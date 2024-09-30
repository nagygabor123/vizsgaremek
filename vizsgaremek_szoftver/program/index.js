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
  console.log(`Megkapott RFID azonosító: ${data}`);
  const rfidTag = data.trim();
  
  // Loggoljuk az RFID olvasást
  logRfidTag(rfidTag);

  // Diák státuszának frissítése
  updateStudentStatus(rfidTag);
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
    if (results.length > 0) {
      const student = results[0];

      // Ha a diák státusza "zarva", akkor ne csináljunk semmit
      if (student.statusz === 'zarva') {
        console.log(`Zárva van, nem lehet frissíteni: ${student.nev}`);
        return;
      }

      // Státusz váltás
      const newStatus = student.statusz === 'ki' ? 'be' : 'ki';
      const updateQuery = 'UPDATE student SET statusz = ? WHERE rfid_azon = ?';

      db.query(updateQuery, [newStatus, rfidTag], (err) => {
        if (err) throw err;
        console.log(`Frissítve: ${student.nev} státusz: ${newStatus}`);
        // Üzenet küldése a kliensnek a státusz változásról
        io.emit('statusUpdate', { rfidTag, status: newStatus, name: student.nev });
      });
    }
  });
}

// Záró funkció a diákok lezárásához és feloldásához
let locked = false;

app.post('/toggle-lock', (req, res) => {
  locked = !locked;

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
        res.send('Minden diák státusza zárolva');
      });
    });
  } else {
    // Státuszok visszaállítása az eredeti állapotra
    for (const rfidTag in originalStatuses) {
      const originalStatus = originalStatuses[rfidTag];
      const updateQuery = 'UPDATE student SET statusz = ? WHERE rfid_azon = ?';
      db.query(updateQuery, [originalStatus, rfidTag], (err) => {
        if (err) throw err;
        console.log(`Státusz visszaállítva: ${rfidTag}, státusz: ${originalStatus}`);
      });
    }
    io.emit('statusUpdate', { status: 'ki' }); // Kliens értesítése a feloldásról
    res.send('Minden diák státusza visszaállítva az eredeti állapotba');
  }
});

// A szerver indítása
const server = app.listen(port, () => {
  console.log(`Szerver fut a következő címen: http://localhost:${port}`);
});

// WebSocket beállítása
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('Új kapcsolat');

  // Diákok lekérdezése és elküldése a kliensnek
  db.query('SELECT * FROM student', (err, results) => {
    if (err) throw err;
    socket.emit('students', results);
  });
});
