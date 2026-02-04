require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const priceRoutes = require("./routes/priceRoutes");
const { fetchAndCachePrices } = require("./services/cryptoService");
const { startPriceUpdater } = require("./jobs/priceUpdater");
const healthRoute = require("./routes/health");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve static HTML files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Homepage loads demo HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "demo.html"));
  // res.json({ message: "Crypto Price API is running 🚀" });
});

app.use("/api/v1", priceRoutes);
app.use("/api/v1", healthRoute);

// Fetch prices after a delay
setTimeout(() => {
  console.log("Starting initial price fetch...");
  fetchAndCachePrices();
}, 5000);

startPriceUpdater();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
