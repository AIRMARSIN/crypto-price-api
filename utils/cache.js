let cache = {
  prices: [],
  lastUpdated: null
};

function setPrices(data) {
  cache.prices = data;
  cache.lastUpdated = new Date();
}

function getPrices() {
  return cache;
}

module.exports = {
  setPrices,
  getPrices
};
