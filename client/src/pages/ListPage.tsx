import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Card, List, Spin, Empty, Radio, Button, message, Tag } from "antd";

const ListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // 👉 categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/categories");
      return res.data;
    },
  });

  // 👉 questions
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
    if (result) return; // ❌ đã submit thì không cho chọn lại
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // 👉 submit
  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      return message.warning("Bạn chưa chọn hết câu hỏi!");
    }

    try {
      setSubmitting(true);

      const payload = questions.map((q: any) => ({
        questionId: q._id,
        selectedIndex: answers[q._id],
      }));

      const res = await axios.post(
        "http://localhost:3000/api/questions/submit",
        {
          userId: "69bc0894f6acf95c5e255a1e",
          answers: payload,
        },
      );

      setResult(res.data);

      message.success("Nộp bài thành công!");
    } catch (error) {
      message.error("Lỗi khi submit!");
    } finally {
      setSubmitting(false);
    }
  };

  // 👉 check đúng sai
  const checkCorrect = (questionId: string) => {
    if (!result) return null;
    const found = result.answers.find((a: any) => a.questionId === questionId);
    return found?.isCorrect;
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
                setAnswers({});
                setResult(null);
              }}
              className={`cursor-pointer text-center ${
                selectedCategory === cat._id ? "border-blue-500 shadow-lg" : ""
              }`}
            >
              <h3>{cat.name}</h3>
            </Card>
          ))}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mb-6 text-center">
          <Tag color="blue" className="text-lg px-4 py-2">
            Điểm: {result.score} / {result.total}
          </Tag>
        </div>
      )}

      {/* QUESTIONS */}
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
            renderItem={(q: any, index) => {
              const isCorrect = checkCorrect(q._id);

              return (
                <List.Item>
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">
                        {index + 1}. {q.content}
                      </p>

                      {result && (
                        <Tag color={isCorrect ? "green" : "red"}>
                          {isCorrect ? "Đúng" : "Sai"}
                        </Tag>
                      )}
                    </div>

                    <Radio.Group
                      className="mt-3 flex flex-col gap-2"
                      onChange={(e) => handleSelect(q._id, e.target.value)}
                      value={answers[q._id]}
                    >
                      {q.options.map((opt: any, i: number) => {
                        const selected = answers[q._id] === i;

                        let className = "p-2 border rounded transition";

                        if (result && selected) {
                          className += isCorrect
                            ? " bg-green-100 border-green-500"
                            : " bg-red-100 border-red-500";
                        }

                        return (
                          <Radio
                            key={i}
                            value={i}
                            disabled={!!result}
                            className={className}
                          >
                            {opt.text}
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                  </div>
                </List.Item>
              );
            }}
          />

          {/* SUBMIT */}
          {!result && (
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
          )}
        </>
      )}
    </div>
  );
};

export default ListPage;
