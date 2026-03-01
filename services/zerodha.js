const axios = require('axios');
const fs = require('fs-extra');
const { TOKEN_FILE } = require('../tokenRefresher');
require('dotenv').config();

async function placeZerodhaOrder(symbol, quantity, side) {
    try {
        // Read latest access token
        const { access_token } = await fs.readJson(TOKEN_FILE);

        const response = await axios.post(
            "https://api.kite.trade/orders/regular",
            new URLSearchParams({
                exchange: "NSE",
                tradingsymbol: symbol,
                transaction_type: side,
                quantity,
                product: "MIS",
                order_type: "MARKET",
                validity: "DAY"
            }),
            {
                headers: {
                    "X-Kite-Version": "3",
                    "Authorization": `token ${process.env.Z_API_KEY}:${access_token}`
                }
            }
        );

        console.log("Zerodha order response:", response.data);
        return response.data;

    } catch (err) {
        console.error("Zerodha order error:", err.response?.data || err.message);
        throw err;
    }
}

module.exports = placeZerodhaOrder;