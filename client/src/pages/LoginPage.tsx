import { Button, Card, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();

  // 👉 Nhận token từ backend (redirect về ?token=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <div className="flex flex-col items-center gap-4">
          <Title level={3}>Đăng nhập</Title>

          <Text type="secondary">Đăng nhập nhanh bằng Google</Text>

          <Button
            type="primary"
            icon={<GoogleOutlined />}
            size="large"
            className="w-full bg-red-500 hover:bg-red-600"
            onClick={handleGoogleLogin}
          >
            Đăng nhập với Google
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
