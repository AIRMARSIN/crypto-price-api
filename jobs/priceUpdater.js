const cron = require("node-cron");
const { fetchAndCachePrices } = require("../services/cryptoService");

function startPriceUpdater() {
  // Every 60 seconds
  cron.schedule("*/60 * * * * *", async () => {
    console.log("Updating crypto prices...");
    await fetchAndCachePrices();
  });
}

module.exports = {
  startPriceUpdater
};
