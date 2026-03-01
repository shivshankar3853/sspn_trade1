const express = require('express');
const router = express.Router();

const placeUpstoxOrder = require('../services/upstox');
const placeZerodhaOrder = require('../services/zerodha');

router.post('/', async (req, res) => {
    try {
        const { broker, symbol, quantity, side } = req.body;

        if (!broker || !symbol || !quantity || !side) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Respond immediately (prevents TradingView timeout)
        res.json({ status: "Signal received" });

        // Process in background
        (async () => {
            try {
                if (broker.toLowerCase() === "zerodha") {
                    await placeZerodhaOrder(symbol, quantity, side.toUpperCase());
                } else if (broker.toLowerCase() === "upstox") {
                    await placeUpstoxOrder(symbol, quantity, side.toUpperCase());
                } else {
                    console.log("Invalid broker received");
                }

                console.log("Order processed");
            } catch (err) {
                console.error("Background order failed:", err.message);
            }
        })();

    } catch (err) {
        console.error("Webhook error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;