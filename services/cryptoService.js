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
        const retryAfter = parseInt(error.response.headers['retry-after']) * 1000 || Math.pow(2, retries) * 1000;
        console.warn(`Rate limited (429). Retry-After: ${retryAfter}ms. Attempt ${retries}/${maxRetries}`);
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

  console.error("Failed to update prices after 3 retries");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  fetchAndCachePrices
};

// Add this to middleware/apiKeyAuth.js
const apiKey = req.headers["x-api-key"] || req.query["api_key"];
