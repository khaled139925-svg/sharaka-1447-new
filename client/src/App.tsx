import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import AdminPanel from "./pages/AdminPanel";
import { ChatProvider } from "./contexts/ChatContext"; // استيراد مزود الدردشة

function App() {
  return (
    <BrowserRouter>
      <ChatProvider> {/* تغليف التطبيق بالكامل */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/public-profile" element={<PublicProfile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;