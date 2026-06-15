const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const IStorageGateway = require("../../../domain/ports/IStorageGateway");

class LocalStorageAdapter extends IStorageGateway {
  constructor({ uploadDir = "./uploads" } = {}) {
    super();
    this.uploadDir = uploadDir;
  }

  async save(file) {
    await fs.mkdir(this.uploadDir, { recursive: true });

    const ext = path.extname(file.originalname);

    const key = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

    const filePath = path.join(this.uploadDir, key);

    await fs.writeFile(filePath, file.buffer);

    return {
      key,
      path: filePath,
      url: `/uploads/${key}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async remove(key) {
    const filePath = path.join(this.uploadDir, key);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  }
}

module.exports = LocalStorageAdapter;
