const rfidList = document.getElementById('rfid-list');

// Képzeljük el, hogy a szerver az RFID azonosítókat WebSocket-en keresztül küldi
const socket = new WebSocket('ws://localhost:3000'); // Cseréld ki, ha szükséges

socket.onmessage = function(event) {
    const rfidTag = event.data;
    const listItem = document.createElement('li');
    listItem.textContent = `Megkapott RFID azonosító: ${rfidTag}`;
    rfidList.prepend(listItem); // Az új bejegyzéseket a lista elejére tesszük
};
