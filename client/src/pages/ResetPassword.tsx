import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Lock, Eye, EyeOff, Save } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  
  // متغير اللغة: نقرأه من localStorage أو نضبطه على العربية
  const [locale, setLocale] = useState<"ar" | "en">(() => {
    const saved = localStorage.getItem("appLocale");
    return saved === "en" ? "en" : "ar";
  });
  
  const translations = {
    ar: {
      title: "إعادة تعيين كلمة المرور",
      subtitle: "أدخل كلمة المرور الجديدة",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      updateBtn: "تحديث كلمة المرور",
      updating: "جاري التحديث...",
      backToLogin: "← العودة لتسجيل الدخول",
      errorMismatch: "كلمتا المرور غير متطابقتين",
      errorLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      successMsg: "تم تغيير كلمة المرور بنجاح",
      invalidLink: "رابط غير صالح",
    },
    en: {
      title: "Reset Password",
      subtitle: "Enter your new password",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      updateBtn: "Update password",
      updating: "Updating...",
      backToLogin: "← Back to login",
      errorMismatch: "Passwords do not match",
      errorLength: "Password must be at least 6 characters",
      successMsg: "Password changed successfully",
      invalidLink: "Invalid link",
    },
  };
  const t = translations[locale];
  
  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    setLocale(newLocale);
    localStorage.setItem("appLocale", newLocale);
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) {
      setError(t.invalidLink);
    }
  }, [t]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t.errorMismatch);
      return;
    }

    if (password.length < 6) {
      setError(t.errorLength);
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(t.successMsg);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1976D2]/10 to-[#FF9800]/10 flex items-center justify-center py-16" dir="rtl">
      <div className="max-w-md w-full mx-4">
        {/* زر الترجمة في أعلى البطاقة */}
        <div className="flex justify-end mb-2">
          <button onClick={toggleLanguage} className="bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold">
            {locale === "ar" ? "🇸🇦 English" : "🇺🇸 العربية"}
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#FF9800] mb-2">{t.title}</h1>
            <p className="text-gray-500">{t.subtitle}</p>
          </div>

          <form onSubmit={handleResetPassword}>
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">{t.newPassword}</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
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

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">{t.confirmPassword}</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? t.updating : t.updateBtn}
              <Save size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-[#1976D2] hover:text-[#FF9800] transition"
            >
              {t.backToLogin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}