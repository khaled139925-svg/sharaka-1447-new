import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { MapPin, Award, DollarSign, ShoppingCart } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";

interface ConsultantCardProps {
  consultant: any;
}

const COUNTRIES = [
  { code: "SA", nameAr: "السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦" },
  { code: "AE", nameAr: "الإمارات", nameEn: "UAE", flag: "🇦🇪" },
  { code: "KW", nameAr: "الكويت", nameEn: "Kuwait", flag: "🇰🇼" },
  { code: "QA", nameAr: "قطر", nameEn: "Qatar", flag: "🇶🇦" },
  { code: "BH", nameAr: "البحرين", nameEn: "Bahrain", flag: "🇧🇭" },
  { code: "OM", nameAr: "عمان", nameEn: "Oman", flag: "🇴🇲" },
  { code: "EG", nameAr: "مصر", nameEn: "Egypt", flag: "🇪🇬" },
  { code: "JO", nameAr: "الأردن", nameEn: "Jordan", flag: "🇯🇴" },
  { code: "LB", nameAr: "لبنان", nameEn: "Lebanon", flag: "🇱🇧" },
  { code: "PS", nameAr: "فلسطين", nameEn: "Palestine", flag: "🇵🇸" },
  { code: "IQ", nameAr: "العراق", nameEn: "Iraq", flag: "🇮🇶" },
  { code: "YE", nameAr: "اليمن", nameEn: "Yemen", flag: "🇾🇪" },
  { code: "SD", nameAr: "السودان", nameEn: "Sudan", flag: "🇸🇩" },
  { code: "LY", nameAr: "ليبيا", nameEn: "Libya", flag: "🇱🇾" },
  { code: "TN", nameAr: "تونس", nameEn: "Tunisia", flag: "🇹🇳" },
  { code: "DZ", nameAr: "الجزائر", nameEn: "Algeria", flag: "🇩🇿" },
  { code: "MA", nameAr: "المغرب", nameEn: "Morocco", flag: "🇲🇦" },
  { code: "TR", nameAr: "تركيا", nameEn: "Turkey", flag: "🇹🇷" },
  { code: "PK", nameAr: "باكستان", nameEn: "Pakistan", flag: "🇵🇰" },
  { code: "ID", nameAr: "إندونيسيا", nameEn: "Indonesia", flag: "🇮🇩" },
  { code: "MY", nameAr: "ماليزيا", nameEn: "Malaysia", flag: "🇲🇾" },
  { code: "GB", nameAr: "بريطانيا", nameEn: "UK", flag: "🇬🇧" },
  { code: "DE", nameAr: "ألمانيا", nameEn: "Germany", flag: "🇩🇪" },
  { code: "FR", nameAr: "فرنسا", nameEn: "France", flag: "🇫🇷" },
  { code: "IT", nameAr: "إيطاليا", nameEn: "Italy", flag: "🇮🇹" },
  { code: "ES", nameAr: "إسبانيا", nameEn: "Spain", flag: "🇪🇸" },
  { code: "US", nameAr: "أمريكا", nameEn: "USA", flag: "🇺🇸" },
  { code: "CA", nameAr: "كندا", nameEn: "Canada", flag: "🇨🇦" },
  { code: "RU", nameAr: "روسيا", nameEn: "Russia", flag: "🇷🇺" },
];

export default function ConsultantCard({ consultant }: ConsultantCardProps) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:image")) return url;
    const { data } = supabase.storage.from('profile_images').getPublicUrl(url);
    return data.publicUrl;
  };

  const getCountryFlag = (code: string) => {
    const country = COUNTRIES.find(c => c.code === code);
    return country?.flag || "🌍";
  };

  const getCountryName = (code: string) => {
    const country = COUNTRIES.find(c => c.code === code);
    if (!country) return code;
    return language === "ar" ? country.nameAr : country.nameEn;
  };

  const getServiceName = (service: string) => {
    const names: Record<string, { ar: string; en: string }> = {
      consulting: { ar: "جلسات استشارية", en: "Consulting" },
      training: { ar: "دورات تدريبية", en: "Training" },
      products: { ar: "متجر", en: "Store" },
      individual: { ar: "جلسات فردية", en: "Individual" },
      workshop: { ar: "ورش عمل", en: "Workshop" },
    };
    return names[service]?.[language] || service;
  };

  const getServicePrice = (service: string) => {
    if (service === "consulting") return consultant.consulting_price;
    if (service === "training") return consultant.training_price;
    if (service === "individual") return consultant.individual_price;
    if (service === "workshop") return consultant.workshop_price;
    return null;
  };

  const serviceOrder = ["consulting", "training", "individual", "workshop", "products"];

  return (
    <div
      onClick={() => navigate(`/consultant/${consultant.id}`)}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
    >
      <div className="h-28 bg-gradient-to-r from-[#1976D2] to-[#FF9800] relative">
        {consultant.profile_image && (
          <img src={getImageUrl(consultant.profile_image)} alt="" className="w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute -bottom-6 right-2">
          <div className="w-12 h-12 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden">
            {consultant.profile_image ? (
              <img src={getImageUrl(consultant.profile_image)} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xl">
                {consultant.account_type === "individual" ? "👤" : "🏢"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 p-3">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-bold text-gray-800">
            {consultant.account_type === "individual" 
              ? consultant.full_name || "مستشار"
              : consultant.company_name || "منشأة"}
          </h3>
          {consultant.country && (
            <span className="text-sm" title={getCountryName(consultant.country)}>
              {getCountryFlag(consultant.country)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[#FF9800] font-semibold text-xs">{consultant.specialty || t.services}</span>
          {consultant.sub_specialty && (
            <span className="text-gray-400 text-xs">- {consultant.sub_specialty}</span>
          )}
        </div>

        {(consultant.country || consultant.city) && (
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
            <MapPin size={10} />
            <span>{consultant.city && consultant.city}{consultant.country && `، ${getCountryName(consultant.country)}`}</span>
          </div>
        )}

        {consultant.selected_services && consultant.selected_services.length > 0 && (
          <div className="mt-2 space-y-1">
            {serviceOrder
              .filter(service => consultant.selected_services.includes(service))
              .map((service) => {
                if (service === "products") {
                  return (
                    <div key={service} className="flex items-center gap-1 text-xs text-gray-600">
                      <ShoppingCart size={10} className="text-[#FF9800]" />
                      <span>{getServiceName(service)}</span>
                    </div>
                  );
                } else {
                  const price = getServicePrice(service);
                  const serviceName = getServiceName(service);
                  if (price) {
                    return (
                      <div key={service} className="flex items-center gap-1 text-xs text-gray-600">
                        <DollarSign size={10} className="text-green-600" />
                        <span>{serviceName}: {price} ريال/ساعة</span>
                      </div>
                    );
                  }
                  return (
                    <div key={service} className="flex items-center gap-1 text-xs text-gray-600">
                      <span>{serviceName}</span>
                    </div>
                  );
                }
              })}
          </div>
        )}

        {consultant.experience && (
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
            <Award size={10} className="text-[#FF9800]" />
            <span>{consultant.experience} {t.experience}</span>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/consultant/${consultant.id}`); }}
          className="w-full bg-[#1976D2] text-white py-1.5 rounded-lg hover:bg-[#1565C0] transition text-xs mt-2"
        >
          {t.details}
        </button>
      </div>
    </div>
  );
}