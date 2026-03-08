import { useState } from 'react';
import { Star, Clock, Award, Globe } from 'lucide-react';

const LOGO_SMALL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/RqiKqWIUsupxHOCa.png';
const LOGO_LARGE = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/RqiKqWIUsupxHOCa.png';

const CONSULTANTS = [
  {
    id: 1,
    name: 'د. أحمد محمد',
    specialty: 'استشارات إدارة الأعمال',
    bio: 'خبرة 15 سنة في إدارة المشاريع والشركات',
    experience: 15,
    price: 50,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'أ. فاطمة علي',
    specialty: 'التسويق الرقمي',
    bio: 'متخصصة في التسويق الإلكتروني والعلامات التجارية',
    experience: 10,
    price: 45,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'م. سارة حسن',
    specialty: 'تطوير البرمجيات',
    bio: 'مهندسة برمجيات بخبرة 10 سنوات في التطوير',
    experience: 10,
    price: 60,
    rating: 4.7,
  },
];

interface HomeProps {
  onNavigate?: (page: 'home' | 'client-signup' | 'consultant-signup') => void;
}

const COUNTRIES = [
  { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', name: 'عمان', flag: '🇴🇲' },
  { code: 'YE', name: 'اليمن', flag: '🇾🇪' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
  { code: 'SY', name: 'سوريا', flag: '🇸🇾' },
  { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
  { code: 'TN', name: 'تونس', flag: '🇹🇳' },
  { code: 'DZ', name: 'الجزائر', flag: '🇩🇿' },
  { code: 'PK', name: 'باكستان', flag: '🇵🇰' },
  { code: 'TR', name: 'تركيا', flag: '🇹🇷' },
  { code: 'GB', name: 'بريطانيا', flag: '🇬🇧' },
  { code: 'DE', name: 'ألمانيا', flag: '🇩🇪' },
  { code: 'FR', name: 'فرنسا', flag: '🇫🇷' },
  { code: 'US', name: 'أمريكا', flag: '🇺🇸' },
  { code: 'CA', name: 'كندا', flag: '🇨🇦' },
];

export default function Home({ onNavigate }: HomeProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCountries, setShowCountries] = useState(false);
const [showSpecialties, setShowSpecialties] = useState(false);
const [showMenu, setShowMenu] = useState(false);
  const isRTL = language === 'ar';

  const translations = {
    ar: {
      title: 'منصة الاستشارات المتخصصة',
      subtitle: 'احصل على استشارات احترافية من أفضل الخبراء',
      consultants: 'المستشارين',
      bookSession: 'حجز جلسة',
      experience: 'سنوات الخبرة',
      price: 'السعر بالساعة',
      rating: 'التقييم',
      becomeConsultant: 'كن مستشاراً',
      expertConsultants: 'خبراء معتمدون',
      flexibleSessions: 'جلسات مرنة',
      highQuality: 'جودة عالية',
      allCertified: 'جميع المستشارين معتمدون ومتحققون',
      bookAtYourTime: 'احجز جلسات حسب وقتك المناسب',
      professionalConsultations: 'استشارات احترافية وذات جودة عالية',
      english: 'English',
      arabic: 'العربية',
    },
    en: {
      title: 'Professional Consulting Platform',
      subtitle: 'Get professional consultations from the best experts',
      consultants: 'Consultants',
      bookSession: 'Book Session',
      experience: 'Years of Experience',
      price: 'Price per Hour',
      rating: 'Rating',
      becomeConsultant: 'Become a Consultant',
      expertConsultants: 'Certified Experts',
      flexibleSessions: 'Flexible Sessions',
      highQuality: 'High Quality',
      allCertified: 'All consultants are certified and verified',
      bookAtYourTime: 'Book sessions at your convenient time',
      professionalConsultations: 'Professional and high-quality consultations',
      english: 'English',
      arabic: 'العربية',
    },
  };

  const t = translations[language];

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center gap-3">

  <img
    src={LOGO_SMALL}
    alt="Sharaka"
    style={{ height: '80px', width: '80px' }}
  />

  <div className="flex flex-col">
    <h1 className="text-2xl font-bold" style={{ color: '#FF9800' }}>
      {language === 'ar' ? 'شراكة' : 'Sharaka'}
    </h1>

    <span style={{ fontSize: '13px', color: '#1976D2' }}>
      {language === 'ar' ? 'شريك نجاحك' : 'Your Partner in Success'}
    </span>
  </div>

</div>

          {/* MENU */}
<div className="flex items-center gap-6 text-sm font-semibold relative">

<button
className="md:hidden text-3xl text-[#1976D2]"
onClick={() => setShowMenu(!showMenu)}
>
☰
</button>

<div className="hidden md:flex items-center gap-6">

<span
onClick={() => onNavigate?.("about")}
className="cursor-pointer text-[#1976D2] hover:text-[#FF9800] text-xl font-semibold"
>
من نحن
</span>

<span
onClick={() => setShowSpecialties(!showSpecialties)}
className="cursor-pointer text-[#1976D2] hover:text-[#FF9800] text-xl font-semibold"
>
التخصصات
</span>

<span className="cursor-pointer text-[#1976D2] hover:text-[#FF9800] text-xl font-semibold">
المستشارون
</span>

<span
onClick={() => onNavigate?.("consultant-signup")}
className="cursor-pointer text-[#1976D2] hover:text-[#FF9800] text-xl font-semibold"
>
كن مستشاراً
</span>

<span
onClick={() => onNavigate?.("client-signup")}
className="cursor-pointer text-[#1976D2] hover:text-[#FF9800] text-xl font-semibold"
>
التسجيل
</span>

<span className="cursor-pointer text-[#1976D2] hover:text-[#FF9800] text-xl font-semibold">
تسجيل الدخول
</span>

</div>

</div>
          {/* COUNTRY + LANGUAGE */}
          <div className="flex items-center gap-4">

            <div className="relative">
              <button
                onClick={() => setShowCountries(!showCountries)}
                className="px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-2"
                style={{ color: '#1976D2', border: '2px solid #1976D2' }}
              >
                <Globe size={16} />
                {COUNTRIES.find(c => c.code === selectedCountry)?.flag}
              </button>

              {showCountries && (
  <div
    className={`absolute top-full mt-2 bg-white border-2 rounded-lg shadow-lg z-50 ${isRTL ? 'left-0' : 'right-0'}`}
    style={{
      borderColor: '#1976D2',
      maxHeight: '300px',
      overflowY: 'auto',
      minWidth: '200px'
    }}
  >
    {COUNTRIES.map((country) => (
      <button
        key={country.code}
        onClick={() => {
          setSelectedCountry(country.code);
          setShowCountries(false);
        }}
        className="w-full text-right px-4 py-2 hover:bg-blue-50 transition"
        style={{ color: '#1976D2' }}
      >
        {country.flag} {country.name}
      </button>
    ))}
  </div>
)}
            </div>

            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 text-sm font-semibold rounded-lg"
              style={{ color: '#1976D2', border: '2px solid #1976D2' }}
            >
              {language === 'ar' ? t.english : t.arabic}
            </button>

          </div>

        </div>
      </header>
      <section className="pt-24 pb-10 text-center" style={{ backgroundColor: '#F5F5F5' }}>
  <div className="container mx-auto px-4">
    <style>
{`
@keyframes slowBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.slow-bounce {
  animation: slowBounce 4s ease-in-out infinite;
}
`}
</style>

    <div className="flex justify-center mb-2">
      <img
  src={LOGO_LARGE}
  alt="Sharaka"
  style={{ height: '250px', width: '250px', animationDuration: '5s' }}
  className="object-contain slow-bounce"
/>
    </div>

    <h2 className="text-5xl font-bold mb-1 -mt-6" style={{ color: '#FF9800' }}>
  {t.title}
    </h2>

    <p className="text-2xl mb-4" style={{ color: '#1976D2' }}>
      {t.subtitle}
    </p>

  </div>
</section>
<section className="py-16">
  <div className="container mx-auto px-4">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

      <div className="bg-white p-6 rounded-lg shadow-lg">
       <div className="flex justify-center mt-12 mb-4">
          <div className="p-3 rounded-full" style={{ backgroundColor: '#E3F2FD' }}>
            <Award size={32} style={{ color: '#1976D2' }} />
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: '#FF9800' }}>
          {t.expertConsultants}
        </h3>
        <p style={{ color: '#1976D2' }}>{t.allCertified}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full" style={{ backgroundColor: '#E3F2FD' }}>
            <Clock size={32} style={{ color: '#1976D2' }} />
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: '#FF9800' }}>
          {t.flexibleSessions}
        </h3>
        <p style={{ color: '#1976D2' }}>{t.bookAtYourTime}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full" style={{ backgroundColor: '#E3F2FD' }}>
            <Star size={32} style={{ color: '#1976D2' }} />
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: '#FF9800' }}>
          {t.highQuality}
        </h3>
        <p style={{ color: '#1976D2' }}>{t.professionalConsultations}</p>
      </div>

    </div>

  </div>
