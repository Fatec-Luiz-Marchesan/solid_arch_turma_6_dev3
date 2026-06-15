const mongoose = require('mongoose');
const BreedSchema = new mongoose.Schema({
name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
species: {
type: String,
enum: ['dog', 'cat', 'rabbit', 'bird', 'other'],
required: true,
},
origin: { type: String, trim: true },
lifeExpectancy: { type: Number, min: 1, max: 30 },
}, { timestamps: true });

BreedSchema.index({ name: 1, species: 1 }, { unique: true });
module.exports = mongoose.model('Breed', BreedSchema);