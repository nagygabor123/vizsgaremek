const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const path = require('path');

const app = express();
const port = 3000;

// MySQL adatbázis kapcsolat
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // cseréld ki a MySQL felhasználónevedre
  password: '', // cseréld ki a MySQL jelszavadra
  database: 'rfid_log'
});

// Kapcsolódás az adatbázishoz
db.connect((err) => {
  if (err) throw err;
  console.log('Kapcsolódva az adatbázishoz');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Statikus fájlok kiszolgálása

// Soros port beállítása
const portName = 'COM3'; // Cseréld ki a számítógépedhez csatlakozó Arduino portjára
const serialPort = new SerialPort({ path: portName, baudRate: 9600 });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Eredeti státuszok tárolására szolgáló objektum
let originalStatuses = {};

// Figyelj a bejövő adatokra az Arduinótól
parser.on('data', (data) => {
  const receivedData = data.trim(); // Kapott adat
  console.log(`Megkapott adat: ${receivedData}`);

  // Ellenőrizzük, hogy PIN vagy RFID érkezett
  if (receivedData.startsWith('PIN:')) {
    const pin = receivedData.split(': ')[1]; // Kinyerjük a PIN-t
    console.log(`Pin elküldve az Arduinónak: ${receivedData}`);
    return; // Kilépés, ha PIN érkezett
  }

  // Ha RFID azonosító érkezett
  if (!receivedData.startsWith('Received PIN:')) {
    const rfidTag = receivedData; // Az RFID azonosító
    logRfidTag(rfidTag); // Loggoljuk az RFID olvasást
    updateStudentStatus(rfidTag); // Diák státuszának frissítése
  } else {
    // Ha a bejövő adat PIN, akkor logoljuk, de ne RFID-ként
    console.log(`PIN érkezett: ${receivedData}`);
  }
});

// RFID olvasás loggolása a "logs" táblába (csak az RFID címkét logoljuk)
function logRfidTag(rfidTag) {
  const logQuery = 'INSERT INTO logs (rfid_tag) VALUES (?)';
  db.query(logQuery, [rfidTag], (err, result) => {
    if (err) throw err;
    console.log(`Loggolva az RFID: ${rfidTag}, ID: ${result.insertId}`);
  });
}

// Diák státuszának frissítése a "student" táblában
function updateStudentStatus(rfidTag) {
  const query = 'SELECT * FROM student WHERE rfid_azon = ?';
  db.query(query, [rfidTag], (err, results) => {
    if (err) throw err;

    // Ellenőrizzük, hogy a diák létezik-e
    if (results.length === 0) {
      // Csak itt írd ki, ha nem található a diák
      console.log(`Téves RFID azonosító: ${rfidTag}`);
      
      // Ellenőrizzük, hogy a rendszer zárva van-e
      if (!locked) { // Ha nem zárva
        // Üzenet küldése az Arduinónak az érvénytelen RFID azonosítóról
        const invalidRfidMessage = 'invalid_rfid_azon\n';
        serialPort.write(invalidRfidMessage, (err) => {
          if (err) {
            console.error('Hiba az érvénytelen RFID üzenet küldésekor:', err);
          } else {
            console.log(`Érvénytelen RFID üzenet elküldve az Arduinónak: ${invalidRfidMessage}`);
          }
        });
      }

      // Üzenet küldése a kliensnek a státusz frissítéséről
      io.emit('statusUpdate', { rfidTag, status: 'téves', name: null });
      return; // Ha nem létezik, kilépünk
    } 

    const student = results[0];

    // Ha a diák státusza "zarva", akkor ne csináljunk semmit
    if (student.statusz === 'zarva') {
      console.log(`Zárva van, nem lehet frissíteni: ${student.nev}`);
      return; // Visszatérés, ha a státusz "zarva"
    }

    // Státusz váltás
    const newStatus = student.statusz === 'ki' ? 'be' : 'ki';
    const updateQuery = 'UPDATE student SET statusz = ? WHERE rfid_azon = ?';

    db.query(updateQuery, [newStatus, rfidTag], (err) => {
      if (err) throw err;
      console.log(`Frissítve: ${student.nev} státusz: ${newStatus}`);

      // LED vezérlés
      controlLed(rfidTag);

      // Üzenet küldése a kliensnek a státusz változásról
      io.emit('statusUpdate', { rfidTag, status: newStatus, name: student.nev });
    });
  });
}



function controlLed(rfidTag) {
  // Lekérdezzük a pin-t az adatbázisból
  const pinQuery = 'SELECT pin FROM student WHERE rfid_azon = ?';
  db.query(pinQuery, [rfidTag], (err, results) => {
    if (err) throw err;

    let pin = '2'; // Alapértelmezett pin érték
    if (results.length > 0 && results[0].pin) {
      pin = results[0].pin; // Ha létezik pin az adatbázisban, akkor azt használjuk
    } else {
      console.log('Nincs érvényes pin az RFID-hoz:', rfidTag, ', a pin értéke 2 lesz.');
    }

    // Küldjük el az Arduino-nak a pin kódot
    const command = `PIN:${pin}\n`; // Parancs formázása
    serialPort.write(command, (err) => {
      if (err) {
        console.error('Hiba a pin küldésekor:', err);
      } else {
        console.log(`Pin elküldve az Arduinónak: ${command}`);
      }
    });
  });
}

// Záró funkció a diákok lezárásához és feloldásához
let locked = false;

app.post('/toggle-lock', (req, res) => {
  locked = !locked; // Az állapot váltása (zárva/nyitva)
  
  serialPort.write('TOGGLE_LED\n', (err) => {
    if (err) {
      return res.status(500).send('Hiba a LED vezérlés során'); // Hiba kezelés
    }

    if (locked) {
      // Eredeti státuszok mentése, mielőtt zárva lesznek
      const query = 'SELECT rfid_azon, statusz FROM student';
      db.query(query, (err, results) => {
        if (err) throw err;

        results.forEach(student => {
          originalStatuses[student.rfid_azon] = student.statusz; // Eredeti státusz mentése
        });

        // Minden diák státusza zárva lesz
        const updateQuery = 'UPDATE student SET statusz = "zarva"';
        db.query(updateQuery, (err) => {
          if (err) throw err;
          console.log('Minden diák státusza zárolva');
          io.emit('statusUpdate', { status: 'zarva' }); // Kliens értesítése
          res.send('Minden diák státusza zárolva'); // Válasz küldése
        });
      });
    } else {
      // Státuszok visszaállítása az eredeti állapotra
      const updatePromises = []; // Tömb a promessek tárolására

      for (const rfidTag in originalStatuses) {
        const originalStatus = originalStatuses[rfidTag];
        const updateQuery = 'UPDATE student SET statusz = ? WHERE rfid_azon = ?';
        
        // Aszinkron frissítések kezelése
        const promise = new Promise((resolve, reject) => {
          db.query(updateQuery, [originalStatus, rfidTag], (err) => {
            if (err) return reject(err); // Hibakezelés
            console.log(`Státusz visszaállítva: ${rfidTag}, státusz: ${originalStatus}`);
            resolve();
          });
        });

        updatePromises.push(promise); // A promise hozzáadása a tömbhöz
      }

      // Várakozás az összes frissítés befejezésére
      Promise.all(updatePromises)
        .then(() => {
          io.emit('statusUpdate', { status: 'ki' }); // Kliens értesítése
          res.send('Minden diák státusza visszaállítva'); // Válasz küldése
        })
        .catch(err => {
          console.error('Hiba a státusz visszaállításakor:', err);
          res.status(500).send('Hiba a státusz visszaállításakor'); // Hiba válasz
        });
    }
  });
});

// WebSocket inicializálása
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// WebSocket események kezelése
io.on('connection', (socket) => {
  console.log('Új kliens csatlakozott:', socket.id);

  // Diákok lekérdezése és küldése
  db.query('SELECT * FROM student', (err, results) => {
    if (err) throw err;
    socket.emit('students', results); // Diákok küldése
  });

  // Ha diák státusza frissül, értesítés küldése
  socket.on('statusUpdate', (data) => {
    // Esetleg itt is kezelheted a státusz frissítéseket, ha szükséges
  });
});


// Szerver indítása
http.listen(port, () => {
  console.log(`Szerver fut: http://localhost:${port}`);
});
