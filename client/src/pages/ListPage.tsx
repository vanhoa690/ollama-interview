import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Card, List, Spin, Empty, Radio, Button, message } from "antd";

const ListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  // 👉 Fetch categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/categories");
      return res.data;
    },
  });

  // 👉 Fetch questions theo category
  const { data: questions = [], isLoading: loadingQuestions } = useQuery({
    queryKey: ["questions", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const res = await axios.get(
        `http://localhost:3000/api/questions/category/${selectedCategory}`,
      );
      return res.data;
    },
    enabled: !!selectedCategory,
  });

  // 👉 chọn đáp án
  const handleSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // 👉 tính điểm FE (optional)
  const calculateScore = () => {
    let score = 0;

    questions.forEach((q: any) => {
      const correctIndex = q.options.findIndex((o: any) => o.isCorrect);
      if (answers[q._id] === correctIndex) score++;
    });

    return score;
  };

  // 👉 submit
  const handleSubmit = async () => {
    if (questions.length === 0) return;

    if (Object.keys(answers).length !== questions.length) {
      return message.warning("Bạn chưa chọn hết câu hỏi!");
    }

    try {
      setSubmitting(true);

      const payload = questions.map((q: any) => ({
        questionId: q._id,
        selectedIndex: answers[q._id],
      }));

      await axios.post("http://localhost:3000/api/submit", {
        answers: payload,
      });

      const score = calculateScore();

      message.success(`Nộp bài thành công! Điểm: ${score}/${questions.length}`);
    } catch (error) {
      message.error("Lỗi khi submit!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Làm bài trắc nghiệm
      </h1>

      {/* CATEGORY */}
      {loadingCategories ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((cat: any) => (
            <Card
              key={cat._id}
              hoverable
              onClick={() => {
                setSelectedCategory(cat._id);
                setAnswers({}); // reset khi đổi category
              }}
              className={`cursor-pointer text-center transition ${
                selectedCategory === cat._id ? "border-blue-500 shadow-lg" : ""
              }`}
            >
              <h3 className="font-semibold">{cat.name}</h3>
            </Card>
          ))}
        </div>
      )}

      {/* QUESTIONS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Danh sách câu hỏi</h2>

        {!selectedCategory ? (
          <Empty description="Chọn danh mục để làm bài" />
        ) : loadingQuestions ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : questions.length === 0 ? (
          <Empty description="Không có câu hỏi" />
        ) : (
          <>
            <List
              bordered
              dataSource={questions}
              renderItem={(q: any, index) => (
                <List.Item>
                  <div className="w-full">
                    <p className="font-medium">
                      {index + 1}. {q.content}
                    </p>

                    <Radio.Group
                      className="mt-3 flex flex-col gap-2"
                      onChange={(e) => handleSelect(q._id, e.target.value)}
                      value={answers[q._id]}
                    >
                      {q.options.map((opt: any, i: number) => (
                        <Radio
                          key={i}
                          value={i}
                          className="p-2 border rounded hover:bg-gray-50 transition"
                        >
                          {opt.text}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </div>
                </List.Item>
              )}
            />

            {/* SUBMIT */}
            <div className="mt-6 text-center">
              <Button
                type="primary"
                size="large"
                loading={submitting}
                onClick={handleSubmit}
              >
                Nộp bài
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListPage;
