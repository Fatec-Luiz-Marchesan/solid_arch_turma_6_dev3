const { validateUserPayload } = require("../helpers/validateUser");

class UserController {
  constructor({
    createUserUseCase,
    getUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
  }) {
    this.createUserUseCase = createUserUseCase;
    this.getUserUseCase = getUserUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;
  }

  async create(req, res) {
    const { valid, errors, data } = validateUserPayload(req.body, false);
    if (!valid) return res.status(400).json({ errors });
    try {
      const user = await this.createUserUseCase.execute(data);
      return res.status(201).json(user);
    } catch (err) {
      const code = err.message.includes("Email ja existe") ? 409 : 400;
      return res.status(code).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const user = await this.getUserUseCase.execute(req.params.id);
      if (!user)
        return res.status(404).json({ error: "Usuario nao encontrado" });
      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    const { valid, errors, data } = validateUserPayload(req.body, true);
    if (!valid) return res.status(400).json({ errors });
    try {
      const updated = await this.updateUserUseCase.execute({
        id: req.params.id,
        ...data,
      });
      if (!updated)
        return res.status(404).json({ error: "Usuario nao encontrado" });
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await this.deleteUserUseCase.execute(req.params.id);
      if (!deleted)
        return res.status(404).json({ error: "Usuario nao encontrado" });
      return res.status(204).send();
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = UserController;
