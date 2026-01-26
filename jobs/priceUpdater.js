const cron = require("node-cron");
const { fetchAndCachePrices } = require("../services/cryptoService");

function startPriceUpdater() {
  // Every 30 minutes (stays within free tier 10k monthly limit)
  cron.schedule("*/30 * * * *", async () => {
    console.log("Updating crypto prices...");
    await fetchAndCachePrices();
  });
}

module.exports = { startPriceUpdater };
