import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search, Star, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface ConsultantsListProps {
  onNavigate?: (page: string, data?: any) => void;
}

export default function ConsultantsList({ onNavigate }: ConsultantsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const isRTL = language === 'ar';
  const { data: consultants = [], isLoading } = trpc.consultants.getAll.useQuery();

  const translations = {
    ar: {
      title: 'المستشارون المتخصصون',
      subtitle: 'اختر المستشار المناسب لك',
      search: 'ابحث عن مستشار...',
      specialization: 'التخصص',
      experience: 'سنوات الخبرة',
      hourlyRate: 'السعر بالساعة',
      bookSession: 'حجز جلسة',
      rating: 'التقييم',
      noResults: 'لم يتم العثور على مستشارين',
      english: 'English',
      arabic: 'العربية',
      back: 'رجوع',
      sar: 'ريال',
      years: 'سنة',
    },
    en: {
      title: 'Expert Consultants',
      subtitle: 'Choose the right consultant for you',
      search: 'Search for a consultant...',
      specialization: 'Specialization',
      experience: 'Years of Experience',
      hourlyRate: 'Hourly Rate',
      bookSession: 'Book Session',
      rating: 'Rating',
      noResults: 'No consultants found',
      english: 'English',
      arabic: 'العربية',
      back: 'Back',
      sar: 'SAR',
      years: 'years',
    },
  };

  const t = translations[language];

  const filteredConsultants = consultants.filter(consultant =>
    consultant.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition"
          >
            <ArrowLeft size={20} />
            <span>{t.back}</span>
          </button>

          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            {language === 'ar' ? t.english : t.arabic}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">{t.title}</h1>
          <p className="text-gray-600 text-lg">{t.subtitle}</p>
        </div>

        {/* Search */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-12 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Consultants Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : filteredConsultants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConsultants.map((consultant) => (
              <div
                key={consultant.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-24"></div>

                {/* Card Content */}
                <div className="px-6 py-4">
                  {/* Name */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {consultant.userId}
                  </h3>

                  {/* Specialization */}
                  <div className="flex items-center gap-2 mb-3 text-gray-600">
                    <Briefcase size={16} className="text-orange-500" />
                    <span>{consultant.specialization}</span>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-2 mb-3 text-gray-600">
                    <Clock size={16} className="text-blue-500" />
                    <span>{consultant.yearsOfExperience} {t.years}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(consultant.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({consultant.totalSessions || 0})</span>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {consultant.bio}
                  </p>

                  {/* Hourly Rate */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-2xl font-bold text-orange-500">
                      {consultant.hourlyRate} <span className="text-sm text-gray-600">{t.sar}</span>
                    </p>
                  </div>

                  {/* Book Button */}
                  <Button
                    onClick={() => onNavigate?.('booking', { consultantId: consultant.userId })}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
                  >
                    {t.bookSession}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Briefcase } from 'lucide-react';
