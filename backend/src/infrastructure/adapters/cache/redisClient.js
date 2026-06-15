const Redis = require("ioredis");
let client = null;
function getRedisClient() {
  if (client) return client;
  client = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => Math.min(times * 100, 3000),
    maxRetriesPerRequest: 3,
  });
  client.on("connect", () => console.log("[Redis] Conectado"));
  client.on("error", (err) => console.error("[Redis] Erro:", err.message));
  return client;
}
async function closeRedisClient() {
  if (client) {
    await client.quit();
    client = null;
  }
}
module.exports = { getRedisClient, closeRedisClient };
