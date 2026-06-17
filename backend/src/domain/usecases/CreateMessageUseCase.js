const Message = require("../entities/Message");

class CreateMessageUseCase {
  constructor({ messageRepository }) {
    if (!messageRepository) throw new Error("messageRepository é obrigatório");
    this.messageRepository = messageRepository;
  }
  async execute({ senderId, receiverId, content, type }) {
    const message = new Message({ senderId, receiverId, content, type });
    return this.messageRepository.create({
      senderId: message.senderId, receiverId: message.receiverId,
      content: message.content, type: message.type,
      status: message.status, conversationId: message.conversationId,
      createdAt: message.createdAt,
    });
  }
}
class GetConversationUseCase {
  constructor({ messageRepository }) { if (!messageRepository) throw new Error("messageRepository é obrigatório"); this.messageRepository = messageRepository; }
  async execute({ userA, userB, page = 1, limit = 50 }) { if (!userA || !userB) throw new Error("userA e userB são obrigatórios"); const conversationId = [userA, userB].sort().join("-"); return this.messageRepository.findByConversation({ conversationId, page, limit }); }
}
module.exports = { CreateMessageUseCase, GetConversationUseCase };
