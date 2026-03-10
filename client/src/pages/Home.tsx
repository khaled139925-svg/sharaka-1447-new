import { useState } from "react";
import {
  Star,
  Clock,
  Award,
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
  Music,
  BookOpen,
  Home as HomeIcon,
  Sparkles,
  Baby,
  Rocket,
  Store,
  Ship,
  TrendingUp,
  Brain,
  Stethoscope,
  Hotel,
  Gavel
} from "lucide-react";
const LOGO_SMALL =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/RqiKqWIUsupxHOCa.png";
const LOGO_LARGE =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/RqiKqWIUsupxHOCa.png";

const CONSULTANTS = [
  {
    id: 1,
    name: "د. أحمد محمد",
    specialty: "استشارات إدارة الأعمال",
    bio: "خبرة 15 سنة في إدارة المشاريع والشركات",
    experience: 15,
    price: 50,
    rating: 4.8,
  },
  {
    id: 2,
    name: "أ. فاطمة علي",
    specialty: "التسويق الرقمي",
    bio: "متخصصة في التسويق الإلكتروني والعلامات التجارية",
    experience: 10,
    price: 45,
    rating: 4.9,
  },
  {
    id: 3,
    name: "م. سارة حسن",
    specialty: "تطوير البرمجيات",
    bio: "مهندسة برمجيات بخبرة 10 سنوات في التطوير",
    experience: 10,
    price: 60,
    rating: 4.7,
  },
];

