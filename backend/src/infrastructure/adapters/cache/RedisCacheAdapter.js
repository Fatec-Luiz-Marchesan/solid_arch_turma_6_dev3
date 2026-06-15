const ICacheGateway = require("../../../domain/ports/ICacheGateway");
class RedisCacheAdapter extends ICacheGateway {
  constructor(redisClient) {
    super();
    if (!redisClient)
      throw new Error("RedisCacheAdapter requer instancia de redisClient");
    this.redis = redisClient;
  }
  async get(key) {
    return this.redis.get(key);
  }
  async set(key, value, ttlSeconds = 60) {
    if (ttlSeconds <= 0) throw new Error("ttlSeconds deve ser positivo");
    await this.redis.set(key, value, "EX", ttlSeconds);
  }
  async del(key) {
    await this.redis.del(key);
  }
  async delByPattern(pattern) {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await this.redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100,
      );
      cursor = nextCursor;
      if (keys.length > 0) await this.redis.del(...keys);
    } while (cursor !== "0");
  }
}
module.exports = RedisCacheAdapter;
