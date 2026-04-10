import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  type: "فرد" | "منشأة";
  specialty: string;
  image: string;
  hasStore: boolean;
  hasSessions: boolean;
};

const SPECIALTIES = [
  "الحج والعمرة",
  "التقنية",
  "التسويق",
  "التصميم",
  "التعليم",
];

const USERS: User[] = [
  {
    id: 1,
    name: "محمد أحمد",
    type: "فرد",
    specialty: "التقنية",
    image: "https://via.placeholder.com/150",
    hasStore: true,
    hasSessions: true,
  },
  {
    id: 2,
    name: "شركة الإبداع",
    type: "منشأة",
    specialty: "التسويق",
    image: "https://via.placeholder.com/150",
    hasStore: false,
    hasSessions: true,
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("");

  const filtered =
    selected === "" ? USERS : USERS.filter((u) => u.specialty === selected);

  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      {/* رجوع */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#1976D2",
          marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        ← رجوع
      </button>

      {/* تصفح الجميع */}
      <button
        onClick={() => setSelected("")}
        style={{
          width: "100%",
          padding: "12px",
          background: "#1976D2",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          marginBottom: "15px",
        }}
      >
        تصفح الجميع
      </button>

      {/* القائمة المنسدلة */}
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <option value="">اختر التخصص</option>
        {SPECIALTIES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* أيقونات */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {SPECIALTIES.map((s) => (
          <div
            key={s}
            onClick={() => setSelected(s)}
            style={{
              padding: "15px",
              textAlign: "center",
              border: "1px solid #ddd",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "24px" }}>
              {s === "الحج والعمرة" ? "🕋" : "📁"}
            </div>
            <div>{s}</div>
          </div>
        ))}
      </div>

      {/* البطاقات */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "15px",
        }}
      >
        {filtered.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "15px",
              textAlign: "center",
            }}
          >
            <img
              src={user.image}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
              }}
            />

            <h3>{user.name}</h3>
            <p>{user.specialty}</p>

            <div>
              {user.hasStore && <span>متجر </span>}
              {user.hasSessions && <span>جلسات</span>}
            </div>

            <button
              onClick={() => navigate(`/profile/${user.id}`)}
              style={{
                marginTop: "10px",
                background: "#FF9800",
                color: "#fff",
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                width: "100%",
              }}
            >
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;