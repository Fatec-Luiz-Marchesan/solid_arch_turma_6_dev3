const DeletePetUseCase = require('../../src/domain/usecases/DeletePetUseCase');
describe('DeletePetUseCase', () => {
let petRepository;
let usecase;
beforeEach(() => {
petRepository = {
findById: jest.fn(),
delete: jest.fn(),
};
usecase = new DeletePetUseCase({ petRepository });
});
it('deleta pet existente', async () => {
petRepository.findById.mockResolvedValue({ id: 'p1', status: 'available' });
petRepository.delete.mockResolvedValue(true);
const result = await usecase.execute('p1');
expect(result).toBe(true);
expect(petRepository.delete).toHaveBeenCalledWith('p1');
});
it('retorna false se pet nao existe', async () => {
petRepository.findById.mockResolvedValue(null);
const result = await usecase.execute('inexistente');
expect(result).toBe(false);
expect(petRepository.delete).not.toHaveBeenCalled();
});
it('rejeita delete sem id', async () => {
await expect(usecase.execute(null))
.rejects.toThrow('id e obrigatorio');
});
it('nao deleta pet adotado', async () => {
petRepository.findById.mockResolvedValue({ id: 'p1', status: 'adopted' });
await expect(usecase.execute('p1'))
.rejects.toThrow('pet ja foi adotado');
expect(petRepository.delete).not.toHaveBeenCalled();
});
});