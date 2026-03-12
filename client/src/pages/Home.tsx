import { useState } from "react";
import logo from "../assets/globe-icon.png";
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
  Gavel,
  Info,
  UserPlus,
  LogIn
} from "lucide-react";


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
name:"الاستشارات",
icon: Brain,
subs:[
"استشارات إدارية",
"استشارات مالية",
"استشارات قانونية",
"استشارات مهنية",
"استشارات أسرية"
]
},

{
name:"التعليم والتدريب",
icon: GraduationCap,
subs:[
"الدورات التدريبية",
"التعليم الأكاديمي",
"التعليم عن بعد",
"التدريب المهني",
"التدريب القيادي"
]
},

{
name:"التقنية والبرمجة",
icon: Code,
subs:[
"تطوير المواقع",
"تطوير التطبيقات",
"الذكاء الاصطناعي",
"أمن المعلومات",
"تحليل البيانات"
]
},

{
name:"التصميم والإبداع",
icon: Palette,
subs:[
"تصميم الجرافيك",
"تصميم الشعارات",
"تصميم واجهات المستخدم",
"التصميم الإعلاني"
]
},

{
name:"الإعلام وصناعة المحتوى",
icon: Camera,
subs:[
"إنتاج الفيديو",
"التصوير الفوتوغرافي",
"صناعة المحتوى",
"إدارة القنوات"
]
},

{
name:"التسويق والتجارة",
icon: TrendingUp,
subs:[
"التسويق الرقمي",
"إدارة الحملات الإعلانية",
"التسويق عبر السوشيال ميديا",
"تحليل السوق"
]
},

{
name:"الإدارة وريادة الأعمال",
icon: Briefcase,
subs:[
"إدارة المشاريع",
"ريادة الأعمال",
"تطوير الأعمال",
"التخطيط الاستراتيجي"
]
},

{
name:"القانون والمحاماة",
icon: Scale,
subs:[
"الاستشارات القانونية",
"القضايا التجارية",
"القضايا المدنية",
"التحكيم"
]
},

{
name:"الطب والصحة",
icon: Stethoscope,
subs:[
"الاستشارات الطبية",
"الصحة العامة",
"الطب الوقائي",
"التوجيه الصحي"
]
},

{
name:"الصحة النفسية",
icon: Brain,
subs:[
"العلاج النفسي",
"الإرشاد النفسي",
"تنمية الشخصية",
"الدعم النفسي"
]
},

{
name:"الرياضة واللياقة",
icon: Dumbbell,
subs:[
"التدريب الرياضي",
"اللياقة البدنية",
"التغذية الرياضية",
"التأهيل البدني"
]
},

{
name:"التغذية والطبخ",
icon: Utensils,
subs:[
"الطبخ الاحترافي",
"التغذية الصحية",
"إعداد الوجبات",
"المطابخ العالمية"
]
},

{
name:"الجمال والعناية",
icon: Sparkles,
subs:[
"العناية بالبشرة",
"العناية بالشعر",
"التجميل",
"الصحة الجمالية"
]
},

{
name:"الأسرة والتربية",
icon: Users,
subs:[
"الإرشاد الأسري",
"التربية",
"العلاقات الأسرية",
"تنمية الأطفال"
]
},

{
name:"الطفولة",
icon: Baby,
subs:[
"تنمية الطفل",
"تعليم الأطفال",
"أنشطة الأطفال",
"تربية الأطفال"
]
},

{
name:"الشباب",
icon: Rocket,
subs:[
"تطوير المهارات",
"العمل الحر",
"بناء المستقبل",
"التوجيه المهني"
]
},

{
name:"الهوايات والفنون",
icon: Palette,
subs:[
"الرسم",
"الموسيقى",
"الحرف اليدوية",
"الفنون الإبداعية"
]
},

{
name:"الأدب والشعر",
icon: BookOpen,
subs:[
"الشعر",
"الكتابة الأدبية",
"النقد الأدبي",
"تطوير مهارات الكتابة"
]
},

{
name:"السفر والسياحة",
icon: Plane,
subs:[
"التخطيط للسفر",
"السياحة العالمية",
"المرشدون السياحيون",
"برامج الرحلات"
]
},

{
name:"الحج والعمرة",
icon:"🕋",
subs:[
"تنظيم رحلات الحج",
"تنظيم رحلات العمرة",
"الإرشاد الديني",
"خدمات المعتمرين"
]
},

{
name:"الفنادق والضيافة",
icon: Hotel,
subs:[
"إدارة الفنادق",
"الضيافة",
"تنظيم الفعاليات",
"خدمات الضيافة"
]
},

{
name:"التجارة الدولية",
icon: Globe,
subs:[
"الاستيراد والتصدير",
"التجارة العالمية",
"الشحن الدولي",
"الأسواق العالمية"
]
},

