import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClientSignup from "./pages/ClientSignup";
import ConsultantSignup from "./pages/ConsultantSignup";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "login":
        return <Login onNavigate={setPage} />;

      case "dashboard":
        return <Dashboard />;

      case "client-signup":
        return <ClientSignup onNavigate={setPage} />;

      case "consultant-signup":
        return <ConsultantSignup onNavigate={setPage} />;

      default:
        return <Home onNavigate={setPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}