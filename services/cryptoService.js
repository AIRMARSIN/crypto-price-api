const axios = require("axios");
const { setPrices } = require("../utils/cache");

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

// Retry logic with exponential backoff
async function fetchAndCachePrices(retries = 3) {
  try {
    const response = await axios.get(COINGECKO_URL, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false
      },
      timeout: 10000
    });

    if (Array.isArray(response.data)) {
      setPrices(response.data);
      console.log("Crypto prices updated:", response.data.length);
    } else {
      console.error("Unexpected response format from CoinGecko");
    }

  } catch (error) {
    // Handle rate limiting (429) with retry
    if (error.response?.status === 429 && retries > 0) {
      const delay = Math.pow(2, 3 - retries) * 1000; // exponential backoff
      console.warn(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
      await sleep(delay);
      return fetchAndCachePrices(retries - 1);
    }
    console.error("Failed to update prices:", error.message);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  fetchAndCachePrices
};
