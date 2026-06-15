const UploadFileUseCase = require("../../src/domain/usecases/UploadFileUseCase");

describe("UploadFileUseCase", () => {
  let storageGateway;
  let uploadRepository;
  let usecase;

  const fakeFile = {
    originalname: "foto.jpg",
    buffer: Buffer.from("x"),
    mimetype: "image/jpeg",
    size: 1024,
  };

  beforeEach(() => {
    storageGateway = {
      save: jest.fn().mockResolvedValue({
        key: "abc.jpg",
        url: "/uploads/abc.jpg",
        mimetype: "image/jpeg",
        size: 1024,
      }),
    };

    uploadRepository = {
      create: jest.fn().mockImplementation(async (data) => ({
        id: "upload-1",
        ...data,
      })),
    };

    usecase = new UploadFileUseCase({
      storageGateway,
      uploadRepository,
    });
  });

  it("salva arquivo e persiste metadados", async () => {
    const result = await usecase.execute({
      file: fakeFile,
      ownerId: "u1",
      purpose: "pet-photo",
    });

    expect(storageGateway.save).toHaveBeenCalledWith(fakeFile);

    expect(uploadRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: "u1",
        storageKey: "abc.jpg",
        purpose: "pet-photo",
      }),
    );

    expect(result.id).toBe("upload-1");
  });

  it("usa purpose general como padrao", async () => {
    await usecase.execute({
      file: fakeFile,
      ownerId: "u1",
    });

    expect(uploadRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        purpose: "general",
      }),
    );
  });

  it("rejeita sem arquivo", async () => {
    await expect(
      usecase.execute({
        ownerId: "u1",
      }),
    ).rejects.toThrow("Arquivo e obrigatorio");

    expect(storageGateway.save).not.toHaveBeenCalled();
  });

  it("rejeita sem ownerId", async () => {
    await expect(
      usecase.execute({
        file: fakeFile,
      }),
    ).rejects.toThrow("ownerId e obrigatorio");

    expect(storageGateway.save).not.toHaveBeenCalled();
  });

  it("nao chama repository se storage falhar", async () => {
    storageGateway.save.mockRejectedValue(new Error("Disco cheio"));

    await expect(
      usecase.execute({
        file: fakeFile,
        ownerId: "u1",
      }),
    ).rejects.toThrow("Disco cheio");

    expect(uploadRepository.create).not.toHaveBeenCalled();
  });

  it("lanca erro sem storageGateway", () => {
    expect(
      () =>
        new UploadFileUseCase({
          uploadRepository,
        }),
    ).toThrow("storageGateway e obrigatorio");
  });

  it("lanca erro sem uploadRepository", () => {
    expect(
      () =>
        new UploadFileUseCase({
          storageGateway,
        }),
    ).toThrow("uploadRepository e obrigatorio");
  });
});
