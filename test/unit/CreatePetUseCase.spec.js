const CreatePetUseCase = require('../../src/domain/usecases/CreatePetUseCase');
describe('CreatePetUseCase', () => {
let petRepository;
let usecase;
beforeEach(() => {
petRepository = {
create: jest.fn().mockImplementation(async (data) => ({
id: 'pet-123', ...data,
})),
};
usecase = new CreatePetUseCase({ petRepository });
});
it('cria pet valido', async () => {
const input = { name: 'Rex', species: 'dog', age: 3, ownerId: 'u1' };
const result = await usecase.execute(input);
expect(result.id).toBe('pet-123');
expect(result.name).toBe('Rex');
expect(petRepository.create).toHaveBeenCalledTimes(1);
expect(petRepository.create).toHaveBeenCalledWith(
expect.objectContaining({ name: 'Rex', species: 'dog' })
);
});
it('rejeita name vazio', async () => {
await expect(usecase.execute({
name: '', species: 'dog', age: 3, ownerId: 'u1',
})).rejects.toThrow('name e obrigatorio');
expect(petRepository.create).not.toHaveBeenCalled();
});
it('rejeita species invalido', async () => {
await expect(usecase.execute({
name: 'Rex', species: 'dinossauro', age: 3, ownerId: 'u1',
})).rejects.toThrow();
});
it('rejeita idade negativa', async () => {
await expect(usecase.execute({
name: 'Rex', species: 'dog', age: -1, ownerId: 'u1',
})).rejects.toThrow();
});
it('chama o repositorio uma vez', async () => {
await usecase.execute({ name: 'Rex', species: 'dog', age: 3, ownerId: 'u1' });
expect(petRepository.create).toHaveBeenCalledTimes(1);
});
});