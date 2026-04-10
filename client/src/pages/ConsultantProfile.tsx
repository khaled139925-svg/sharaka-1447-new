import { useNavigate } from "react-router-dom";

export default function ConsultantProfile() {
  const navigate = useNavigate();

  const user = {
    name: "أحمد محمد",
    email: "ahmed@mail.com",
    phone: "123456789",
    country: "السعودية",
    city: "الرياض",
    image: "https://via.placeholder.com/150",

    services: ["متجر", "جلسات استشارية"],

    bio: "مطور مواقع وخبير تقني",

    contact: {
      whatsapp: "123456",
      phone: "123456",
      email: "ahmed@mail.com",
      other: "Telegram",
    },

    links: {
      website: "example.com",
      linkedin: "linkedin.com",
      instagram: "instagram.com",
      youtube: "youtube.com",
      tiktok: "tiktok.com",
      telegram: "telegram.com",
      snapchat: "snapchat.com",
    },

    ads: [
      {
        title: "تصميم موقع",
        description: "تصميم احترافي",
        price: "500$",
        contact: "123456",
      },
    ],

    payments: [
      { method: "تحويل بنكي", details: "IBAN XXXXX" },
      { method: "STC Pay", details: "05555555" },
    ],
  };

  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      
      <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
        ← رجوع
      </div>

      <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        🏠 الرئيسية
      </div>

      <img src={user.image} style={{ width: "120px", borderRadius: "50%" }} />

      <h2>{user.name}</h2>
      <p>{user.country} - {user.city}</p>

      <h3>الخدمات</h3>
      {user.services.map((s, i) => (
        <p key={i}>🔹 {s}</p>
      ))}

      <h3>نبذة</h3>
      <p>{user.bio}</p>

      <h3>طرق الاتصال</h3>
      <p>واتساب: {user.contact.whatsapp}</p>
      <p>هاتف: {user.contact.phone}</p>
      <p>بريد: {user.contact.email}</p>

      <h3>الروابط</h3>
      {Object.entries(user.links).map(([k, v]) => (
        <p key={k}>{k}: {v}</p>
      ))}

      <h3>الإعلانات</h3>
      {user.ads.map((ad, i) => (
        <div key={i}>
          <p>{ad.title}</p>
          <p>{ad.description}</p>
          <p>{ad.price}</p>
        </div>
      ))}

      <h3>طرق الدفع</h3>
      {user.payments.map((p, i) => (
        <p key={i}>{p.method} - {p.details}</p>
      ))}
    </div>
  );
}