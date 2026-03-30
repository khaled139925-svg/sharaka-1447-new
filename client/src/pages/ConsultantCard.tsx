import React from 'react';
import { useNavigate } from "react-router-dom";
import { MapPin, Award, DollarSign, ShoppingCart } from 'lucide-react';

interface ConsultantCardProps {
  consultant: any;
}

export default function ConsultantCard({ consultant }: ConsultantCardProps) {
  const navigate = useNavigate();

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:image")) return url;
    const { data } = supabase.storage.from('profile_images').getPublicUrl(url);
    return data.publicUrl;
  };

  const getCountryFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      "SA": "🇸🇦", "AE": "🇦🇪", "KW": "🇰🇼", "QA": "🇶🇦", "BH": "🇧🇭", "OM": "🇴🇲",
      "EG": "🇪🇬", "JO": "🇯🇴", "LB": "🇱🇧", "PS": "🇵🇸", "IQ": "🇮🇶", "YE": "🇾🇪",
      "SD": "🇸🇩", "LY": "🇱🇾", "TN": "🇹🇳", "DZ": "🇩🇿", "MA": "🇲🇦", "TR": "🇹🇷",
      "PK": "🇵🇰", "ID": "🇮🇩", "MY": "🇲🇾", "GB": "🇬🇧", "DE": "🇩🇪", "FR": "🇫🇷",
      "IT": "🇮🇹", "ES": "🇪🇸", "US": "🇺🇸", "CA": "🇨🇦", "RU": "🇷🇺"
    };
    return flags[code] || "🌍";
  };

  const getServiceName = (service: string) => {
    if (service === "consulting") return "جلسات استشارية";
    if (service === "training") return "دورات تدريبية";
    if (service === "products") return "متجر";
    if (service === "individual") return "جلسات فردية";
    if (service === "workshop") return "ورش عمل";
    return service;
  };

  const getServicePrice = (service: string) => {
    if (service === "consulting") return consultant.consulting_price;
    if (service === "training") return consultant.training_price;
    if (service === "individual") return consultant.individual_price;
    if (service === "workshop") return consultant.workshop_price;
    return null;
  };

  return (
    <div
      onClick={() => navigate(`/consultant/${consultant.id}`)}
      className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* صورة الغلاف */}
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

      {/* محتوى البطاقة */}
      <div className="pt-8 md:pt-12 p-3 md:p-5">
        {/* الاسم والدولة */}
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
        
        {/* التخصص */}
        <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
          <span className="text-[#FF9800] font-semibold text-xs md:text-sm">{consultant.specialty || "تخصص غير محدد"}</span>
          {consultant.sub_specialty && (
            <span className="text-gray-400 text-xs">- {consultant.sub_specialty}</span>
          )}
        </div>

        {/* الموقع */}
        {(consultant.country || consultant.city) && (
          <div className="flex items-center gap-1 md:gap-2 text-gray-500 text-xs md:text-sm mb-1 md:mb-2">
            <MapPin size={12} className="md:w-4 md:h-4" />
            <span>{consultant.city && consultant.city}{consultant.country && `، ${consultant.country}`}</span>
          </div>
        )}

        {/* الخدمات المختصرة (جلسات ومتجر) */}
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
                const price = getServicePrice(service);
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

        {/* الخبرة */}
        {consultant.experience && (
          <div className="flex items-center gap-1 md:gap-2 text-gray-500 text-xs md:text-sm mt-2 md:mt-3">
            <Award size={12} className="text-[#FF9800] md:w-4 md:h-4" />
            <span>{consultant.experience} سنوات خبرة</span>
          </div>
        )}

        {/* زر التفاصيل */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/consultant/${consultant.id}`);
          }}
          className="w-full bg-[#1976D2] text-white py-1.5 md:py-2 rounded-lg md:rounded-xl hover:bg-[#1565C0] transition font-medium text-xs md:text-sm mt-2 md:mt-3"
        >
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
}