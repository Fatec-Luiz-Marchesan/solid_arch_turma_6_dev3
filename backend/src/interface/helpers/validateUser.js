function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.length < 5 || email.length > 254) return false;
  const atIndex = email.indexOf('@');
  if (atIndex < 1 || atIndex !== email.lastIndexOf('@')) return false;
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (local.length === 0 || local.length > 64) return false;
  if (domain.length === 0 || domain.length > 253) return false;
  const dotIndex = domain.lastIndexOf('.');
  if (dotIndex < 1 || dotIndex === domain.length - 1) return false;
  for (let i = 0; i < email.length; i++) {
    const c = email.charCodeAt(i);
    if (c === 32 || c === 9 || c === 10 || c === 13) return false;
  }
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
