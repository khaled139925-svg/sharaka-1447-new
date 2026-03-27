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
  DollarSign
} from "lucide-react";
import ContactModal from "../components/ContactModal";

interface Consultant {
  id: string;
  account_type: string;
  full_name: string;
  company_name: string;
  specialty: string;
  sub_specialty: string;
  experience: string;
  country: string;
  city: string;
  profile_image: string;
  bio: string;
  selected_services?: string[];
  consulting_price?: string;
  training_price?: string;
  individual_price?: string;
  workshop_price?: string;
}

const SPECIALTIES = [
  { name: "الاستشارات", icon: Brain },
  { name: "التعليم والتدريب", icon: GraduationCap },
  { name: "التقنية والبرمجة", icon: Code },
  { name: "التصميم والإبداع", icon: Palette },
  { name: "الإعلام وصناعة المحتوى", icon: Camera },
  { name: "التسويق والتجارة", icon: TrendingUp },
  { name: "الإدارة وريادة الأعمال", icon: Briefcase },
  { name: "القانون والمحاماة", icon: Scale },
  { name: "الطب والصحة", icon: Stethoscope },
  { name: "الصحة النفسية", icon: Brain },
  { name: "الرياضة واللياقة", icon: Dumbbell },
  { name: "التغذية والطبخ", icon: Utensils },
  { name: "الجمال والعناية", icon: Sparkles },
  { name: "الأسرة والتربية", icon: Users },
  { name: "الطفولة", icon: Baby },
  { name: "الشباب", icon: Rocket },
  { name: "الهوايات والفنون", icon: Palette },
  { name: "الأدب والشعر", icon: BookOpen },
  { name: "السفر والسياحة", icon: Plane },
  { name: "الحج والعمرة", icon: "🕋" },
  { name: "الفنادق والضيافة", icon: Hotel },
  { name: "التجارة الدولية", icon: Globe },
  { name: "الزراعة", icon: Leaf },
  { name: "تربية الحيوانات", icon: Heart },
  { name: "البيئة والطبيعة", icon: Leaf },
  { name: "المتاجر والتجارة الإلكترونية", icon: ShoppingCart },
  { name: "النقل والخدمات اللوجستية", icon: Ship },
  { name: "الاستثمار والمال", icon: TrendingUp },
  { name: "العقار", icon: HomeIcon },
  { name: "أنشطة متنوعة", icon: Sparkles },
];

interface HomeProps {
  onNavigate?: (page: "home" | "about" | "client-signup" | "consultant-signup") => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(false);

