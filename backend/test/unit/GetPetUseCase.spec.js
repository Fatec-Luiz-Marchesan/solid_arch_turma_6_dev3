const GetPetUseCase = require('../../src/domain/usecases/GetPetUseCase');
describe('GetPetUseCase', () => {
let petRepository;
let usecase;
beforeEach(() => {
petRepository = {
findById: jest.fn(),
findByOwnerId: jest.fn(),
};
usecase = new GetPetUseCase({ petRepository });
});
it('retorna pet quando id existe', async () => {
const fakePet = { id: 'p1', name: 'Rex', species: 'dog' };
petRepository.findById.mockResolvedValue(fakePet);
const result = await usecase.findById('p1');
expect(result).toEqual(fakePet);
expect(petRepository.findById).toHaveBeenCalledWith('p1');
});
it('retorna null quando id inexistente', async () => {
petRepository.findById.mockResolvedValue(null);
const result = await usecase.findById('inexistente');
expect(result).toBeNull();
});
it('lista pets de um owner', async () => {
const pets = [{ id: 'p1' }, { id: 'p2' }];
petRepository.findByOwnerId.mockResolvedValue(pets);
const result = await usecase.findByOwner('owner-1');
expect(result).toEqual(pets);
expect(petRepository.findByOwnerId).toHaveBeenCalledWith('owner-1');
});
it('retorna array vazio se owner sem pets', async () => {
petRepository.findByOwnerId.mockResolvedValue([]);
const result = await usecase.findByOwner('owner-vazio');
expect(result).toEqual([]);
});
it('rejeita id invalido', async () => {
await expect(usecase.findById(null)).rejects.toThrow('id e obrigatorio');
await expect(usecase.findById('')).rejects.toThrow('id e obrigatorio');
});
});