const CreateLocationUseCase = require('../../src/domain/usecases/CreateLocationUseCase');

describe('CreateLocationUseCase', () => {
  let repo, usecase;

  beforeEach(() => {
    repo = { create: jest.fn().mockImplementation(loc => ({ id: 'l1', ...loc })) };
    usecase = new CreateLocationUseCase({ locationRepository: repo });
  });

  it('cria uma location valida', async () => {
    const result = await usecase.execute({
      name: 'Parque Central', latitude: -23.5, longitude: -46.6,
      type: 'event', referenceId: 'e1',
    });
    expect(result.id).toBe('l1');
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('rejeita latitude invalida', async () => {
    await expect(usecase.execute({
      name: 'Parque', latitude: 200, longitude: 0, type: 'event', referenceId: 'e1',
    })).rejects.toThrow('latitude deve estar entre -90 e 90');
  });

  it('rejeita type invalido', async () => {
    await expect(usecase.execute({
      name: 'Parque', latitude: 0, longitude: 0, type: 'banco', referenceId: 'e1',
    })).rejects.toThrow('type deve ser pet, event ou user');
  });
});