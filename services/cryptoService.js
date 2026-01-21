const axios = require("axios");
const { setPrices } = require("../utils/cache");

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

async function fetchAndCachePrices() {
  try {
    const response = await axios.get(COINGECKO_URL, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false
      }
    });

    if (Array.isArray(response.data)) {
      setPrices(response.data);
      console.log("Crypto prices updated:", response.data.length);
    } else {
      console.error("Unexpected response format from CoinGecko");
    }

  } catch (error) {
    console.error("Failed to update prices:", error.message);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  fetchAndCachePrices
};
