class Location {
  constructor({ id, name, latitude, longitude, type, referenceId, createdAt }) {
    if (!name || name.trim().length < 2) throw new Error('Location.name e obrigatorio (min 2 caracteres)');
    if (latitude == null || latitude < -90 || latitude > 90) throw new Error('Location.latitude deve estar entre -90 e 90');
    if (longitude == null || longitude < -180 || longitude > 180) throw new Error('Location.longitude deve estar entre -180 e 180');
    if (!['pet', 'event', 'user'].includes(type)) throw new Error('Location.type deve ser pet, event ou user');
    if (!referenceId) throw new Error('Location.referenceId e obrigatorio');
    this.id = id; this.name = name.trim(); this.latitude = latitude;
    this.longitude = longitude; this.type = type; this.referenceId = referenceId;
    this.createdAt = createdAt || new Date();
  }
  distanceTo(otherLat, otherLng) {
    const R = 6371, dLat = (otherLat - this.latitude) * Math.PI / 180, dLng = (otherLng - this.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(this.latitude*Math.PI/180)*Math.cos(otherLat*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
module.exports = Location;
