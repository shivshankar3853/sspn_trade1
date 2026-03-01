module.exports = async function(symbol, quantity, side) {
    console.log("Zerodha order:", symbol, quantity, side);
    return { status: "Zerodha order simulated" };
};