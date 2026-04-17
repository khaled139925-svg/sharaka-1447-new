import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("consultants")
      .select("id, full_name, email, avatar_url")
      .eq("email", email)
      .eq("password", password)
      .single();
    if (error || !data) setError("البريد أو كلمة المرور غير صحيحة");
    else {
      localStorage.setItem("user", JSON.stringify(data));
      onLoginSuccess(data);
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">تسجيل الدخول</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400" required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400" required />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50">
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
          <p className="text-center text-sm text-gray-600">
            ليس لديك حساب؟{" "}
            <button type="button" onClick={() => { onClose(); document.dispatchEvent(new CustomEvent("openSignupModal")); }} className="text-blue-600 hover:underline">إنشاء حساب</button>
          </p>
        </form>
      </div>
    </div>
  );
}