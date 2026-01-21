const axios = require("axios");
const { setPrices } = require("../utils/cache");

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

async function fetchAndCachePrices() {
  const maxRetries = 3;
  let retries = 0;

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
        const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.warn(`Rate limited (429). Retrying in ${waitTime}ms... (${retries}/${maxRetries})`);
        await sleep(waitTime);
      } else {
        console.error("Failed to update prices:", error.message);
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
