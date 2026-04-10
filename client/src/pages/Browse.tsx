import { useNavigate } from "react-router-dom";

const SPECIALTIES = [
  { name: "الاستشارات", icon: "🧠" },
  { name: "التعليم والتدريب", icon: "🎓" },
  { name: "التقنية والبرمجة", icon: "💻" },
  { name: "التصميم والإبداع", icon: "🎨" },
  { name: "الإعلام وصناعة المحتوى", icon: "📷" },
  { name: "التسويق والتجارة", icon: "📈" },
  { name: "الإدارة وريادة الأعمال", icon: "💼" },
  { name: "القانون والمحاماة", icon: "⚖️" },
  { name: "الطب والصحة", icon: "🩺" },
  { name: "الصحة النفسية", icon: "🧠" },
  { name: "الرياضة واللياقة", icon: "🏋️" },
  { name: "التغذية والطبخ", icon: "🍽️" },
  { name: "الجمال والعناية", icon: "✨" },
  { name: "الأسرة والتربية", icon: "👨‍👩‍👧" },
  { name: "الطفولة", icon: "👶" },
  { name: "الشباب", icon: "🚀" },
  { name: "الهوايات والفنون", icon: "🎨" },
  { name: "الأدب والشعر", icon: "📚" },
  { name: "السفر والسياحة", icon: "✈️" },
  { name: "الحج والعمرة", icon: "🕋" },
  { name: "الفنادق والضيافة", icon: "🏨" },
  { name: "التجارة الدولية", icon: "🌍" },
  { name: "الزراعة", icon: "🌱" },
  { name: "تربية الحيوانات", icon: "🐾" },
  { name: "البيئة والطبيعة", icon: "🌿" },
  { name: "المتاجر والتجارة الإلكترونية", icon: "🛒" },
  { name: "النقل والخدمات اللوجستية", icon: "🚢" },
  { name: "الاستثمار والمال", icon: "💰" },
  { name: "العقار", icon: "🏠" },
  { name: "أنشطة متنوعة", icon: "✨" },
];

export default function Browse() {
  const navigate = useNavigate();

  return (
    <div style={{ direction: "rtl", padding: "30px", textAlign: "center" }}>
      
      {/* 🏠 الرئيسية */}
      <div
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", marginBottom: "20px" }}
      >
        🏠 الرئيسية
      </div>

      {/* تصفح الجميع */}
      <button
        onClick={() => navigate("/browse/all")}
        style={{
          marginBottom: "30px",
          padding: "12px 25px",
          background: "#FF9800",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        تصفح الجميع
      </button>

      {/* الأيقونات */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))",
          gap: "15px",
        }}
      >
        {SPECIALTIES.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(`/browse/${item.name}`)}
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "30px" }}>{item.icon}</div>
            <div style={{ fontSize: "12px" }}>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}