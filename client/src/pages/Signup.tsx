import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.from("consultants").insert([{ full_name: fullName, email, password }]);
    if (error) {
      setError(error.message);
    } else {
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">إنشاء حساب</h2>
        <form onSubmit={handleSignup} className="space-y-3">
          <input type="text" placeholder="الاسم الكامل" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" required />
          {error && <div className="text-red-500">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-2 rounded">تسجيل</button>
          <Link to="/login" className="block text-center text-blue-600">لديك حساب؟ دخول</Link>
        </form>
      </div>
    </div>
  );
}