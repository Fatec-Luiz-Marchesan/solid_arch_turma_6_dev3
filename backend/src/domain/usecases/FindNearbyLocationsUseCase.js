class FindNearbyLocationsUseCase {
  constructor({ locationRepository }) {
    if (!locationRepository)
      throw new Error("locationRepository e obrigatorio");
    this.locationRepository = locationRepository;
  }

  async execute({ latitude, longitude, radiusKm = 5, type } = {}) {
    if (typeof latitude !== "number" || typeof longitude !== "number")
      throw new Error(
        "latitude e longitude sao obrigatorios e devem ser numericos",
      );
    if (radiusKm <= 0 || radiusKm > 100)
      throw new Error("radiusKm deve estar entre 0 e 100");

    return this.locationRepository.findNearby({
      latitude,
      longitude,
      radiusKm,
      type,
    });
  }
}

module.exports = FindNearbyLocationsUseCase;
