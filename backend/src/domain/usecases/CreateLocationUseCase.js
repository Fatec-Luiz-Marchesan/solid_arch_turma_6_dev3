const Location = require("../entities/Location");

class CreateLocationUseCase {
  constructor({ locationRepository }) {
    if (!locationRepository)
      throw new Error("locationRepository e obrigatorio");
    this.locationRepository = locationRepository;
  }

  async execute(input) {
    const location = new Location(input);
    return this.locationRepository.create(location);
  }
}

module.exports = CreateLocationUseCase;
