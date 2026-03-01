const express = require('express');
const router = express.Router();
const placeUpstoxOrder = require('../services/upstox');
const placeZerodhaOrder = require('../services/zerodha');

router.post('/', async (req, res) => {
    try {
        const { broker, symbol, quantity, side } = req.body;

        if (broker === 'upstox') {
            const response = await placeUpstoxOrder(symbol, quantity, side);
            return res.json(response);
        }

        if (broker === 'zerodha') {
            const response = await placeZerodhaOrder(symbol, quantity, side);
            return res.json(response);
        }

        res.status(400).json({ error: "Invalid broker" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Order failed" });
    }
});

module.exports = router;