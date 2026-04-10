import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Browse from './pages/Browse';
import ConsultantProfile from './pages/ConsultantProfile';
import ClientSignup from './pages/ClientSignup';
import ConsultantSignup from './pages/ConsultantSignup';
import BrowseResults from "./pages/BrowseResults";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/consultant/:id" element={<ConsultantProfile />} />
      <Route path="/client-signup" element={<ClientSignup />} />
      <Route path="/consultant-signup" element={<ConsultantSignup />} />
      <Route path="/browse/:category" element={<BrowseResults />} />
    </Routes>
  );
}