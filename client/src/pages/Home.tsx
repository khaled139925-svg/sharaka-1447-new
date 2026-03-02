import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, Award, Search, ChevronRight, MessageCircle, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';


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
  const { language, setLanguage, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCountries, setShowCountries] = useState(false);

  const translations = {
    ar: {
      title: 'منصة الاستشارات المتخصصة',
      subtitle: 'احصل على استشارات احترافية من أفضل الخبراء',
      description: 'تواصل مع أفضل المستشارين والخبراء في مختلف المجالات',
      searchPlaceholder: 'ابحث عن مستشار...',
      consultants: 'المستشارين',
      bookSession: 'حجز جلسة',
      specialization: 'التخصص',
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
      selectCountry: 'اختر الدولة',
    },
    en: {
      title: 'Professional Consulting Platform',
      subtitle: 'Get professional consultations from the best experts',
      description: 'Connect with the best consultants and experts in various fields',
      searchPlaceholder: 'Search for a consultant...',
      consultants: 'Consultants',
      bookSession: 'Book Session',
      specialization: 'Specialization',
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
      selectCountry: 'Select Country',
    },
  };

  const t = translations[language];

  const filteredConsultants = CONSULTANTS.filter(c =>
    c.name.includes(searchTerm) || c.specialty.includes(searchTerm)
  );

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={LOGO_SMALL} alt="Sharaka" className="h-12 w-12 object-contain" />
            <h1 className="text-2xl font-bold" style={{ color: '#FF9800' }}>
              {language === 'ar' ? 'شراكة' : 'Sharaka'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCountries(!showCountries)}
                className="px-3 py-2 text-sm font-semibold rounded-lg transition flex items-center gap-2"
                style={{ color: '#1976D2', border: '2px solid #1976D2' }}
              >
                <Globe size={16} />
                {COUNTRIES.find(c => c.code === selectedCountry)?.flag}
              </button>
              {showCountries && (
                <div className={`absolute top-full mt-2 bg-white border-2 rounded-lg shadow-lg z-50 ${isRTL ? 'left-0' : 'right-0'}`} style={{ borderColor: '#1976D2', maxHeight: '300px', overflowY: 'auto', minWidth: '200px' }}>
                  {COUNTRIES.map(country => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setShowCountries(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 transition flex items-center gap-2"
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 text-sm font-semibold rounded-lg transition"
              style={{ color: '#1976D2', border: '2px solid #1976D2' }}
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Large Logo */}
      <section className="py-16 text-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="container mx-auto px-4">
          {/* Large Logo with Animation */}
          <style>{`
            @keyframes slowBounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
            .bounce-slow {
              animation: slowBounce 3s ease-in-out infinite;
            }
          `}</style>
          <img src={LOGO_LARGE} alt="Sharaka" className="h-48 w-auto mx-auto mb-8 bounce-slow object-contain" />
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#FF9800' }}>
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t.subtitle}
          </p>
          <p className="text-gray-600 mb-8">
            {t.description}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: '#1976D2' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#E8F4F8' }}>
              <Star className="mx-auto mb-4" size={40} style={{ color: '#FF9800' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: '#FF9800' }}>
                {t.expertConsultants}
              </h3>
              <p style={{ color: '#1976D2' }}>
                {t.allCertified}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#E8F4F8' }}>
              <Clock className="mx-auto mb-4" size={40} style={{ color: '#FF9800' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: '#FF9800' }}>
                {t.flexibleSessions}
              </h3>
              <p style={{ color: '#1976D2' }}>
                {t.bookAtYourTime}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#E8F4F8' }}>
              <Award className="mx-auto mb-4" size={40} style={{ color: '#FF9800' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: '#FF9800' }}>
                {t.highQuality}
              </h3>
              <p style={{ color: '#1976D2' }}>
                {t.professionalConsultations}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultants Section */}
      <section className="py-16" style={{ backgroundColor: '#F9F9F9' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#FF9800' }}>
            {t.consultants}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredConsultants.map(consultant => (
              <div key={consultant.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{consultant.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star size={16} style={{ color: '#FF9800' }} fill="#FF9800" />
                    <span style={{ color: '#1976D2' }}>{consultant.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{consultant.specialty}</p>
                <p className="text-sm text-gray-500 mb-4">{consultant.bio}</p>
                <div className="flex justify-between items-center mb-4">
                  <span style={{ color: '#1976D2' }}>{consultant.experience} {t.experience}</span>
                  <span style={{ color: '#FF9800' }}>${consultant.price}/{t.price}</span>
                </div>
                <Button
                  onClick={() => onNavigate?.('client-signup')}
                  className="w-full"
                  style={{ backgroundColor: '#FF9800', color: 'white' }}
                >
                  {t.bookSession}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: '#1976D2' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t.becomeConsultant}
          </h2>
          <Button
            onClick={() => onNavigate?.('consultant-signup')}
            className="bg-white text-blue-600 hover:bg-gray-100"
            size="lg"
          >
            {t.becomeConsultant}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 {language === 'ar' ? 'منصة الاستشارات' : 'Consulting Platform'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
