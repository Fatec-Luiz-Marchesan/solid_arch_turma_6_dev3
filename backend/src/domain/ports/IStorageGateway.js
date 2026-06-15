class IStorageGateway {
  async save(file) {
    throw new Error('IStorageGateway.save deve ser implementado');
  }
  async remove(key) {
    throw new Error('IStorageGateway.remove deve ser implementado');
  }
}
module.exports = IStorageGateway;