class UploadFileUseCase {
  constructor({ storageGateway, uploadRepository }) {
    if (!storageGateway) throw new Error('storageGateway é obrigatório');
    if (!uploadRepository) throw new Error('uploadRepository é obrigatório');
    this.storageGateway = storageGateway;
    this.uploadRepository = uploadRepository;
  }

  async execute({ file, ownerId, purpose }) {
    if (!file) throw new Error('Arquivo é obrigatório');
    if (!ownerId) throw new Error('ownerId é obrigatório');

    const stored = await this.storageGateway.save(file);

    const upload = await this.uploadRepository.create({
      ownerId,
      purpose: purpose || 'general',
      originalName: file.originalname,
      storageKey: stored.key,
      url: stored.url,
      mimetype: stored.mimetype,
      size: stored.size,
    });

    return upload;
  }
}

module.exports = UploadFileUseCase;