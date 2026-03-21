import Question from "../models/question.model";
import Result from "../models/result.model";

export const createManyQuestions = async (req, res) => {
  try {
    const { questions, categoryId } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({
        message: "questions phải là array",
      });
    }

    const formattedQuestions = [];

    for (const q of questions) {
      const correctCount = q.options.filter((o) => o.isCorrect).length;

      if (correctCount !== 1) {
        return res.status(400).json({
          message: `Câu "${q.content}" phải có đúng 1 đáp án đúng`,
        });
      }

      formattedQuestions.push({
        content: q.content,
        options: q.options,
        categoryId,
      });
    }

    const result = await Question.insertMany(formattedQuestions);

    res.json({
      message: "Tạo nhiều câu hỏi thành công",
      count: result.length,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
  try {
    const { categoryId } = req.params;

    const questions = await Question.find({ categoryId });

    res.json(questions);
  } catch (error) {
    return res.json({ error: error.message });
  }
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

export const submitQuiz = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    let score = 0;
    const resultAnswers = [];

    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);

      const correctIndex = question.options.findIndex((o) => o.isCorrect);

      const isCorrect = correctIndex === ans.selectedIndex;

      if (isCorrect) score++;

      resultAnswers.push({
        questionId: ans.questionId,
        selectedOptionIndex: ans.selectedIndex,
        isCorrect,
      });
    }

    const result = await Result.create({
      userId,
      answers: resultAnswers,
      score,
      total: answers.length,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
