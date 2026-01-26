const axios = require("axios");
const { setPrices } = require("../utils/cache");

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

async function fetchAndCachePrices() {
  const maxRetries = 3;
  let retries = 0;
  console.log("API Key present:", !!process.env.COINGECKO_API_KEY);

  while (retries < maxRetries) {
    try {
      const response = await axios.get(COINGECKO_URL, {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false
        },
        ...(process.env.COINGECKO_API_KEY && {
          headers: {
            "x-cg-pro-api-key": process.env.COINGECKO_API_KEY
          }
        })
      });

      if (Array.isArray(response.data)) {
        setPrices(response.data);
        console.log("Crypto prices updated:", response.data.length);
        return;
      } else {
        console.error("Unexpected response format from CoinGecko");
        return;
      }

    } catch (error) {
      if (error.response?.status === 429) {
        retries++;
        if (retries >= maxRetries) {
          console.error("Failed to update prices after 3 retries due to rate limiting");
          return;
        }
        // Use server's retry-after header or default to exponential backoff (min 60s)
        const serverRetryAfter = parseInt(error.response.headers['retry-after']) * 1000;
        const retryAfter = serverRetryAfter || (60000 * Math.pow(2, retries - 1));
        console.warn(`Rate limited (429). Waiting ${retryAfter}ms before retry. Attempt ${retries}/${maxRetries}`);
        await sleep(retryAfter);
      } else {
        console.error("Failed to update prices:", error.message);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
        return;
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  fetchAndCachePrices
};
