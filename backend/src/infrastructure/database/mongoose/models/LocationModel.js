const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    type: {
      type: String,
      enum: ["pet", "event", "user", "clinic", "shelter"],
      required: true,
      index: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    address: { type: String, trim: true, default: null },
  },
  { timestamps: true },
);

LocationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Location", LocationSchema);
