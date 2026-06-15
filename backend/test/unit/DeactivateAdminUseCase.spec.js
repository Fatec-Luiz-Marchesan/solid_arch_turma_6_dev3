const DeactivateAdminUseCase = require('../../src/domain/usecases/DeactivateAdminUseCase');

describe('DeactivateAdminUseCase', () => {
  let adminRepository, usecase;

  beforeEach(() => {
    adminRepository = {
      findById: jest.fn().mockResolvedValue({ id: 'a1', isActive: true }),
      update: jest.fn().mockImplementation(async (id, data) => ({ id, ...data })),
    };
    usecase = new DeactivateAdminUseCase({ adminRepository });
  });

  it('desativa admin ativo com sucesso', async () => {
    const result = await usecase.execute('a1');
    expect(result.isActive).toBe(false);
    expect(adminRepository.update).toHaveBeenCalledWith('a1', { isActive: false });
  });

  it('retorna null se admin não existe', async () => {
    adminRepository.findById.mockResolvedValue(null);
    const result = await usecase.execute('ghost');
    expect(result).toBeNull();
    expect(adminRepository.update).not.toHaveBeenCalled();
  });

  it('lança erro ao tentar desativar admin já inativo', async () => {
    adminRepository.findById.mockResolvedValue({ id: 'a1', isActive: false });
    await expect(usecase.execute('a1')).rejects.toThrow('já está inativo');
  });

  it('rejeita id ausente', async () => {
    await expect(usecase.execute(null)).rejects.toThrow('id é obrigatório');
  });
});