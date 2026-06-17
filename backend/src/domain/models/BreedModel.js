const mongoose = require("mongoose");

const BreedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    species: { type: String, enum: ["dog", "cat", "rabbit", "bird", "other"], required: true },
    origin: { type: String, trim: true, default: null },
    lifeExpectancy: { type: Number, min: 1, max: 30, default: null },
    size: { type: String, enum: ["small", "medium", "large", "giant"], default: null },
    averageWeight: {
      min: { type: Number, min: 0.1, default: null },
      max: { type: Number, min: 0.1, default: null },
    },
    characteristics: {
      type: [String],
      default: [],
      validate: { validator: (arr) => arr.length <= 10, message: "characteristics nao pode ter mais de 10 itens" },
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

BreedSchema.index({ name: 1, species: 1 }, { unique: true });
BreedSchema.index({ species: 1, size: 1 });

BreedSchema.virtual("weightRange").get(function () {
  if (!this.averageWeight) return null;
  return `${this.averageWeight.min}kg - ${this.averageWeight.max}kg`;
});

module.exports = mongoose.model("Breed", BreedSchema);