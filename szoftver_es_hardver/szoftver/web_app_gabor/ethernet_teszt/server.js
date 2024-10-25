const express = require('express');
const http = require('http');
const net = require('net');
const WebSocket = require('ws');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware for processing JSON data
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rfid_log'
});

// Serve static files
app.use(express.static('public'));

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket csatlakozott');

  ws.on('close', () => {
    console.log('WebSocket lecsatlakozott');
  });
});

// TCP server
const tcpServer = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    const rfidTag = data.toString().trim();
    if (rfidTag) {
      console.log('Received RFID:', rfidTag);
      processRfidTag(rfidTag, socket);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Error:', err);
  });
});

tcpServer.on('error', (err) => {
  console.error('Server error:', err);
});

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
      // Send invalid message to Arduino
      socket.write('INVALID\n');
    }
  });
}




// Function to update student status
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

// Function to log RFID reading
function logRfidTag(rfidTag) {
  db.query('INSERT INTO logs (rfid_tag) VALUES (?)', [rfidTag], (logError) => {
    if (logError) throw logError;
    console.log(`Loggolva az RFID: ${rfidTag}`);
  });
}

function controlLed(rfidTag, socket) {
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

    // Küldjük el az Arduino-nak a pin kódot a socket.write használatával
    const command = `PIN:${pin}\n`; // Parancs formázása
    socket.write(command, (err) => {
      if (err) {
        console.error('Hiba a pin küldésekor:', err);
      } else {
        console.log(`Pin elküldve az Arduinónak: ${command}`);
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
