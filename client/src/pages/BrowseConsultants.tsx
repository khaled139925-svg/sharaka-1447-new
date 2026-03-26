import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { MapPin, Award, DollarSign, ShoppingCart, Search, ChevronRight, X } from 'lucide-react';

interface Consultant {
  id: number;
  account_type: string;
  full_name: string;
  company_name: string;
  country: string;
  city: string;
  profile_image: string;
  specialty: string;
  sub_specialty: string;
  experience: string;
  bio: string;
  selected_services: string[];
  consulting_price: string;
  training_price: string;
  individual_price: string;
  workshop_price: string;
  products: any[];
}

export default function BrowseConsultants() {
  const navigate = useNavigate();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    fetchConsultants();
  }, []);

  useEffect(() => {
    filterConsultants();
  }, [searchTerm, selectedSpecialty, consultants]);

  const fetchConsultants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("خطأ في تحميل البيانات:", error);
    } else {
      setConsultants(data || []);
      const uniqueSpecialties = [...new Set(data?.map(c => c.specialty).filter(Boolean))];
      setSpecialties(uniqueSpecialties);
    }
    setLoading(false);
  };

  const filterConsultants = () => {
    let filtered = [...consultants];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        (c.full_name?.toLowerCase().includes(term)) ||
        (c.company_name?.toLowerCase().includes(term)) ||
        (c.specialty?.toLowerCase().includes(term)) ||
        (c.sub_specialty?.toLowerCase().includes(term))
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(c => c.specialty === selectedSpecialty);
    }

    setFilteredConsultants(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:image")) return url;
    const { data } = supabase.storage.from('profile_images').getPublicUrl(url);
    return data.publicUrl;
  };

  const getServiceName = (service: string) => {
    if (service === "consulting") return "جلسات استشارية";
    if (service === "training") return "دورات تدريبية";
    if (service === "products") return "متجر";
    if (service === "individual") return "جلسات فردية";
    if (service === "workshop") return "ورش عمل";
    return service;
  };

  const getServicePrice = (consultant: Consultant, service: string) => {
    if (service === "consulting") return consultant.consulting_price;
    if (service === "training") return consultant.training_price;
    if (service === "individual") return consultant.individual_price;
    if (service === "workshop") return consultant.workshop_price;
    return null;
  };

  const getCountryFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      "SA": "🇸🇦", "AE": "🇦🇪", "KW": "🇰🇼", "QA": "🇶🇦", "BH": "🇧🇭", "OM": "🇴🇲",
      "EG": "🇪🇬", "JO": "🇯🇴", "LB": "🇱🇧", "PS": "🇵🇸", "IQ": "🇮🇶", "YE": "🇾🇪",
      "TR": "🇹🇷", "PK": "🇵🇰", "ID": "🇮🇩", "MY": "🇲🇾", "GB": "🇬🇧", "US": "🇺🇸"
    };
    return flags[code] || "🌍";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        
        <button
          onClick={() => navigate(-1)}
          className="mb-4 md:mb-6 text-[#1976D2] hover:text-[#FF9800] flex items-center gap-1 transition text-sm md:text-base"
        >
          <ChevronRight size={18} />
          <span>رجوع</span>
        </button>

        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1976D2] mb-2 md:mb-3">
            تصفح المستشارين والخبراء
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            اختر المستشار المناسب لاحتياجاتك وتواصل معه مباشرة
          </p>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-3 md:p-6 mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block mb-1 md:mb-2 font-semibold text-gray-700 text-sm md:text-base">🔍 بحث</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو التخصص..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 p-2 md:p-3 pr-10 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9800] text-sm md:text-base"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 md:mb-2 font-semibold text-gray-700 text-sm md:text-base">📌 التخصص</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full border border-gray-300 p-2 md:p-3 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9800] text-sm md:text-base"
              >
                <option value="">جميع التخصصات</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4 md:mb-6 text-right">
          <p className="text-gray-500 text-sm md:text-base">
            <span className="font-bold text-[#FF9800]">{filteredConsultants.length}</span> مستشار/خبير
            {selectedSpecialty && (
              <span className="mr-2">في تخصص {selectedSpecialty}</span>
            )}
            {searchTerm && (
              <span className="mr-2">نتائج البحث "{searchTerm}"</span>
            )}
          </p>
        </div>

        {filteredConsultants.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-white rounded-xl md:rounded-2xl shadow-sm">
            <p className="text-gray-500 text-base md:text-lg">لا يوجد مستشارين</p>
            <button
              onClick={() => navigate("/consultant-signup")}
              className="mt-3 md:mt-4 bg-[#FF9800] text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl hover:bg-[#F57C00] transition text-sm md:text-base"
            >
              انضم كأول مستشار
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredConsultants.map((consultant) => (
              <div
                key={consultant.id}
                onClick={() => navigate(`/consultant/${consultant.id}`)}
                className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="h-28 md:h-32 bg-gradient-to-r from-[#1976D2] to-[#FF9800] relative">
                  {consultant.profile_image && (
                    <img
                      src={getImageUrl(consultant.profile_image) || ""}
                      alt={consultant.full_name || consultant.company_name}
                      className="w-full h-full object-cover opacity-30"
                    />
                  )}
                  <div className="absolute -bottom-6 md:-bottom-10 right-2 md:right-4">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white shadow-lg border-2 md:border-4 border-white overflow-hidden">
                      {consultant.profile_image ? (
                        <img
                          src={getImageUrl(consultant.profile_image) || ""}
                          alt="صورة"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xl md:text-3xl">
                          {consultant.account_type === "individual" ? "👤" : "🏢"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 md:pt-12 p-3 md:p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base md:text-xl font-bold text-gray-800 mb-0.5 md:mb-1">
                      {consultant.account_type === "individual" 
                        ? consultant.full_name || "مستشار"
                        : consultant.company_name || "منشأة"}
                    </h3>
                    {consultant.country && (
                      <span className="text-sm md:text-base" title={consultant.country}>
                        {getCountryFlag(consultant.country)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                    <span className="text-[#FF9800] font-semibold text-xs md:text-sm">{consultant.specialty || "تخصص غير محدد"}</span>
                    {consultant.sub_specialty && (
                      <span className="text-gray-400 text-xs">- {consultant.sub_specialty}</span>
                    )}
                  </div>

                  {(consultant.country || consultant.city) && (
                    <div className="flex items-center gap-1 md:gap-2 text-gray-500 text-xs md:text-sm mb-1 md:mb-2">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span>{consultant.city && consultant.city}{consultant.country && `، ${consultant.country}`}</span>
                    </div>
                  )}

                  {consultant.selected_services && consultant.selected_services.length > 0 && (
                    <div className="mt-2 md:mt-3 space-y-1">
                      {consultant.selected_services.slice(0, 2).map((service: string) => {
                        if (service === "products") {
                          return (
                            <div key={service} className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                              <ShoppingCart size={12} className="text-[#FF9800] md:w-4 md:h-4" />
                              <span>متجر</span>
                            </div>
                          );
                        } else {
                          const price = getServicePrice(consultant, service);
                          const serviceName = getServiceName(service);
                          if (price) {
                            return (
                              <div key={service} className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                                <DollarSign size={12} className="text-green-600 md:w-4 md:h-4" />
                                <span>{serviceName}: {price} ريال/ساعة</span>
                              </div>
                            );
                          }
                          return null;
                        }
                      })}
                      {consultant.selected_services.length > 2 && (
                        <div className="text-xs text-gray-400">+{consultant.selected_services.length - 2} خدمات أخرى</div>
                      )}
                    </div>
                  )}

                  {consultant.experience && (
                    <div className="flex items-center gap-1 md:gap-2 text-gray-500 text-xs md:text-sm mt-2 md:mt-3">
                      <Award size={12} className="text-[#FF9800] md:w-4 md:h-4" />
                      <span>{consultant.experience} سنوات خبرة</span>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/consultant/${consultant.id}`);
                    }}
                    className="w-full bg-[#1976D2] text-white py-1.5 md:py-2 rounded-lg md:rounded-xl hover:bg-[#1565C0] transition font-medium text-xs md:text-sm mt-1 md:mt-2"
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