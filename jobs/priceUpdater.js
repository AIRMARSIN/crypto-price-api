const cron = require("node-cron");
const { fetchAndCachePrices } = require("../services/cryptoService");

function startPriceUpdater() {
  // Every 3 minutes
  cron.schedule("*/3 * * * *", async () => {
    console.log("Updating crypto prices...");
    await fetchAndCachePrices();
  });
}

module.exports = { startPriceUpdater };
