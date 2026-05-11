import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// قائمة رموز الدول (بنفس الترتيب الأصلي دون تغيير)
const countryCodes = [
  { code: "+20", country: "مصر" },
  { code: "+966", country: "السعودية" },
  { code: "+971", country: "الإمارات" },
  { code: "+965", country: "الكويت" },
  { code: "+974", country: "قطر" },
  { code: "+968", country: "عُمان" },
  { code: "+973", country: "البحرين" },
  { code: "+962", country: "الأردن" },
  { code: "+961", country: "لبنان" },
  { code: "+963", country: "سوريا" },
  { code: "+967", country: "اليمن" },
  { code: "+218", country: "ليبيا" },
  { code: "+213", country: "الجزائر" },
  { code: "+216", country: "تونس" },
  { code: "+212", country: "المغرب" },
  { code: "+222", country: "موريتانيا" },
  { code: "+249", country: "السودان" },
  { code: "+252", country: "الصومال" },
  { code: "+92", country: "باكستان" },
  { code: "+90", country: "تركيا" },
  { code: "+44", country: "المملكة المتحدة" },
  { code: "+33", country: "فرنسا" },
  { code: "+49", country: "ألمانيا" },
  { code: "+34", country: "إسبانيا" },
  { code: "+39", country: "إيطاليا" },
  { code: "+31", country: "هولندا" },
  { code: "+32", country: "بلجيكا" },
  { code: "+41", country: "سويسرا" },
  { code: "+46", country: "السويد" },
  { code: "+47", country: "النرويج" },
  { code: "+45", country: "الدنمارك" },
  { code: "+358", country: "فنلندا" },
  { code: "+48", country: "بولندا" },
  { code: "+420", country: "جمهورية التشيك" },
  { code: "+36", country: "المجر" },
  { code: "+351", country: "البرتغال" },
  { code: "+30", country: "اليونان" },
  { code: "+7", country: "روسيا" },
  { code: "+1", country: "الولايات المتحدة / كندا" },
  { code: "+86", country: "الصين" },
  { code: "+81", country: "اليابان" },
  { code: "+82", country: "كوريا الجنوبية" },
  { code: "+55", country: "البرازيل" },
  { code: "+54", country: "الأرجنتين" },
  { code: "+52", country: "المكسيك" },
  { code: "+61", country: "أستراليا" },
  { code: "+64", country: "نيوزيلندا" },
  { code: "+27", country: "جنوب أفريقيا" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"ar" | "en">("ar");

  const translations = {
    ar: {
      title: "إنشاء حساب جديد",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني (خاص بالدخول)",
      phone: "رقم الجوال",
      password: "كلمة المرور",
      specialty: "التخصص (اختياري)",
      bio: "نبذة عنك (اختياري)",
      register: "تسجيل",
      phoneHint: "📌 اختر مفتاح الدولة ثم أدخل رقم الجوال",
      emailRequired: "الاسم والإيميل وكلمة المرور إجبارية",
      phoneRequired: "رقم الجوال إجباري",
      emailExists: "هذا البريد مسجل مسبقًا",
      avatarUploadFail: "فشل رفع الصورة",
      registerSuccess: "تم التسجيل بنجاح، يمكنك الآن تسجيل الدخول",
      close: "إغلاق",
      userTypeLabel: "نوع الحساب",
      individual: "فرد",
      company: "شركة / منشأة",
    },
    en: {
      title: "Create new account",
      fullName: "Full name",
      email: "Email (for login)",
      phone: "Phone number",
      password: "Password",
      specialty: "Specialty (optional)",
      bio: "Bio (optional)",
      register: "Register",
      phoneHint: "📌 Select country code then enter phone number",
      emailRequired: "Name, email and password are required",
      phoneRequired: "Phone number is required",
      emailExists: "Email already registered",
      avatarUploadFail: "Failed to upload image",
      registerSuccess: "Registration successful, you can now log in",
      close: "Close",
      userTypeLabel: "Account type",
      individual: "Individual",
      company: "Company / Establishment",
    },
  };
  const t = locale === "ar" ? translations.ar : translations.en;

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    specialty: "",
    bio: "",
  });
  const [userType, setUserType] = useState<'individual' | 'company'>('individual');
  const [countryCode, setCountryCode] = useState("+966");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
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
    setLoading(true);

    if (!form.full_name || !form.email || !form.password) {
      setError(t.emailRequired);
      setLoading(false);
      return;
    }
    if (!phoneNumber) {
      setError(t.phoneRequired);
      setLoading(false);
      return;
    }

    const { data: existing } = await supabase
      .from("consultants")
      .select("email")
      .eq("email", form.email)
      .maybeSingle();
    if (existing) {
      setError(t.emailExists);
      setLoading(false);
      return;
    }

    let avatarUrl = null;
    if (avatar) {
      avatarUrl = await uploadAvatar(avatar);
      if (!avatarUrl) {
        setError(t.avatarUploadFail);
        setLoading(false);
        return;
      }
    }

    const fullPhone = `${countryCode}${phoneNumber}`;
    const selectedCountry = countryCodes.find(c => c.code === countryCode);
    const { error: insertError } = await supabase.from("consultants").insert({
      full_name: form.full_name,
      email: form.email,
      phone: fullPhone,
      password: form.password,
      specialty: form.specialty || null,
      bio: form.bio || null,
      avatar_url: avatarUrl,
      is_active: true,
      is_admin: false,
      country_code: countryCode,
      country_name: selectedCountry?.country || "",
      user_type: userType,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    alert(t.registerSuccess);
    navigate("/login");
    setLoading(false);
  };

  const toggleLanguage = () => setLocale(prev => (prev === "ar" ? "en" : "ar"));

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20, background: "#fff", borderRadius: 16, position: "relative" }}>
      <button onClick={() => navigate("/")} style={{ position: "absolute", top: 15, right: 20, background: "transparent", border: "none", fontSize: 24, cursor: "pointer", color: "#888" }}>✖</button>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button onClick={toggleLanguage} style={{ background: "#f0f0f0", border: "none", borderRadius: 30, padding: "6px 12px", cursor: "pointer", fontWeight: "bold" }}>
          {locale === "ar" ? "🇸🇦 English" : "🇺🇸 العربية"}
        </button>
      </div>
      <h2 style={{ textAlign: "center" }}>{t.title}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder={t.fullName} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} style={inputStyle} required />
        <input placeholder={t.email} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
        
        {/* حقل نوع الحساب */}
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{t.userTypeLabel}</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as 'individual' | 'company')}
            style={inputStyle}
          >
            <option value="individual">{t.individual}</option>
            <option value="company">{t.company}</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 5 }}>
          <select value={countryCode} onChange={e => setCountryCode(e.target.value)} style={{ ...inputStyle, width: "30%" }} required>
            {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code} {c.country}</option>)}
          </select>
          <input type="tel" placeholder={t.phone} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} style={{ ...inputStyle, width: "70%" }} required />
        </div>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 15 }}>{t.phoneHint}</div>
        <input type="password" placeholder={t.password} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} required />
        <input placeholder={t.specialty} value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} style={inputStyle} />
        <textarea placeholder={t.bio} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ ...inputStyle, minHeight: 80 }} rows={3} />
        <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] || null)} style={inputStyle} />
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={btnStyle} disabled={loading}>{loading ? "جاري التسجيل..." : t.register}</button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  borderRadius: 8,
  border: "1px solid #ddd",
  boxSizing: "border-box" as const,
};
const btnStyle = {
  background: "#f97316",
  color: "#fff",
  padding: 10,
  width: "100%",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};