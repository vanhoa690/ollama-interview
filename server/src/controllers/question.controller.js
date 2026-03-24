import Question from "../models/question.model";
import Result from "../models/result.model";
import { analyzeQuizWithAI } from "../services/ollama.service";

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
    const { userId, answers, useAI = false } = req.body;

    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: "Invalid payload",
      });
    }

    let score = 0;

    // 🚀 Lấy toàn bộ question song song
    const questions = await Promise.all(
      answers.map((ans) => Question.findById(ans.questionId)),
    );

    const resultAnswers = [];
    const aiAnswers = [];

    for (let i = 0; i < answers.length; i++) {
      const ans = answers[i];
      const question = questions[i];

      if (!question) continue;

      const correctIndex = question.options.findIndex((o) => o.isCorrect);
      const isCorrect = correctIndex === ans.selectedIndex;

      if (isCorrect) score++;

      // 👉 Data lưu DB (gọn nhẹ)
      resultAnswers.push({
        questionId: ans.questionId,
        selectedOptionIndex: ans.selectedIndex,
        isCorrect,
      });

      // 👉 Data gửi AI (CHI TIẾT)
      aiAnswers.push({
        question: question.content, // hoặc question.title tùy schema
        options: question.options.map((o) => o.text),
        correctAnswer: question.options[correctIndex]?.text,
        userAnswer: question.options[ans.selectedIndex]?.text,
        isCorrect,
        topic: question.topic || "", // nếu có
      });
    }

    // 👉 Lưu DB trước
    const result = await Result.create({
      userId,
      answers: resultAnswers,
      score,
      total: resultAnswers.length,
      aiAnalysis: null,
    });

    // 🚀 TRẢ VỀ NGAY (không chờ AI)
    res.json({
      message: "Submit success",
      data: result,
    });

    // 🧠 CHẠY AI BACKGROUND
    if (useAI) {
      (async () => {
        try {
          const aiAnalysis = await analyzeQuizWithAI({
            score,
            total: resultAnswers.length,
            answers: aiAnswers, // 🔥 dùng data đầy đủ
          });

          if (aiAnalysis) {
            await Result.findByIdAndUpdate(result._id, {
              aiAnalysis,
            });
          }
        } catch (err) {
          console.error("AI background error:", err.message);
        }
      })();
    }
  } catch (err) {
    console.error("Submit quiz error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};
