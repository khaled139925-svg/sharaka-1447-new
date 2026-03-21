import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Consultant {
  id: string;
  full_name: string;
  specialty: string | null;
  sub_specialty: string | null;
  bio: string | null;
  profile_image: string | null;
  email: string | null;
  phone: string | null;
}

export default function BrowseConsultants() {
  const navigate = useNavigate();

  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("consultants")
      .select("*");

    console.log("📦 البيانات:", data);
    console.log("❌ الخطأ:", error);

    if (error) {
      setError(error.message);
    } else {
      setConsultants(data || []);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>حدث خطأ: {error}</p>
      </div>
    );
  }

  if (consultants.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">⚠️ لا يوجد مستشارون حتى الآن.</p>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">

      {/* زر رجوع */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 bg-gray-300 px-4 py-2 rounded"
      >
        ← رجوع
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {consultants.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >

            {/* الصورة */}
            <div className="h-48 bg-gray-200">
              {c.profile_image ? (
                <img
                  src={c.profile_image}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/no-image.png";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  لا توجد صورة
                </div>
              )}
            </div>

            {/* المحتوى */}
            <div className="p-4">

              <h2 className="text-[#1976D2] font-bold text-xl mb-1">
                {c.full_name}
              </h2>

              <p className="text-gray-500 text-sm mb-2">
                {c.specialty || "بدون تخصص"}
                {c.sub_specialty && ` - ${c.sub_specialty}`}
              </p>

              <p className="text-gray-600 line-clamp-3 mb-4">
                {c.bio || "لا يوجد وصف"}
              </p>

              <button
                onClick={() => navigate(`/consultant/${c.id}`)}
                className="w-full bg-[#FF9800] hover:bg-[#f57c00] text-white font-bold py-2 rounded-lg transition"
              >
                التفاصيل
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}