interface HomeProps {
  onNavigate?: (page: "home" | "about" | "client-signup" | "consultant-signup") => void;
}
const SPECIALTIES = [

{
name:"الرياضة",
icon:Dumbbell,
subs:[
"كرة القدم",
"كرة السلة",
"السباحة",
"الجري",
"كمال الأجسام",
"الفنون القتالية",
"الرماية",
"الرمي بالقوس",
"ركوب الخيل"
]
},

{
name:"الصحة والطب",
icon:Stethoscope,
subs:[
"الطب العام",
"التغذية الصحية",
"العلاج الطبيعي",
"الصحة النفسية",
"العيادات الطبية",
"التحاليل الطبية",
"التمريض"
]
},

{
name:"الجمال والعناية",
icon:Sparkles,
subs:[
"العناية بالبشرة",
"العناية بالشعر",
"المكياج",
"التجميل",
"العناية الشخصية"
]
},

{
name:"التعليم",
icon:GraduationCap,
subs:[
"الدروس الخصوصية",
"تعليم اللغات",
"التعليم الإلكتروني",
"الإرشاد الأكاديمي",
"التدريب المهني"
]
},

{
name:"التقنية",
icon:Code,
subs:[
"البرمجة",
"تطوير المواقع",
"تطوير التطبيقات",
"الذكاء الاصطناعي",
"الأمن السيبراني",
"تحليل البيانات"
]
},

{
name:"التصميم",
icon:Palette,
subs:[
"تصميم الجرافيك",
"تصميم الشعارات",
"الهوية البصرية",
"تصميم الواجهات"
]
},

{
name:"التصوير والإعلام",
icon:Camera,
subs:[
"التصوير الفوتوغرافي",
"تصوير الفيديو",
"المونتاج",
"صناعة المحتوى"
]
},

{
name:"الطبخ وفنون الطعام",
icon:Utensils,
subs:[
"الطبخ العربي",
"الطبخ العالمي",
"الحلويات",
"المخبوزات",
"تنسيق الموائد"
]
},

{
name:"التجارة",
icon:ShoppingCart,
subs:[
"التجارة المحلية",
"التجارة الإلكترونية",
"البيع بالتجزئة",
"إدارة المتاجر"
]
},

{
name:"الأعمال وريادة الأعمال",
icon:Briefcase,
subs:[
"ريادة الأعمال",
"إدارة المشاريع",
"إدارة الشركات",
"الموارد البشرية"
]
},

{
name:"القانون والمحاماة",
icon:Scale,
subs:[
"الاستشارات القانونية",
"المحاماة",
"القانون التجاري",
"القانون المدني"
]
},

{
name:"السفر والسياحة",
icon:Plane,
subs:[
"تنظيم الرحلات",
"السياحة الداخلية",
"السياحة الخارجية",
"الإرشاد السياحي"
]
},

{
name:"الحج والعمرة",
icon:Gavel,
subs:[
"خدمات الحج",
"خدمات العمرة",
"الإرشاد للحجاج"
]
},

{
name:"الزراعة",
icon:Leaf,
subs:[
"الزراعة المنزلية",
"الزراعة الحديثة",
"زراعة الخضروات",
"زراعة الفواكه"
]
},

{
name:"تربية الحيوانات",
icon:Leaf,
subs:[
"تربية الأغنام",
"تربية الأبقار",
"تربية الدواجن",
"تربية الطيور",
"تربية النحل"
]
},

{
name:"الأسرة",
icon:Users,
subs:[
"العلاقات الأسرية",
"الإرشاد الأسري",
"الحياة الزوجية",
"التربية"
]
},

{
name:"الأطفال",
icon:Baby,
subs:[
"تعليم الأطفال",
"تنمية المهارات",
"الأنشطة التعليمية"
]
},

{
name:"الشباب",
icon:Rocket,
subs:[
"تطوير الذات",
"المهارات المهنية",
"المبادرات الشبابية"
]
},

{
name:"ربات البيوت",
icon:HomeIcon,
subs:[
"إدارة المنزل",
"تنظيم المنزل",
"الاقتصاد المنزلي",
"الطبخ المنزلي"
]
},

{
name:"الهوايات",
icon:Music,
subs:[
"القراءة",
"الألعاب",
"الهوايات المنزلية",
"التخييم"
]
},

{
name:"الفنون",
icon:Palette,
subs:[
"الرسم",
"النحت",
"الحرف اليدوية",
"الخط العربي"
]
},

{
name:"الأدب والشعر",
icon:BookOpen,
subs:[
"الشعر",
"الروايات",
"القصص",
"الكتابة الأدبية"
]
},

{
name:"المتاجر",
icon:Store,
subs:[
"المتاجر التقليدية",
"المتاجر الإلكترونية",
"عرض المنتجات"
]
},

{
name:"الاستيراد والتصدير",
icon:Ship,
subs:[
"الاستيراد",
"التصدير",
"الشحن الدولي"
]
},

{
name:"الاستثمار",
icon:TrendingUp,
subs:[
"الاستثمار المالي",
"الأسهم",
"إدارة الأموال"
]
},

{
name:"التنمية البشرية",
icon:Brain,
subs:[
"تطوير الذات",
"إدارة الوقت",
"تحقيق الأهداف"
]
},

{
name:"الخدمات",
icon:Users,
subs:[
"الخدمات المهنية",
"الخدمات المنزلية",
"الصيانة"
]
},

{
name:"الفنادق والضيافة",
icon:Hotel,
subs:[
"الفنادق",
"دور الضيافة",
"تنظيم الفعاليات"
]
}

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

export default function Home({ onNavigate }: HomeProps) {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const [showCountries, setShowCountries] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
const [openSpecialty, setOpenSpecialty] = useState<number | null>(null);
  const isRTL = language === "ar";

  const translations = {
  ar: {
    title: "اعرض ما لديك… واحصل على ما تريد",
    subtitle: "شريك نجاحك",
    consultants: "المستشارون",
    bookSession: "حجز جلسة",
    experience: "سنوات الخبرة",
    price: "السعر بالساعة",
    rating: "التقييم",
    english: "English",
    arabic: "العربية",
  },
  en: {
    title: "Show what you have… get what you want",
    subtitle: "Your Partner in Success",
    consultants: "Consultants",
    bookSession: "Book Session",
    experience: "Years of Experience",
    price: "Price per Hour",
    rating: "Rating",
    english: "English",
    arabic: "Arabic",
  },
};
  const t = translations[language];

  return (
    <div
      className={`min-h-screen bg-white ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          {/* MENU BUTTON */}
          <button
            className="text-3xl text-[#1976D2] mr-4"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰
          </button>

          {/* LOGO */}
          <div className="flex items-center"></div>

          <div className="flex-1"></div>

          {/* COUNTRY */}
          <div className="relative mr-3">
            <button
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
                    onClick={() => {
                      setSelectedCountry(country.code);
                      setShowCountries(false);
                    }}
                    className="w-full text-right px-4 py-2 hover:bg-blue-50"
                  >
                    {country.flag} {country.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LANGUAGE */}
          <button
            onClick={() =>
              setLanguage(language === "ar" ? "en" : "ar")
            }
            className="px-3 py-2 text-sm font-semibold rounded-lg"
            style={{ color: "#1976D2", border: "2px solid #1976D2" }}
          >
            {language === "ar" ? t.english : t.arabic}
          </button>
        </div>

        {/* MOBILE MENU */}
        {showMenu && (
          <div className={`fixed top-0 ${language === "ar" ? "right-0" : "left-0"} w-72 h-full bg-white shadow-2xl z-50 p-6 flex flex-col text-right`}>
            <button
              onClick={() => setShowMenu(false)}
              className="text-2xl mb-6"
            >
              ✕
            </button>

            <button
  onClick={() => {
    setShowMenu(false);
    onNavigate?.("about");
  }}
  className="py-3 border-b text-right hover:text-[#FF9800]"
>
من نحن
</button>

<button
  onClick={() => {
    setShowMenu(false);
    onNavigate?.("specialties");
  }}
  className="py-3 border-b text-right hover:text-[#FF9800]"
>
التخصصات
</button>

<button className="py-3 border-b text-right hover:text-[#FF9800]">
المستشارون
</button>

<button
  onClick={() => {
    setShowMenu(false);
    onNavigate?.("consultant-signup");
  }}
  className="py-3 border-b text-right hover:text-[#FF9800]"
>
كن مستشاراً
</button>

<button
  onClick={() => {
    setShowMenu(false);
    onNavigate?.("client-signup");
  }}
  className="py-3 border-b text-right hover:text-[#FF9800]"
>
التسجيل
</button>

<button className="py-3 text-right hover:text-[#FF9800]">
تسجيل الدخول
</button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        className="pt-24 pb-10 text-center"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-2">
            <img
  src={LOGO_LARGE}
  alt="Sharaka"
  className="logo-float"
  style={{ height: "200px" }}
/>
          </div>

          <h2
            className="text-4xl font-bold mb-2"
            style={{ color: "#FF9800" }}
          >
            {t.title}
          </h2>

          <p className="text-xl" style={{ color: "#1976D2" }}>
  شريك نجاحك
</p>
        </div>
        
      </section>
{/* SPECIALTIES */}

<section className="py-16 bg-gray-50">

<div className="container mx-auto px-4">

<h2 className="text-3xl font-bold text-center mb-12 text-[#FF9800]">
التخصصات
</h2>

<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

{SPECIALTIES.map((s,i)=>{

const Icon=s.icon;
const open=openSpecialty===i;

return(

<div key={i} className="bg-white rounded-xl shadow-md hover:shadow-xl transition">

<button
onClick={()=>setOpenSpecialty(open?null:i)}
className="w-full p-5 text-center"
>

<div className="flex justify-center mb-3">

<div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">

<Icon size={30} className="text-[#1976D2]" />

</div>

</div>

<h3 className="font-bold text-[#FF9800]">

{s.name}

</h3>

</button>

{open && (

<div className="px-5 pb-5 text-sm text-gray-700">

{s.subs.map((sub,index)=>(
<div key={index}>• {sub}</div>
))}

</div>

)}

</div>

)

})}

</div>

</div>

</section>
      {/* CONSULTANTS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-10"
            style={{ color: "#FF9800" }}
          >
            {t.consultants}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {CONSULTANTS.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-[#FF9800]">
                  {c.name}
                </h3>

                <p className="text-[#1976D2] mb-2">{c.specialty}</p>

                <p className="text-gray-600 mb-4">{c.bio}</p>

                <div className="text-sm text-gray-600">
                  ⭐ {c.rating} | {c.experience} سنة
                </div>

                <button
                  onClick={() => onNavigate?.("client-signup")}
                  className="mt-4 w-full py-2 rounded-lg text-white"
                  style={{ backgroundColor: "#FF9800" }}
                >
                  {t.bookSession}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}