import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "@/pages/About";
import Dashboard from "./pages/Dashboard";
import ClientSignup from "./pages/ClientSignup";
import ConsultantSignup from "./pages/ConsultantSignup";
import Specialties from "./pages/Specialties";
export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "about":
  return <About />;
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

      default:
        return <Home onNavigate={setPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}