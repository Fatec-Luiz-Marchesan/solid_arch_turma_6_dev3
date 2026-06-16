class IHashGateway {
  async hash(plain) {
    throw new Error("IHashGateway.hash deve ser implementado");
  }
  async compare(plain, hashed) {
    throw new Error("IHashGateway.compare deve ser implementado");
  }
}

module.exports = IHashGateway;
