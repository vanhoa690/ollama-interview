# Workshop: Xây dựng Website Trắc Nghiệm với AI (Ollama)

---

## 1. Giới thiệu

- AI đang thay đổi cách học tập
- Quiz truyền thống:
  - Chỉ có điểm
  - Không có phân tích

👉 Mục tiêu: Xây dựng hệ thống quiz có AI phân tích

---

## 2. Ý tưởng hệ thống

Flow: - Làm bài quiz - Submit - AI phân tích: - Điểm mạnh - Điểm yếu -
Gợi ý học tập

---

## 3. Kiến trúc hệ thống

React (Frontend) ↓ Node.js (Backend) ↓ MongoDB (Database) ↓ Ollama (AI
local)

---

## 4. Frontend (React)

- Hiển thị câu hỏi
- Submit bài
- Hiển thị kết quả

Công nghệ: - React - Ant Design - React Query

---

## 5. Backend (Node.js)

- Xử lý logic
- Chấm điểm
- Gọi AI

API: - GET /questions - POST /submit - GET /results/:id

---

## 6. Database (MongoDB)

Lưu: - Questions - Users - Results

---

## 7. AI (Ollama)

- Chạy local
- Không tốn phí
- Không cần internet

---

## 8. Flow hoạt động

1.  User làm bài
2.  Submit
3.  Backend chấm điểm
4.  Gửi AI
5.  Trả kết quả

---

## 9. Ví dụ Prompt

Bạn là giảng viên lập trình.

Sinh viên đạt 6/10.

Hãy: - Nhận xét - Chỉ ra điểm yếu - Đưa ra lời khuyên

---

## 10. Giá trị hệ thống

- Cá nhân hóa học tập
- Phân tích thông minh
- Hỗ trợ cải thiện

---

## 11. Thách thức

- AI chậm
- Prompt chưa tốt
- Polling API

---

## 12. Hướng cải tiến

- Streaming AI
- Cache kết quả
- Cá nhân hóa sâu hơn

---

## 13. Kết luận

- AI giúp nâng cao trải nghiệm học
- Ollama giúp tiết kiệm chi phí

---

## 14. Q&A

- AI sai thì sao?
- Có nên dùng AI mọi nơi?
