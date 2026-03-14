import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClientSignup from "./pages/ClientSignup";
import ConsultantSignup from "./pages/ConsultantSignup";
import Specialties from "./pages/Specialties";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAds from "./pages/AdminAds";
import AdminMeetings from "./pages/AdminMeetings";
import AdminMessages from "./pages/AdminMessages";
import AdminStats from "./pages/AdminStats";
import BookSession from "./pages/BookSession";
import BrowseAll from "./pages/BrowseAll";
import AddAd from "./pages/AddAd";
import Ads from "./pages/Ads";
import AdDetails from "./pages/AdDetails";
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

  const onNavigate = (page:string) => {

    if(page === "home") window.location.href = "/";
    else if(page === "about") window.location.href = "/about";
    else if(page === "login") window.location.href = "/login";
    else if(page === "dashboard") window.location.href = "/dashboard";
    else if(page === "client-signup") window.location.href = "/client-signup";
    else if(page === "consultant-signup") window.location.href = "/consultant-signup";
    else if(page === "specialties") window.location.href = "/specialties";
    else if(page === "admin") window.location.href = "/admin";
    else if(page === "admin-dashboard") window.location.href = "/admin-dashboard";
    else if(page === "admin-users") window.location.href = "/admin-users";
    else if(page === "admin-ads") window.location.href = "/admin-ads";
    else if(page === "admin-meetings") window.location.href = "/admin-meetings";
    else if(page === "admin-messages") window.location.href = "/admin-messages";
    else if(page === "admin-stats") window.location.href = "/admin-stats";

  };

  return (

    <BrowserRouter>

      <AdminShortcut />

      <Routes>

        <Route path="/" element={<Home onNavigate={onNavigate} />} />

        <Route path="/about" element={<About onNavigate={onNavigate} />} />

        <Route path="/login" element={<Login onNavigate={onNavigate} />} />

        <Route path="/dashboard" element={<Dashboard onNavigate={onNavigate} />} />

        <Route path="/client-signup" element={<ClientSignup onNavigate={onNavigate} />} />

        <Route path="/consultant-signup" element={<ConsultantSignup onNavigate={onNavigate} />} />

        <Route path="/specialties" element={<Specialties onNavigate={onNavigate} />} />

        <Route path="/admin" element={<AdminLogin onNavigate={onNavigate} />} />

        <Route path="/admin-dashboard" element={<AdminDashboard onNavigate={onNavigate} />} />

        <Route path="/admin-users" element={<AdminUsers onNavigate={onNavigate} />} />

        <Route path="/admin-ads" element={<AdminAds onNavigate={onNavigate} />} />

        <Route path="/admin-meetings" element={<AdminMeetings onNavigate={onNavigate} />} />

        <Route path="/admin-messages" element={<AdminMessages onNavigate={onNavigate} />} />

        <Route path="/admin-stats" element={<AdminStats onNavigate={onNavigate} />} />

        <Route path="/book-session" element={<BookSession />} />

        <Route path="/browse" element={<BrowseAll />} />

        <Route path="/add-ad" element={<AddAd />} />
<Route path="/ads" element={<Ads />} />
<Route path="/ad/:id" element={<AdDetails />} />

      </Routes>

    </BrowserRouter>

  );

}