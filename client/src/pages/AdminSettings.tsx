import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminSettings() {
  const navigate = useNavigate();
  const [price, setPrice] = useState(0);
  const [durationDays, setDurationDays] = useState(365);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.is_admin) {
      alert("ليس لديك صلاحية للوصول إلى هذه الصفحة");
      navigate("/");
      return;
    }
    setIsAdmin(true);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("subscription_settings")
      .select("price, duration_days")
      .eq("id", 1)
      .single();
    if (data) {
      setPrice(data.price);
      setDurationDays(data.duration_days);
    }
  };

  const updateSettings = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("subscription_settings")
      .upsert({ id: 1, price, duration_days: durationDays });
    if (error) {
      alert("❌ فشل التحديث: " + error.message);
    } else {
      alert("✅ تم تحديث سعر الاشتراك والمدة بنجاح");
    }
    setLoading(false);
  };

  if (!isAdmin) return null;

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <div style={card}>
        <h2>إعدادات الاشتراك</h2>
        <div style={{ marginBottom: 15 }}>
          <label style={labelStyle}>سعر الاشتراك (ريال)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={labelStyle}>مدة الاشتراك (أيام)</label>
          <input
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <button onClick={updateSettings} disabled={loading} style={btnBlue}>
          {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
        <button onClick={() => navigate("/")} style={btnRed}>
          رجوع
        </button>
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
};
const labelStyle = { display: "block", marginBottom: 5, fontWeight: "bold" };
const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};
const btnBlue = {
  background: "#3b82f6",
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  marginRight: 10,
};
const btnRed = {
  background: "#ef4444",
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 10,
};