  let pressTimer: any;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && e.code === "KeyA") {
        e.preventDefault();
        navigate("/admin");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  const navigateTo = (page: string) => {
    if (page === "admin") navigate("/admin");
    else if (page === "admin-dashboard") navigate("/admin-dashboard");
    else if (page === "login") navigate("/login");
    else if (page === "browse") navigate("/browse");
    else onNavigate?.(page as any);
  };

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

  useEffect(() => {
    if (selectedSpecialty) {
      let filtered = consultants.filter(c => c.specialty === selectedSpecialty);
      setFilteredConsultants(filtered);
      setLoading(false);
    }
  }, [selectedSpecialty, consultants]);

  const handleSpecialtyClick = (specialtyName: string) => {
    setSelectedSpecialty(specialtyName);
    setLoading(true);
  };

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
      "TR": "🇹🇷", "PK": "🇵🇰", "ID": "🇮🇩", "MY": "🇲🇾", "GB": "🇬🇧", "US": "🇺🇸"
    };
    return flags[code] || "🌍";
  };

  if (!selectedSpecialty) {
    return (
      <div className="min-h-screen bg-white" dir="rtl">

        <header className="sticky top-0 z-50 bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <button className="text-3xl text-[#1976D2] mr-4" onClick={() => setShowMenu(!showMenu)}>☰</button>
            <div className="flex-1"></div>
            <button
              onMouseDown={() => { pressTimer = setTimeout(() => navigateTo("admin"), 5000); }}
              onMouseUp={() => clearTimeout(pressTimer)}
              onTouchStart={() => { pressTimer = setTimeout(() => navigateTo("admin"), 5000); }}
              onTouchEnd={() => clearTimeout(pressTimer)}
              className="px-3 py-2 text-sm font-semibold rounded-lg"
              style={{ color: "#1976D2", border: "2px solid #1976D2" }}
            >
              <Globe size={16} className="inline ml-1" />
            </button>
          </div>

          {showMenu && (
            <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowMenu(false)}>
              <div onClick={(e) => e.stopPropagation()} className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-[#FF9800]">القائمة</h2>
                  <button onClick={() => setShowMenu(false)} className="text-2xl hover:text-red-500">✕</button>
                </div>
                <button onClick={() => { setShowMenu(false); onNavigate?.("about"); }} className="flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-gray-100 transition">
                  <Info size={20} className="text-[#1976D2]" /><span className="font-medium">من نحن</span>
                </button>
                <button onClick={() => { setShowMenu(false); onNavigate?.("consultant-signup"); }} className="flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-gray-100 transition">
                  <UserPlus size={20} className="text-[#FF9800]" /><span className="font-medium">انضم إلينا</span>
                </button>
                <button onClick={() => { setShowMenu(false); navigate("/login"); }} className="flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-gray-100 transition">
                  <LogIn size={20} className="text-[#1976D2]" /><span className="font-medium">تسجيل الدخول</span>
                </button>
              </div>
            </div>
          )}
        </header>

        <section className="pt-24 pb-10 text-center" style={{ backgroundColor: "#F5F5F5" }}>
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-2"><img src={logo} alt="Sharaka" className="logo-float" style={{ height: "200px", mixBlendMode: "multiply" }} /></div>
            <h2 className="text-4xl font-bold mb-2" style={{ color: "#FF9800" }}>اعرض ما لديك… واحصل على ما تريد</h2>
            <p className="text-xl" style={{ color: "#1976D2" }}>شريك نجاحك</p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <button onClick={() => onNavigate?.("consultant-signup")} className="w-60 bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-4 rounded-lg text-lg transition">انضم الآن</button>
              <button onClick={() => navigate("/browse")} className="w-60 bg-[#1976D2] hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition">👥 تصفح الجميع</button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {SPECIALTIES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} onClick={() => handleSpecialtyClick(s.name)} className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer">
                    <div className="w-full p-5 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                          {typeof s.icon === "string" ? <span className="text-2xl">{s.icon}</span> : <Icon size={30} className="text-[#1976D2]" />}
                        </div>
                      </div>
                      <h3 className="font-bold text-[#FF9800]">{s.name}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#1976D2] text-center text-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">شراكة… منصة تجمع الخبرة والخدمة والفرص</h2>
            <p className="text-lg leading-8 mb-8">في شراكة يستطيع الأفراد والمؤسسات عرض ما لديهم من معرفة أو خدمة أو منتج، كما يمكنهم الوصول إلى ما يحتاجون إليه من خبرة أو خدمة أو فرصة في مكان واحد.</p>
            <button
              onClick={() => setShowContact(true)}
              className="bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition"
            >
              تواصل معنا
            </button>
          </div>
        </section>

        <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6" dir="rtl">
      <div className="max-w-7xl mx-auto px-3">
        
        <button
          onClick={() => setSelectedSpecialty(null)}
          className="mb-4 text-[#1976D2] hover:text-[#FF9800] flex items-center gap-1"
        >
          <span>←</span>
          <span>العودة للتخصصات</span>
        </button>

        <h1 className="text-2xl font-bold text-center text-[#1976D2] mb-6">{selectedSpecialty}</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
          </div>
        ) : filteredConsultants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">لا يوجد مستشارين في هذا التخصص حالياً</p>
            <button onClick={() => onNavigate?.("consultant-signup")} className="mt-4 bg-[#FF9800] text-white px-6 py-2 rounded-lg">كن أول مستشار في هذا التخصص</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConsultants.map((consultant) => (
              <div
                key={consultant.id}
                onClick={() => navigate(`/consultant/${consultant.id}`)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
              >
                <div className="h-28 bg-gradient-to-r from-[#1976D2] to-[#FF9800] relative">
                  {consultant.profile_image && <img src={getImageUrl(consultant.profile_image)} alt="" className="w-full h-full object-cover opacity-30" />}
                  <div className="absolute -bottom-6 right-2">
                    <div className="w-12 h-12 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden">
                      {consultant.profile_image ? <img src={getImageUrl(consultant.profile_image)} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xl">{consultant.account_type === "individual" ? "👤" : "🏢"}</div>}
                    </div>
                  </div>
                </div>
                <div className="pt-8 p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-gray-800">{consultant.account_type === "individual" ? consultant.full_name || "مستشار" : consultant.company_name || "منشأة"}</h3>
                    {consultant.country && <span className="text-sm">{getCountryFlag(consultant.country)}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[#FF9800] font-semibold text-xs">{consultant.specialty || "تخصص"}</span>
                    {consultant.sub_specialty && <span className="text-gray-400 text-xs">- {consultant.sub_specialty}</span>}
                  </div>
                  {(consultant.country || consultant.city) && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1"><MapPin size={10} /><span>{consultant.city && consultant.city}{consultant.country && `، ${consultant.country}`}</span></div>
                  )}
                  {consultant.experience && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1"><Award size={10} className="text-[#FF9800]" /><span>{consultant.experience} سنوات خبرة</span></div>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/consultant/${consultant.id}`); }} className="w-full bg-[#1976D2] text-white py-1.5 rounded-lg hover:bg-[#1565C0] transition text-xs mt-2">عرض التفاصيل</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}