import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },

    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
