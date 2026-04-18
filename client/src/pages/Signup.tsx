import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", specialty: "", bio: "", security_question: "", security_answer: "" });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState("");

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const { error } = await supabase.storage.from("media").upload(filePath, file);
    if (error) return null;
    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.full_name || !form.email || !form.password) {
      setError("الاسم والإيميل وكلمة المرور إجبارية");
      return;
    }
    const { data: existing } = await supabase.from("consultants").select("email").eq("email", form.email).maybeSingle();
    if (existing) {
      setError("هذا البريد مسجل مسبقًا");
      return;
    }
    let avatarUrl = null;
    if (avatar) {
      avatarUrl = await uploadAvatar(avatar);
      if (!avatarUrl) setError("فشل رفع الصورة");
    }
    if (error) return;
    const { error: insertError } = await supabase.from("consultants").insert({
      ...form,
      phone: form.phone || null,
      specialty: form.specialty || null,
      bio: form.bio || null,
      avatar_url: avatarUrl,
      is_active: true,
      is_admin: false,
    });
    if (insertError) setError(insertError.message);
    else {
      alert("تم التسجيل بنجاح، يمكنك الآن تسجيل الدخول");
      navigate("/login");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20, background: "#fff", borderRadius: 16 }}>
      <h2>إنشاء حساب جديد</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="الاسم الكامل" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={inputStyle} required />
        <input placeholder="البريد الإلكتروني" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} required />
        <input placeholder="رقم الجوال (مع رمز الدولة)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} />
        <input placeholder="كلمة المرور" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} required />
        <input placeholder="التخصص" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} style={inputStyle} />
        <textarea placeholder="نبذة عنك" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} style={inputStyle} rows={2} />
        <select value={form.security_question} onChange={e => setForm({...form, security_question: e.target.value})} style={inputStyle} required>
          <option value="">اختر سؤال الأمان</option>
          <option>ما هو اسم والدتك؟</option>
          <option>ما هو اسم حيوانك الأليف الأول؟</option>
          <option>ما هي مدينتك المفضلة؟</option>
        </select>
        <input placeholder="إجابة السؤال" value={form.security_answer} onChange={e => setForm({...form, security_answer: e.target.value})} style={inputStyle} required />
        <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] || null)} style={inputStyle} />
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={btnStyle}>تسجيل</button>
      </form>
    </div>
  );
}

const inputStyle = { width: "100%", padding: 10, marginBottom: 15, borderRadius: 8, border: "1px solid #ddd" };
const btnStyle = { background: "#f97316", color: "#fff", padding: 10, width: "100%", borderRadius: 8, border: "none", cursor: "pointer" };