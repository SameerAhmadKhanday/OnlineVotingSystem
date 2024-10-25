// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#ylogopolr#018cboae',
    database: 'votingsystem'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

let votes = {
    'Party A': { count: 0, users: [] },
    'Party B': { count: 0, users: [] },
    'Party C': { count: 0, users: [] }
};

let votedUsers = new Set(); // To track users who have voted

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signin.html'));
});

app.get('/signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signin.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// POST route for signup
app.post('/signup', (req, res) => {
    const { userId, password } = req.body;
    const sql = 'INSERT INTO users (userId, password) VALUES (?, ?)';
    db.query(sql, [userId, password], (err) => {
        if (err) {
            console.error('Signup failed: ', err);
            return res.status(500).json({ message: 'Signup failed!' });
        }
        res.json({ message: 'Sign up successful! Please log in.' });
    });
});

// POST route for login
app.post('/login', (req, res) => {
    const { userId, password } = req.body;
    const sql = 'SELECT * FROM users WHERE userId = ? AND password = ?';
    db.query(sql, [userId, password], (err, results) => {
        if (err) {
            console.error('Login failed: ', err);
            return res.status(500).json({ message: 'Login failed!' });
        }

        if (results.length > 0) {
            return res.json({ message: 'Login successful! Redirecting to the voting page.' });
        } else {
            return res.status(401).json({ message: 'Invalid user ID or password.' });
        }
    });
});

// POST route for voting
app.post('/vote', (req, res) => {
    const { party } = req.body;
    const userId = req.headers['user-id'];

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    if (votedUsers.has(userId)) {
        return res.status(400).json({ message: 'You have already voted' });
    }

    if (votes[party] !== undefined) {
        votes[party].count++;
        votes[party].users.push(userId); // Store the user ID
        votedUsers.add(userId); // Mark user as having voted
        return res.json({ message: `Thank you for voting for ${party}` });
    }

    return res.status(400).json({ message: 'Invalid party' });
});

// GET route to display results
app.get('/results', (req, res) => {
    res.json(votes);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
