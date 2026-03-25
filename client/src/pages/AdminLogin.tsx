import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface AdminLoginProps {
  onNavigate?: (page: string) => void;
}

export default function AdminLogin({ onNavigate }: AdminLoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // البحث عن المستخدم بالبريد وكلمة المرور
    const { data, error: loginError } = await supabase
      .from("consultants")
      .select("id, email, full_name, company_name")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (loginError || !data) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    // حفظ بيانات الأدمن
    localStorage.setItem("adminLoggedIn", "true");
    localStorage.setItem("adminData", JSON.stringify(data));
    
    setLoading(false);
    navigate("/admin-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1976D2]/10 to-[#FF9800]/10 flex items-center justify-center py-16" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#FF9800] mb-2">لوحة التحكم</h1>
            <p className="text-gray-500">أدخل بيانات الدخول للوصول</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
                placeholder="admin@sharaka.com"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? "جاري الدخول..." : "دخول"}
            </button>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-[#1976D2] hover:text-[#FF9800]"
              >
                ← العودة للرئيسية
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}