const ObjectId = require("mongoose").Types.ObjectId;
function validateReviewPayload(payload = {}) {
  const errors = [], data = {};
  if (!payload.userId) { errors.push("userId e obrigatorio"); }
  else if (!ObjectId.isValid(payload.userId)) { errors.push("userId invalido"); }
  else { data.userId = payload.userId; }
  if (!payload.petId) { errors.push("petId e obrigatorio"); }
  else if (!ObjectId.isValid(payload.petId)) { errors.push("petId invalido"); }
  else { data.petId = payload.petId; }
  if (payload.rating === undefined || payload.rating === null) { errors.push("rating e obrigatorio"); }
  else { const r = Number(payload.rating); if (Number.isNaN(r) || r < 1 || r > 5) { errors.push("rating deve ser entre 1 e 5"); } else { data.rating = r; } }
  if (payload.comment !== undefined) data.comment = String(payload.comment);
  if (payload.recommend !== undefined) { if (typeof payload.recommend !== "boolean") { errors.push("recommend deve ser um booleano"); } else { data.recommend = payload.recommend; } } else { data.recommend = true; }
  return { valid: errors.length === 0, errors, data };
}
module.exports = { validateReviewPayload };
