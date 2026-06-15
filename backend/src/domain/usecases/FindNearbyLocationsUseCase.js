class FindNearbyLocationsUseCase {
  constructor({ locationRepository }) {
    this.locationRepository = locationRepository;
  }

  async execute({ latitude, longitude, radiusKm = 5, type }) {
    if (latitude == null || longitude == null) {
      throw new Error('latitude e longitude sao obrigatorios');
    }
    if (radiusKm <= 0 || radiusKm > 100) {
      throw new Error('radiusKm deve estar entre 0 e 100');
    }

    const locations = await this.locationRepository.findNearby({
      latitude, longitude, radiusKm, type,
    });

    return locations;
  }
}

module.exports = FindNearbyLocationsUseCase;