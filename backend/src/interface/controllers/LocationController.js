const {
  validateLocationPayload,
  validateNearbyQuery,
} = require("../helpers/validateLocation");

class LocationController {
  constructor({ createLocationUseCase, findNearbyLocationsUseCase }) {
    this.createLocationUseCase = createLocationUseCase;
    this.findNearbyLocationsUseCase = findNearbyLocationsUseCase;
  }

  async create(req, res) {
    const { valid, errors, data } = validateLocationPayload(req.body);
    if (!valid) return res.status(400).json({ errors });

    try {
      const location = await this.createLocationUseCase.execute(data);
      return res.status(201).json(location);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async findNearby(req, res) {
    const { valid, errors, data } = validateNearbyQuery(req.query);
    if (!valid) return res.status(400).json({ errors });

    try {
      const result = await this.findNearbyLocationsUseCase.execute(data);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = LocationController;
