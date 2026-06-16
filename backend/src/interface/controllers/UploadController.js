class UploadController {
  constructor({ uploadFileUseCase, listByOwnerUseCase }) {
    this.uploadFileUseCase = uploadFileUseCase;
    this.listByOwnerUseCase = listByOwnerUseCase;
  }
  async upload(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      const result = await this.uploadFileUseCase.execute({
        file: req.file,
        ownerId: req.body.ownerId,
        purpose: req.body.purpose,
      });
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  async listByOwner(req, res) {
    try {
      const uploads = await this.listByOwnerUseCase.execute(req.params.ownerId);
      return res.json(uploads);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}
module.exports = UploadController;
