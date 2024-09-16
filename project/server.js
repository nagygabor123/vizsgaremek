const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // To serve the HTML file

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" folder

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'resztli'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

// API endpoint to fetch restaurants
app.get('/restaurants', (req, res) => {
    const query = 'SELECT restname, restlocation FROM restaurants';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port "http://localhost:${port}"`);
});
