const axios = require("axios");
const { setPrices } = require("../utils/cache");

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

let lastRateLimitError = null;
let rateLimitBackoffMs = 0;

// Retry logic with exponential backoff
async function fetchAndCachePrices(retries = 2) {
  // If we hit rate limit recently, wait longer
  if (rateLimitBackoffMs > 0) {
    console.warn(`Rate limit backoff active. Skipping fetch for now.`);
    return;
  }

  try {
    const response = await axios.get(COINGECKO_URL, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false
      },
      timeout: 15000
    });

    if (Array.isArray(response.data)) {
      setPrices(response.data);
      console.log("Crypto prices updated:", response.data.length);
      lastRateLimitError = null; // reset on success
      rateLimitBackoffMs = 0;
    } else {
      console.error("Unexpected response format from CoinGecko");
    }

  } catch (error) {
    // Handle rate limiting (429) with longer backoff
    if (error.response?.status === 429) {
      lastRateLimitError = Date.now();
      rateLimitBackoffMs = Math.min(30000, 5000 * (3 - retries)); // max 30s backoff
      
      if (retries > 0) {
        const delay = Math.pow(2, 2 - retries) * 2000; // 2s, 4s, 8s
        console.warn(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
        await sleep(delay);
        return fetchAndCachePrices(retries - 1);
      }
      console.error("Rate limited and out of retries. Will retry on next scheduled update.");
    } else {
      console.error("Failed to update prices:", error.message);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  fetchAndCachePrices
};
