require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());

// Mount webhook router
const webhookRoute = require('./routes/webhook');
app.use('/webhook', webhookRoute);

// Test route
app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});