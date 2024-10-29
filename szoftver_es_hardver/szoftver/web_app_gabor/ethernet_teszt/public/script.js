const studentsDiv = document.getElementById('students');
const toggleButton = document.getElementById('toggle-status');
const ws = new WebSocket('ws://localhost:3000');

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

