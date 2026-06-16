const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    bio: { type: String, trim: true, maxlength: 500, default: "" },
    avatar: { type: String, default: null },
    phone: {
      type: String,
      match: [/^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato invalido"],
      default: null,
    },
    city: { type: String, trim: true, default: null },
    state: { type: String, trim: true, default: null },
    socialLinks: {
      instagram: { type: String, default: null },
      facebook: { type: String, default: null },
      linkedin: { type: String, default: null },
    },
    preferredContactMethod: {
      type: String,
      enum: ["email", "phone", "whatsapp"],
      default: "email",
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Profile", ProfileSchema);
