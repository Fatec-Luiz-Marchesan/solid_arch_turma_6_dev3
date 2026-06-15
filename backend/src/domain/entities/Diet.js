class Diet {
  static VALID_TYPES = [
    "standard",
    "hypocaloric",
    "hyperproteic",
    "therapeutic",
    "raw",
  ];
  static VALID_FREQUENCIES = ["daily", "weekly", "custom"];

  constructor({
    id,
    petId,
    vetId,
    type,
    dailyCalories,
    restrictions = [],
    mealsPerDay,
    notes = "",
    startDate,
    endDate,
    frequency = "daily",
    targetWeight = null,
  }) {
    if (!petId) throw new Error("Diet.petId e obrigatorio");
    if (!vetId) throw new Error("Diet.vetId e obrigatorio");

    if (!Diet.VALID_TYPES.includes(type)) {
      throw new Error(
        `Diet.type invalido. Aceitos: ${Diet.VALID_TYPES.join(", ")}`,
      );
    }

    if (
      dailyCalories != null &&
      (typeof dailyCalories !== "number" || dailyCalories <= 0)
    ) {
      throw new Error("Diet.dailyCalories deve ser um numero positivo");
    }

    if (!Number.isInteger(mealsPerDay) || mealsPerDay < 1 || mealsPerDay > 10) {
      throw new Error("Diet.mealsPerDay deve ser um inteiro entre 1 e 10");
    }

    if (!Diet.VALID_FREQUENCIES.includes(frequency)) {
      throw new Error(
        `Diet.frequency invalido. Aceitos: ${Diet.VALID_FREQUENCIES.join(", ")}`,
      );
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      throw new Error("Diet.endDate deve ser posterior a startDate");
    }

    if (targetWeight != null) {
      const tw = Number(targetWeight);
      if (Number.isNaN(tw) || tw <= 0) {
        throw new Error("Diet.targetWeight deve ser um numero positivo");
      }
      if (!["hypocaloric", "therapeutic"].includes(type)) {
        throw new Error(
          "Diet.targetWeight so e permitido para tipos hypocaloric ou therapeutic",
        );
      }
    }

    this.id = id;
    this.petId = petId;
    this.vetId = vetId;
    this.type = type;
    this.dailyCalories = dailyCalories || null;
    this.restrictions = Array.isArray(restrictions) ? restrictions : [];
    this.mealsPerDay = mealsPerDay;
    this.notes = notes ? notes.trim() : "";
    this.startDate = startDate ? new Date(startDate) : new Date();
    this.endDate = endDate ? new Date(endDate) : null;
    this.frequency = frequency;
    this.targetWeight = targetWeight;
  }

  isActive() {
    const now = new Date();
    if (now < this.startDate) return false;
    if (this.endDate && now > this.endDate) return false;
    return true;
  }
}

module.exports = Diet;
