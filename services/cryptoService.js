const axios = require("axios");
const { setPrices } = require("../utils/cache");

const COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/markets";
const API_KEY = process.env.COINGECKO_API_KEY; 

let blockedUntil = 0;
let isFetching = false;

async function fetchAndCachePrices() {
  if (isFetching) return;
  if (Date.now() < blockedUntil) {
    console.log("Cooldown active. Skipping CoinGecko call.");
    return;
  }

  isFetching = true;

  try {
    const response = await axios.get(COINGECKO_URL, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false,
        x_cg_demo_api_key: API_KEY,
        sparkline: false,
      },
      timeout: 15000,
    });

    setPrices(response.data);
    console.log("Crypto prices updated:", response.data.length);
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("Rate limited. Cooling down for 30 mins...");
      blockedUntil = Date.now() + 30 * 60 * 1000;
    } else {
      console.error("Failed to update prices:", error.message);
    }
  } finally {
    isFetching = false;
  }
}

module.exports = {
  fetchAndCachePrices,
};
