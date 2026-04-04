import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: loginError } = await supabase
      .from("consultants")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (loginError || !data) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("isLoggedIn", "true");
    
    setLoading(false);
    navigate("/dashboard");
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotMessage("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    setForgotLoading(true);
    
    const { data, error } = await supabase
      .from("consultants")
      .select("password")
      .eq("email", forgotEmail)
      .single();

    if (error || !data) {
      setForgotMessage("❌ البريد الإلكتروني غير مسجل في النظام");
      setForgotLoading(false);
      return;
    }

    setForgotMessage(`🔑 كلمة المرور الخاصة بك هي: ${data.password}`);
    
    setTimeout(() => {
      setForgotMessage("");
      setShowForgot(false);
      setForgotEmail("");
    }, 8000);
    
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1976D2]/10 to-[#FF9800]/10 flex items-center justify-center py-16" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#FF9800] mb-2">مرحباً بك</h1>
            <p className="text-gray-500">سجل دخولك للوصول إلى حسابك</p>
          </div>

          {!showForgot ? (
            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-left mb-6">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-[#1976D2] hover:text-[#FF9800] transition"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                <ArrowRight size={18} />
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  ليس لديك حساب؟{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/consultant-signup")}
                    className="text-[#1976D2] hover:text-[#FF9800] font-semibold"
                  >
                    انضم إلينا
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <div>
              <p className="text-gray-600 mb-6 text-center">
                أدخل بريدك الإلكتروني وستظهر لك كلمة المرور مباشرة
              </p>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {forgotMessage && (
                <div className={`mb-4 p-3 rounded-xl text-sm text-center ${forgotMessage.includes("هي") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                  {forgotMessage}
                </div>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className="w-full bg-[#1976D2] hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
              >
                {forgotLoading ? "جاري البحث..." : "استعادة كلمة المرور"}
              </button>

              <button
                onClick={() => {
                  setShowForgot(false);
                  setForgotMessage("");
                  setForgotEmail("");
                }}
                className="w-full mt-3 text-gray-500 hover:text-gray-700 py-2 rounded-xl transition"
              >
                ← العودة لتسجيل الدخول
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}