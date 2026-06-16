const bcrypt = require("bcrypt");
const IHashGateway = require("../../../domain/ports/IHashGateway");

class BcryptHashAdapter extends IHashGateway {
  constructor(saltRounds = 12) {
    super();
    this.saltRounds = saltRounds;
  }

  async hash(plain) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(plain, salt);
  }

  async compare(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

module.exports = BcryptHashAdapter;
