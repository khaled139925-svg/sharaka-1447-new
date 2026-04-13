import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const categories = [
  "تقنية","تسويق","تصميم","تعليم","استشارات","قانون","محاسبة","صحة",
  "رياضة","تغذية","تطوير ذات","إدارة","برمجة","ذكاء اصطناعي","أمن سيبراني",
  "تجارة","عقارات","تصوير","مونتاج","كتابة","ترجمة","دعم فني","خدمة عملاء",
  "لوجستيات","صناعة محتوى","إعلانات","SEO","تحليل بيانات","هندسة","أخرى"
];

const users = [
  { name: "محمد أحمد", category: "تقنية" },
  { name: "شركة الإبداع", category: "تسويق" },
];

export default function Browse() {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate(); // 🔥 مهم

  return (
    <div className="page">

      {/* زر الرجوع */}
      <div className="home-btn" onClick={() => navigate("/")}>
        <Home size={22} />
      </div>

      {/* الأعلى */}
      <div className="top-bar">
        <button className="login">دخول</button>
        <button className="signup">تسجيل</button>
        <button className="about">من نحن</button>
      </div>

      {/* البحث */}
      <div className="search-box">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">اختر التخصص</option>

          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {selected === "أخرى" && (
          <input placeholder="اكتب تخصصك..." />
        )}
      </div>

      {/* البطاقات */}
      <div className="cards">
        {users.map((u, i) => (
          <div key={i} className="card">
            <div className="avatar"></div>

            <h3>{u.name}</h3>
            <p>{u.category}</p>

            {/* 🔥 هذا هو التعديل المهم */}
            <button
              className="details"
              onClick={() => navigate(`/profile/${u.name}`)}
            >
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}