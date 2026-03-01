require('dotenv').config();
const express = require('express');

const app = express();

// 🔥 THIS IS REQUIRED
app.use(express.json());

const webhookRoute = require('./routes/webhook');
app.use('/webhook', webhookRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});