const dgram = require("dgram");
const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
    console.log(`Received message: ${msg.toString()} from ${rinfo.address}:${rinfo.port}`);
});

server.on("listening", () => {
    const address = server.address();
    console.log(`Server listening ${address.address}:${address.port}`);
});

server.bind(8080); // Győződj meg arról, hogy ez a port megegyezik az Arduino kódjában megadott porttal.
