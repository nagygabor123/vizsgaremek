const express = require('express');
const http = require('http');
const net = require('net');
const WebSocket = require('ws');
const mysql = require('mysql');
const path = require('path');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL adatbázis csatlakozás
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rfid_log'
});

// bejelentkezés ellenőrzése
app.get('/', (req, res) => {
  // Ellenőrizzük, hogy van-e tárolt felhasználónév
  const username = req.query.username; // A felhasználónév lekérdezési paraméterként
  if (username) {
    // Ha van felhasználónév, irányítsuk át az index.html-re
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // Ellenkező esetben a login.html-t töltjük be
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

// Login útvonal a hitelesítéshez
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Adatbázis-lekérdezés a bejelentkezési adatok ellenőrzésére
    const query = 'SELECT * FROM admins WHERE username = ? AND password = ?';
    db.query(query, [username, password], (error, results) => {
        if (error) {
            console.error('Hiba az adatbázis-lekérdezés során:', error);
            return res.status(500).json({ success: false, message: 'Szerver hiba.' });
        }

        if (results.length > 0) {
            res.json({ success: true, message: 'Sikeres bejelentkezés!' });
        } else {
            res.json({ success: false, message: 'Hibás felhasználónév vagy jelszó!' });
        }
    });
});

let arduinoSocket = null;
let systemLocked = false; 

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket csatlakozott');
  
  // Query the current list of students and send to the connected client
  db.query('SELECT * FROM student', (error, results) => {
    if (error) {
      console.error('Hiba a diákok lekérdezésénél:', error);
      return;
    }
    ws.send(JSON.stringify(results)); // Send the initial list of students to the WebSocket client
  });

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.action === 'toggleStatus') {
      toggleSystem();
    }
  });

  ws.on('close', () => {
    console.log('WebSocket lecsatlakozott');
  });
});

// TCP server
const tcpServer = net.createServer((socket) => {
  console.log('Client connected');
  arduinoSocket = socket; // Store the Arduino socket reference

  socket.on('data', (data) => {
    const rfidTag = data.toString().trim();
    if (rfidTag) {
      console.log('Received RFID:', rfidTag);
      processRfidTag(rfidTag, socket);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
    arduinoSocket = null; // Clear the reference when disconnected
  });

  socket.on('error', (err) => {
    console.error('Error:', err);
  });
});

tcpServer.on('error', (err) => {
  console.error('Server error:', err);
});

// Modify the toggleSystem function
function toggleSystem() {
  systemLocked = !systemLocked; // Toggle the lock status
  const statusMessage = systemLocked ? 'Rendszer zárva' : 'Rendszer feloldva';
  console.log(statusMessage);

  // Send command to Arduino if it's connected
  if (arduinoSocket) {
    const command = systemLocked ? 'LOCK\n' : 'UNLOCK\n'; // Use appropriate command for Arduino
    arduinoSocket.write(command, (err) => {
      if (err) {
        console.error('Hiba a pin küldésekor:', err);
      } else {
        console.log(`Pin elküldve az Arduinónak: ${command.trim()}`);
      }
    });
  }
}

function processRfidTag(rfidTag, socket) {
  db.query('SELECT * FROM student WHERE rfid_azon = ?', [rfidTag], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const student = results[0];
      const newStatus = student.statusz === 'ki' ? 'be' : 'ki';

      // Update student status
      updateStudentStatus(rfidTag, newStatus, student.nev);
      // Send the PIN to Arduino
      controlLed(rfidTag, socket);
    } else {
      console.log('Hibás RFID azonosító:', rfidTag);
      socket.write('INVALID\n');
      logRfidTag(rfidTag);
    }
  });
}

function updateStudentStatus(rfidTag, newStatus, studentName) {
  db.query('UPDATE student SET statusz = ? WHERE rfid_azon = ?', [newStatus, rfidTag], (updateError) => {
    if (updateError) throw updateError;

    // Log az RFID beolvasásról
    logRfidTag(rfidTag);

    // WebSocket kliensek értesítése friss adatokkal
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        db.query('SELECT * FROM student', (queryError, results) => {
          if (queryError) throw queryError;
          client.send(JSON.stringify(results)); // Minden diák adat küldése
        });
      }
    });

    console.log(`Diák neve: ${studentName}, új státusz: ${newStatus}`);
  });
}

function logRfidTag(rfidTag) {
  db.query('INSERT INTO logs (rfid_tag) VALUES (?)', [rfidTag], (logError) => {
    if (logError) throw logError;
    console.log(`Loggolva az RFID: ${rfidTag}\n`);
  });
}

function controlLed(rfidTag, socket) {
  const pinQuery = 'SELECT pin FROM student WHERE rfid_azon = ?';
  db.query(pinQuery, [rfidTag], (err, results) => {
    if (err) throw err;

    let pin = '2'; // Default pin value
    if (results.length > 0 && results[0].pin) {
      pin = results[0].pin; // Use the pin from the database if available
    } else {
      console.log('Nincs érvényes pin az RFID-hoz:', rfidTag, ', a pin értéke 2 lesz.');
    }

    const command = `PIN:${pin}\n`; // Format the command
    socket.write(command, (err) => {
      if (err) {
        console.error('Hiba a pin küldésekor:', err);
      } else {
        console.log(`Pin elküldve az Arduinónak: ${pin}`);
      }
    });
  });
}

// Start TCP server
tcpServer.listen(8080, () => {
  console.log('TCP server running on port 8080');
});

// Start HTTP server
server.listen(3000, () => {
  console.log('HTTP server running on port 3000');
});
