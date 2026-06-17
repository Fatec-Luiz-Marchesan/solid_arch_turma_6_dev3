class Location {
  static VALID_TYPES = ["pet", "event", "user", "clinic", "shelter"];

  constructor({
    id,
    name,
    latitude,
    longitude,
    type,
    referenceId,
    address,
    createdAt,
  }) {
    if (!name || name.trim().length < 2)
      throw new Error("Location.name e obrigatorio (min 2 caracteres)");
    if (typeof latitude !== "number" || latitude < -90 || latitude > 90)
      throw new Error("Location.latitude deve estar entre -90 e 90");
    if (typeof longitude !== "number" || longitude < -180 || longitude > 180)
      throw new Error("Location.longitude deve estar entre -180 e 180");
    if (!Location.VALID_TYPES.includes(type))
      throw new Error(
        `Location.type invalido. Aceitos: ${Location.VALID_TYPES.join(", ")}`,
      );
    if (!referenceId) throw new Error("Location.referenceId e obrigatorio");

    this.id = id;
    this.name = name.trim();
    this.latitude = latitude;
    this.longitude = longitude;
    this.type = type;
    this.referenceId = referenceId;
    this.address = address ? address.trim() : null;
    this.createdAt = createdAt || new Date();
  }
  distanceTo(otherLat, otherLng) {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(otherLat - this.latitude);
    const dLng = toRad(otherLng - this.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(this.latitude)) *
        Math.cos(toRad(otherLat)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}

module.exports = Location;
