const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  type: {
    type: String,
    enum: ['pet', 'event', 'user'],
    required: true,
    index: true,
  },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
}, { timestamps: true });

LocationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', LocationSchema);