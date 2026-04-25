import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      setError("الإيميل أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    if (data.is_active === false) {
      setError("هذا الحساب مجمد، رجاء التواصل مع الإدارة");
      setLoading(false);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    navigate("/profile");
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 16,
        position: "relative",
      }}
    >
      {/* زر الإغلاق */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 15,
          right: 20,
          background: "transparent",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          color: "#888",
        }}
        aria-label="إغلاق"
      >
        ✖
      </button>

      <h2 style={{ textAlign: "center" }}>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  borderRadius: 8,
  border: "1px solid #ddd",
  boxSizing: "border-box" as const,
};

const btnStyle = {
  background: "#f97316", // اللون البرتقالي (مطابق لزر التسجيل)
  color: "#fff",
  padding: 10,
  width: "100%",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};