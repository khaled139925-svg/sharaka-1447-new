import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "@/pages/About";
import Dashboard from "./pages/Dashboard";
import ClientSignup from "./pages/ClientSignup";
import ConsultantSignup from "./pages/ConsultantSignup";
import Specialties from "./pages/Specialties";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAds from "./pages/AdminAds";
import AdminMeetings from "./pages/AdminMeetings";
import AdminMessages from "./pages/AdminMessages";
import AdminStats from "./pages/AdminStats";
import UserDashboard from "./pages/UserDashboard";
export default function App() {
  const [page, setPage] = useState("home");
  useEffect(() => {

const handleKey = (e) => {

if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {

setPage("admin");

}

};

window.addEventListener("keydown", handleKey);

return () => window.removeEventListener("keydown", handleKey);

}, []);

  const renderPage = () => {
    switch (page) {
      case "about":
  return <About onNavigate={setPage} />;
      case "login":
        return <Login onNavigate={setPage} />;

      case "dashboard":
        return <Dashboard />;

      case "client-signup":
        return <ClientSignup onNavigate={setPage} />;

      case "consultant-signup":
        return <ConsultantSignup onNavigate={setPage} />;
        case "specialties":
  return <Specialties onNavigate={setPage} />;
  case "admin":
return <AdminLogin onNavigate={setPage} />;

case "admin-dashboard":
return <AdminDashboard onNavigate={setPage} />;

case "admin-users":
return <AdminUsers onNavigate={setPage} />;

case "admin-ads":
return <AdminAds onNavigate={setPage} />;

case "admin-meetings":
return <AdminMeetings onNavigate={setPage} />;

case "admin-messages":
return <AdminMessages onNavigate={setPage} />;

case "admin-stats":
return <AdminStats onNavigate={setPage} />;

  

      default:
        return <Home onNavigate={setPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}