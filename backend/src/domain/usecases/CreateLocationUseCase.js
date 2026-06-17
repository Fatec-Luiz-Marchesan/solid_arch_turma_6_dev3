const Location = require("../entities/Location");

class CreateLocationUseCase {
  constructor({ locationRepository }) {
    if (!locationRepository)
      throw new Error("locationRepository e obrigatorio");
    this.locationRepository = locationRepository;
  }

  async execute(input) {
    const location = new Location(input);
    return this.locationRepository.create({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      type: location.type,
      referenceId: location.referenceId,
      address: location.address,
      createdAt: location.createdAt,
    });
  }
}

class FindNearbyLocationsUseCase {
  constructor({ locationRepository }) {
    if (!locationRepository)
      throw new Error("locationRepository e obrigatorio");
    this.locationRepository = locationRepository;
  }

  async execute({ latitude, longitude, radiusKm = 5, type }) {
    if (latitude == null || longitude == null)
      throw new Error("latitude e longitude sao obrigatorios");
    if (radiusKm <= 0 || radiusKm > 100)
      throw new Error("radiusKm deve estar entre 0 e 100");
    return this.locationRepository.findNearby({ latitude, longitude, radiusKm, type });
  }
}

module.exports = CreateLocationUseCase;
module.exports.FindNearbyLocationsUseCase = FindNearbyLocationsUseCase;