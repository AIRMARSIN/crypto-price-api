function apiKeyAuth(req, res, next) {
  // Accept API key from header, query param, or Authorization Bearer token.
  const headerKey = req.headers["x-api-key"];
  const queryKey = req.query && (req.query.apikey || req.query.api_key);
  const bearer = req.headers.authorization && req.headers.authorization.split(" ")[1];

  const apiKey = headerKey || queryKey || bearer;

  if (!apiKey) {
    return res.status(401).json({
      error: "API key missing"
    });
  }

  const validKeys = (process.env.API_KEYS || "").split(",");

  if (!validKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Invalid API key"
    });
  }

  next();
}

module.exports = apiKeyAuth;
