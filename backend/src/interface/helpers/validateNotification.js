const VALID_TYPES = ["adoption", "message", "event", "system", "alert"];

function validateNotificationPayload(payload = {}) {
  const errors = [];
  const data = {};

  if (!payload.userId) {
    errors.push("userId e obrigatorio");
  } else {
    data.userId = payload.userId;
  }

  if (!payload.type || !VALID_TYPES.includes(payload.type)) {
    errors.push("type invalido. Aceitos: " + VALID_TYPES.join(", "));
  } else {
    data.type = payload.type;
  }

  if (!payload.title || payload.title.trim().length < 3) {
    errors.push("title e obrigatorio (min 3 caracteres)");
  } else {
    data.title = payload.title.trim();
  }

  if (!payload.message || payload.message.trim().length < 5) {
    errors.push("message e obrigatorio (min 5 caracteres)");
  } else {
    data.message = payload.message.trim();
  }

  if (payload.metadata !== undefined) data.metadata = payload.metadata;

  return { valid: errors.length === 0, errors, data };
}

module.exports = { validateNotificationPayload };