const DeleteAdoptionUseCase = require('../../src/domain/usecases/DeleteAdoptionUseCase');
describe('DeleteAdoptionUseCase', () => {
let adoptionRepository, usecase;
beforeEach(() => {
adoptionRepository = {
findById: jest.fn().mockResolvedValue({ id: 'a1', adopterId: 'u1', status: 'active' }),
delete:
jest.fn().mockResolvedValue(true),
};
usecase = new DeleteAdoptionUseCase({ adoptionRepository });
});
it('cancela adocao ativa com sucesso', async () => {
const result = await usecase.execute({ id: 'a1', requesterId: 'u1' });
expect(result).toBe(true);
expect(adoptionRepository.delete).toHaveBeenCalledWith('a1');
});
it('retorna false se adocao nao existe', async () => {
adoptionRepository.findById.mockResolvedValue(null);
const result = await usecase.execute({ id: 'ghost', requesterId: 'u1' });
expect(result).toBe(false);
expect(adoptionRepository.delete).not.toHaveBeenCalled();
});
it('lanca erro se requester nao e o adotante', async () => {
await expect(usecase.execute({ id: 'a1', requesterId: 'outro-user' }))
.rejects.toThrow('permissao');
expect(adoptionRepository.delete).not.toHaveBeenCalled();
});
it('lanca erro ao tentar cancelar adocao ja concluida', async () => {
adoptionRepository.findById.mockResolvedValue({ id: 'a1', adopterId: 'u1', status: 'completed' });
await expect(usecase.execute({ id: 'a1', requesterId: 'u1' }))
.rejects.toThrow('concluida');
});
it('rejeita sem id', async () => {
await expect(usecase.execute({ requesterId: 'u1' })).rejects.toThrow('id e obrigatorio');
});
it('lanca erro sem adoptionRepository', () => {
expect(() => new DeleteAdoptionUseCase({})).toThrow('adoptionRepository e obrigatorio');
});
});