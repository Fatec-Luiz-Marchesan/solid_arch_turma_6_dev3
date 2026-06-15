const { validateMessagePayload } = require("../helpers/validateMessage");

class MessageController {
  constructor({ createMessageUseCase, getConversationUseCase }) {
    this.createMessageUseCase = createMessageUseCase;
    this.getConversationUseCase = getConversationUseCase;
  }

  async send(req, res) {
    const { valid, errors, data } = validateMessagePayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    try {
      const message = await this.createMessageUseCase.execute(data);
      return res.status(201).json(message);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getConversation(req, res) {
    try {
      const { userA, userB } = req.params;
      const { page, limit } = req.query;
      const result = await this.getConversationUseCase.execute({
        userA,
        userB,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 50,
      });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = MessageController;
