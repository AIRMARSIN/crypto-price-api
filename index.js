require("dotenv").config();
const express = require("express");
const cors = require("cors");

const priceRoutes = require("./routes/priceRoutes");
const { fetchAndCachePrices } = require("./services/cryptoService");
const { startPriceUpdater } = require("./jobs/priceUpdater");
const healthRoute = require("./routes/health");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Crypto Price API is running 🚀" });
});

app.use("/api/v1", priceRoutes);
app.use("/api/v1", healthRoute);


// Fetch prices once at startup
fetchAndCachePrices();
startPriceUpdater();


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
