const axios = require("axios");
const { setPrices } = require("../utils/cache");

const BINANCE_URL = "https://api.binance.com/api/v3/ticker/price";
const COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/markets";

// Top cryptocurrencies by market cap to fetch from Binance
const TOP_CRYPTOS = [
  "BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT",
  "DOGEUSDT", "SOLUSDT", "MATICUSDT", "LTCUSDT", "LINKUSDT",
  "UNIUSDT", "AVAXUSDT", "DOTUSDT", "DASUSDT", "TRXUSDT",
  "XLMUSDT", "WBTCUSDT", "ATOMUSDT", "GMTUSDT", "ARBUSDT",
  "OPUSDT", "FTMUSDT", "INJUSDT", "AAVEUSDT", "MKRUSDT",
  "ZECUSDT", "SUIUSDT", "KASUSDT", "APOUSDT", "NEARUSDT"
];

async function fetchFromBinance() {
  try {
    console.log("Fetching prices from Binance...");
    const response = await axios.get(BINANCE_URL, { timeout: 10000 });
    
    if (!Array.isArray(response.data)) {
      throw new Error("Unexpected Binance response format");
    }

    // Filter to top cryptocurrencies and transform to match our format
    const topPrices = response.data
      .filter(item => TOP_CRYPTOS.includes(item.symbol))
      .map((item, index) => ({
        id: item.symbol.toLowerCase().replace('usdt', ''),
        name: item.symbol.replace('usdt', '').toUpperCase(),
        symbol: item.symbol.replace('usdt', '').toLowerCase(),
        current_price: parseFloat(item.price),
        market_cap_rank: index + 1
      }))
      .sort((a, b) => a.market_cap_rank - b.market_cap_rank);

    if (topPrices.length > 0) {
      setPrices(topPrices);
      console.log(`Binance: Successfully cached ${topPrices.length} crypto prices`);
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Binance fetch failed:", error.message);
    return false;
  }
}

async function fetchFromCoinGecko() {
  const maxRetries = 2;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log("Fetching prices from CoinGecko...");
      const response = await axios.get(COINGECKO_URL, {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false
        },
        timeout: 10000,
        ...(process.env.COINGECKO_API_KEY && {
          headers: {
            "x-cg-pro-api-key": process.env.COINGECKO_API_KEY
          }
        })
      });

      if (Array.isArray(response.data)) {
        setPrices(response.data);
        console.log(`CoinGecko: Successfully cached ${response.data.length} crypto prices`);
        return true;
      }
      return false;

    } catch (error) {
      if (error.response?.status === 429) {
        retries++;
        if (retries >= maxRetries) {
          console.error("CoinGecko: Rate limited, giving up");
          return false;
        }
        const retryAfter = parseInt(error.response.headers['retry-after']) * 1000 || 120000;
        console.warn(`CoinGecko: Rate limited (429). Waiting ${retryAfter}ms before retry (${retries}/${maxRetries})`);
        await sleep(retryAfter);
      } else {
        console.error("CoinGecko fetch failed:", error.message);
        return false;
      }
    }
  }
  return false;
}

async function fetchAndCachePrices() {
  console.log("Starting crypto price update...");
  
  // Try Binance first (free, no rate limits)
  const binanceSuccess = await fetchFromBinance();
  
  if (!binanceSuccess) {
    // Fall back to CoinGecko if Binance fails
    await fetchFromCoinGecko();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  fetchAndCachePrices
};
