const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Review = mongoose.model(
  "Review",
  new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      petId: {
        type: Schema.Types.ObjectId,
        ref: "Pet",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
      recommend: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true },
  ),
);

module.exports = Review;
