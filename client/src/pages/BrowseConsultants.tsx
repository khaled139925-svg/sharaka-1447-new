import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { MapPin, Award, DollarSign, ChevronRight } from 'lucide-react';

interface Consultant {
  id: string;
  account_type: string;
  full_name: string;
  company_name: string;
  specialty: string;
  sub_specialty: string;
  experience: string;
  price: string;
  currency: string;
  country: string;
  city: string;
  profile_image: string;
  bio: string;
}

export default function BrowseConsultants() {
  const navigate = useNavigate();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setConsultants(data);
    }
    setLoading(false);
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:image")) return url;
    const { data } = supabase.storage.from('profile_images').getPublicUrl(url);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* زر الرجوع */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1976D2] hover:text-[#FF9800] transition"
          >
            <ChevronRight size={20} />
            <span>رجوع</span>
          </button>
        </div>

        {/* البطاقات */}
        {consultants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">لا يوجد مستشارين حالياً</p>
            <button
              onClick={() => navigate("/consultant-signup")}
              className="mt-4 bg-[#FF9800] text-white px-6 py-2 rounded-xl hover:bg-[#F57C00] transition"
            >
              انضم كأول مستشار
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants.map((consultant) => (
              <div
                key={consultant.id}
                onClick={() => navigate(`/consultant/${consultant.id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                {/* صورة الغلاف */}
                <div className="h-32 bg-gradient-to-r from-[#1976D2] to-[#FF9800] relative">
                  {consultant.profile_image && (
                    <img
                      src={getImageUrl(consultant.profile_image) || ""}
                      alt={consultant.full_name || consultant.company_name}
                      className="w-full h-full object-cover opacity-30"
                    />
                  )}
                  <div className="absolute -bottom-10 right-4">
                    <div className="w-20 h-20 rounded-full bg-white shadow-lg border-4 border-white overflow-hidden">
                      {consultant.profile_image ? (
                        <img
                          src={getImageUrl(consultant.profile_image) || ""}
                          alt="صورة"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-3xl">
                          {consultant.account_type === "individual" ? "👤" : "🏢"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* محتوى البطاقة */}
                <div className="pt-12 p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {consultant.account_type === "individual" 
                      ? consultant.full_name || "مستشار"
                      : consultant.company_name || "منشأة"}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#FF9800] font-semibold">{consultant.specialty || "تخصص غير محدد"}</span>
                    {consultant.sub_specialty && (
                      <span className="text-gray-400 text-sm">- {consultant.sub_specialty}</span>
                    )}
                  </div>

                  {(consultant.country || consultant.city) && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <MapPin size={14} />
                      <span>{consultant.city && consultant.city}{consultant.country && `، ${consultant.country}`}</span>
                    </div>
                  )}

                  {consultant.experience && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <Award size={14} className="text-[#FF9800]" />
                      <span>{consultant.experience} سنوات خبرة</span>
                    </div>
                  )}

                  {consultant.price && (
                    <div className="flex items-center gap-2 text-green-600 font-semibold mb-3">
                      <DollarSign size={14} />
                      <span>{consultant.price} {consultant.currency || "ريال"}/ساعة</span>
                    </div>
                  )}

                  {consultant.bio && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {consultant.bio.length > 100 ? consultant.bio.substring(0, 100) + "..." : consultant.bio}
                    </p>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/consultant/${consultant.id}`);
                    }}
                    className="w-full bg-[#1976D2] text-white py-2 rounded-xl hover:bg-[#1565C0] transition font-medium"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}