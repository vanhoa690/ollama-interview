import axios from "axios";

export const analyzeQuizWithAI = async ({ score, total, answers }) => {
  try {
    const prompt = `
Bạn là một giảng viên lập trình giàu kinh nghiệm.

Một sinh viên vừa hoàn thành bài quiz.

Điểm số: ${score}/${total}

Danh sách câu trả lời:
${JSON.stringify(answers, null, 2)}

Yêu cầu:

1. Đánh giá trình độ (Beginner / Intermediate / Advanced)
2. Nhận xét ngắn gọn, dễ hiểu
3. Phân tích điểm yếu (nếu có)
4. Đưa ra gợi ý học tập cụ thể

QUAN TRỌNG:
- Trả về bằng TIẾNG VIỆT
- Chỉ trả về JSON hợp lệ, KHÔNG giải thích thêm

Format JSON:
{
  "level": "Beginner | Intermediate | Advanced",
  "feedback": "Nhận xét",
  "weakness": "Điểm yếu",
  "suggestions": "Gợi ý cải thiện"
}
`;

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt,
      stream: false,
    });

    // Ollama trả về text -> cần parse JSON
    const text = response.data.response;

    try {
      return JSON.parse(text);
    } catch {
      return {
        level: "Unknown",
        feedback: text,
        suggestions: "",
      };
    }
  } catch (err) {
    console.error("Ollama error:", err.message);
    return null;
  }
};
