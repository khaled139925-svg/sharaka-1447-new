import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignupModal({ isOpen, onClose, onSignupSuccess }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadAvatar = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const { error } = await supabase.storage.from("media").upload(filePath, file);
    if (error) return null;
    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: existing } = await supabase.from("consultants").select("id").eq("email", email).maybeSingle();
    if (existing) {
      setError("البريد الإلكتروني مسجل بالفعل");
      setLoading(false);
      return;
    }

    let avatarUrl = null;
    if (avatarFile) avatarUrl = await uploadAvatar(avatarFile);

    const { error: insertError } = await supabase.from("consultants").insert([{
      full_name: fullName,
      email,
      password,
      phone: phone || null,
      specialty: specialty || null,
      bio: bio || null,
      avatar_url: avatarUrl,
    }]);

    if (insertError) setError(insertError.message);
    else onSignupSuccess();
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl my-8">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">إنشاء حساب</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="الاسم الكامل" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3" required />
          <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3" required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3" required />
          <input type="tel" placeholder="رقم الجوال (اختياري)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3" />
          <input type="text" placeholder="التخصص (اختياري)" value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3" />
          <textarea placeholder="نبذة عنك (اختياري)" rows={3} value={bio} onChange={e => setBio(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3" />
          <div>
            <label className="block text-sm text-gray-600 mb-1">صورة شخصية (اختياري)</label>
            <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50">
            {loading ? "جاري التسجيل..." : "تسجيل"}
          </button>
          <p className="text-center text-sm text-gray-600">
            لديك حساب؟{" "}
            <button type="button" onClick={() => { onClose(); document.dispatchEvent(new CustomEvent("openLoginModal")); }} className="text-blue-600 hover:underline">تسجيل الدخول</button>
          </p>
        </form>
      </div>
    </div>
  );
}