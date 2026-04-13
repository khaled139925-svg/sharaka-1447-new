import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import UserDashboard from "./pages/UserDashboard";
import Specialties from "./pages/Specialties";
import ResetPassword from "./pages/ResetPassword";
import Browse from "./pages/Browse";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Services />} />
      <Route path="/browse" element={<Browse />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* 🔥 المسار الصحيح للبروفايل */}
      <Route path="/profile/:name" element={<Profile />} />

      <Route path="/messages" element={<Messages />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/specialties" element={<Specialties />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* أي مسار غلط يرجع للرئيسية */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}