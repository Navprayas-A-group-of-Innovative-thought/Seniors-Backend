const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    postedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const collegeSchema = new mongoose.Schema(
  {
    collegeID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
      unique: true,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
