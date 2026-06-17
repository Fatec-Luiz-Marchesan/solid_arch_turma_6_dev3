const VALID_TYPES = [
  "rabies",
  "distemper",
  "parvovirus",
  "leptospirosis",
  "hepatitis",
  "feline-leukemia",
  "other",
];

function validateVaccinePayload(payload = {}) {
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

  if (
    !payload.name ||
    typeof payload.name !== "string" ||
    payload.name.trim().length < 2
  ) {
    errors.push("name e obrigatorio (min 2 caracteres)");
  } else {
    data.name = payload.name.trim();
  }

  if (payload.appliedAt) {
    const dt = new Date(payload.appliedAt);
    if (Number.isNaN(dt.getTime()))
      errors.push("appliedAt deve ser uma data valida");
    else if (dt > new Date()) errors.push("appliedAt nao pode ser no futuro");
    else data.appliedAt = dt;
  }

  if (payload.nextDoseAt) {
    const dt = new Date(payload.nextDoseAt);
    if (Number.isNaN(dt.getTime()))
      errors.push("nextDoseAt deve ser uma data valida");
    else if (data.appliedAt && dt <= data.appliedAt) {
      errors.push("nextDoseAt deve ser posterior a appliedAt");
    } else {
      data.nextDoseAt = dt;
    }
  }

  if (!payload.batchNumber || payload.batchNumber.trim().length === 0) {
    errors.push("batchNumber e obrigatorio");
  } else {
    data.batchNumber = payload.batchNumber.trim();
  }

  if (payload.manufacturer) data.manufacturer = payload.manufacturer.trim();
  if (payload.notes) data.notes = payload.notes;

  return { valid: errors.length === 0, errors, data };
}

module.exports = { validateVaccinePayload };
