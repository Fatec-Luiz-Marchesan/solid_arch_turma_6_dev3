class Upload {
  constructor({
    ownerId,
    purpose,
    originalName,
    storageKey,
    url,
    mimetype,
    size,
  }) {
    this.ownerId = ownerId;
    this.purpose = purpose;
    this.originalName = originalName;
    this.storageKey = storageKey;
    this.url = url;
    this.mimetype = mimetype;
    this.size = size;
  }
}

module.exports = Upload;
