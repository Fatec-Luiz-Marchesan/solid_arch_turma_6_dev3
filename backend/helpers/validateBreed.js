const VALID_SPECIES = ["dog", "cat", "rabbit", "bird", "other"];
const VALID_SIZES = ["small", "medium", "large", "giant"];
function validateBreedPayload(payload = {}, isUpdate = false) {
  const errors = [];
  const data = {};

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || payload.name.trim().length < 2) {
      errors.push("name e obrigatorio e deve ter minimo 2 caracteres");
    } else if (payload.name.trim().length > 50) {
      errors.push("name nao pode ultrapassar 50 caracteres");
    } else {
      data.name = payload.name.trim();
    }
  }

  if (!isUpdate || payload.species !== undefined) {
    if (!VALID_SPECIES.includes(payload.species)) {
      errors.push(`species invalido. Aceitos: ${VALID_SPECIES.join(", ")}`);
    } else {
      data.species = payload.species;
    }
  }

  if (!isUpdate || payload.size !== undefined) {
    if (!VALID_SIZES.includes(payload.size)) {
      errors.push(`size invalido. Aceitos: ${VALID_SIZES.join(", ")}`);
    } else {
      data.size = payload.size;
    }
  }
  if (!isUpdate || payload.averageWeight !== undefined) {
    const aw = payload.averageWeight;
    if (!aw || typeof aw !== "object") {
      errors.push(
        "averageWeight e obrigatorio e deve ser um objeto { min, max }",
      );
    } else {
      const min = Number(aw.min);
      const max = Number(aw.max);
      if (Number.isNaN(min) || min <= 0)
        errors.push("averageWeight.min deve ser positivo");
      else if (Number.isNaN(max) || max <= 0)
        errors.push("averageWeight.max deve ser positivo");
      else if (min >= max)
        errors.push("averageWeight.max deve ser maior que averageWeight.min");
      else data.averageWeight = { min, max };
    }
  }

  if (payload.characteristics !== undefined) {
    if (!Array.isArray(payload.characteristics)) {
      errors.push("characteristics deve ser um array");
    } else if (payload.characteristics.length > 10) {
      errors.push("characteristics nao pode ter mais de 10 itens");
    } else if (payload.characteristics.some((c) => typeof c !== "string")) {
      errors.push("Todos os itens de characteristics devem ser strings");
    } else {
      data.characteristics = payload.characteristics;
    }
  }

  if (payload.origin !== undefined) {
    data.origin = payload.origin ? payload.origin.trim() : null;
  }

  if (payload.lifeExpectancy !== undefined) {
    const le = Number(payload.lifeExpectancy);
    if (Number.isNaN(le) || le < 1 || le > 30) {
      errors.push("lifeExpectancy deve ser um numero entre 1 e 30");
    } else {
      data.lifeExpectancy = le;
    }
  }
  return { valid: errors.length === 0, errors, data };
}
module.exports = { validateBreedPayload };
