class IUserRepository {
  async create(data) {
    throw new Error("nao implementado");
  }
  async findById(id) {
    throw new Error("nao implementado");
  }
  async findByEmail(email) {
    throw new Error("nao implementado");
  }
  async update(id, changes) {
    throw new Error("nao implementado");
  }
  async delete(id) {
    throw new Error("nao implementado");
  }
}

module.exports = IUserRepository;
