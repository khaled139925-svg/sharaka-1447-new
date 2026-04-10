import React from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      {/* رجوع */}
      <button
        onClick={() => window.history.back()}
        style={{
          background: "none",
          border: "none",
          color: "#1976D2",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        ← رجوع
      </button>

      {/* بيانات المستخدم (مؤقتة) */}
      <h2>اسم المستخدم</h2>
      <p>التخصص</p>

      {/* النبذة */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "#1976D2" }}>نبذة</h3>
        <p>كل التفاصيل التي كتبها المستخدم تظهر هنا...</p>
      </div>

      {/* زر مراسلة */}
      <button
        style={{
          marginTop: "30px",
          background: "#E6E6FA",
          color: "#333",
          padding: "12px",
          border: "none",
          borderRadius: "10px",
          width: "100%",
          cursor: "pointer",
        }}
      >
        💬 مراسلة صاحب الحساب
      </button>
    </div>
  );
};

export default Profile;