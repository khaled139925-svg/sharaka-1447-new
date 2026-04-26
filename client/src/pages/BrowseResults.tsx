import { useNavigate, useParams } from "react-router-dom";

export default function BrowseResults() {
  const navigate = useNavigate();
  const { category } = useParams();

  const data = [
    {
      id: 1,
      name: "أحمد محمد",
      country: "السعودية",
      city: "الرياض",
      image: "https://via.placeholder.com/150",
      specialty: "التقنية والبرمجة",
      services: ["متجر", "جلسات استشارية"],
    },
    {
      id: 2,
      name: "سارة",
      country: "الإمارات",
      city: "دبي",
      image: "https://via.placeholder.com/150",
      specialty: "التسويق والتجارة",
      services: ["جلسات فردية"],
    },
  ];

  const filtered =
    category === "all"
      ? data
      : data.filter((item) => item.specialty === category);

  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      
      {/* رجوع */}
      <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
        ← رجوع
      </div>

      {/* الرئيسية */}
      <div
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", marginBottom: "20px" }}
      >
        🏠 الرئيسية
      </div>

      {/* البطاقات */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={item.image}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
              }}
            />

            <h3>{item.name}</h3>
            <p>{item.country} - {item.city}</p>

            {/* الخدمات */}
            <div>
              {item.services.map((s, i) => (
                <span key={i}>🔹 {s} </span>
              ))}
            </div>

            <button
              onClick={() => navigate(`/consultant/${item.id}`)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                background: "#FF9800",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
              }}
            >
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}