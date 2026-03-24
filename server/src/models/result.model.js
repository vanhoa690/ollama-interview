import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOptionIndex: Number,
        isCorrect: Boolean,
      },
    ],

    score: Number,
    total: Number,
    aiAnalysis: {
      level: String,
      feedback: String,
      suggestions: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Result = mongoose.model("Result", resultSchema);

export default Result;
