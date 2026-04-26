import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Home() {
  const navigate = useNavigate();
  const [consultants, setConsultants] = useState<any[]>([]);
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

  useEffect(() => {
    loadConsultants();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const map: any = {};
    consultants.forEach(c => {
      const key = `follow_${c.id}`;
      if (localStorage.getItem(key) === "true") {
        map[c.id] = 1;
      } else {
        map[c.id] = 0;
      }
    });
    setFollowersMap(map);
  }, [consultants]);

  async function loadConsultants() {
    const { data } = await supabase.from("consultants").select("*").eq("is_active", true);
    setConsultants(data || []);
  }

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
      setRegisterError("الاسم والإيميل وكلمة المرور إجبارية");
      return;
    }

    const { data: existingUser } = await supabase
      .from("consultants")
      .select("email")
      .eq("email", registerEmail)
      .maybeSingle();

    if (existingUser) {
      setRegisterError("هذا البريد مسجل مسبقًا");
      return;
    }

    let avatarUrl = null;
    if (registerAvatar) {
      avatarUrl = await uploadAvatar(registerAvatar);
      if (!avatarUrl) {
        setRegisterError("فشل رفع الصورة");
        return;
      }
    }

    const { error } = await supabase.from("consultants").insert([
      {
        full_name: registerName,
        email: registerEmail,
        phone: registerPhone || null,
        password: registerPassword,
        specialty: registerSpecialty || null,
        bio: registerBio || null,
        avatar_url: avatarUrl,
        is_active: true,
        is_admin: false,
      },
    ]);

    if (error) {
      setRegisterError(error.message);
    } else {
      alert("تم التسجيل بنجاح");
      setShowRegister(false);
      loadConsultants();
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPhone("");
      setRegisterPassword("");
      setRegisterSpecialty("");
      setRegisterBio("");
      setRegisterAvatar(null);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .eq("email", loginEmail)
      .eq("password", loginPassword)
      .single();

    if (error || !data) {
      setLoginError("الإيميل أو كلمة المرور غير صحيحة");
    } else if (data.is_active === false) {
      setLoginError("هذا الحساب مجمد، رجاء التواصل مع الإدارة");
    } else {
      localStorage.setItem("user", JSON.stringify(data));
      setCurrentUser(data);
      navigate("/profile");
    }
  }

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
        padding: "20px 16px",
      }}>
        <img
          src="/logo.png"
          alt="شعار"
          style={{
            width: 90,
            height: "auto",
            mixBlendMode: "multiply",
            background: "transparent",
            animation: "pulse 2s infinite",
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        />

        <div style={{ display: "flex", gap: 12 }}>
          {currentUser?.is_admin && (
            <button onClick={() => navigate("/admin")} style={btnAdmin}>
              🛠️ لوحة التحكم
            </button>
          )}
          {!currentUser ? (
            <>
              <button onClick={() => setShowLogin(true)} style={btnBlueSmall}>دخول</button>
              <button onClick={() => window.location.href = "/signup"} style={btnOrangeSmall}>تسجيل</button>
            </>
          ) : (
            <button onClick={() => {
              localStorage.removeItem("user");
              setCurrentUser(null);
              navigate("/");
            }} style={btnRedSmall}>تسجيل خروج</button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: "40px auto", padding: "0 16px" }}>
        {consultants.map(c => (
          <div
            key={c.id}
            onClick={() => {
              localStorage.setItem("viewUser", JSON.stringify(c));
              if (currentUser && c.id === currentUser.id) {
                navigate("/profile");
              } else {
                navigate("/public-profile");
              }
            }}
            style={{
              background: "#fff",
              marginBottom: 20,
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              gap: 15,
              alignItems: "center",
              cursor: "pointer"
            }}
          >
            <div style={{ width: 70, height: 70, borderRadius: "50%", overflow: "hidden", background: "#eee" }}>
              {c.avatar_url ? <img src={c.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold" }}>{c.full_name}</div>
              <div style={{ color: "#666", fontSize: 13 }}>{c.specialty || "بدون تخصص"}</div>
              <div style={{ fontSize: 14 }}>{c.bio || "لا يوجد نبذة"}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 5 }}>{followersMap[c.id] || 0} متابع</div>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة تسجيل الدخول المنبثقة */}
      {showLogin && (
        <div style={overlay}>
          <div style={modal}>
            <h2>تسجيل الدخول</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={input} />
              <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={input} />
              {loginError && <div style={{ color: "red", marginBottom: 10 }}>{loginError}</div>}
              <button type="submit" style={btnOrange}>دخول</button>
              <button
                type="button"
                onClick={async () => {
                  if (!loginEmail) { alert("أدخل بريدك الإلكتروني أولاً"); return; }
                  const { data, error } = await supabase.from("consultants").select("password").eq("email", loginEmail).single();
                  if (error || !data) alert("البريد غير موجود");
                  else alert(`كلمة المرور: ${data.password}`);
                }}
                style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer", marginTop: "10px", width: "100%" }}
              >
                نسيت كلمة المرور؟
              </button>
            </form>
            <button onClick={() => setShowLogin(false)}>إغلاق</button>
          </div>
        </div>
      )}

      {/* نافذة التسجيل المنبثقة */}
      {showRegister && (
        <div style={overlay}>
          <div style={modal}>
            <h2>تسجيل</h2>
            <form onSubmit={handleRegister}>
              <input placeholder="الاسم" value={registerName} onChange={e => setRegisterName(e.target.value)} style={input} />
              <input placeholder="الإيميل" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} style={input} />
              <input placeholder="الجوال" value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} style={input} />
              <input type="password" placeholder="كلمة المرور" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} style={input} />
              <input placeholder="التخصص" value={registerSpecialty} onChange={e => setRegisterSpecialty(e.target.value)} style={input} />
              <textarea placeholder="نبذة" value={registerBio} onChange={e => setRegisterBio(e.target.value)} style={input} />
              <input type="file" onChange={e => setRegisterAvatar(e.target.files?.[0] || null)} />
              {registerError && <div style={{ color: "red" }}>{registerError}</div>}
              <button type="submit" style={btnOrange}>تسجيل</button>
            </form>
            <button onClick={() => setShowRegister(false)}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay: any = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal: any = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  width: 320,
};

const input: any = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const btnBlue: any = {
  background: "#2563eb",
  color: "#fff",
  padding: 10,
  border: "none",
  width: "100%",
  borderRadius: 8,
  cursor: "pointer",
};

const btnOrange: any = {
  background: "#f97316",
  color: "#fff",
  padding: 10,
  border: "none",
  width: "100%",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
};

const btnBlueSmall: any = {
  background: "#2563eb",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const btnOrangeSmall: any = {
  background: "#f97316",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const btnAdmin: any = {
  background: "#8b5cf6",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const btnRedSmall: any = {
  background: "#ef4444",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};