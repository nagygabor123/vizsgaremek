const rfidList = document.getElementById('rfid-list');
const studentsContainer = document.getElementById('students-container');
const toggleStatusButton = document.getElementById('toggle-status');
const usernameDisplay = document.getElementById('usernameDisplay');
const modal = document.getElementById('modal');
const closeModal = document.getElementsByClassName("close")[0];
const logoutButton = document.getElementById('logout-button');

const socket = io();
let isLocked = false; // Alapértelmezett állapot

// Diákok megjelenítése
socket.on('students', (students) => {
    studentsContainer.innerHTML = ''; // Ürítse ki a tárolót
    students.forEach(student => {
        const box = document.createElement('div');
        box.className = 'student-box';
        box.id = student.rfid_azon;
        box.innerText = student.nev;
        if (student.statusz === 'be') {
            box.classList.add('present'); // Zöld szín
        }
        studentsContainer.appendChild(box);
    });
});

// Státusz frissítése, ha az RFID olvasás történik
socket.on('statusUpdate', ({ rfidTag, status, name }) => {
    const box = document.getElementById(rfidTag);
    if (box) {
        box.classList.toggle('present'); // Váltás zöldre vagy vissza
    }
});

// Gomb esemény figyelése a státusz zárására / nyitására
toggleStatusButton.addEventListener('click', () => {
    isLocked = !isLocked;
    fetch('/toggle-lock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.text())
    .then(message => {
        alert(message); // Üzenet megjelenítése a felhasználónak
    })
    .catch(error => {
        console.error('Hiba a státuszváltásban:', error);
    });
});

// Felhasználónév kattintásának kezelése
usernameDisplay.addEventListener('click', () => {
    modal.style.display = "block"; // Felugró ablak megjelenítése
});

// Felugró ablak bezárása
closeModal.onclick = function() {
    modal.style.display = "none"; // Felugró ablak eltüntetése
}

// Kijelentkezés gomb esemény figyelése
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('username'); // Felhasználónév eltávolítása a localStorage-ból
    window.location.href = '/login.html'; // Átirányítás a bejelentkező oldalra
});

// Képzeljük el, hogy a szerver az RFID azonosítókat WebSocket-en keresztül küldi
const webSocket = new WebSocket('ws://localhost:3000'); // Cseréld ki, ha szükséges

webSocket.onmessage = function(event) {
    const rfidTag = event.data;
    const listItem = document.createElement('li');
    listItem.textContent = `Megkapott RFID azonosító: ${rfidTag}`;
    rfidList.prepend(listItem); // Az új bejegyzéseket a lista elejére tesszük
};

// Felhasználónév megjelenítése az index oldalon
const username = localStorage.getItem('username');
if (username) {
    usernameDisplay.textContent = `${username}`;
} else {
    window.location.href = '/login.html'; // Ha nincs bejelentkezve, visszairányítjuk a login oldalra
}

// Bejelentkezés kezelése a login.html oldalon
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('username', username); // Felhasználónév mentése a localStorage-ba
            window.location.href = '/index.html'; // Átirányítás az index oldalra
        } else {
            alert('Ilyen felhasználó nem létezik!');
        }
    })
    .catch(error => {
        console.error('Hiba történt:', error);
    });
}
