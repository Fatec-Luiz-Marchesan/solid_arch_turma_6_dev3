const CreateLocationUseCase = require('../../src/domain/usecases/CreateLocationUseCase');

describe('CreateLocationUseCase', () => {
  let repo, usecase;
  const validInput = {
  name: 'Parque Ibirapuera', latitude: -23.587, longitude: -46.657,
  type: 'event', referenceId: 'event-1',
};
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
  
it('rejeita latitude abaixo de -90', async () => {
  await expect(usecase.execute({
    ...validInput,
    latitude: -95
  })).rejects.toThrow('latitude'); 
});

it('rejeita longitude acima de 180', async () => {
  await expect(usecase.execute({
    ...validInput,
    longitude: 200
  })).rejects.toThrow('longitude');
});

it('rejeita name com menos de 2 caracteres', async () => {
  await expect(usecase.execute({
    ...validInput,
    name: 'A'
  })).rejects.toThrow('min 2 caracteres'); 
});

it('rejeita quando referenceId está ausente', async () => {
  const { referenceId, ...inputSemRef } = validInput;
  await expect(usecase.execute(inputSemRef))
    .rejects.toThrow('referenceId');
});

it('lança erro se locationRepository não for fornecido', () => {
  expect(() => new CreateLocationUseCase({}))
    .toThrow('locationRepository e obrigatorio');
});
});