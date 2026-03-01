const puppeteer = require('puppeteer');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs-extra');
require('dotenv').config();

// File to store current access token
const TOKEN_FILE = 'access_token.json';

async function refreshZerodhaToken() {
    try {
        console.log("Starting Zerodha token refresh...");

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const loginUrl = `https://kite.zerodha.com/connect/login?api_key=${process.env.Z_API_KEY}&redirect_uri=https://your-app.onrender.com/zerodha/callback`;

        await page.goto(loginUrl, { waitUntil: 'networkidle0' });

        // Login
        await page.type('input[id="userid"]', process.env.Z_USERNAME);
        await page.type('input[id="password"]', process.env.Z_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000);

        // Optional PIN / 2FA
        if (process.env.Z_PIN) {
            await page.type('input[id="pin"]', process.env.Z_PIN);
            await page.click('button[type="submit"]');
            await page.waitForTimeout(3000);
        }

        // Wait for redirect with request_token
        const url = page.url();
        await browser.close();

        const request_token_match = url.match(/request_token=([^&]+)/);
        if (!request_token_match) throw new Error("Request token not found");

        const request_token = request_token_match[1];
        console.log("Request token:", request_token);

        // Exchange request token for access token
        const checksum = crypto
            .createHash('sha256')
            .update(process.env.Z_API_KEY + request_token + process.env.Z_API_SECRET)
            .digest('hex');

        const resp = await axios.post(
            'https://api.kite.trade/session/token',
            new URLSearchParams({
                api_key: process.env.Z_API_KEY,
                request_token,
                checksum
            }),
            { headers: { 'X-Kite-Version': '3' } }
        );

        const access_token = resp.data.data.access_token;
        console.log("New access token:", access_token);

        // Save access token to JSON file
        await fs.writeJson(TOKEN_FILE, { access_token }, { spaces: 2 });

        console.log("Access token saved successfully.");

    } catch (err) {
        console.error("Token refresh failed:", err.response?.data || err.message);
    }
}

// Run immediately, then schedule daily at 6:30 AM
refreshZerodhaToken();
const cron = require('node-cron');
cron.schedule('30 6 * * *', refreshZerodhaToken, { timezone: 'Asia/Kolkata' });

module.exports = { TOKEN_FILE };