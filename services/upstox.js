module.exports = async function(symbol, quantity, side) {
    console.log("Upstox order:", symbol, quantity, side);
    return { status: "Upstox order simulated" };
};