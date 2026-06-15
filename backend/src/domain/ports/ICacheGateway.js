class ICacheGateway {
  async get(key) {
    throw new Error("ICacheGateway.get deve ser implementado");
  }
  async set(key, value, ttlSeconds) {
    throw new Error("ICacheGateway.set deve ser implementado");
  }
  async del(key) {
    throw new Error("ICacheGateway.del deve ser implementado");
  }
  async delByPattern(pattern) {
    throw new Error("ICacheGateway.delByPattern deve ser implementado");
  }
}
module.exports = ICacheGateway;
