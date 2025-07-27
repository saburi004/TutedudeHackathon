const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Enable CORS for all origins (or just localhost:3000 if you prefer)
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Your routes here
app.get('/api/get-sellers', (req, res) => {
    // Logic here
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
