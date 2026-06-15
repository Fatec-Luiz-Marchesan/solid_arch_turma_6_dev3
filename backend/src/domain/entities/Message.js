class Message {
  static VALID_TYPES = ["text", "image", "file"];
  static VALID_STATUSES = ["sent", "delivered", "read"];

  constructor({
    id,
    senderId,
    receiverId,
    content,
    type = "text",
    status = "sent",
    conversationId,
    createdAt,
  }) {
    if (!senderId) throw new Error("Message.senderId é obrigatório");
    if (!receiverId) throw new Error("Message.receiverId é obrigatório");
    if (senderId === receiverId)
      throw new Error("Remetente e destinatário não podem ser o mesmo");
    if (!content || content.trim().length === 0)
      throw new Error("Message.content é obrigatório");
    if (content.length > 2000)
      throw new Error("Message.content não pode ultrapassar 2000 caracteres");
    if (!Message.VALID_TYPES.includes(type))
      throw new Error(
        `Message.type inválido. Aceitos: ${Message.VALID_TYPES.join(", ")}`,
      );

    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content.trim();
    this.type = type;
    this.status = status;
    this.conversationId =
      conversationId || `${[senderId, receiverId].sort().join("-")}`;
    this.createdAt = createdAt || new Date();
  }

  markAsRead() {
    if (this.status === "read") throw new Error("Mensagem já foi lida");
    this.status = "read";
    return this;
  }
}

module.exports = Message;
