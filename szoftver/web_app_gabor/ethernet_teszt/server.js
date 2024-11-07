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

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rfid_log'
});

// bejelentkezés ellenőrzése
app.get('/', (req, res) => {
  const username = req.query.username;
  if (username) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

// Login rész
app.post('/login', (req, res) => {
    const { username, password } = req.body;
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

let systemLocked = false;
const connectedClients = [];

// WebSocket kezelése
wss.on('connection', (ws) => {
  console.log('WebSocket csatlakozott');
  ws.send(JSON.stringify({ action: 'systemStatus', isLocked: systemLocked })); // rendszer állapot küldése a kliensnek
  db.query('SELECT * FROM student', (error, results) => {
    if (error) {
      console.error('Hiba a diákok lekérdezésénél:', error);
      return;
    }
    ws.send(JSON.stringify(results));  // diákok listájának elküldése a kliensnek
  });

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.action === 'toggleStatus') {
      toggleSystem();
    } 
    if (data.action === 'unlockStudent') {
      const rfid = data.rfid;
      unlockStudent(rfid);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket lecsatlakozott');
  });
});

// TCP szerver
const tcpServer = net.createServer((socket) => {
  console.log('Client connected');
  connectedClients.push(socket); // új kapcsolat hozzáadása a listához

  socket.on('data', (data) => {
    const rfidTag = data.toString().trim();
    if (rfidTag) {
      console.log('Received RFID:', rfidTag);
      processRfidTag(rfidTag, socket);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
    const index = connectedClients.indexOf(socket);
    if (index > -1) connectedClients.splice(index, 1); // kapcsolat eltávolítása a listáról
  });

  socket.on('error', (err) => {
    console.error('Error:', err);
  });
});

tcpServer.on('error', (err) => {
  console.error('Server error:', err);
});

function unlockStudent(rfid) {
  console.log(`Feloldott RFID: ${rfid}`);
}

function toggleSystem() {
  systemLocked = !systemLocked;
  const statusMessage = systemLocked ? 'Rendszer zárva' : 'Rendszer feloldva';
  console.log(statusMessage);
  const command = systemLocked ? 'LOCK\n' : 'UNLOCK\n';
  arduinoMessage(command);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ action: 'systemStatus', isLocked: systemLocked }));
    }
  });
}

function arduinoMessage(message) {
  connectedClients.forEach((client) => {
    client.write(message, (err) => {
      if (err) {
        console.error('Hiba az üzenet küldésekor:', err);
      } else {
        console.log(`Üzenet elküldve az Arduinónak: ${message.trim()}`);
      }
    });
  });
}

function processRfidTag(rfidTag, socket) {
  db.query('SELECT * FROM student WHERE rfid_azon = ?', [rfidTag], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const student = results[0];
      const newStatus = student.statusz === 'ki' ? 'be' : 'ki';
      updateStudentStatus(rfidTag, newStatus, student.nev);
      controlLed(rfidTag);
    } else {
      console.log('Hibás RFID azonosító:', rfidTag);
      const command = 'INVALID\n';
      arduinoMessage(command);
      logRfidTag(rfidTag);
    }
  });
}

function updateStudentStatus(rfidTag, newStatus, studentName) {
  db.query('UPDATE student SET statusz = ? WHERE rfid_azon = ?', [newStatus, rfidTag], (updateError) => {
    if (updateError) throw updateError;
    logRfidTag(rfidTag);

    // WebSocket kliens frissítése
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        db.query('SELECT * FROM student', (queryError, results) => {
          if (queryError) throw queryError;
          client.send(JSON.stringify(results));
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

function controlLed(rfidTag) {
  const pinQuery = 'SELECT pin FROM student WHERE rfid_azon = ?';
  db.query(pinQuery, [rfidTag], (err, results) => {
    if (err) throw err;

    let pin = '0'; // alap pin
    if (results.length > 0 && results[0].pin) {
      pin = results[0].pin;
    } else {
      console.log('Nincs érvényes pin az RFID-hoz:', rfidTag, ', a pin értéke 2 lesz.');
    }
    const command = `PIN:${pin}\n`;
    arduinoMessage(command);
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