{
name:"الزراعة",
icon: Leaf,
subs:[
"الزراعة الحديثة",
"المزارع",
"الإنتاج الزراعي",
"التقنيات الزراعية"
]
},

{
name:"تربية الحيوانات",
icon: Heart,
subs:[
"تربية المواشي",
"تربية الطيور",
"رعاية الحيوانات",
"الإنتاج الحيواني"
]
},

{
name:"البيئة والطبيعة",
icon: Leaf,
subs:[
"الحفاظ على البيئة",
"الاستدامة",
"المشاريع البيئية",
"الطبيعة"
]
},

{
name:"المتاجر والتجارة الإلكترونية",
icon: ShoppingCart,
subs:[
"إنشاء المتاجر",
"إدارة المتاجر",
"التجارة الإلكترونية",
"التسويق الإلكتروني"
]
},

{
name:"النقل والخدمات اللوجستية",
icon: Ship,
subs:[
"الشحن",
"النقل",
"الخدمات اللوجستية",
"إدارة سلاسل الإمداد"
]
},

{
name:"الاستثمار والمال",
icon: TrendingUp,
subs:[
"الاستثمار",
"الأسواق المالية",
"التخطيط المالي",
"إدارة الأموال"
]
},

{
name:"العقار",
icon: HomeIcon,
subs:[
"بيع وشراء العقارات",
"التأجير",
"التطوير العقاري",
"الاستثمار العقاري"
]
},

