const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'user_auth'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Handle login POST request
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [username], (err, results) => {
        if (err) return res.status(500).send('Database error');
        if (results.length === 0) return res.status(401).send('Invalid credentials');
        bcrypt.compare(password, results[0].password, (err, match) => {
            if (match) {
                res.send('Login successful!');
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    });
});

// Handle registration POST request
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send('Error hashing password');
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], (err) => {
            if (err) return res.status(500).send('Database error');
            res.send('Registration successful!');
        });
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
// Note: Ensure to replace 'your_password' with your actual MySQL password.