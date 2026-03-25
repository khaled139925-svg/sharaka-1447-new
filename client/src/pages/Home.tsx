import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/globe-icon.png";
import {
  Globe,
  Dumbbell,
  Heart,
  GraduationCap,
  Code,
  Palette,
  Camera,
  Utensils,
  ShoppingCart,
  Briefcase,
  Scale,
  Plane,
  Leaf,
  Users,
  BookOpen,
  Home as HomeIcon,
  Sparkles,
  Baby,
  Rocket,
  Ship,
  TrendingUp,
  Brain,
  Stethoscope,
  Hotel,
  Info,
  UserPlus,
  LogIn,
  MapPin,
  Award,
  DollarSign,
  X
} from "lucide-react";

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

const SPECIALTIES = [
  { name: "الاستشارات", icon: Brain, subs: ["استشارات إدارية", "استشارات مالية", "استشارات قانونية", "استشارات مهنية", "استشارات أسرية"] },
  { name: "التعليم والتدريب", icon: GraduationCap, subs: ["الدورات التدريبية", "التعليم الأكاديمي", "التعليم عن بعد", "التدريب المهني", "التدريب القيادي"] },
  { name: "التقنية والبرمجة", icon: Code, subs: ["تطوير المواقع", "تطوير التطبيقات", "الذكاء الاصطناعي", "أمن المعلومات", "تحليل البيانات"] },
  { name: "التصميم والإبداع", icon: Palette, subs: ["تصميم الجرافيك", "تصميم الشعارات", "تصميم واجهات المستخدم", "التصميم الإعلاني"] },
  { name: "الإعلام وصناعة المحتوى", icon: Camera, subs: ["إنتاج الفيديو", "التصوير الفوتوغرافي", "صناعة المحتوى", "إدارة القنوات"] },
  { name: "التسويق والتجارة", icon: TrendingUp, subs: ["التسويق الرقمي", "إدارة الحملات الإعلانية", "التسويق عبر السوشيال ميديا", "تحليل السوق"] },
  { name: "الإدارة وريادة الأعمال", icon: Briefcase, subs: ["إدارة المشاريع", "ريادة الأعمال", "تطوير الأعمال", "التخطيط الاستراتيجي"] },
  { name: "القانون والمحاماة", icon: Scale, subs: ["الاستشارات القانونية", "القضايا التجارية", "القضايا المدنية", "التحكيم"] },
  { name: "الطب والصحة", icon: Stethoscope, subs: ["الاستشارات الطبية", "الصحة العامة", "الطب الوقائي", "التوجيه الصحي"] },
  { name: "الصحة النفسية", icon: Brain, subs: ["العلاج النفسي", "الإرشاد النفسي", "تنمية الشخصية", "الدعم النفسي"] },
  { name: "الرياضة واللياقة", icon: Dumbbell, subs: ["التدريب الرياضي", "اللياقة البدنية", "التغذية الرياضية", "التأهيل البدني"] },
  { name: "التغذية والطبخ", icon: Utensils, subs: ["الطبخ الاحترافي", "التغذية الصحية", "إعداد الوجبات", "المطابخ العالمية"] },
  { name: "الجمال والعناية", icon: Sparkles, subs: ["العناية بالبشرة", "العناية بالشعر", "التجميل", "الصحة الجمالية"] },
  { name: "الأسرة والتربية", icon: Users, subs: ["الإرشاد الأسري", "التربية", "العلاقات الأسرية", "تنمية الأطفال"] },
  { name: "الطفولة", icon: Baby, subs: ["تنمية الطفل", "تعليم الأطفال", "أنشطة الأطفال", "تربية الأطفال"] },
  { name: "الشباب", icon: Rocket, subs: ["تطوير المهارات", "العمل الحر", "بناء المستقبل", "التوجيه المهني"] },
  { name: "الهوايات والفنون", icon: Palette, subs: ["الرسم", "الموسيقى", "الحرف اليدوية", "الفنون الإبداعية"] },
  { name: "الأدب والشعر", icon: BookOpen, subs: ["الشعر", "الكتابة الأدبية", "النقد الأدبي", "تطوير مهارات الكتابة"] },
  { name: "السفر والسياحة", icon: Plane, subs: ["التخطيط للسفر", "السياحة العالمية", "المرشدون السياحيون", "برامج الرحلات"] },
  { name: "الحج والعمرة", icon: "🕋", subs: ["تنظيم رحلات الحج", "تنظيم رحلات العمرة", "الإرشاد الديني", "خدمات المعتمرين"] },
  { name: "الفنادق والضيافة", icon: Hotel, subs: ["إدارة الفنادق", "الضيافة", "تنظيم الفعاليات", "خدمات الضيافة"] },
  { name: "التجارة الدولية", icon: Globe, subs: ["الاستيراد والتصدير", "التجارة العالمية", "الشحن الدولي", "الأسواق العالمية"] },
  { name: "الزراعة", icon: Leaf, subs: ["الزراعة الحديثة", "المزارع", "الإنتاج الزراعي", "التقنيات الزراعية"] },
  { name: "تربية الحيوانات", icon: Heart, subs: ["تربية المواشي", "تربية الطيور", "رعاية الحيوانات", "الإنتاج الحيواني"] },
  { name: "البيئة والطبيعة", icon: Leaf, subs: ["الحفاظ على البيئة", "الاستدامة", "المشاريع البيئية", "الطبيعة"] },
  { name: "المتاجر والتجارة الإلكترونية", icon: ShoppingCart, subs: ["إنشاء المتاجر", "إدارة المتاجر", "التجارة الإلكترونية", "التسويق الإلكتروني"] },
  { name: "النقل والخدمات اللوجستية", icon: Ship, subs: ["الشحن", "النقل", "الخدمات اللوجستية", "إدارة سلاسل الإمداد"] },
  { name: "الاستثمار والمال", icon: TrendingUp, subs: ["الاستثمار", "الأسواق المالية", "التخطيط المالي", "إدارة الأموال"] },
  { name: "العقار", icon: HomeIcon, subs: ["بيع وشراء العقارات", "التأجير", "التطوير العقاري", "الاستثمار العقاري"] },
  { name: "أنشطة متنوعة", icon: Sparkles, subs: ["أفكار ومشاريع", "مبادرات مجتمعية", "أنشطة ثقافية", "أنشطة عامة"] },
];

