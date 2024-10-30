const studentsDiv = document.getElementById('students');
const toggleButton = document.getElementById('toggle-status');
const ws = new WebSocket('ws://localhost:3000');
const usernameDisplay = document.getElementById('usernameDisplay');
const modal = document.getElementById('modal');
const closeModal = document.getElementsByClassName("close")[0];
const logoutButton = document.getElementById('logout-button');

// Check localStorage for the lock status and set the button text accordingly
if (localStorage.getItem('isLocked') === 'true') {
    toggleButton.textContent = 'Feloldás';
}

ws.onopen = function() {
    console.log('WebSocket kapcsolat létrejött.');
};

ws.onmessage = function(event) {
    const students = JSON.parse(event.data);
    studentsDiv.innerHTML = ''; // Üresítse ki a diákok div-jét

    students.forEach(student => {
        const studentBox = document.createElement('div');
        studentBox.className = 'student-box';
        studentBox.textContent = student.nev;

        // Állítsa be az osztályt a státusz alapján
        if (student.statusz === 'be') {
            studentBox.classList.add('present');
        } else {
            studentBox.classList.add('absent');
        }

        studentsDiv.appendChild(studentBox);
    });
};

ws.onerror = function(event) {
    console.error('WebSocket hiba:', event);
};

ws.onclose = function() {
    console.log('WebSocket kapcsolat lezárult.');
};

// Gomb eseménykezelő
toggleButton.addEventListener('click', () => {
    // Toggle lock status and update button text
    const isLocked = toggleButton.textContent === 'Zárás';
    toggleButton.textContent = isLocked ? 'Feloldás' : 'Zárás';
    
    // Store the lock status in localStorage
    localStorage.setItem('isLocked', isLocked);

    // Send lock status to server
    ws.send(JSON.stringify({ action: 'toggleStatus', isLocked }));
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

// Felhasználónév megjelenítése az index oldalon
const username = localStorage.getItem('username');
if (username) {
    usernameDisplay.textContent = `${username}`;
} else {
    window.location.href = '/login.html'; // Ha nincs bejelentkezve, visszairányítjuk a login oldalra
}

// Login function for login.html
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('username', username); // Felhasználónév mentése a localStorage-ba
            window.location.href = '/index.html'; // Redirect to main page
        } else {
            alert('Hibás felhasználónév vagy jelszó!');
        }
    })
    .catch(error => {
        console.error('Hiba történt a bejelentkezés során:', error);
    });
}
