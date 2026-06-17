const VALID_TYPES = ["pet", "event", "user", "clinic", "shelter"];

function validateLocationPayload(payload = {}) {
  const errors = [];
  const data = {};

  if (
    !payload.name ||
    typeof payload.name !== "string" ||
    payload.name.trim().length < 2
  ) {
    errors.push("name e obrigatorio (min 2 caracteres)");
  } else if (payload.name.trim().length > 100) {
    errors.push("name nao pode passar de 100 caracteres");
  } else {
    data.name = payload.name.trim();
  }

  const lat = Number(payload.latitude);
  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    errors.push("latitude deve estar entre -90 e 90");
  } else {
    data.latitude = lat;
  }

  const lng = Number(payload.longitude);
  if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    errors.push("longitude deve estar entre -180 e 180");
  } else {
    data.longitude = lng;
  }

  if (!VALID_TYPES.includes(payload.type)) {
    errors.push(`type invalido. Aceitos: ${VALID_TYPES.join(", ")}`);
  } else {
    data.type = payload.type;
  }

  if (!payload.referenceId) {
    errors.push("referenceId e obrigatorio");
  } else {
    data.referenceId = payload.referenceId;
  }

  if (payload.address !== undefined) {
    if (typeof payload.address !== "string") {
      errors.push("address deve ser uma string");
    } else {
      data.address = payload.address.trim();
    }
  }

  return { valid: errors.length === 0, errors, data };
}

function validateNearbyQuery(query = {}) {
  const errors = [];
  const data = {};

  const lat = parseFloat(query.lat);
  if (Number.isNaN(lat)) errors.push("lat e obrigatorio e deve ser numerico");
  else data.latitude = lat;

  const lng = parseFloat(query.lng);
  if (Number.isNaN(lng)) errors.push("lng e obrigatorio e deve ser numerico");
  else data.longitude = lng;

  const radius = parseFloat(query.radius || "5");
  if (Number.isNaN(radius) || radius <= 0 || radius > 100) {
    errors.push("radius deve ser um numero entre 0 e 100");
  } else {
    data.radiusKm = radius;
  }

  if (query.type) {
    if (!VALID_TYPES.includes(query.type)) {
      errors.push(`type invalido. Aceitos: ${VALID_TYPES.join(", ")}`);
    } else {
      data.type = query.type;
    }
  }

  return { valid: errors.length === 0, errors, data };
}

module.exports = { validateLocationPayload, validateNearbyQuery };
