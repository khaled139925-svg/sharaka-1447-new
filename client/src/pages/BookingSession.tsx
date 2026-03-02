import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface BookingSessionProps {
  consultantId?: number;
  onNavigate?: (page: string) => void;
}

export default function BookingSession({ consultantId, onNavigate }: BookingSessionProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    meetingType: 'zoom' as const,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const isRTL = language === 'ar';
  const createSessionMutation = trpc.sessions.create.useMutation();

  const translations = {
    ar: {
      title: 'حجز جلسة استشارية',
      subtitle: 'اختر التاريخ والوقت المناسب لك',
      sessionTitle: 'عنوان الجلسة',
      description: 'الوصف',
      date: 'التاريخ',
      time: 'الوقت',
      duration: 'المدة (دقيقة)',
      meetingType: 'نوع الاجتماع',
      zoom: 'Zoom',
      googleMeet: 'Google Meet',
      teams: 'Microsoft Teams',
      phone: 'اتصال هاتفي',
      book: 'حجز الجلسة',
      fillAllFields: 'يرجى ملء جميع الحقول',
      bookingSuccess: 'تم حجز الجلسة بنجاح!',
      english: 'English',
      arabic: 'العربية',
      back: 'رجوع',
    },
    en: {
      title: 'Book a Consultation Session',
      subtitle: 'Choose the date and time that works for you',
      sessionTitle: 'Session Title',
      description: 'Description',
      date: 'Date',
      time: 'Time',
      duration: 'Duration (minutes)',
      meetingType: 'Meeting Type',
      zoom: 'Zoom',
      googleMeet: 'Google Meet',
      teams: 'Microsoft Teams',
      phone: 'Phone Call',
      book: 'Book Session',
      fillAllFields: 'Please fill in all fields',
      bookingSuccess: 'Session booked successfully!',
      english: 'English',
      arabic: 'العربية',
      back: 'Back',
    },
  };

  const t = translations[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.date || !formData.time || !consultantId) {
      setError(t.fillAllFields);
      return;
    }

    setLoading(true);
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      await createSessionMutation.mutateAsync({
        consultantId,
        title: formData.title,
        description: formData.description,
        scheduledDate: dateTime,
        duration: parseInt(formData.duration),
        meetingType: formData.meetingType,
      });
      alert(t.bookingSuccess);
      onNavigate?.('home');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الحجز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => onNavigate?.('consultants')}
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
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-orange-500 mb-2 text-center">{t.title}</h1>
            <p className="text-gray-600 text-center mb-8">{t.subtitle}</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Session Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.sessionTitle}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t.sessionTitle}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.description}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t.description}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {t.date}
                    </div>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {t.time}
                    </div>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.duration}
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="30">30 دقيقة</option>
                  <option value="60">60 دقيقة</option>
                  <option value="90">90 دقيقة</option>
                  <option value="120">120 دقيقة</option>
                </select>
              </div>

              {/* Meeting Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.meetingType}
                </label>
                <select
                  name="meetingType"
                  value={formData.meetingType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="zoom">{t.zoom}</option>
                  <option value="google_meet">{t.googleMeet}</option>
                  <option value="teams">{t.teams}</option>
                  <option value="phone">{t.phone}</option>
                </select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? 'جاري الحجز...' : t.book}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
