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

    const { data, error: loginError } = await supabase
      .from("consultants")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (loginError || !data) {
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
    localStorage.setItem("isLoggedIn", "true");
    navigate("/profile");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, background: "#fff", borderRadius: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", position: "relative" }}>
      <button onClick={() => navigate("/")} style={{ position: "absolute", top: 15, right: 20, background: "transparent", border: "none", fontSize: 24, cursor: "pointer", color: "#888" }}>✖</button>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }} required />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }} required />
        {error && <div style={{ color: "red", marginBottom: 10, textAlign: "center" }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ background: "#f97316", color: "#fff", padding: 10, width: "100%", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: "bold" }}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
      <div style={{ marginTop: 15, textAlign: "center" }}>
        <button onClick={() => navigate("/signup")} style={{ background: "none", border: "none", color: "#1976D2", cursor: "pointer" }}>ليس لديك حساب؟ سجل الآن</button>
      </div>
    </div>
  );
}