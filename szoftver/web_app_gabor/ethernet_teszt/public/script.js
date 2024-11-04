const studentsDiv = document.getElementById('students');
const toggleButton = document.getElementById('toggle-status');
const ws = new WebSocket('ws://localhost:3000');
const usernameDisplay = document.getElementById('usernameDisplay');
const modal = document.getElementById('modal'); 
const studentModal = document.getElementById('studentModal'); 
const closeButtons = document.getElementsByClassName("close"); 
const logoutButton = document.getElementById('logout-button');

ws.onopen = function() {
    console.log('WebSocket kapcsolat létrejött.');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);

    if (Array.isArray(data)) {
        studentsDiv.innerHTML = '';

        data.forEach(student => {
            const studentBox = document.createElement('div');
            studentBox.className = 'student-box';
            studentBox.textContent = student.nev;
            studentBox.setAttribute('data-rfid', student.rfid_azon); 
            studentBox.setAttribute('data-pin', student.pin); 

            if (student.statusz === 'be') {
                studentBox.classList.add('present');
            } else {
                studentBox.classList.add('absent');
            }

            studentsDiv.appendChild(studentBox);
        });
    } else if (data.action === 'systemStatus') {
        toggleButton.textContent = data.isLocked ? 'Feloldás' : 'Zárás';
        document.getElementById('student-unlocking').disabled = !data.isLocked; 
    }
};

ws.onerror = function(event) {
    console.error('WebSocket hiba:', event);
};

ws.onclose = function() {
    console.log('WebSocket kapcsolat lezárult.');
};

// Gomb eseménykezelő
toggleButton.addEventListener('click', () => {
    const isLocked = toggleButton.textContent === 'Zárás';
    ws.send(JSON.stringify({ action: 'toggleStatus' }));
});

// Felhasználónév kattintásának kezelése
usernameDisplay.addEventListener('click', () => {
    modal.style.display = "block";
});

// Diákok rublikáinak kattintás eseménykezelője
studentsDiv.addEventListener('click', (event) => {
    if (event.target.classList.contains('student-box')) {
        const studentName = event.target.textContent;
        const studentRFID = event.target.getAttribute('data-rfid');
        const studentPIN = event.target.getAttribute('data-pin'); 
        document.getElementById('studentName').textContent = studentName;
        document.getElementById('studentRFID').textContent = studentRFID;
        document.getElementById('studentPIN').textContent = studentPIN;
        studentModal.style.display = "block";
    }
});

// A modalok bezárása
Array.from(closeButtons).forEach(closeButton => {
    closeButton.onclick = function() {
        modal.style.display = "none";
        studentModal.style.display = "none";
    };
});

// Diák feloldása gomb eseménykezelője
document.getElementById('student-unlocking').addEventListener('click', () => {
    const studentRFID = document.getElementById('studentRFID').textContent;
    ws.send(JSON.stringify({ action: 'unlockStudent', rfid: studentRFID }));
    console.log(`Diák feloldása: ${studentRFID}`);
});


logoutButton.addEventListener('click', () => {
    localStorage.removeItem('username');
    window.location.href = '/login.html';
});

const username = localStorage.getItem('username');
if (username) {
    usernameDisplay.textContent = `${username}`;
} else {
    window.location.href = '/login.html';
}

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
            localStorage.setItem('username', username);
            window.location.href = '/index.html';
        } else {
            alert('Hibás felhasználónév vagy jelszó!');
        }
    })
    .catch(error => {
        console.error('Hiba történt a bejelentkezés során:', error);
    });
}
