const { FindNearbyLocationsUseCase } = require('../../src/domain/usecases/CreateLocationUseCase');
describe('FindNearbyLocationsUseCase', () => {
let locationRepository, usecase;
beforeEach(() => {
locationRepository = {
findNearby: jest.fn().mockResolvedValue([
{ id: 'l1', name: 'Parque', latitude: -23.5, longitude: -46.6 },
]),
};
usecase = new FindNearbyLocationsUseCase({ locationRepository });
});
it('busca locations proximas com raio padrao de 5km', async () => {
const result = await usecase.execute({ latitude: -23.5, longitude: -46.6 });
expect(locationRepository.findNearby).toHaveBeenCalledWith(
expect.objectContaining({ latitude: -23.5, longitude: -46.6, radiusKm: 5 })
);
expect(result).toHaveLength(1);
});
it('aceita radiusKm customizado', async () => {
await usecase.execute({ latitude: -23.5, longitude: -46.6, radiusKm: 25 });
expect(locationRepository.findNearby).toHaveBeenCalledWith(
expect.objectContaining({ radiusKm: 25 })
);
});
it('filtra por type quando passado', async () => {
await usecase.execute({ latitude: 0, longitude: 0, type: 'clinic' });
expect(locationRepository.findNearby).toHaveBeenCalledWith(
expect.objectContaining({ type: 'clinic' })
);
});
it('rejeita coordenadas ausentes', async () => {
await expect(usecase.execute({ latitude: -23.5 }))
.rejects.toThrow('latitude e longitude');
});
it('rejeita radiusKm zero', async () => {
await expect(usecase.execute({ latitude: 0, longitude: 0, radiusKm: 0 }))
.rejects.toThrow('radiusKm deve estar entre 0 e 100');
});
it('rejeita radiusKm acima de 100', async () => {
await expect(usecase.execute({ latitude: 0, longitude: 0, radiusKm: 200 }))
.rejects.toThrow('entre 0 e 100');
});
});