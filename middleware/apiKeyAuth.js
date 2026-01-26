function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query["api_key"];

  if (!apiKey) {
    return res.status(401).json({
      error: "API key missing"
    });
  }

  const validKeys = process.env.API_KEYS.split(",");

  if (!validKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Invalid API key"
    });
  }

  next();
}

module.exports = apiKeyAuth;
