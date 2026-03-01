require('dotenv').config();
const express = require('express');
const webhookRoute = require('./routes/webhook');
const { TOKEN_FILE } = require('./tokenRefresher');

const app = express();
app.use(express.json());

app.use('/webhook', webhookRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});