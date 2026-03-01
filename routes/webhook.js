router.post('/', async (req, res) => {
    try {
        const { broker, symbol, quantity, side } = req.body;

        if (!broker || !symbol || !quantity || !side) {
            return res.status(400).json({ error: "Missing fields" });
        }

        // 🚀 Immediately respond to TradingView
        res.json({ status: "Signal received" });

        // 🔥 Process order in background (no await)
        (async () => {
            try {
                if (broker.toLowerCase() === "zerodha") {
                    await placeZerodhaOrder(symbol, quantity, side.toUpperCase());
                } 
                else if (broker.toLowerCase() === "upstox") {
                    await placeUpstoxOrder(symbol, quantity, side.toUpperCase());
                }

                console.log("✅ Order placed successfully");

            } catch (err) {
                console.error("❌ Background order failed:", err.message);
            }
        })();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});