const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const answerSchema = new mongoose.Schema({
  answer: {
    type: {},
    max: 2000000,
  },
  answeredBy: {
    type: String,
    required: true,
  },
});

const forumSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
      required: true,
    },
    answers: [answerSchema],
    college: [{ type: ObjectId, ref: "College"}],
    tags: [{ type: ObjectId, ref: "Tags"}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Forum", forumSchema);
