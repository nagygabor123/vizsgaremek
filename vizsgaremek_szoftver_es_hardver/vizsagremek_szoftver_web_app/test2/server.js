const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Statikus fájlok a 'public' mappából

const dataFilePath = path.join(__dirname, 'schedule.json');

app.get('/api/schedule', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Hiba a fájl olvasásakor.');
        }
        res.json(JSON.parse(data || '{}'));
    });
});

app.post('/api/schedule', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Hiba a fájl olvasásakor.');
        }
        const schedule = JSON.parse(data || '{}');
        const { date, description, startTime, endTime } = req.body;

        schedule[date] = schedule[date] || [];
        schedule[date].push({ description, startTime, endTime });

        fs.writeFile(dataFilePath, JSON.stringify(schedule, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Hiba a fájl írásakor.');
            }
            res.sendStatus(200);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
