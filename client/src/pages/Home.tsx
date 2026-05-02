import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// خريطة ترجمة أسماء الدول (عربي -> إنجليزي)
const countryTranslations: Record<string, { ar: string; en: string }> = {
  "مصر": { ar: "مصر", en: "Egypt" },
  "السعودية": { ar: "السعودية", en: "Saudi Arabia" },
  "الإمارات": { ar: "الإمارات", en: "UAE" },
  "الكويت": { ar: "الكويت", en: "Kuwait" },
  "قطر": { ar: "قطر", en: "Qatar" },
  "عُمان": { ar: "عُمان", en: "Oman" },
  "البحرين": { ar: "البحرين", en: "Bahrain" },
  "الأردن": { ar: "الأردن", en: "Jordan" },
  "لبنان": { ar: "لبنان", en: "Lebanon" },
  "سوريا": { ar: "سوريا", en: "Syria" },
  "اليمن": { ar: "اليمن", en: "Yemen" },
  "ليبيا": { ar: "ليبيا", en: "Libya" },
  "الجزائر": { ar: "الجزائر", en: "Algeria" },
  "تونس": { ar: "تونس", en: "Tunisia" },
  "المغرب": { ar: "المغرب", en: "Morocco" },
  "موريتانيا": { ar: "موريتانيا", en: "Mauritania" },
  "السودان": { ar: "السودان", en: "Sudan" },
  "الصومال": { ar: "الصومال", en: "Somalia" },
  "باكستان": { ar: "باكستان", en: "Pakistan" },
  "تركيا": { ar: "تركيا", en: "Turkey" },
  "المملكة المتحدة": { ar: "المملكة المتحدة", en: "United Kingdom" },
  "فرنسا": { ar: "فرنسا", en: "France" },
  "ألمانيا": { ar: "ألمانيا", en: "Germany" },
  "إسبانيا": { ar: "إسبانيا", en: "Spain" },
  "إيطاليا": { ar: "إيطاليا", en: "Italy" },
  "هولندا": { ar: "هولندا", en: "Netherlands" },
  "بلجيكا": { ar: "بلجيكا", en: "Belgium" },
  "سويسرا": { ar: "سويسرا", en: "Switzerland" },
  "السويد": { ar: "السويد", en: "Sweden" },
  "النرويج": { ar: "النرويج", en: "Norway" },
  "الدنمارك": { ar: "الدنمارك", en: "Denmark" },
  "فنلندا": { ar: "فنلندا", en: "Finland" },
  "بولندا": { ar: "بولندا", en: "Poland" },
  "جمهورية التشيك": { ar: "جمهورية التشيك", en: "Czech Republic" },
  "المجر": { ar: "المجر", en: "Hungary" },
  "البرتغال": { ar: "البرتغال", en: "Portugal" },
  "اليونان": { ar: "اليونان", en: "Greece" },
  "روسيا": { ar: "روسيا", en: "Russia" },
  "الولايات المتحدة / كندا": { ar: "الولايات المتحدة / كندا", en: "USA / Canada" },
  "الصين": { ar: "الصين", en: "China" },
  "اليابان": { ar: "اليابان", en: "Japan" },
  "كوريا الجنوبية": { ar: "كوريا الجنوبية", en: "South Korea" },
  "البرازيل": { ar: "البرازيل", en: "Brazil" },
  "الأرجنتين": { ar: "الأرجنتين", en: "Argentina" },
  "المكسيك": { ar: "المكسيك", en: "Mexico" },
  "أستراليا": { ar: "أستراليا", en: "Australia" },
  "نيوزيلندا": { ar: "نيوزيلندا", en: "New Zealand" },
  "جنوب أفريقيا": { ar: "جنوب أفريقيا", en: "South Africa" },
};

// دالة للحصول على اسم البلد حسب اللغة
const getCountryName = (countryAr: string, locale: string) => {
  if (locale === "ar") return countryAr;
  const translation = countryTranslations[countryAr];
  return translation ? translation.en : countryAr; // إذا لم يوجد ترجمة، نرجع الاسم العربي
};

