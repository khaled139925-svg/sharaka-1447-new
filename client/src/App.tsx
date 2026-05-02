import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import AdminPanel from "./pages/AdminPanel";
import AdminSettings from "./pages/AdminSettings";
import MyInvoice from "./pages/MyInvoice";
import MyInvoices from "./pages/MyInvoices";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/public-profile" element={<PublicProfile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/my-invoice" element={<MyInvoice />} />
          <Route path="/my-invoices" element={<MyInvoices />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;