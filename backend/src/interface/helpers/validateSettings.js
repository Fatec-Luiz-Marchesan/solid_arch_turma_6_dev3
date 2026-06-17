function validateSettings(payload = {}) {
  if (!payload.userId) throw new Error("userId e obrigatorio");
  if (
    payload.notifications !== undefined &&
    typeof payload.notifications !== "boolean"
  )
    throw new Error("notifications deve ser booleano");
  return true;
}

module.exports = validateSettings;