const COUNTRIES = [
  { code: "SA", name: "السعودية", flag: "🇸🇦" },
  { code: "AE", name: "الإمارات", flag: "🇦🇪" },
  { code: "KW", name: "الكويت", flag: "🇰🇼" },
  { code: "QA", name: "قطر", flag: "🇶🇦" },
  { code: "BH", name: "البحرين", flag: "🇧🇭" },
  { code: "OM", name: "عمان", flag: "🇴🇲" },
  { code: "YE", name: "اليمن", flag: "🇾🇪" },
  { code: "EG", name: "مصر", flag: "🇪🇬" },
  { code: "JO", name: "الأردن", flag: "🇯🇴" },
  { code: "PK", name: "باكستان", flag: "🇵🇰" },
  { code: "TR", name: "تركيا", flag: "🇹🇷" },
  { code: "GB", name: "بريطانيا", flag: "🇬🇧" },
  { code: "DE", name: "ألمانيا", flag: "🇩🇪" },
  { code: "FR", name: "فرنسا", flag: "🇫🇷" },
  { code: "US", name: "أمريكا", flag: "🇺🇸" },
  { code: "CA", name: "كندا", flag: "🇨🇦" },
];

interface HomeProps {
  onNavigate?: (page: "home" | "about" | "client-signup" | "consultant-signup") => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const navigateTo = useNavigate();
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const [showCountries, setShowCountries] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(false);

  let pressTimer: any;

  const navigate = (page: string) => {
    if (page === "admin") window.location.href = "/admin";
  };

