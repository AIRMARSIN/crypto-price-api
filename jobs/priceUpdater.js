const cron = require("node-cron");
const { fetchAndCachePrices } = require("../services/cryptoService");

function startPriceUpdater() {
  // Every 10 minutes (CoinGecko free tier ~10 calls/min)
  cron.schedule("*/10 * * * *", async () => {
    console.log("Updating crypto prices...");
    await fetchAndCachePrices();
  });
}

module.exports = { startPriceUpdater };
