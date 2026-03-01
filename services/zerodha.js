const axios = require("axios");

async function placeZerodhaOrder(symbol, quantity, side) {
    try {

        console.log("Placing real Zerodha order...");

        const response = await axios.post(
            "https://api.kite.trade/orders/regular",
            new URLSearchParams({
                exchange: "NSE",
                tradingsymbol: symbol,
                transaction_type: side,
                quantity: quantity,
                product: "MIS",
                order_type: "MARKET",
                validity: "DAY"
            }),
            {
                headers: {
                    "X-Kite-Version": "3",
                    "Authorization": `token ${process.env.Z_API_KEY}:${process.env.Z_ACCESS_TOKEN}`
                }
            }
        );

        console.log("Zerodha API SUCCESS:", response.data);
        return response.data;

    } catch (err) {
        console.error("Zerodha API ERROR:", err.response?.data || err.message);
        throw err;
    }
}

module.exports = placeZerodhaOrder;