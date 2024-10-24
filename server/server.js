const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Store votes with user IDs
let votes = {
    'Party A': { count: 0, users: [] },
    'Party B': { count: 0, users: [] },
    'Party C': { count: 0, users: [] }
};

let votedUsers = new Set();

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

app.get('/results', (req, res) => {
    res.json(votes);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
