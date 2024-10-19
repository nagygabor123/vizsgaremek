const express = require('express');
const http = require('http');
const net = require('net');
const WebSocket = require('ws');
const mysql = require('mysql'); // MySQL könyvtár importálása

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware a JSON adatok feldolgozásához
app.use(express.json());

// MySQL kapcsolat létrehozása
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Használja a megfelelő felhasználónevet
  password: '', // Használja a megfelelő jelszót
  database: 'rfid_log' // Az adatbázis neve
});

// Üzenetek tárolása
let messages = [];

// Statikus fájlok kiszolgálása
app.use(express.static('public'));

// REST API: Üzenetek listázása
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// WebSocket kapcsolat kezelése
wss.on('connection', (ws) => {
  console.log('WebSocket kliens kapcsolódott');

  // Diákok adatait lekérdezni, amikor egy kliens csatlakozik
  db.query('SELECT * FROM student', (error, results) => {
    if (error) throw error;
    ws.send(JSON.stringify(results)); // Küldje el a diákok adatait a kliensnek
  });

  ws.on('close', () => {
    console.log('WebSocket kliens levált');
  });
});

// TCP szerver
const tcpServer = net.createServer((socket) => {
  console.log('Kapcsolódott egy kliens');

  socket.on('data', (data) => {
    const rfidTag = data.toString().trim();
    if (rfidTag) {
      console.log('Kapott RFID:', rfidTag);

      // Diák státuszának frissítése
      db.query('SELECT * FROM student WHERE rfid_azon = ?', [rfidTag], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
          const student = results[0];
          const newStatus = student.statusz === 'ki' ? 'be' : 'ki';

          // Státusz frissítése az adatbázisban
          db.query('UPDATE student SET statusz = ? WHERE rfid_azon = ?', [newStatus, rfidTag], (updateError) => {
            if (updateError) throw updateError;

            // Frissítse az összes WebSocket klienst
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                db.query('SELECT * FROM student', (queryError, results) => {
                  if (queryError) throw queryError;
                  client.send(JSON.stringify(results)); // Küldje el az összes diák adatait
                });
              }
            });
          });
        }
      });
    }
  });

  socket.on('end', () => {
    console.log('Kliens levált');
  });

  socket.on('error', (err) => {
    console.error('Hiba:', err);
  });
});

tcpServer.on('error', (err) => {
  console.error('Szerver hiba:', err);
});

// TCP szerver indítása
tcpServer.listen(8080, () => {
  console.log('TCP szerver fut az 8080-as porton');
});

// HTTP szerver indítása
server.listen(3000, () => {
  console.log('HTTP szerver fut a 3000-es porton');
});
