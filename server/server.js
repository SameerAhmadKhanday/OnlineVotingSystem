// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// // Serve static files from the public directory
// app.use(express.static(path.join(__dirname, '../public')));

// // Store votes with user IDs
// let votes = {
//     'Party A': { count: 0, users: [] },
//     'Party B': { count: 0, users: [] },
//     'Party C': { count: 0, users: [] }
// };

// let votedUsers = new Set();
// let users = {}; // Store user credentials

// app.post('/signup', (req, res) => {
//     const { userId, password } = req.body;

//     if (users[userId]) {
//         return res.status(400).json({ message: 'User ID already exists' });
//     }

//     users[userId] = { password }; // Store the user's password
//     return res.json({ message: 'Signup successful!' });
// });

// app.post('/login', (req, res) => {
//     const { userId, password } = req.body;

//     if (!users[userId]) {
//         return res.status(400).json({ message: 'User ID does not exist' });
//     }

//     if (users[userId].password !== password) {
//         return res.status(400).json({ message: 'Invalid password' });
//     }

//     return res.json({ success: true, message: 'Login successful!' });
// });

// // Voting logic remains the same...
// app.post('/vote', (req, res) => {
//     const { party } = req.body;
//     const userId = req.headers['user-id'];

//     if (!userId) {
//         return res.status(400).json({ message: 'User ID is required' });
//     }

//     if (votedUsers.has(userId)) {
//         return res.status(400).json({ message: 'You can only vote once' });
//     }

//     if (votes[party] !== undefined) {
//         votes[party].count++;
//         votes[party].users.push(userId); // Store the user ID
//         votedUsers.add(userId);
//         return res.json({ message: `Thank you for voting for ${party}` });
//     }

//     return res.status(400).json({ message: 'Invalid party' });
// });

// app.get('/results', (req, res) => {
//     res.json(votes);
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Store votes with user IDs
let votes = {
    'Party A': { count: 0, users: [] },
    'Party B': { count: 0, users: [] },
    'Party C': { count: 0, users: [] }
};

let votedUsers = new Set();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Redirect the root URL to the signup page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signin.html')); // Default to signup page
});

// Serve the signup page
app.get('/signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signin.html'));
});

// Serve the login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// POST route for signup (for submitting form data)
app.post('/signup', (req, res) => {
    const { userId, password } = req.body;

    // Simulate saving user details (this is where database logic would go)
    res.json({ message: 'Sign up successful! Please log in.' });
});

// POST route for login (for submitting form data)
app.post('/login', (req, res) => {
    const { userId, password } = req.body;

    // Simulate checking user credentials (this is where login logic would go)
    res.json({ message: 'Login successful! Redirecting to the voting page.' });
});

// POST route for voting
app.post('/vote', (req, res) => {
    const { party } = req.body;
    const userId = req.headers['user-id'];

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    if (votedUsers.has(userId)) {
        return res.status(400).json({ message: 'You can only vote once' });
    }

    if (votes[party] !== undefined) {
        votes[party].count++;
        votes[party].users.push(userId); // Store the user ID
        votedUsers.add(userId);
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
