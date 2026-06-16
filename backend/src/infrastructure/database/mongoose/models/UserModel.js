const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato invalido"],
      default: null,
    },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "UserCleanArch",
  UserSchema,
  "users_clean_arch",
);
