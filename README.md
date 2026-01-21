# 🚀 Crypto Prices API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

A simple, **real-time cryptocurrency price API** built with Node.js and Express.  
Perfect for frontend developers, portfolios, and demo projects.

---

## 🌐 Base URL

http://localhost:5000/api/v1



---

## 🔑 Authentication

All endpoints **except `/health`** require an **API key** sent in headers:

x-api-key: YOUR_API_KEY



Example valid keys (for testing/demo):

key123, key456, devtestkey



---

## 🧾 Endpoints

### 1️⃣ Get All Crypto Prices

- **URL:** `/prices`  
- **Method:** `GET`  
- **Headers:** 
x-api-key: key123



- **Success Response (200 OK):**

```json
{
"updatedAt": "2026-01-21T14:20:00.000Z",
"count": 50,
"data": [
  {
    "id": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "price": 43210,
    "marketCap": 850000000000,
    "change24h": 2.14,
    "image": "https://..."
  }
]
}
Error Responses:


{ "error": "API key missing" }  // 401 Unauthorized
{ "error": "Invalid API key" }  // 403 Forbidden

2️⃣ Health Check

URL : /health
Method: GET
Headers: None
Response (200 OK):

{
  "status": "ok",
  "uptime": 1234.56,
  "timestamp": "2026-01-21T14:20:00.000Z"
}
Use this endpoint to verify if the API is live and healthy.

💻 Example Usage (JavaScript / Fetch)


fetch("http://localhost:5000/api/v1/prices", {
  headers: {
    "x-api-key": "key123"
  }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

⚡ Features
✅ Real-time cryptocurrency prices (50 top coins)
✅ Prices cached and updated every 3 minutes
✅ Simple API key authentication
✅ Health check endpoint for uptime monitoring
✅ Clean and frontend-friendly JSON output


🛠 Tech Stack
Node.js
Express.js
Axios (for CoinGecko API)
Node-cron (automatic updates)
In-memory cache for speed

🚀 Deployment
Clone the repo:

git clone https://github.com/yourusername/crypto-prices-api.git

Install dependencies:
npm install

Create .env file:

API_KEYS=key123,key456,devtestkey
PRICE_UPDATE_INTERVAL=180
PORT=5000
Run locally:
npm run dev

Access API:
http://localhost:5000/api/v1/prices
http://localhost:5000/api/v1/health