const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport'); // Frissített import
const { ReadlineParser } = require('@serialport/parser-readline'); // Frissített import

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

// Soros port beállítása (állítsd be a megfelelő port nevét)
const portName = 'COM3'; // Cseréld ki a számítógépedhez csatlakozó Arduino portjára (pl. Windows esetén 'COM3', Linux esetén '/dev/ttyUSB0')
const serialPort = new SerialPort({ path: portName, baudRate: 9600 });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' })); // Frissített parser

// Figyelj a bejövő adatokra az Arduinótól
parser.on('data', (data) => {
  console.log(`Megkapott RFID azonosító: ${data}`);
  logRfidTag(data.trim());
});

// RFID azonosító loggolása az adatbázisba
function logRfidTag(rfidTag) {
  const query = 'INSERT INTO logs (rfid_tag) VALUES (?)';
  db.query(query, [rfidTag], (err, result) => {
    if (err) throw err;
    console.log(`Loggolva az RFID azonosító: ${rfidTag}, ID: ${result.insertId}`);
  });
}

// A szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut a következő címen: http://localhost:${port}`);
});
