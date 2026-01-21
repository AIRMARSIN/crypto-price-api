function formatPrices(rawPrices) {
  return rawPrices.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    marketCap: coin.market_cap,
    change24h: coin.price_change_percentage_24h,
    image: coin.image
  }));
}

module.exports = {
  formatPrices
};
