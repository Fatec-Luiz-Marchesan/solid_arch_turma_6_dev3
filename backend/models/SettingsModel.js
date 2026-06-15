const mongoose = require("mongoose");
const SettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    language: {
      type: String,
      enum: ["pt-BR", "en-US", "es-ES"],
      default: "pt-BR",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    notifications: { type: Boolean, default: true },
    timezone: { type: String, required: true, default: "America/Sao_Paulo" },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Settings", SettingsSchema);
