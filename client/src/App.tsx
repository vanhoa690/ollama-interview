import { Toaster } from "react-hot-toast";
import { Link, Route, Routes } from "react-router-dom";
import { Button, Avatar } from "antd";
import LoginPage from "./pages/LoginPage";
import { useMe } from "./hooks/useMe";
import { useLogout } from "./hooks/useLogout";
import ListPage from "./pages/ListPage";

function App() {
  const { data } = useMe();
  const logout = useLogout();

  const user = data?.user;

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
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} className="w-8 h-8 rounded-full" />
                <span>{user.name}</span>
                <Button danger onClick={logout} type="primary">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button type="primary">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/list" element={<ListPage />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
