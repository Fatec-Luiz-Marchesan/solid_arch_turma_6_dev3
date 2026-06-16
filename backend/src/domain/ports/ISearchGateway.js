class ISearchGateway {
  async index(index, id, body) {
    throw new Error("ISearchGateway.index deve ser implementado");
  }

  async search(index, query, options = {}) {
    throw new Error("ISearchGateway.search deve ser implementado");
  }

  async delete(index, id) {
    throw new Error("ISearchGateway.delete deve ser implementado");
  }
}

module.exports = ISearchGateway;
