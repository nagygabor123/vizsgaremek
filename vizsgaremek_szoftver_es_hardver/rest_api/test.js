const express = require('express');
const mysql = require('mysql');
const WebSocket = require('ws');
const net = require('net');

// MySQL kapcsolat beállítása
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rfid_system'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL adatbázis csatlakoztatva.');
});

// Express szerver beállítása
const app = express();
app.use(express.static('public')); // A HTML fájlok kiszolgálása a "public" mappából

app.listen(3000, () => {
    console.log('Express szerver fut a 3000-es porton');
});

// WebSocket szerver indítása
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
    console.log('Új WebSocket kapcsolat.');

    ws.on('close', () => {
        console.log('WebSocket kapcsolat bontva.');
    });
});

// Ethernet kapcsolat az Arduino-val (TCP)
const server = net.createServer((socket) => {
    console.log('Arduino csatlakozott.');

    socket.on('data', (data) => {
        const rfidData = data.toString().trim();
        console.log('Kapott RFID adat: ' + rfidData);

        // RFID adat mentése az adatbázisba
        let query = `INSERT INTO rfid_logs (rfid_tag) VALUES (?)`;
        db.query(query, [rfidData], (err, result) => {
            if (err) throw err;

            // RFID adatok elküldése WebSocket-en keresztül az összes kapcsolódott kliensnek
            let newData = {
                id: result.insertId,  // Az új rekord azonosítója
                rfid_tag: rfidData,
                timestamp: new Date().toISOString()  // Az aktuális időbélyeg
            };

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(newData));  // JSON formátumban küldjük az adatokat
                }
            });

            console.log('Adat mentve és elküldve WebSocketen.');
        });
    });

    socket.on('close', () => {
        console.log('Arduino lecsatlakozott.');
    });
});

server.listen(4000, '0.0.0.0', () => {
    console.log('TCP szerver fut a 4000-es porton');
});


/*CREATE DATABASE rfid_system;
USE rfid_system;

CREATE TABLE rfid_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rfid_tag VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/