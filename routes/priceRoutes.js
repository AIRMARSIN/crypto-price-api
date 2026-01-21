const express = require("express");
const router = express.Router();
const { getPrices } = require("../utils/cache");
const { formatPrices } = require("../utils/priceFormatter");
const apiKeyAuth = require("../middleware/apiKeyAuth");


router.get("/prices", apiKeyAuth, (req, res) => {
  const cache = getPrices();

  if (!cache || !cache.prices || cache.prices.length === 0) {
    return res.status(503).json({
      error: "Prices not ready yet. Try again shortly."
    });
  }

  const formattedPrices = formatPrices(cache.prices);

  res.json({
    updatedAt: cache.lastUpdated,
    count: formattedPrices.length,
    data: formattedPrices
  });
});


module.exports = router;
