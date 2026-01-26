const cron = require("node-cron");
const { fetchAndCachePrices } = require("../services/cryptoService");

function startPriceUpdater() {
  // Every 60 minutes (Binance has no rate limits, but this reduces API calls further)
  cron.schedule("0 * * * *", async () => {
    console.log("Updating crypto prices...");
    await fetchAndCachePrices();
  });
}

module.exports = { startPriceUpdater };
