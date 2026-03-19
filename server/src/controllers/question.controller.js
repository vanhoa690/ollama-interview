import Question from "../models/question.model";

export const createQuestion = async (req, res) => {
  try {
    const { content, options, categoryId } = req.body;

    const correctCount = options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      return res.status(400).json({
        message: "Phải có đúng 1 đáp án đúng",
      });
    }

    const question = await Question.create({
      content,
      options,
      categoryId,
    });

    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuestions = async (req, res) => {
  const { categoryId } = req.query;

  const questions = await Question.find({ categoryId });

  res.json(questions);
};