{
name:"أنشطة متنوعة",
icon: Sparkles,
subs:[
"أفكار ومشاريع",
"مبادرات مجتمعية",
"أنشطة ثقافية",
"أنشطة عامة"
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


  const [showContact, setShowContact] = useState(false);

  const [showLogin, setShowLogin] = useState(false);

  const [showAdForm, setShowAdForm] = useState(false);
const [isMember, setIsMember] = useState<boolean | null>(null);

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
<div
className="fixed inset-0 bg-black/40 z-50"
onClick={() => setShowMenu(false)}
>

<div
onClick={(e)=>e.stopPropagation()}
className={`fixed top-0 ${
language === "ar" ? "right-0" : "left-0"
} w-80 h-full bg-white shadow-2xl p-6 flex flex-col`}

>

<div className="flex items-center justify-between mb-8">

<h2 className="text-xl font-bold text-[#FF9800]">
القائمة
</h2>

<button
onClick={()=>setShowMenu(false)}
className="text-2xl hover:text-red-500"
>
✕
</button>

</div>


<button
onClick={()=>{
setShowMenu(false);
onNavigate?.("about");
}}
className="flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-gray-100 transition"
>
<Info size={20} className="text-[#1976D2]" />
<span className="font-medium">من نحن</span>
</button>


<button
onClick={()=>{
setShowMenu(false);
onNavigate?.("consultant-signup");
}}
className="flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-gray-100 transition"
>
<UserPlus size={20} className="text-[#FF9800]" />
<span className="font-medium">انضم إلينا</span>
</button>


<button
onClick={()=>{
setShowMenu(false);
setShowLogin(true);
}}
className="flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-gray-100 transition"
>
<LogIn size={20} className="text-[#1976D2]" />
<span className="font-medium">تسجيل الدخول</span>
</button>


</div>

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
  src={logo}
  alt="Sharaka"
  className="logo-float"
  style={{
    height: "200px",
    mixBlendMode: "multiply"
  }}
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
<div className="mt-6 flex flex-col items-center gap-4">

<button
onClick={()=>onNavigate?.("consultant-signup")}
className="w-60 bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-4 rounded-lg text-lg transition"
>
انضم الآن
</button>

<button
onClick={()=>onNavigate?.("consultants")}
className="w-60 flex items-center justify-center gap-2 bg-[#1976D2] hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition"
>
👥 تصفح الجميع
</button>

</div>
        </div>
        
      </section>
      
{/* SPECIALTIES */}

{/* SPECIALTIES */}

<section id="specialties" className="py-16 bg-gray-50">

<div className="container mx-auto px-4">

<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

{SPECIALTIES.map((s,i)=>{

const Icon = s.icon;
const open = openSpecialty === i;

return(

<div key={i} className="bg-white rounded-xl shadow-md hover:shadow-xl transition">

<button
onClick={()=>setOpenSpecialty(open?null:i)}
className="w-full p-5 text-center"
>

<div className="flex justify-center mb-3">

<div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">

{typeof s.icon === "string"
? <span className="text-2xl">{s.icon}</span>
: <Icon size={30} className="text-[#1976D2]" />
}

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


{/* SOUQ SHARAKA */}

<section className="py-20 bg-white">

<div className="max-w-6xl mx-auto px-6 text-center">

<h2 className="text-3xl font-bold mb-10 text-[#FF9800]">
سوق شراكة
</h2>

<div className="flex flex-col items-center gap-4 mb-12">

<button
onClick={()=>setShowAdForm(true)}
className="w-60 bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-4 rounded-lg text-lg transition"
>
أضف إعلانك مجانًا
</button>

<button
onClick={()=>onNavigate?.("market")}
className="w-60 bg-[#1976D2] hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition"
>
تصفح الإعلانات
</button>

</div>

<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

{[
{icon:"🏠",name:"عقار"},
{icon:"🚗",name:"سيارات"},
{icon:"📱",name:"أجهزة"},
{icon:"💼",name:"وظائف"},
{icon:"🛒",name:"بيع"},
{icon:"🛍",name:"شراء"},
{icon:"📈",name:"استثمار"},
{icon:"🏪",name:"تجارة"},
{icon:"🧰",name:"خدمات"},
{icon:"➕",name:"أخرى"}
].map((s,i)=>{

return(

<div key={i} className="bg-white rounded-xl shadow-md hover:shadow-xl transition">

<button className="w-full p-5 text-center">

<div className="flex justify-center mb-3">

<div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-2xl">

{s.icon}

</div>

</div>

<h3 className="font-bold text-[#FF9800]">
{s.name}
</h3>

</button>

</div>

)

})}

</div>

</div>

</section>
{/* SOUQ SHARAKA */}


      <section className="py-20 bg-[#1976D2] text-center text-white">

<div className="max-w-3xl mx-auto px-6">

<h2 className="text-3xl font-bold mb-6">
شراكة… منصة تجمع الخبرة والخدمة والفرص
</h2>

<p className="text-lg leading-8 mb-8">
في شراكة يستطيع الأفراد والمؤسسات عرض ما لديهم من معرفة أو خدمة أو منتج،
كما يمكنهم الوصول إلى ما يحتاجون إليه من خبرة أو خدمة أو فرصة في مكان واحد.
</p>

<button
onClick={()=>setShowContact(true)}
className="bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition"
>
تواصل معنا
</button>

</div>

</section>
{showAdForm && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-2xl text-right">

<div className="flex justify-between items-center mb-6">

<h3 className="text-xl font-bold text-[#1976D2]">
إضافة إعلان
</h3>

<button
onClick={()=>{
setShowAdForm(false);
setIsMember(null);
}}
className="text-xl hover:text-red-500"
>
✕
</button>

</div>


{/* سؤال العضوية */}

{isMember === null && (

<div className="text-center space-y-4">

<p className="text-lg font-semibold">
هل لديك عضوية في منصة شراكة؟
</p>

<div className="flex justify-center gap-4">

<button
onClick={()=>setIsMember(true)}
className="bg-[#1976D2] text-white px-6 py-3 rounded-lg"
>
نعم
</button>

<button
onClick={()=>onNavigate?.("consultant-signup")}
className="bg-[#FF9800] text-white px-6 py-3 rounded-lg"
>
لا — انضم الآن
</button>

</div>

</div>

)}


{/* استمارة الإعلان */}

{isMember === true && (

<div className="space-y-4">

<input
type="text"
placeholder="عنوان الإعلان"
className="w-full border p-3 rounded"
/>

<select className="w-full border p-3 rounded">

<option>اختر القسم</option>
<option>عقار</option>
<option>سيارات</option>
<option>أجهزة</option>
<option>وظائف</option>
<option>بيع</option>
<option>شراء</option>
<option>استثمار</option>
<option>تجارة</option>
<option>خدمات</option>
<option>أخرى</option>

</select>

<textarea
placeholder="وصف الإعلان"
rows={4}
className="w-full border p-3 rounded"
/>

<input
type="text"
placeholder="السعر (اختياري)"
className="w-full border p-3 rounded"
/>

<input
type="text"
placeholder="رقم التواصل"
className="w-full border p-3 rounded"
/>

<button
className="w-full bg-[#FF9800] text-white py-3 rounded hover:bg-orange-500 transition"
>
نشر الإعلان
</button>

</div>

)}

</div>

</div>

)}
{showContact && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-2xl text-right">

<div className="flex justify-between items-center mb-6">

<h3 className="text-xl font-bold text-[#1976D2]">
تواصل معنا
</h3>

<button
onClick={()=>setShowContact(false)}
className="text-xl hover:text-red-500"
>
✕
</button>

</div>

<input
type="text"
placeholder="الاسم"
className="w-full border p-3 rounded mb-4"
/>

<input
type="email"
placeholder="البريد الإلكتروني"
className="w-full border p-3 rounded mb-4"
/>

<textarea
placeholder="الرسالة"
rows={4}
className="w-full border p-3 rounded mb-6"
/>

<button
className="w-full bg-[#FF9800] text-white py-3 rounded hover:bg-orange-500 transition"
>
إرسال
</button>

</div>

</div>

)}

    </div>
  );
}