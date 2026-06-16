function isStrongPassword(password) {
  if (!password || password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

function isValidBRPhone(phone) {
  return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone);
}

function validateUserPayload(payload = {}, isUpdate = false) {
  const errors = [];
  const data = {};

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || payload.name.trim().length < 2) {
      errors.push("name é obrigatório e deve ter mínimo 2 caracteres");
    } else if (payload.name.trim().length > 80) {
      errors.push("name não pode ultrapassar 80 caracteres");
    } else {
      data.name = payload.name.trim();
    }
  }

  if (!isUpdate) {
    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      errors.push("email inválido ou ausente");
    } else {
      data.email = payload.email.toLowerCase().trim();
    }
  }

  if (!isUpdate || payload.password !== undefined) {
    if (!isStrongPassword(payload.password)) {
      errors.push(
        "password deve ter mínimo 8 caracteres, 1 letra maiúscula e 1 número",
      );
    } else {
      data.password = payload.password;
    }
  }

  if (payload.phoneNumber !== undefined) {
    if (!isValidBRPhone(payload.phoneNumber)) {
      errors.push("phoneNumber inválido. Formato esperado: (XX) XXXXX-XXXX");
    } else {
      data.phoneNumber = payload.phoneNumber;
    }
  }

  return { valid: errors.length === 0, errors, data };
}

module.exports = { validateUserPayload, isStrongPassword, isValidBRPhone };