</section>
<section className="py-16">
  <div className="container mx-auto px-4">

    <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#FF9800' }}>
      {t.consultants}
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      {CONSULTANTS.map((consultant) => (
        <div
          key={consultant.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4"
          style={{ borderColor: '#1976D2' }}
        >

          <div className="p-6" style={{ backgroundColor: '#E3F2FD' }}>
            <div className="flex items-center gap-4 mb-4">

              <div
                className="w-16 h-16 rounded-full"
                style={{ backgroundColor: '#FF9800' }}
              ></div>

              <div className="text-left">
                <h3 className="text-xl font-bold" style={{ color: '#FF9800' }}>
                  {consultant.name}
                </h3>

                <p style={{ color: '#1976D2' }}>
                  {consultant.specialty}
                </p>
              </div>

            </div>
          </div>

          <div className="p-6">

            <p className="text-gray-700 mb-4">
              {consultant.bio}
            </p>

            <div className="space-y-2 mb-6">

              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: '#1976D2' }}>
                  {t.experience}
                </span>
                <span style={{ color: '#FF9800' }}>
                  {consultant.experience} سنة
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: '#1976D2' }}>
                  {t.price}
                </span>
                <span style={{ color: '#FF9800' }}>
                  {consultant.price} ريال
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: '#1976D2' }}>
                  {t.rating}
                </span>
                <span style={{ color: '#FF9800' }}>
                  ⭐ {consultant.rating}
                </span>
              </div>

            </div>

            <button
              onClick={() => onNavigate?.('client-signup')}
              className="w-full py-3 font-bold rounded-lg text-white transition hover:shadow-lg"
              style={{ backgroundColor: '#FF9800' }}
            >
              {t.bookSession}
            </button>

          </div>

        </div>
      ))}

    </div>

  </div>
</section>

    </div>
  );
}