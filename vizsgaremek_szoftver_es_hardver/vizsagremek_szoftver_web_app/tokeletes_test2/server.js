const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'schedule.json');

app.use(bodyParser.json());
app.use(express.static('public')); // Serve your HTML file

// Load schedule from file
app.get('/load-schedule', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read schedule file' });
        }
        const schedule = JSON.parse(data || '{}');
        res.json(schedule);
    });
});

// Add new entry to schedule
app.post('/add-entry', (req, res) => {
    const { description, selectedDate, startTime, endTime } = req.body;
    if (!description || !selectedDate || !startTime || !endTime) {
        return res.status(400).send('Invalid input');
    }

    const entry = { description, startTime: parseInt(startTime), endTime: parseInt(endTime) };
    
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        let schedule = {};
        if (!err && data) {
            schedule = JSON.parse(data);
        }

        if (!schedule[selectedDate]) {
            schedule[selectedDate] = [];
        }
        schedule[selectedDate].push(entry);

        fs.writeFile(FILE_PATH, JSON.stringify(schedule, null, 2), err => {
            if (err) {
                return res.status(500).send('Could not write to schedule file');
            }
            res.sendStatus(200);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
