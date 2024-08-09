require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => console.log(err));

// MongoDB Models
const playerSchema = new mongoose.Schema({
    name: String,
    playerId: { type: Number, unique: true },
    walletAddress: String,
});

const scoreSchema = new mongoose.Schema({
    playerName: String,
    playerId: Number,
    score: Number,
    createdAt: { type: Date, default: Date.now },
    walletAddress: String,
});

const Player = mongoose.model('Player', playerSchema);
const Score = mongoose.model('Score', scoreSchema);

// API Endpoints

// Fetch leaderboard (sorted by score)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Score.find().sort({ score: -1 }).limit(10);
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get player data by ID
app.get('/api/player/:id', async (req, res) => {
    console.log(`Received request for player ID: ${req.params.id}`); // Debugging line
    try {
        const player = await Player.findOne({ playerId: req.params.id });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Submit score
app.post('/api/submit_score', async (req, res) => {
    try {
        const { player_id, score, player_name } = req.body;

        // Fetch player by ID
        const player = await Player.findOne({ playerId: player_id });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Create a new score record
        const newScore = new Score({
            playerName: player_name,
            playerId: player_id,
            score,
            walletAddress: player.walletAddress,
        });

        await newScore.save();
        res.status(201).json(newScore);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
