const UploadFileUseCase = require('../../src/domain/usecases/UploadFileUseCase');

describe('UploadFileUseCase', () => {
  let storage, repo, usecase;
  beforeEach(() => {
    storage = {
      save: jest.fn().mockResolvedValue({
        key: 'abc.jpg',
        url: '/uploads/abc.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      }),
    };
    repo = {
      create: jest.fn().mockImplementation(async (data) => ({ id: 'u1', ...data })),
    };
    usecase = new UploadFileUseCase({ storageGateway: storage, uploadRepository: repo });
  });

  it('salva o arquivo e persiste metadados', async () => {
    const fakeFile = {
      originalname: 'foto.jpg',
      buffer: Buffer.from('x'),
      mimetype: 'image/jpeg',
      size: 1024,
    };
    const result = await usecase.execute({
      file: fakeFile,
      ownerId: 'u1',
      purpose: 'pet-photo',
    });
    expect(storage.save).toHaveBeenCalledWith(fakeFile);
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      ownerId: 'u1',
      purpose: 'pet-photo',
      storageKey: 'abc.jpg',
    }));
    expect(result.id).toBe('u1');
  });

  it('lança erro sem arquivo', async () => {
    await expect(usecase.execute({ ownerId: 'u1' }))
      .rejects.toThrow('Arquivo é obrigatório');
  });
});