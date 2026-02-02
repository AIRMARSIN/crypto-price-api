require("dotenv").config();
const express = require("express");
const cors = require("cors");

const priceRoutes = require("./routes/priceRoutes");
const { fetchAndCachePrices } = require("./services/cryptoService");
const { startPriceUpdater } = require("./jobs/priceUpdater");
const healthRoute = require("./routes/health");

const axios = require("axios");

let priceCache = {};
let lastUpdated = null;
let isFetching = false;
let blockedUntil = 0;



const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Crypto Price API is running 🚀" });
});

app.use("/api/v1", priceRoutes);
app.use("/api/v1", healthRoute);


// Fetch prices after a 5s delay to avoid immediate rate-limit on startup
setTimeout(() => {
  console.log("Starting initial price fetch...");
  fetchAndCachePrices();
}, 5000);

startPriceUpdater();


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
