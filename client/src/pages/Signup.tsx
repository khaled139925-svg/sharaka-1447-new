import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// قائمة رموز الدول (كما هي)
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
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    specialty: "",
    bio: "",
  });
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
      setError("الاسم والإيميل وكلمة المرور إجبارية");
      setLoading(false);
      return;
    }
    if (!phoneNumber) {
      setError("رقم الجوال إجباري");
      setLoading(false);
      return;
    }

    // التحقق من وجود البريد مسبقاً
    const { data: existing } = await supabase
      .from("consultants")
      .select("email")
      .eq("email", form.email)
      .maybeSingle();
    if (existing) {
      setError("هذا البريد مسجل مسبقًا");
      setLoading(false);
      return;
    }

    let avatarUrl = null;
    if (avatar) {
      avatarUrl = await uploadAvatar(avatar);
      if (!avatarUrl) setError("فشل رفع الصورة");
    }
    if (error) {
      setLoading(false);
      return;
    }

    const fullPhone = `${countryCode}${phoneNumber}`;
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
      invoice_status: "not_issued",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    alert("تم التسجيل بنجاح، يمكنك الآن تسجيل الدخول");
    navigate("/login");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20, background: "#fff", borderRadius: 16, position: "relative" }}>
      {/* زر الإغلاق */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 15,
          right: 20,
          background: "transparent",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          color: "#888",
        }}
        aria-label="إغلاق"
      >
        ✖
      </button>

      <h2 style={{ textAlign: "center" }}>إنشاء حساب جديد</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="الاسم الكامل"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          placeholder="البريد الإلكتروني (خاص بالدخول)"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
          required
        />
        <div style={{ display: "flex", gap: 10, marginBottom: 5 }}>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            style={{ ...inputStyle, width: "30%" }}
            required
          >
            {countryCodes.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} {c.country}
              </option>
            ))}
          </select>
          <input
            type="tel"
            placeholder="رقم الجوال"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ ...inputStyle, width: "70%" }}
            required
          />
        </div>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 15 }}>
          📌 أدخل رقم الجوال مع مفتاح الدولة
        </div>
        <input
          placeholder="كلمة المرور"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          placeholder="التخصص (اختياري)"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="نبذة عنك (اختياري)"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          style={{ ...inputStyle, minHeight: 80 }}
          rows={3}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          style={inputStyle}
        />
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? "جاري التسجيل..." : "تسجيل"}
        </button>
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