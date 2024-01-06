// const uuid = require("uuid");
// function generateApiKey() {
//   return uuid.v4();
// }
// const apiKey = generateApiKey();
// console.log("Generated API Key:", apiKey);

const apiKeys = new Set([
  "e8c65c0d-e231-4294-9115-85d77c33140d",
  "ee22874d-6c1a-4502-ad55-c9821e613514",
]); // Store valid API keys

function isValidApiKey(apiKey) {
  return apiKeys.has(apiKey);
}

function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers["x-api-key"]; // Assuming API key is provided in the 'x-api-key' header

  if (!apiKey || !isValidApiKey(apiKey)) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  next(); // API key is valid, proceed to the next middleware or route handler
}

module.exports = {
  apiKeyMiddleware,
  isValidApiKey,
};