export default function Home() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"ar" | "en">(() => {
    const saved = localStorage.getItem("appLocale");
    return saved === "en" ? "en" : "ar";
  });

  const translations = {
    ar: {
      siteName: "شراكة",
      adminPanel: "🛠️ لوحة التحكم",
      login: "دخول",
      signup: "تسجيل",
      logout: "تسجيل خروج",
      allCountries: "🌍 جميع البلدان",
      noBio: "لا يوجد نبذة",
      noSpecialty: "بدون تخصص",
      followers: "متابع",
      loginTitle: "تسجيل الدخول",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      loginBtn: "دخول",
      close: "إغلاق",
      registerTitle: "تسجيل",
      fullName: "الاسم الكامل",
      phone: "رقم الجوال",
      specialty: "التخصص (اختياري)",
      bio: "نبذة عنك (اختياري)",
      registerBtn: "تسجيل",
      emailRequired: "الاسم والإيميل وكلمة المرور إجبارية",
      phoneRequired: "رقم الجوال إجباري",
      emailExists: "هذا البريد مسجل مسبقًا",
      avatarUploadFail: "فشل رفع الصورة",
      registerSuccess: "تم التسجيل بنجاح",
      loginError: "الإيميل أو كلمة المرور غير صحيحة",
      accountFrozen: "هذا الحساب مجمد، رجاء التواصل مع الإدارة",
    },
    en: {
      siteName: "Sharaka",
      adminPanel: "🛠️ Admin Panel",
      login: "Login",
      signup: "Sign up",
      logout: "Logout",
      allCountries: "🌍 All countries",
      noBio: "No bio",
      noSpecialty: "No specialty",
      followers: "Followers",
      loginTitle: "Login",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      loginBtn: "Login",
      close: "Close",
      registerTitle: "Register",
      fullName: "Full name",
      phone: "Phone number",
      specialty: "Specialty (optional)",
      bio: "Bio (optional)",
      registerBtn: "Register",
      emailRequired: "Name, email and password are required",
      phoneRequired: "Phone number is required",
      emailExists: "Email already registered",
      avatarUploadFail: "Failed to upload image",
      registerSuccess: "Registration successful",
      loginError: "Incorrect email or password",
      accountFrozen: "This account is frozen, contact admin",
    },
  };
  const t = locale === "ar" ? translations.ar : translations.en;

  const [allConsultants, setAllConsultants] = useState<any[]>([]);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerSpecialty, setRegisterSpecialty] = useState("");
  const [registerBio, setRegisterBio] = useState("");
  const [registerAvatar, setRegisterAvatar] = useState<File | null>(null);
  const [registerError, setRegisterError] = useState("");
  const [followersMap, setFollowersMap] = useState<any>({});

  const orderUsers = (users: any[]) => {
    let sharaka = null, safra = null, others = [];
    for (const user of users) {
      if (user.full_name === "شراكة" || user.specialty === "شراكة") sharaka = user;
      else if (user.full_name === "سفرة بيت" || user.specialty === "سفرة بيت") safra = user;
      else others.push(user);
    }
    others.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const result = [];
    if (sharaka) result.push(sharaka);
    if (safra) result.push(safra);
    result.push(...others);
    return result;
  };

  async function loadAllConsultants() {
    const { data } = await supabase.from("consultants").select("*").eq("is_active", true);
    const ordered = orderUsers(data || []);
    setAllConsultants(ordered);
    setConsultants(ordered);
    const uniqueCountries = [...new Set(data?.map(c => c.country_name).filter(Boolean))] as string[];
    setCountries(uniqueCountries);
  }

  useEffect(() => {
    loadAllConsultants();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const filtered = allConsultants.filter(c => c.country_name === selectedCountry);
      setConsultants(orderUsers(filtered));
    } else {
      setConsultants(allConsultants);
    }
  }, [selectedCountry, allConsultants]);

  useEffect(() => {
    const map: any = {};
    consultants.forEach(c => map[c.id] = localStorage.getItem(`follow_${c.id}`) === "true" ? 1 : 0);
    setFollowersMap(map);
  }, [consultants]);

  async function uploadAvatar(file: File): Promise<string | null> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const { error } = await supabase.storage.from("media").upload(filePath, file);
    if (error) return null;
    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError("");
    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterError(t.emailRequired);
      return;
    }
    if (!registerPhone) {
      setRegisterError(t.phoneRequired);
      return;
    }
    const { data: existingUser } = await supabase.from("consultants").select("email").eq("email", registerEmail).maybeSingle();
    if (existingUser) {
      setRegisterError(t.emailExists);
      return;
    }
    let avatarUrl = null;
    if (registerAvatar) avatarUrl = await uploadAvatar(registerAvatar);
    if (registerAvatar && !avatarUrl) {
      setRegisterError(t.avatarUploadFail);
      return;
    }
    const { error } = await supabase.from("consultants").insert({
      full_name: registerName, email: registerEmail, phone: registerPhone || null, password: registerPassword,
      specialty: registerSpecialty || null, bio: registerBio || null, avatar_url: avatarUrl,
      is_active: true, is_admin: false,
    });
    if (error) setRegisterError(error.message);
    else {
      alert(t.registerSuccess);
      setShowRegister(false);
      loadAllConsultants();
      setRegisterName(""); setRegisterEmail(""); setRegisterPhone(""); setRegisterPassword("");
      setRegisterSpecialty(""); setRegisterBio(""); setRegisterAvatar(null);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const { data, error } = await supabase.from("consultants").select("*").eq("email", loginEmail).eq("password", loginPassword).single();
    if (error || !data) setLoginError(t.loginError);
    else if (!data.is_active) setLoginError(t.accountFrozen);
    else {
      localStorage.setItem("user", JSON.stringify(data));
      setCurrentUser(data);
      navigate("/profile");
    }
  }

  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    setLocale(newLocale);
    localStorage.setItem("appLocale", newLocale);
  };

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <img src="/logo.png" alt="شعار" style={{ width: 90, cursor: "pointer", animation: "pulse 2s infinite" }} onClick={() => navigate("/")} />
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {currentUser?.is_admin && <button onClick={() => navigate("/admin")} style={{ background: "#8b5cf6", color: "#fff", padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}>{t.adminPanel}</button>}
          {!currentUser ? (
            <>
              <button onClick={() => setShowLogin(true)} style={{ background: "#2563eb", color: "#fff", padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}>{t.login}</button>
              <button onClick={() => window.location.href = "/signup"} style={{ background: "#f97316", color: "#fff", padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}>{t.signup}</button>
            </>
          ) : (
            <button onClick={() => { localStorage.removeItem("user"); setCurrentUser(null); navigate("/"); }} style={{ background: "#ef4444", color: "#fff", padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}>{t.logout}</button>
          )}
          <button onClick={toggleLanguage} style={{ background: "#f0f0f0", border: "none", borderRadius: 30, padding: "6px 12px", cursor: "pointer", fontWeight: "bold", fontSize: 14 }}>{locale === "ar" ? "🇸🇦 English" : "🇺🇸 العربية"}</button>
        </div>
      </div>

      {/* فلتر البلدان مع ترجمة أسماء الدول */}
      {countries.length > 0 && (
        <div style={{ padding: "12px 16px", backgroundColor: "#fff", borderBottom: "1px solid #eee" }}>
          <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontSize: 16 }}>
            <option value="">{t.allCountries}</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {getCountryName(country, locale)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* قائمة المستخدمين */}
      <div>
        {consultants.map(c => (
          <div key={c.id} onClick={() => { localStorage.setItem("viewUser", JSON.stringify(c)); navigate(currentUser && c.id === currentUser.id ? "/profile" : "/public-profile"); }}
            style={{ backgroundColor: "#fff", marginBottom: 12, padding: 16, borderBottom: "1px solid #eee", display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", background: "#eee", flexShrink: 0 }}>
              {c.avatar_url ? <img src={c.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 2 }}>{c.full_name}</div>
              <div style={{ color: "#666", fontSize: 13, marginBottom: 2 }}>{c.specialty || t.noSpecialty}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{followersMap[c.id] || 0} {t.followers}</div>
              {c.country_name && <div style={{ fontSize: 12, color: "#22c55e", marginTop: 2 }}>📍 {getCountryName(c.country_name, locale)}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* نوافذ تسجيل الدخول والتسجيل (نفس السابق) */}
      {showLogin && (
        <div style={overlay}>
          <div style={modal}>
            <h2>{t.loginTitle}</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder={t.email} value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={input} />
              <input type="password" placeholder={t.password} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={input} />
              {loginError && <div style={{ color: "red", marginBottom: 10 }}>{loginError}</div>}
              <button type="submit" style={btnOrange}>{t.loginBtn}</button>
              <button type="button" onClick={async () => { if (!loginEmail) { alert(t.email); return; } const { data } = await supabase.from("consultants").select("password").eq("email", loginEmail).single(); alert(data ? `Password: ${data.password}` : t.email); }} style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer", marginTop: 10, width: "100%" }}>{t.forgotPassword}</button>
            </form>
            <button onClick={() => setShowLogin(false)} style={{ ...btnRedSmall, marginTop: 10 }}>{t.close}</button>
          </div>
        </div>
      )}

      {showRegister && (
        <div style={overlay}>
          <div style={modal}>
            <h2>{t.registerTitle}</h2>
            <form onSubmit={handleRegister}>
              <input placeholder={t.fullName} value={registerName} onChange={e => setRegisterName(e.target.value)} style={input} />
              <input placeholder={t.email} value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} style={input} />
              <input placeholder={t.phone} value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} style={input} />
              <input type="password" placeholder={t.password} value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} style={input} />
              <input placeholder={t.specialty} value={registerSpecialty} onChange={e => setRegisterSpecialty(e.target.value)} style={input} />
              <textarea placeholder={t.bio} value={registerBio} onChange={e => setRegisterBio(e.target.value)} style={{ ...input, minHeight: 80 }} rows={3} />
              <input type="file" accept="image/*" onChange={e => setRegisterAvatar(e.target.files?.[0] || null)} style={input} />
              {registerError && <div style={{ color: "red", marginBottom: 10 }}>{registerError}</div>}
              <button type="submit" style={btnOrange}>{t.registerBtn}</button>
            </form>
            <button onClick={() => setShowRegister(false)} style={{ ...btnRedSmall, marginTop: 10 }}>{t.close}</button>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay: any = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modal: any = { background: "#fff", padding: 20, borderRadius: 12, width: 320 };
const input: any = { width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" };
const btnOrange: any = { background: "#f97316", color: "#fff", padding: 10, border: "none", width: "100%", borderRadius: 8, cursor: "pointer", fontWeight: "bold" };
const btnRedSmall: any = { background: "#ef4444", color: "#fff", padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer" };