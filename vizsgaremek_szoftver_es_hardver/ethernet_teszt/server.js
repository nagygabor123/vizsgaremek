const express = require('express');
const http = require('http');
const net = require('net');
const WebSocket = require('ws');
const mysql = require('mysql'); // MySQL library import

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware for processing JSON data
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Use the appropriate username
  password: '', // Use the appropriate password
  database: 'rfid_log' // Database name
});

// Serve static files
app.use(express.static('public'));

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket csatlakozott');

  // Query student data when a client connects
  db.query('SELECT * FROM student', (error, results) => {
    if (error) throw error;
    ws.send(JSON.stringify(results)); // Send student data to the client
  });

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

      // Update student status and log to the database
      db.query('SELECT * FROM student WHERE rfid_azon = ?', [rfidTag], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
          const student = results[0];
          const newStatus = student.statusz === 'ki' ? 'be' : 'ki';

          // Update the status in the database
          db.query('UPDATE student SET statusz = ? WHERE rfid_azon = ?', [newStatus, rfidTag], (updateError) => {
            if (updateError) throw updateError;

            // Log the RFID read in the logs table
            db.query('INSERT INTO logs (rfid_tag) VALUES (?)', [rfidTag], (logError) => {
              if (logError) throw logError;

              // Send updated student data to all WebSocket clients
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  db.query('SELECT * FROM student', (queryError, results) => {
                    if (queryError) throw queryError;
                    client.send(JSON.stringify(results)); // Send all student data
                  });
                }
              });

              // Output status to console
              if (newStatus === 'be') {
                console.log(`Diák neve: ${student.nev}, státusz: be`);
              } else {
                console.log(`Diák neve: ${student.nev}, státusz: ki`);
              }
            });
          });
        } else {
          // Log an error message if the RFID tag is not found
          console.log('Téves RFID azonosító:', rfidTag);
        }
      });
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

// Start TCP server
tcpServer.listen(8080, () => {
  console.log('TCP server running on port 8080');
});

// Start HTTP server
server.listen(3000, () => {
  console.log('HTTP server running on port 3000');
});
