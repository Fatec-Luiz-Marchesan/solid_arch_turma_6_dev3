const mongoose = require("mongoose");

const VaccineSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    vetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "rabies",
        "distemper",
        "parvovirus",
        "leptospirosis",
        "hepatitis",
        "feline-leukemia",
        "other",
      ],
      required: true,
    },
    name: { type: String, required: true, trim: true, minlength: 2 },
    appliedAt: { type: Date, required: true, default: Date.now },
    nextDoseAt: { type: Date, default: null },
    batchNumber: { type: String, required: true, trim: true },
    manufacturer: { type: String, trim: true, default: null },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

VaccineSchema.index({ petId: 1, appliedAt: -1 });
VaccineSchema.index({ nextDoseAt: 1 });

module.exports = mongoose.model("Vaccine", VaccineSchema);
