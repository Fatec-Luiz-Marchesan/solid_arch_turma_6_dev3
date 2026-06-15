class IDietRepository {
  async create(diet) {
    throw new Error("Not implemented");
  }
  async findById(id) {
    throw new Error("Not implemented");
  }
  async findByPetId(petId) {
    throw new Error("Not implemented");
  }
  async findAll({ petId, type, page, limit }) {
    throw new Error("Not implemented");
  }
  async update(id, diet) {
    throw new Error("Not implemented");
  }
  async delete(id) {
    throw new Error("Not implemented");
  }
}

module.exports = IDietRepository;
