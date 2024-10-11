const express = require('express');
const mysql = require('mysql');
const net = require('net');

// MySQL adatbázis csatlakozás
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rfid_system'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected.');
});

// Express szerver
const app = express();
app.use(express.json());

// RFID adatok mentése
app.post('/rfid', (req, res) => {
    const { rfid } = req.body;
    let query = `INSERT INTO rfid_logs (rfid_tag) VALUES (?)`;
    
    db.query(query, [rfid], (err, result) => {
        if (err) throw err;
        console.log('RFID tag mentve: ' + rfid);
        res.send('Data received');
    });
});

app.listen(3000, () => {
    console.log('Express server running on port 3000');
});

// Ethernet kapcsolat kezelése az Arduino-val
const server = net.createServer((socket) => {
    console.log('Arduino csatlakozott');

    socket.on('data', (data) => {
        const rfidData = data.toString().trim();
        console.log('Kapott RFID adat: ' + rfidData);

        // Mentés az adatbázisba
        let query = `INSERT INTO rfid_logs (rfid_tag) VALUES (?)`;
        db.query(query, [rfidData], (err, result) => {
            if (err) throw err;
            console.log('RFID tag adatbázisba mentve: ' + rfidData);
        });

        // LED vezérlés: válasz "ON" vagy "OFF"
        if (rfidData.includes('RFID')) {
            socket.write('ON\n');  // Válaszként "ON" küldése az Arduino-nak
        } else {
            socket.write('OFF\n');
        }
    });

    socket.on('close', () => {
        console.log('Arduino lecsatlakozott');
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log('TCP szerver fut a 3000-es porton');
});
