const UploadFileUseCase = require("../../src/domain/usecases/UploadFileUseCase");

describe("UploadFileUseCase", () => {
  let storageGateway, uploadRepository, usecase;

  const fakeFile = {
    originalname: "foto-rex.jpg",
    buffer: Buffer.from("fake-image-data"),
    mimetype: "image/jpeg",
    size: 204800,
  };

  const storedResult = {
    key: "1234567890-abc.jpg",
    url: "/uploads/1234567890-abc.jpg",
    mimetype: "image/jpeg",
    size: 204800,
  };

  beforeEach(() => {
    storageGateway = {
      save: jest.fn().mockResolvedValue(storedResult),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    uploadRepository = {
      create: jest
        .fn()
        .mockImplementation(async (data) => ({ id: "upload-1", ...data })),
      findByOwnerId: jest.fn().mockResolvedValue([]),
    };
    usecase = new UploadFileUseCase({ storageGateway, uploadRepository });
  });

  it("salva o arquivo no storage e persiste metadados", async () => {
    const result = await usecase.execute({
      file: fakeFile,
      ownerId: "owner-123",
      purpose: "pet-photo",
    });

    expect(storageGateway.save).toHaveBeenCalledWith(fakeFile);
    expect(uploadRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: "owner-123",
        purpose: "pet-photo",
        storageKey: "1234567890-abc.jpg",
        url: "/uploads/1234567890-abc.jpg",
      }),
    );
    expect(result.id).toBe("upload-1");
  });

  it('usa purpose "general" como padrão quando não informado', async () => {
    await usecase.execute({ file: fakeFile, ownerId: "u1" });

    expect(uploadRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ purpose: "general" }),
    );
  });

  it("chama storage.save exatamente uma vez", async () => {
    await usecase.execute({ file: fakeFile, ownerId: "u1" });
    expect(storageGateway.save).toHaveBeenCalledTimes(1);
  });

  it("retorna URL pública do arquivo", async () => {
    const result = await usecase.execute({ file: fakeFile, ownerId: "u1" });
    expect(result.url).toBe("/uploads/1234567890-abc.jpg");
  });

  it("rejeita quando arquivo não é fornecido", async () => {
    await expect(usecase.execute({ ownerId: "u1" })).rejects.toThrow(
      "Arquivo é obrigatório",
    );
    expect(storageGateway.save).not.toHaveBeenCalled();
    expect(uploadRepository.create).not.toHaveBeenCalled();
  });

  it("rejeita quando ownerId não é fornecido", async () => {
    await expect(usecase.execute({ file: fakeFile })).rejects.toThrow(
      "ownerId é obrigatório",
    );
    expect(storageGateway.save).not.toHaveBeenCalled();
  });

  it("não chama repository se storage falhar", async () => {
    storageGateway.save.mockRejectedValue(new Error("Disco cheio"));

    await expect(
      usecase.execute({ file: fakeFile, ownerId: "u1" }),
    ).rejects.toThrow("Disco cheio");
    expect(uploadRepository.create).not.toHaveBeenCalled();
  });

  it("lança erro sem storageGateway", () => {
    expect(() => new UploadFileUseCase({ uploadRepository })).toThrow(
      "storageGateway é obrigatório",
    );
  });

  it("lança erro sem uploadRepository", () => {
    expect(() => new UploadFileUseCase({ storageGateway })).toThrow(
      "uploadRepository é obrigatório",
    );
  });
});