  // جلب المستشارين من قاعدة البيانات
  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setConsultants(data);
    }
  };

  // تصفية المستشارين حسب التخصص المختار
  useEffect(() => {
    if (selectedSpecialty) {
      const filtered = consultants.filter(c => c.specialty === selectedSpecialty);
      setFilteredConsultants(filtered);
      setLoading(false);
    } else {
      setFilteredConsultants([]);
    }
  }, [selectedSpecialty, consultants]);

  const handleSpecialtyClick = (specialtyName: string) => {
    setSelectedSpecialty(specialtyName);
    setLoading(true);
  };

  const closeCards = () => {
    setSelectedSpecialty(null);
    setFilteredConsultants([]);
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:image")) return url;
    const { data } = supabase.storage.from('profile_images').getPublicUrl(url);
    return data.publicUrl;
  };

  const isRTL = language === "ar";

  const translations = {
    ar: {
      title: "اعرض ما لديك… واحصل على ما تريد",
      english: "English",
      arabic: "العربية",
      backToSpecialties: "← العودة للتخصصات",
      noConsultants: "لا يوجد مستشارين في هذا التخصص حالياً",
    },
    en: {
      title: "Show what you have… get what you want",
      english: "English",
      arabic: "Arabic",
      backToSpecialties: "← Back to Specialties",
      noConsultants: "No consultants in this specialty yet",
    },
  };
  const t = translations[language];

  return (
    <div className={`min-h-screen bg-white ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>

      {/* ===== HEADER (نفس الكود الأصلي) ===== */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button className="text-3xl text-[#1976D2] mr-4" onClick={() => setShowMenu(!showMenu)}>
            ☰
          </button>
          <div className="flex-1"></div>
          <div className="relative mr-3">
            <button
              onMouseDown={() => { pressTimer = setTimeout(() => navigate("admin"), 5000); }}
              onMouseUp={() => clearTimeout(pressTimer)}
              onTouchStart={() => { pressTimer = setTimeout(() => navigate("admin"), 5000); }}
              onTouchEnd={() => clearTimeout(pressTimer)}
              onClick={() => setShowCountries(!showCountries)}
              className="px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 ml-2"
              style={{ color: "#1976D2", border: "2px solid #1976D2" }}
            >
              <Globe size={16} />
              {COUNTRIES.find(c => c.code === selectedCountry)?.flag}
            </button>
            {showCountries && (
              <div className="absolute top-full mt-2 bg-white border-2 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => { setSelectedCountry(country.code); setShowCountries(false); }}
                    className="w-full text-right px-4 py-2 hover:bg-blue-50"
                  >
                    {country.flag} {country.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="px-3 py-2 text-sm font-semibold rounded-lg"
            style={{ color: "#1976D2", border: "2px solid #1976D2" }}
          >
            {language === "ar" ? t.english : t.arabic}
          </button>
        </div>

        {/* القائمة الجانبية */}
        {showMenu && (
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowMenu(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className={`fixed top-0 ${language === "ar" ? "right-0" : "left-0"} w-80 h-full bg-white shadow-2xl p-6 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-[#FF9800]">القائمة</h2>
                <button onClick={() => setShowMenu(false)} className="text-2xl hover:text-red-500">✕</button>
              </div>
              <button
                onClick={() => { setShowMenu(false); onNavigate?.("about"); }}
                className="flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-gray-100 transition"
              >
                <Info size={20} className="text-[#1976D2]" />
                <span className="font-medium">من نحن</span>
              </button>
              <button
                onClick={() => { setShowMenu(false); onNavigate?.("consultant-signup"); }}
                className="flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-gray-100 transition"
              >
                <UserPlus size={20} className="text-[#FF9800]" />
                <span className="font-medium">انضم إلينا</span>
              </button>
              <button
  onClick={() => window.location.href = "/login"}
  className="flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-gray-100 transition"
>
  <LogIn size={20} className="text-[#1976D2]" />
  <span className="font-medium">تسجيل الدخول</span>
</button>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="pt-24 pb-10 text-center" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-2">
            <img src={logo} alt="Sharaka" className="logo-float" style={{ height: "200px", mixBlendMode: "multiply" }} />
          </div>
          <h2 className="text-4xl font-bold mb-2" style={{ color: "#FF9800" }}>
            {t.title}
          </h2>
          <p className="text-xl" style={{ color: "#1976D2" }}>شريك نجاحك</p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <button
              onClick={() => onNavigate?.("consultant-signup")}
              className="w-60 bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-4 rounded-lg text-lg transition"
            >
              انضم الآن
            </button>
            <button
              onClick={() => window.location.href = "/browse"}
              className="w-60 bg-[#1976D2] hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition"
            >
              👥 تصفح الجميع
            </button>
          </div>
        </div>
      </section>

      {/* ===== التخصصات ===== */}
      <section id="specialties" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          
          {/* زر العودة إذا كان هناك تخصص مختار */}
          {selectedSpecialty && (
            <div className="mb-6 text-right">
              <button
                onClick={closeCards}
                className="text-[#1976D2] hover:text-[#FF9800] flex items-center gap-2"
              >
                <span>←</span>
                <span>{t.backToSpecialties}</span>
              </button>
            </div>
          )}

          {/* عرض التخصصات أو البطاقات */}
          {!selectedSpecialty ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {SPECIALTIES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    onClick={() => handleSpecialtyClick(s.name)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
                  >
                    <div className="w-full p-5 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                          {typeof s.icon === "string"
                            ? <span className="text-2xl">{s.icon}</span>
                            : <Icon size={30} className="text-[#1976D2]" />
                          }
                        </div>
                      </div>
                      <h3 className="font-bold text-[#FF9800]">{s.name}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // عرض البطاقات حسب التخصص المختار
            <div>
              <h2 className="text-2xl font-bold text-[#1976D2] mb-6 text-center">
                {selectedSpecialty}
              </h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
                  <p className="mt-4 text-gray-600">جاري التحميل...</p>
                </div>
              ) : filteredConsultants.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-500 text-lg">{t.noConsultants}</p>
                  <button
                    onClick={() => onNavigate?.("consultant-signup")}
                    className="mt-4 bg-[#FF9800] text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition"
                  >
                    كن أول مستشار في هذا التخصص
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredConsultants.map((consultant) => (
                    <div
                      key={consultant.id}
                      onClick={() => navigateTo(`/consultant/${consultant.id}`)}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    >
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
                            navigateTo(`/consultant/${consultant.id}`);
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
          )}
        </div>
      </section>

      {/* ===== قسم عن شراكة ===== */}
      <section className="py-20 bg-[#1976D2] text-center text-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">شراكة… منصة تجمع الخبرة والخدمة والفرص</h2>
          <p className="text-lg leading-8 mb-8">
            في شراكة يستطيع الأفراد والمؤسسات عرض ما لديهم من معرفة أو خدمة أو منتج،
            كما يمكنهم الوصول إلى ما يحتاجون إليه من خبرة أو خدمة أو فرصة في مكان واحد.
          </p>
          <button
            onClick={() => setShowContact(true)}
            className="bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition"
          >
            تواصل معنا
          </button>
        </div>
      </section>

      {/* ===== MODAL: تواصل معنا ===== */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-2xl text-right">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1976D2]">تواصل معنا</h3>
              <button onClick={() => setShowContact(false)} className="text-xl hover:text-red-500">✕</button>
            </div>
            <input type="text" placeholder="الاسم" className="w-full border p-3 rounded mb-4" />
            <input type="email" placeholder="البريد الإلكتروني" className="w-full border p-3 rounded mb-4" />
            <textarea placeholder="الرسالة" rows={4} className="w-full border p-3 rounded mb-6" />
            <button className="w-full bg-[#FF9800] text-white py-3 rounded hover:bg-orange-500 transition">إرسال</button>
          </div>
        </div>
      )}

    </div>
  );
}