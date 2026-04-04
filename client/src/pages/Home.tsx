import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/globe-icon.png";

export default function Home() {
  const navigate = useNavigate();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  // أنماط الأزرار
  const orangeButtonStyle = {
    background: "#FF9800",
    color: "#fff",
    border: "2px solid #e68900",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s",
    fontWeight: "bold",
  };
  const blueButtonStyle = {
    ...orangeButtonStyle,
    background: "#1976D2",
    border: "2px solid #0d5ba0",
  };
  const smallOrangeButton = {
    ...orangeButtonStyle,
    padding: "6px 16px",
    fontSize: "14px",
  };
  const smallBlueButton = {
    ...blueButtonStyle,
    padding: "6px 16px",
    fontSize: "14px",
  };

  // حركة الشعار مع إزالة الخلفية البيضاء
  const logoAnimation = {
    animation: "logoOrbit 5s ease-in-out infinite",
    width: "250px",
    height: "auto",
    display: "block",
    margin: "0 auto 20px",
    mixBlendMode: "multiply",   // يزيل الخلفية البيضاء من الصورة
  };

  // الشعار الصغير داخل دائرة بيضاء
  const smallLogoContainer = {
    width: "50px",
    height: "50px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
  };
  const smallLogoStyle = {
    width: "35px",
    height: "auto",
  };

  // إضافة keyframes للحركة (احتياطي)
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes logoOrbit {
      0% { transform: rotate(0deg) translateY(0px) scale(1); }
      25% { transform: rotate(2deg) translateY(-8px) scale(1.03); }
      50% { transform: rotate(0deg) translateY(-14px) scale(1.06); }
      75% { transform: rotate(-2deg) translateY(-8px) scale(1.03); }
      100% { transform: rotate(0deg) translateY(0px) scale(1); }
    }
  `;
  document.head.appendChild(styleSheet);

  // إزالة أي هوامش من الجذر (تأكيد)
  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  // محتوى "من نحن" الكامل (اختصار للمساحة – يمكنك وضع النص الطويل هنا)
  const aboutFullText = `عن منصة شراكة
شراكة — منصة تجمع الخبرة والخدمة والمنتج في مكان واحد
... (ضع النص الكامل هنا) ...
تواصل معنا`;

  const paragraphs = aboutFullText.split("\n").filter(p => p.trim() !== "");
  const titles = [
    "عن منصة شراكة",
    "لماذا تعتبر شراكة منصة مختلفة؟",
    "من نحن",
    "الرؤية",
    "الرسالة",
    "أهداف المنصة",
    "قيم المنصة",
    "منصة تفتح أبوابها للجميع",
    "منصة تلبي احتياجات الحياة",
    "منصة تجمع الخبرة والخدمة والمنتج",
    "كيف تعمل المنصة",
    "الأسئلة الشائعة",
    "سياسة الخصوصية",
    "الشروط والأحكام",
    "إخلاء المسؤولية",
    "تواصل معنا"
  ];

  return (
    <div style={{ direction: "rtl", fontFamily: "Arabic Typesetting", margin: 0, padding: 0 }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 0,
      }}>
        <div style={smallLogoContainer} onClick={() => navigate("/")}>
          <img src={logo} alt="Sharaka" style={smallLogoStyle} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={smallOrangeButton} onClick={() => navigate("/consultant-signup")}>تسجيل</button>
          <button style={smallBlueButton} onClick={() => navigate("/login")}>دخول</button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "30px 20px",
      }}>
        <img src={logo} alt="Sharaka" style={logoAnimation} />
        <h1 style={{ fontSize: "48px", marginBottom: "15px", color: "#FF9800" }}>اعرض ما لديك… واحصل على ما تريد</h1>
        <p style={{ fontSize: "28px", maxWidth: "700px", lineHeight: "1.5", marginBottom: "12px", color: "#1976D2" }}>شريك نجاحك</p>
        <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
          <button style={orangeButtonStyle} onClick={() => navigate("/consultant-signup")}>انضم إلينا</button>
          <button style={blueButtonStyle} onClick={() => navigate("/browse")}>تصفح الخدمات</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#1976D2", color: "#fff", textAlign: "center", padding: "70px 20px" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "15px" }}>شراكة… منصة تجمع الخبرة والخدمة والفرص</h1>
        <p style={{ fontSize: "22px", maxWidth: "700px", margin: "0 auto 30px", lineHeight: "1.8" }}>
          في شراكة يستطيع الأفراد والمؤسسات عرض ما لديهم من معرفة أو خدمة أو منتج، كما يمكنهم الوصول إلى ما يحتاجون إليه من خبرة أو خدمة أو فرصة في مكان واحد.
        </p>
        <button style={orangeButtonStyle} onClick={() => setAboutModalOpen(true)}>من نحن</button>
      </div>

      {/* Modal من نحن */}
      {aboutModalOpen && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1000,
          }}
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            style={{
              background: "#fff", width: "90%", maxWidth: "800px", maxHeight: "90%",
              borderRadius: "12px", overflow: "auto", padding: "20px", position: "relative",
              direction: "rtl",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAboutModalOpen(false)}
              style={{ position: "absolute", top: "10px", left: "10px", background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
            >
              ✕
            </button>
            <h2 style={{ textAlign: "center", color: "#FF9800", marginBottom: "20px" }}>من نحن</h2>
            <div style={{ lineHeight: "1.8" }}>
              {paragraphs.map((p, idx) => {
                const isTitle = titles.includes(p.trim());
                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "16px",
                      fontWeight: isTitle ? "bold" : "normal",
                      fontSize: isTitle ? "1.5rem" : "1rem",
                      color: isTitle ? "#1976D2" : "#333",
                      textAlign: "justify",
                    }}
                  >
                    {p}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button style={orangeButtonStyle} onClick={() => setContactModalOpen(true)}>تواصل معنا</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal تواصل */}
      {contactModalOpen && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1100,
          }}
          onClick={() => setContactModalOpen(false)}
        >
          <div
            style={{
              background: "#fff", width: "90%", maxWidth: "500px", borderRadius: "12px",
              padding: "20px", position: "relative", direction: "rtl",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setContactModalOpen(false)}
              style={{ position: "absolute", top: "10px", left: "10px", background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
            >
              ✕
            </button>
            <h2 style={{ textAlign: "center", color: "#FF9800", marginBottom: "20px" }}>تواصل معنا</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input
                type="text"
                placeholder="الاسم"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
              />
              <textarea
                placeholder="الرسالة"
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
              />
              <button
                style={orangeButtonStyle}
                onClick={() => {
                  alert("تم إرسال رسالتك (سيتم تفعيل الإرسال لاحقاً)");
                  setContactModalOpen(false);
                }}
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}