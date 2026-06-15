const mongoose = require("mongoose");

const DietSchema = new mongoose.Schema(
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
      enum: ["standard", "hypocaloric", "hyperproteic", "therapeutic", "raw"],
      required: true,
    },
    dailyCalories: { type: Number, min: 1, default: null },
    restrictions: { type: [String], default: [] },
    mealsPerDay: { type: Number, required: true, min: 1, max: 10 },
    notes: { type: String, trim: true, default: "" },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, default: null },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "daily",
    },
    targetWeight: {
      type: Number,
      min: [0.1, "targetWeight deve ser maior que 0"],
      default: null,
    },
  },
  { timestamps: true },
);

DietSchema.index({ petId: 1, startDate: -1 });

DietSchema.pre("validate", function (next) {
  if (
    this.targetWeight != null &&
    !["hypocaloric", "therapeutic"].includes(this.type)
  ) {
    this.invalidate(
      "targetWeight",
      "targetWeight so e permitido para tipos hypocaloric ou therapeutic",
    );
  }
  next();
});

module.exports = mongoose.model("Diet", DietSchema);
