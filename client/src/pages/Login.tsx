import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"ar" | "en">("ar");

  const translations = {
    ar: {
      title: "تسجيل الدخول",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      loginBtn: "دخول",
      forgotPassword: "نسيت كلمة المرور؟",
      close: "إغلاق",
      loginError: "الإيميل أو كلمة المرور غير صحيحة",
      accountFrozen: "هذا الحساب مجمد، رجاء التواصل مع الإدارة",
      signupLink: "ليس لديك حساب؟ سجل الآن",
    },
    en: {
      title: "Login",
      email: "Email",
      password: "Password",
      loginBtn: "Login",
      forgotPassword: "Forgot password?",
      close: "Close",
      loginError: "Incorrect email or password",
      accountFrozen: "This account is frozen, contact admin",
      signupLink: "Don't have an account? Sign up",
    },
  };
  const t = locale === "ar" ? translations.ar : translations.en;

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
      setError(t.loginError);
      setLoading(false);
      return;
    }
    if (data.is_active === false) {
      setError(t.accountFrozen);
      setLoading(false);
      return;
    }
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("isLoggedIn", "true");
    navigate("/profile");
    setLoading(false);
  };

  const toggleLanguage = () => setLocale(prev => (prev === "ar" ? "en" : "ar"));

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, background: "#fff", borderRadius: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", position: "relative" }}>
      <button onClick={() => navigate("/")} style={{ position: "absolute", top: 15, right: 20, background: "transparent", border: "none", fontSize: 24, cursor: "pointer", color: "#888" }}>✖</button>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button onClick={toggleLanguage} style={{ background: "#f0f0f0", border: "none", borderRadius: 30, padding: "6px 12px", cursor: "pointer", fontWeight: "bold" }}>
          {locale === "ar" ? "🇸🇦 English" : "🇺🇸 العربية"}
        </button>
      </div>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>{t.title}</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }} required />
        <input type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }} required />
        {error && <div style={{ color: "red", marginBottom: 10, textAlign: "center" }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ background: "#f97316", color: "#fff", padding: 10, width: "100%", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: "bold" }}>
          {loading ? "جاري الدخول..." : t.loginBtn}
        </button>
        <button type="button" onClick={async () => { if (!email) return; const { data } = await supabase.from("consultants").select("password").eq("email", email).single(); alert(data ? `كلمة المرور: ${data.password}` : "البريد غير موجود"); }} style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer", marginTop: "10px", width: "100%" }}>{t.forgotPassword}</button>
      </form>
      <div style={{ marginTop: 15, textAlign: "center" }}>
        <button onClick={() => navigate("/signup")} style={{ background: "none", border: "none", color: "#1976D2", cursor: "pointer" }}>{t.signupLink}</button>
      </div>
    </div>
  );
}