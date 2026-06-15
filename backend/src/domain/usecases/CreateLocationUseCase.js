const Location = require('../entities/Location');

class CreateLocationUseCase {
  constructor({ locationRepository }) {
    if (!locationRepository) throw new Error('locationRepository e obrigatorio');
    this.locationRepository = locationRepository;
  }

  async execute(input) {
    const location = new Location({
      name: input.name,
      latitude: input.latitude,
      longitude: input.longitude,
      type: input.type,
      referenceId: input.referenceId,
    });

    const saved = await this.locationRepository.create(location);
    return saved;
  }
}

module.exports = CreateLocationUseCase;