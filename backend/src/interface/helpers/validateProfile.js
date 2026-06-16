const VALID_CONTACT_METHODS = ["email", "phone", "whatsapp"];

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidBRPhone(phone) {
  return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone);
}

function validateProfilePayload(payload = {}, isUpdate = false) {
  const errors = [];
  const data = {};

  if (!isUpdate) {
    if (!payload.userId) errors.push("userId e obrigatorio");
    else data.userId = payload.userId;
  }

  if (payload.bio !== undefined) {
    if (typeof payload.bio !== "string") {
      errors.push("bio deve ser uma string");
    } else if (payload.bio.length > 500) {
      errors.push("bio nao pode ultrapassar 500 caracteres");
    } else {
      data.bio = payload.bio.trim();
    }
  }

  if (payload.avatar !== undefined) {
    if (payload.avatar && !isValidUrl(payload.avatar)) {
      errors.push("avatar deve ser uma URL valida");
    } else {
      data.avatar = payload.avatar;
    }
  }

  if (payload.phone !== undefined) {
    if (!isValidBRPhone(payload.phone)) {
      errors.push("phone invalido. Formato: (XX) XXXXX-XXXX");
    } else {
      data.phone = payload.phone;
    }
  }

  if (payload.city !== undefined)
    data.city = payload.city ? payload.city.trim() : null;
  if (payload.state !== undefined)
    data.state = payload.state ? payload.state.trim() : null;

  if (payload.socialLinks !== undefined) {
    if (
      typeof payload.socialLinks !== "object" ||
      Array.isArray(payload.socialLinks)
    ) {
      errors.push("socialLinks deve ser um objeto");
    } else {
      const sl = {};
      const allowed = ["instagram", "facebook", "linkedin"];
      for (const key of Object.keys(payload.socialLinks)) {
        if (!allowed.includes(key)) {
          errors.push(
            `socialLinks.${key} nao e permitido. Aceitos: ${allowed.join(", ")}`,
          );
          continue;
        }
        const url = payload.socialLinks[key];
        if (url && !isValidUrl(url)) {
          errors.push(`socialLinks.${key} deve ser uma URL valida`);
        } else if (url) {
          sl[key] = url;
        }
      }
      data.socialLinks = sl;
    }
  }

  if (payload.preferredContactMethod !== undefined) {
    if (!VALID_CONTACT_METHODS.includes(payload.preferredContactMethod)) {
      errors.push(
        `preferredContactMethod invalido. Aceitos: ${VALID_CONTACT_METHODS.join(", ")}`,
      );
    } else {
      data.preferredContactMethod = payload.preferredContactMethod;
      if (["phone", "whatsapp"].includes(payload.preferredContactMethod)) {
        if (!data.phone && !payload.phone) {
          errors.push(
            "phone e obrigatorio quando preferredContactMethod e phone ou whatsapp",
          );
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, data };
}

module.exports = { validateProfilePayload, isValidUrl, isValidBRPhone };
