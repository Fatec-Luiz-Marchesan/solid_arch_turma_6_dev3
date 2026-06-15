class LocationController {
  constructor({ createLocationUseCase, findNearbyLocationsUseCase }) {
    this.createLocationUseCase = createLocationUseCase;
    this.findNearbyLocationsUseCase = findNearbyLocationsUseCase;
  }

  async create(req, res) {
    try {
      const location = await this.createLocationUseCase.execute(req.body);
      return res.status(201).json(location);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async findNearby(req, res) {
    try {
      const { lat, lng, radius, type } = req.query;
      const result = await this.findNearbyLocationsUseCase.execute({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        radiusKm: parseFloat(radius || 5),
        type,
      });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = LocationController;