const mongoose = require("mongoose");

const BreedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    species: { type: String, enum: ["dog", "cat", "rabbit", "bird", "other"], required: true },
    origin: { type: String, trim: true, default: null },
    lifeExpectancy: { type: Number, min: 1, max: 30, default: null },
    size: { type: String, default: null },
    averageWeight: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },
    characteristics: {
      type: [String],
      default: [],
      validate: { validator: (arr) => arr.length <= 10, message: "characteristics nao pode ter mais de 10 itens" },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

BreedSchema.index({ name: 1, species: 1 }, { unique: true });

BreedSchema.virtual("weightRange").get(function () {
  if (!this.averageWeight) return null;
  return `${this.averageWeight.min}kg - ${this.averageWeight.max}kg`;
});

module.exports = mongoose.model("Breed", BreedSchema);