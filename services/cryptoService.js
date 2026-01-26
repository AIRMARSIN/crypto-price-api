const axios = require("axios");
const { setPrices } = require("../utils/cache");

const BINANCE_PRICE_URL = "https://api.binance.com/api/v3/ticker/price";
const BINANCE_INFO_URL = "https://api.binance.com/api/v3/exchangeInfo";

// Top 50 cryptocurrencies by market cap (Binance trading pairs)
const TOP_CRYPTOS = [
  "BTC", "ETH", "BNB", "XRP", "ADA", "DOGE", "SOL", "MATIC", "LTC", "LINK",
  "UNI", "AVAX", "DOT", "DA", "TRX", "XLM", "WBTC", "ATOM", "GMT", "ARB",
  "OP", "FTM", "INJ", "AAVE", "MKR", "ZEC", "SUI", "KAS", "APO", "NEAR",
  "FLOW", "SAND", "GALA", "MANA", "AEUR", "CELO", "FIL", "HBAR", "ICP", "VET"
];

async function fetchFromBinance() {
  try {
    console.log("Fetching crypto prices from Binance...");
    
    // Fetch all prices
    const pricesResponse = await axios.get(BINANCE_PRICE_URL, { timeout: 10000 });
    
    if (!Array.isArray(pricesResponse.data)) {
      throw new Error("Unexpected response format from Binance prices");
    }

    // Get prices map for quick lookup
    const pricesMap = {};
    pricesResponse.data.forEach(item => {
      const symbol = item.symbol.replace('USDT', '');
      pricesMap[symbol] = parseFloat(item.price);
    });

    // Filter to top cryptos and build response
    const topPrices = TOP_CRYPTOS
      .map((symbol, index) => {
        const price = pricesMap[symbol];
        if (!price) return null;
        
        return {
          id: symbol.toLowerCase(),
          name: symbol.toUpperCase(),
          symbol: symbol.toLowerCase(),
          current_price: price,
          market_cap_rank: index + 1
        };
      })
      .filter(item => item !== null);

    if (topPrices.length > 0) {
      setPrices(topPrices);
      console.log(`✓ Successfully fetched and cached ${topPrices.length} cryptocurrencies from Binance`);
      return true;
    } else {
      console.error("No prices found from Binance");
      return false;
    }

  } catch (error) {
    console.error("✗ Binance fetch failed:", error.message);
    if (error.response) {
      console.error("  Status:", error.response.status);
    }
    return false;
  }
}

async function fetchAndCachePrices() {
  console.log("Starting crypto price fetch at", new Date().toISOString());
  const success = await fetchFromBinance();
  
  if (!success) {
    console.error("Failed to fetch prices. Cache will remain unchanged.");
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  fetchAndCachePrices
};
