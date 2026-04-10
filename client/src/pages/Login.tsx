import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/globe-icon.png";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>مرحباً بك</h2>
        <p style={subtitle}>سجل دخولك للوصول إلى حسابك</p>

        {/* Email */}
        <div style={inputGroup}>
          <label>البريد الإلكتروني</label>
          <div style={inputWrapper}>
            <input type="email" placeholder="example@email.com" style={input} />
            <span style={icon}>✉️</span>
          </div>
        </div>

        {/* Password */}
        <div style={inputGroup}>
          <label>كلمة المرور</label>
          <div style={inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              style={input}
            />
            <span style={icon} onClick={() => setShowPassword(!showPassword)}>
              👁
            </span>
          </div>
        </div>

        <p style={forgot}>نسيت كلمة المرور؟</p>

        <button style={button}>تسجيل الدخول →</button>

        <p style={bottomText}>
          ليس لديك حساب؟{" "}
          <span onClick={() => navigate("/consultant-signup")} style={link}>
            انضم إلينا
          </span>
        </p>
      </div>
    </div>
  );
}

// 🎨 styles
const page = {
  minHeight: "100vh",
  background: "#f5f7fa",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  direction: "rtl",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  background: "#fff",
  padding: "35px",
  borderRadius: "16px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
};

const title = {
  color: "#FF9800",
  textAlign: "center" as const,
  marginBottom: "5px",
};

const subtitle = {
  textAlign: "center" as const,
  color: "#777",
  marginBottom: "25px",
};

const inputGroup = {
  marginBottom: "15px",
};

const inputWrapper = {
  position: "relative" as const,
};

const input = {
  width: "100%",
  padding: "12px 40px 12px 12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const icon = {
  position: "absolute" as const,
  left: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
};

const forgot = {
  fontSize: "13px",
  color: "#1976D2",
  marginBottom: "15px",
  cursor: "pointer",
};

const button = {
  width: "100%",
  padding: "14px",
  background: "#FF9800",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
};

const bottomText = {
  textAlign: "center" as const,
  marginTop: "15px",
};

const link = {
  color: "#1976D2",
  cursor: "pointer",
};