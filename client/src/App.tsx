import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Card, List, Spin, Empty } from "antd";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    enabled: !!selectedCategory, // chỉ call khi có category
  });

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="#" className="text-xl font-semibold">
            <strong>WEB2091 App</strong>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="#" className="hover:text-gray-200">
              Trang chủ
            </Link>
            <Link to="/list" className="hover:text-gray-200">
              Danh sách
            </Link>
            <Link to="/add" className="hover:text-gray-200">
              Thêm mới
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Danh mục câu hỏi
        </h1>

        {/* CATEGORY LIST */}
        {loadingCategories ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {categories.map((cat: any) => (
              <Card
                key={cat._id}
                hoverable
                onClick={() => setSelectedCategory(cat._id)}
                className={`cursor-pointer text-center transition ${
                  selectedCategory === cat._id
                    ? "border-blue-500 shadow-lg"
                    : ""
                }`}
              >
                <h3 className="font-semibold">{cat.name}</h3>
              </Card>
            ))}
          </div>
        )}

        {/* QUESTIONS */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Danh sách câu hỏi</h2>

          {!selectedCategory ? (
            <Empty description="Chọn danh mục để xem câu hỏi" />
          ) : loadingQuestions ? (
            <div className="text-center">
              <Spin size="large" />
            </div>
          ) : questions.length === 0 ? (
            <Empty description="Không có câu hỏi" />
          ) : (
            <List
              bordered
              dataSource={questions}
              renderItem={(q: any, index) => (
                <List.Item>
                  <div>
                    <p className="font-medium">
                      {index + 1}. {q.content}
                    </p>

                    <ul className="mt-2 pl-5 list-disc text-gray-600">
                      {q.options.map((opt: any, i: number) => (
                        <li key={i}>{opt.text}</li>
                      ))}
                    </ul>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default App;
