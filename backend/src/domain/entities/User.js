function isValidEmailSafe(email) {
  if (typeof email !== "string") return false;
  if (email.length < 5 || email.length > 254) return false;
  const atIndex = email.indexOf("@");
  if (atIndex < 1 || atIndex !== email.lastIndexOf("@")) return false;
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (local.length === 0 || local.length > 64) return false;
  if (domain.length === 0 || domain.length > 253) return false;
  const dotIndex = domain.lastIndexOf(".");
  if (dotIndex < 1 || dotIndex === domain.length - 1) return false;
  for (let i = 0; i < email.length; i++) {
    const c = email.charCodeAt(i);
    if (c === 32 || c === 9 || c === 10 || c === 13) return false;
  }
  return true;
}
class User {
  constructor({ id, name, email, password, phoneNumber, image, createdAt }) {
    if (!name || name.trim().length < 2) {
      throw new Error("User.name e obrigatorio (min 2 caracteres)");
    }
    if (name.trim().length > 80) {
      throw new Error("User.name nao pode ultrapassar 80 caracteres");
    }
    if (!email || !isValidEmailSafe(email)) {
      throw new Error("User.email invalido");
    }
    if (!password || password.length < 6) {
      throw new Error("User.password e obrigatorio (min 6 caracteres)");
    }
    if (phoneNumber && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(phoneNumber)) {
      throw new Error("User.phoneNumber invalido. Formato: (XX) XXXXX-XXXX");
    }
    this.id = id;
    this.name = name.trim();
    this.email = email.toLowerCase().trim();
    this.password = password;
    this.phoneNumber = phoneNumber || null;
    this.image = image || null;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = User;
