import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, Award, Search, ChevronRight, MessageCircle } from 'lucide-react';


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

export default function Home({ onNavigate }: HomeProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [searchTerm, setSearchTerm] = useState('');

  const isRTL = language === 'ar';

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
    },
  };

  const t = translations[language];

  const filteredConsultants = CONSULTANTS.filter(c =>
    c.name.includes(searchTerm) || c.specialty.includes(searchTerm)
  );

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b-2" style={{ borderColor: '#1976D2' }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={LOGO_SMALL} alt="Sharaka" className="h-12 w-12 object-contain" />
            <h1 className="text-2xl font-bold" style={{ color: '#FF9800' }}>
              {language === 'ar' ? 'شراكة' : 'Sharaka'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 text-sm font-semibold rounded-lg transition"
              style={{ color: '#1976D2', border: '2px solid #1976D2' }}
            >
              {language === 'ar' ? t.english : t.arabic}
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
            .slow-bounce {
              animation: slowBounce 4s ease-in-out infinite;
            }
          `}</style>
          <div className="flex justify-center mb-8 slow-bounce">
            <img src={LOGO_LARGE} alt="Sharaka" className="h-48 w-48 object-contain" />
          </div>

          <h2 className="text-5xl font-bold mb-4" style={{ color: '#FF9800' }}>
            {t.title}
          </h2>
          <p className="text-2xl mb-4" style={{ color: '#1976D2' }}>
            {t.subtitle}
          </p>
          <p className="text-lg text-gray-600 mb-8">
            {t.description}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3" style={{ color: '#FF9800' }} size={20} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#1976D2' }}
                />
              </div>
            </div>
          </div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: '#E3F2FD' }}>
                  <Award size={32} style={{ color: '#1976D2' }} />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#FF9800' }}>
                {t.expertConsultants}
              </h3>
              <p style={{ color: '#1976D2' }}>{t.allCertified}</p>
            </div>

            {/* Card 2 */}
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

            {/* Card 3 */}
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

      {/* Consultants Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#FF9800' }}>
            {t.consultants}
          </h2>

          {filteredConsultants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredConsultants.map((consultant) => (
                <div key={consultant.id} className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4" style={{ borderColor: '#1976D2' }}>
                  {/* Consultant Header */}
                  <div className="p-6" style={{ backgroundColor: '#E3F2FD' }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full" style={{ backgroundColor: '#FF9800' }}></div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold" style={{ color: '#FF9800' }}>
                          {consultant.name}
                        </h3>
                        <p style={{ color: '#1976D2' }}>{consultant.specialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Consultant Details */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">{consultant.bio}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between">
                        <span className="font-semibold" style={{ color: '#1976D2' }}>
                          {t.experience}:
                        </span>
                        <span style={{ color: '#FF9800' }}>{consultant.experience} سنة</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold" style={{ color: '#1976D2' }}>
                          {t.price}:
                        </span>
                        <span style={{ color: '#FF9800' }}>{consultant.price} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold" style={{ color: '#1976D2' }}>
                          {t.rating}:
                        </span>
                        <span style={{ color: '#FF9800' }}>⭐ {consultant.rating}</span>
                      </div>
                    </div>

                    {/* Book Button */}
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
          ) : (
            <p className="text-center text-gray-600 text-xl">{t.searchPlaceholder}</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: '#1976D2' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {language === 'ar' ? 'هل تريد أن تصبح مستشاراً؟' : 'Want to become a consultant?'}
          </h2>
          <p className="text-xl text-white mb-8">
            {language === 'ar'
              ? 'انضم إلى شبكة المستشارين المعتمدين وابدأ كسب الدخل'
              : 'Join our network of certified consultants and start earning'}
          </p>
          <button
            onClick={() => onNavigate?.('consultant-signup')}
            className="px-8 py-4 font-bold rounded-lg text-lg transition hover:shadow-lg"
            style={{ backgroundColor: '#FF9800', color: 'white' }}
          >
            {t.becomeConsultant}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 منصة شراكة - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
