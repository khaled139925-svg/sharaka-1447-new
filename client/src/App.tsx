import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import BrowseConsultants from "./pages/BrowseConsultants";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClientSignup from "./pages/ClientSignup";
import ConsultantSignup from "./pages/ConsultantSignup";
import Specialties from "./pages/Specialties";
import ConsultantDetails from "./pages/ConsultantDetails";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import ResetPassword from "./pages/ResetPassword";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAds from "./pages/AdminAds";
import AdminMeetings from "./pages/AdminMeetings";
import AdminMessages from "./pages/AdminMessages";
import AdminStats from "./pages/AdminStats";

import BookSession from "./pages/BookSession";
import AddAd from "./pages/AddAd";
import Ads from "./pages/Ads";
import AdDetails from "./pages/AdDetails";

function NavigationHandler() {
  const navigate = useNavigate();

  (window as any).onNavigate = (page: string) => {
    if (page === "home") navigate("/");
    else if (page === "browse") navigate("/browse");
    else if (page === "about") navigate("/about");
    else if (page === "login") navigate("/login");
    else if (page === "dashboard") navigate("/dashboard");
    else if (page === "client-signup") navigate("/client-signup");
    else if (page === "consultant-signup") navigate("/consultant-signup");
    else if (page === "specialties") navigate("/specialties");
    else if (page === "admin") navigate("/admin");
    else if (page === "admin-dashboard") navigate("/admin-dashboard");
    else if (page === "admin-users") navigate("/admin-users");
    else if (page === "admin-ads") navigate("/admin-ads");
    else if (page === "admin-meetings") navigate("/admin-meetings");
    else if (page === "admin-messages") navigate("/admin-messages");
    else if (page === "admin-stats") navigate("/admin-stats");
  };

  return null;
}

function AdminShortcut() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && e.code === "KeyA") {
        e.preventDefault();
        navigate("/admin");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  return null;
}

export default function App() {
  const onNavigate = (page: string) => {
    (window as any).onNavigate(page);
  };

  return (
    <BrowserRouter>
      <NavigationHandler />
      <AdminShortcut />
      <Routes>
        <Route path="/" element={<Home onNavigate={onNavigate} />} />
        <Route path="/about" element={<About onNavigate={onNavigate} />} />
        <Route path="/login" element={<Login onNavigate={onNavigate} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/client-signup" element={<ClientSignup onNavigate={onNavigate} />} />
        <Route path="/consultant-signup" element={<ConsultantSignup onNavigate={onNavigate} />} />
        <Route path="/specialties" element={<Specialties onNavigate={onNavigate} />} />
        <Route path="/browse" element={<BrowseConsultants />} />
        <Route path="/consultant/:id" element={<ConsultantDetails />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:userId" element={<Messages />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/book-session" element={<BookSession />} />
        <Route path="/add-ad" element={<AddAd />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/ad/:id" element={<AdDetails />} />
        <Route path="/admin" element={<AdminLogin onNavigate={onNavigate} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AdminUsers onNavigate={onNavigate} />} />
        <Route path="/admin-ads" element={<AdminAds onNavigate={onNavigate} />} />
        <Route path="/admin-meetings" element={<AdminMeetings onNavigate={onNavigate} />} />
        <Route path="/admin-messages" element={<AdminMessages onNavigate={onNavigate} />} />
        <Route path="/admin-stats" element={<AdminStats onNavigate={onNavigate} />} />
      </Routes>
    </BrowserRouter>
  );
}