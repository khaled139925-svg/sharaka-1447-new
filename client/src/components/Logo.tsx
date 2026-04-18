import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();
    if (error || !data) {
      setError("الإيميل أو كلمة المرور غير صحيحة");
    } else if (data.is_active === false) {
      setError("هذا الحساب مجمد، رجاء التواصل مع الإدارة");
    } else {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/profile");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, background: "#fff", borderRadius: 16 }}>
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={btnStyle}>دخول</button>
      </form>
    </div>
  );
}

const inputStyle = { width: "100%", padding: 10, marginBottom: 15, borderRadius: 8, border: "1px solid #ddd" };
const btnStyle = { background: "#2563eb", color: "#fff", padding: 10, width: "100%", borderRadius: 8, border: "none", cursor: "pointer" };