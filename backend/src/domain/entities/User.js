class User {
  constructor({ id, name, email, password, phoneNumber, image, createdAt }) {
    if (!name || name.trim().length < 2) {
      throw new Error("User.name e obrigatorio (min 2 caracteres)");
    }
    if (name.trim().length > 80) {
      throw new Error("User.name nao pode ultrapassar 80 caracteres");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
