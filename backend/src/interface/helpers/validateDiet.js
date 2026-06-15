const VALID_TYPES = [
  "standard",
  "hypocaloric",
  "hyperproteic",
  "therapeutic",
  "raw",
];
const VALID_FREQS = ["daily", "weekly", "custom"];
const TYPES_WITH_TARGET = ["hypocaloric", "therapeutic"];

function validateDietPayload(payload = {}) {
  const errors = [];
  const data = {};

  if (!payload.petId) errors.push("petId e obrigatorio");
  else data.petId = payload.petId;

  if (!payload.vetId) errors.push("vetId e obrigatorio");
  else data.vetId = payload.vetId;

  if (!VALID_TYPES.includes(payload.type)) {
    errors.push(`type invalido. Aceitos: ${VALID_TYPES.join(", ")}`);
  } else {
    data.type = payload.type;
  }

  const meals = parseInt(payload.mealsPerDay, 10);
  if (Number.isNaN(meals) || meals < 1 || meals > 10) {
    errors.push("mealsPerDay deve ser um inteiro entre 1 e 10");
  } else {
    data.mealsPerDay = meals;
  }

  if (payload.frequency !== undefined) {
    if (!VALID_FREQS.includes(payload.frequency)) {
      errors.push(`frequency invalido. Aceitos: ${VALID_FREQS.join(", ")}`);
    } else {
      data.frequency = payload.frequency;
    }
  }

  if (payload.targetWeight !== undefined) {
    const tw = Number(payload.targetWeight);
    if (Number.isNaN(tw) || tw <= 0) {
      errors.push("targetWeight deve ser um numero positivo");
    } else if (data.type && !TYPES_WITH_TARGET.includes(data.type)) {
      errors.push(
        `targetWeight so e permitido para: ${TYPES_WITH_TARGET.join(", ")}`,
      );
    } else {
      data.targetWeight = tw;
    }
  }

  if (payload.restrictions) data.restrictions = payload.restrictions;
  if (payload.notes) data.notes = payload.notes;
  if (payload.startDate) data.startDate = payload.startDate;
  if (payload.endDate) data.endDate = payload.endDate;

  return { valid: errors.length === 0, errors, data };
}

module.exports = { validateDietPayload };
