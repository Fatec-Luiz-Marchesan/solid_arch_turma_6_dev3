const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["adoption", "message", "event", "system", "alert"],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, minlength: 3 },
    message: { type: String, required: true, trim: true, minlength: 5 },
    isRead: { type: Boolean, default: false, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);
