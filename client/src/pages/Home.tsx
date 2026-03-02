'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, Award, Search, ChevronRight, MessageCircle } from 'lucide-react';

const LOGO_SMALL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663333045223/LPqWsDAqrBRRgfKZkbJUrr/logo-sharaka_e9dbc5e2.png';
const LOGO_LARGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663333045223/LPqWsDAqrBRRgfKZkbJUrr/logo-sharaka_e9dbc5e2.png';

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

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const isRTL = language === 'ar';

  const translations = {
    ar: {
      title: 'منصة الاستشارات المتخصصة',
      subtitle: 'احصل على استشارات احترافية من أفضل الخبراء',
      searchPlaceholder: 'ابحث عن مستشار...',
      consultants: 'المستشارين',
      bookSession: 'حجز جلسة',
      specialization: 'التخصص',
      experience: 'سنوات الخبرة',
      price: 'السعر بالساعة',
      rating: 'التقييم',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      becomeConsultant: 'كن مستشاراً',
      features: 'المميزات',
      aboutUs: 'من نحنا',
      contact: 'تواصل معنا',
      english: 'English',
      arabic: 'العربية',
      sessionTitle: 'عنوان الجلسة',
      date: 'التاريخ',
      time: 'الوقت',
      duration: 'المدة',
      meetingType: 'نوع الاجتماع',
      confirm: 'تأكيد',
      cancel: 'إلغاء',
      noConsultants: 'لا توجد استشارات متاحة',
      bookingSuccess: 'تم حجز الجلسة بنجاح',
      expertConsultants: 'خبراء معتمدون',
      flexibleSessions: 'جلسات مرنة',
      highQuality: 'جودة عالية',
      allCertified: 'جميع المستشارين معتمدون ومتحققون',
      bookAtYourTime: 'احجز جلسات حسب وقتك المناسب',
      professionalConsultations: 'استشارات احترافية وذات جودة عالية',
    },
    en: {
      title: 'Professional Consulting Platform',
      subtitle: 'Get professional consultations from the best experts',
      searchPlaceholder: 'Search for a consultant...',
      consultants: 'Consultants',
      bookSession: 'Book Session',
      specialization: 'Specialization',
      experience: 'Years of Experience',
      price: 'Price per Hour',
      rating: 'Rating',
      logout: 'Logout',
      login: 'Login',
      becomeConsultant: 'Become a Consultant',
      features: 'Features',
      aboutUs: 'About Us',
      contact: 'Contact',
      english: 'English',
      arabic: 'العربية',
      sessionTitle: 'Session Title',
      date: 'Date',
      time: 'Time',
      duration: 'Duration',
      meetingType: 'Meeting Type',
      confirm: 'Confirm',
      cancel: 'Cancel',
      noConsultants: 'No consultants available',
      bookingSuccess: 'Session booked successfully',
      expertConsultants: 'Certified Experts',
      flexibleSessions: 'Flexible Sessions',
      highQuality: 'High Quality',
      allCertified: 'All consultants are certified and verified',
      bookAtYourTime: 'Book sessions at your convenient time',
      professionalConsultations: 'Professional and high-quality consultations',
    },
  };

  const t = translations[language];

  const filteredConsultants = CONSULTANTS.filter((c: any) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={LOGO_SMALL} alt="Sharaka" className="h-12 w-auto object-contain" />
            <h1 className="text-2xl font-bold text-indigo-600 hidden md:block">{t.title}</h1>
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              {language === 'ar' ? t.english : t.arabic}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Large Logo */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          {/* Large Logo */}
          <div className="flex justify-center mb-8 animate-bounce">
            <img src={LOGO_LARGE} alt="Sharaka" className="h-80 w-80 object-contain" />
          </div>

          <h2 className="text-5xl font-bold text-gray-800 mb-4">{t.subtitle}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {language === 'ar'
              ? 'تواصل مع أفضل المستشارين والخبراء في مختلف المجالات'
              : 'Connect with the best consultants and experts in various fields'}
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
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.expertConsultants}</h3>
              <p className="text-gray-600 text-sm">{t.allCertified}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.flexibleSessions}</h3>
              <p className="text-gray-600 text-sm">{t.bookAtYourTime}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <Award className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.highQuality}</h3>
              <p className="text-gray-600 text-sm">{t.professionalConsultations}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultants Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">{t.consultants}</h3>

          {filteredConsultants.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">{t.noConsultants}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredConsultants.map((consultant: any) => (
                <div
                  key={consultant.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  {/* Avatar */}
                  <div className="h-48 bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-indigo-600">
                      {consultant.name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Name */}
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {consultant.name}
                    </h4>

                    {/* Specialization */}
                    <p className="text-indigo-600 font-semibold mb-3">
                      {consultant.specialty}
                    </p>

                    {/* Bio */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {consultant.bio}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="bg-blue-50 rounded p-2">
                        <p className="text-gray-600 text-xs">{t.experience}</p>
                        <p className="font-semibold text-gray-800">{consultant.experience} {language === 'ar' ? 'سنة' : 'years'}</p>
                      </div>
                      <div className="bg-green-50 rounded p-2">
                        <p className="text-gray-600 text-xs">{t.price}</p>
                        <p className="font-semibold text-gray-800">${consultant.price}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-gray-800">{consultant.rating}</span>
                      <span className="text-gray-600 text-sm">(24 reviews)</span>
                    </div>

                    {/* Book Button */}
                    <Button
                      onClick={() => {
                        setSelectedConsultant(consultant);
                        setShowBookingModal(true);
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {t.bookSession}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {language === 'ar' ? 'حجز جلسة مع' : 'Book session with'} {selectedConsultant.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.sessionTitle}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'مثال: استشارة عن التسويق الرقمي' : 'e.g., Digital Marketing Consultation'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.date}
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.time}
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.meetingType}
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                  <option value="zoom">Zoom</option>
                  <option value="google_meet">Google Meet</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="phone">{language === 'ar' ? 'هاتفي' : 'Phone'}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => setShowBookingModal(false)}
                variant="outline"
                className="flex-1"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={() => {
                  setShowBookingModal(false);
                  alert(t.bookingSuccess);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {t.confirm}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.aboutUs}</h4>
              <p className="text-gray-400 text-sm">
                {language === 'ar'
                  ? 'منصة متخصصة في توفير استشارات احترافية من أفضل الخبراء'
                  : 'A specialized platform providing professional consultations from top experts'}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.features}</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>{language === 'ar' ? 'جلسات مرنة' : 'Flexible Sessions'}</li>
                <li>{language === 'ar' ? 'خبراء معتمدون' : 'Certified Experts'}</li>
                <li>{language === 'ar' ? 'أسعار منافسة' : 'Competitive Prices'}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.contact}</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>📧 info@consulting.com</li>
                <li>📞 +966 11 2345 6789</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.becomeConsultant}</h4>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                {t.becomeConsultant}
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 {language === 'ar' ? 'منصة الاستشارات' : 'Consulting Platform'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
