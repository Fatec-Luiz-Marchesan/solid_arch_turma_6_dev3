class Vaccine {
  static VALID_TYPES = [
    "rabies",
    "distemper",
    "parvovirus",
    "leptospirosis",
    "hepatitis",
    "feline-leukemia",
    "other",
  ];

  constructor({
    id,
    petId,
    vetId,
    type,
    name,
    appliedAt,
    nextDoseAt,
    batchNumber,
    manufacturer,
    notes,
  }) {
    if (!petId) throw new Error("Vaccine.petId e obrigatorio");
    if (!vetId) throw new Error("Vaccine.vetId e obrigatorio");
    if (!Vaccine.VALID_TYPES.includes(type)) {
      throw new Error(
        `Vaccine.type invalido. Aceitos: ${Vaccine.VALID_TYPES.join(", ")}`,
      );
    }
    if (!name || name.trim().length < 2) {
      throw new Error("Vaccine.name e obrigatorio (min 2 caracteres)");
    }

    const applied = appliedAt ? new Date(appliedAt) : new Date();
    if (Number.isNaN(applied.getTime())) {
      throw new Error("Vaccine.appliedAt deve ser uma data valida");
    }
    if (applied > new Date()) {
      throw new Error("Vaccine.appliedAt nao pode ser no futuro");
    }

    if (nextDoseAt) {
      const next = new Date(nextDoseAt);
      if (Number.isNaN(next.getTime())) {
        throw new Error("Vaccine.nextDoseAt deve ser uma data valida");
      }
      if (next <= applied) {
        throw new Error("Vaccine.nextDoseAt deve ser posterior a appliedAt");
      }
    }

    if (!batchNumber || batchNumber.trim().length === 0) {
      throw new Error("Vaccine.batchNumber e obrigatorio");
    }

    this.id = id;
    this.petId = petId;
    this.vetId = vetId;
    this.type = type;
    this.name = name.trim();
    this.appliedAt = applied;
    this.nextDoseAt = nextDoseAt ? new Date(nextDoseAt) : null;
    this.batchNumber = batchNumber.trim();
    this.manufacturer = manufacturer ? manufacturer.trim() : null;
    this.notes = notes ? notes.trim() : "";
  }

  isOverdue() {
    if (!this.nextDoseAt) return false;
    return new Date() > this.nextDoseAt;
  }

  daysUntilNextDose() {
    if (!this.nextDoseAt) return null;
    const diffMs = this.nextDoseAt - new Date();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
}

module.exports = Vaccine;
