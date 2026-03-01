require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Webhook route
const webhookRoute = require('./routes/webhook');
app.use('/webhook', webhookRoute);

// Zerodha callback route to generate access token automatically
app.get('/zerodha/callback', async (req, res) => {
    const request_token = req.query.request_token;

    if (!request_token) {
        return res.status(400).send("Missing request_token");
    }

    try {
        // Generate checksum
        const checksum_str = process.env.Z_API_KEY + request_token + process.env.Z_API_SECRET;
        const checksum = crypto.createHash('sha256').update(checksum_str).digest('hex');

        // Exchange request_token for access_token
        const response = await axios.post(
            'https://api.kite.trade/session/token',
            new URLSearchParams({
                api_key: process.env.Z_API_KEY,
                request_token: request_token,
                checksum: checksum
            }),
            { headers: { "X-Kite-Version": "3" } }
        );

        const access_token = response.data.data.access_token;

        // For demo: log token. In prod, store in DB or update ENV
        console.log("NEW ZERODHA ACCESS TOKEN:", access_token);

        // Optionally, you can update a .env file (local dev only)
        // Or use a secrets manager for production
        res.send("Access token generated successfully! Check server logs.");

    } catch (err) {
        console.error("Error generating access token:", err.response?.data || err.message);
        res.status(500).send("Failed to generate access token");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});