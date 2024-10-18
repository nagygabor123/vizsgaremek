const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const net = require('net');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = []; // Üzenetek tárolása

// Statikus fájlok kiszolgálása
app.use(express.static('public')); // A public mappa tartalmát szolgálja ki

// WebSocket kapcsolat kezelése
wss.on('connection', (ws) => {
  console.log('WebSocket kliens kapcsolódott');

  // Új üzenet küldése a WebSocket klienseknek
  ws.on('close', () => {
    console.log('WebSocket kliens levált');
  });
});

// TCP szerver
const tcpServer = net.createServer((socket) => {
  console.log('Kapcsolódott egy kliens');

  socket.on('data', (data) => {
    const message = data.toString().trim();
    if (message) { // Csak akkor ír ki, ha nem üres az üzenet
      console.log('Kapott üzenet:', message);
      messages.push(message); // Üzenet tárolása
      // Minden WebSocket kliensnek elküldjük az új üzenetet
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
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
  console.log('TCP szerver fut az 8080-es porton');
});

// HTTP szerver indítása a WebSocket-tel
server.listen(3000, () => {
  console.log('HTTP szerver fut a 3000-es porton');
});
