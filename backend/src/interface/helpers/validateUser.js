function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBRPhone(phone) {
  return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone);
}

function validateUserPayload(payload = {}, isUpdate = false) {
  const errors = [];
  const data = {};

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || payload.name.trim().length < 2) {
      errors.push("name e obrigatorio (min 2 caracteres)");
    } else if (payload.name.trim().length > 80) {
      errors.push("name nao pode ultrapassar 80 caracteres");
    } else {
      data.name = payload.name.trim();
    }
  }

  if (!isUpdate) {
    if (!payload.email || !isValidEmail(payload.email)) {
      errors.push("email invalido ou ausente");
    } else {
      data.email = payload.email.toLowerCase().trim();
    }
  }

  if (!isUpdate || payload.password !== undefined) {
    if (!payload.password || payload.password.length < 6) {
      errors.push("password e obrigatorio (min 6 caracteres)");
    } else {
      data.password = payload.password;
    }
  }

  if (payload.phoneNumber !== undefined && payload.phoneNumber !== null) {
    if (!isValidBRPhone(payload.phoneNumber)) {
      errors.push("phoneNumber invalido. Formato esperado: (XX) XXXXX-XXXX");
    } else {
      data.phoneNumber = payload.phoneNumber;
    }
  }

  return { valid: errors.length === 0, errors, data };
}

module.exports = { validateUserPayload, isValidEmail, isValidBRPhone };
