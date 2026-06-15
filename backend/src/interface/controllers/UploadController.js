class UploadController {
  constructor({ uploadFileUseCase }) {
    this.uploadFileUseCase = uploadFileUseCase;
  }

  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }
      const result = await this.uploadFileUseCase.execute({
        file: req.file,
        ownerId: req.body.ownerId,
        purpose: req.body.purpose || 'general',
      });
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
module.exports = UploadController;