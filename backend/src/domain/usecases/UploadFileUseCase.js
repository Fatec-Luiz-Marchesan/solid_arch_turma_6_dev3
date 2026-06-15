class UploadFileUseCase {
  constructor({ storageGateway, uploadRepository }) {
    if (!storageGateway) {
      throw new Error("storageGateway e obrigatorio");
    }

    if (!uploadRepository) {
      throw new Error("uploadRepository e obrigatorio");
    }

    this.storageGateway = storageGateway;
    this.uploadRepository = uploadRepository;
  }

  async execute({ file, ownerId, purpose = "general" }) {
    if (!file) {
      throw new Error("Arquivo e obrigatorio");
    }

    if (!ownerId) {
      throw new Error("ownerId e obrigatorio");
    }

    const stored = await this.storageGateway.save(file);

    return this.uploadRepository.create({
      ownerId,
      purpose,
      originalName: file.originalname,
      storageKey: stored.key,
      url: stored.url,
      mimetype: stored.mimetype,
      size: stored.size,
    });
  }
}

module.exports = UploadFileUseCase;
