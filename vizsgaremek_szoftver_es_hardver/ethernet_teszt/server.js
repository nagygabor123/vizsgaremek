const net = require('net');

// TCP szerver indítása
const server = net.createServer((socket) => {
  console.log('Új kapcsolat érkezett');

  // Üzenet fogadása
  socket.on('data', (data) => {
    console.log(`Üzenet érkezett: ${data.toString()}`);
  });

  // Kapcsolat bezárása
  socket.on('end', () => {
    console.log('Kapcsolat lezárva');
  });
});

// Szerver indítása a 8080-as porton
server.listen(8080, () => {
  console.log('TCP szerver fut a 8080-as porton');
});
