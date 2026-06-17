class Adoption {
  static VALID_STATUSES = ["pending", "approved", "rejected", "cancelled"];
  constructor({ id, petId, adopterId, notes = "", status = "pending", createdAt }) {
    if (!petId) throw new Error("petId e obrigatorio");
    if (!adopterId) throw new Error("adopterId e obrigatorio");
    if (!Adoption.VALID_STATUSES.includes(status)) throw new Error(`status invalido`);
    this.id = id; this.petId = petId; this.adopterId = adopterId;
    this.notes = notes; this.status = status; this.createdAt = createdAt || new Date();
  }
}
module.exports = Adoption;
