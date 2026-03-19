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

export async function getQuestions(req, res) {
  try {
    const questions = await Question.find();
    return res.json(questions);
  } catch (error) {
    return res.json({ error: error.message });
  }
}

export const getQuestionsByCategory = async (req, res) => {
  const { categoryId } = req.query;

  const questions = await Question.find({ categoryId });

  res.json(questions);
};

export async function deleteQuestion(req, res) {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.json({ error: error.message });
  }
}
