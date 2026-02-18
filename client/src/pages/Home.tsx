'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { trpc } from '@/lib/trpc';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const isRTL = language === 'ar';

  const t = language === 'ar' ? {
    platformName: 'منصة الخدمات المتكاملة',
    description: 'منصة أعمال رقمية متكاملة تجمع الاستشارات، التعهيد وإدارة المشاريع، السوق الإلكتروني، ونظام نقاط وشريك نجاحك',
    startNow: 'ابدأ الآن',
    consultants: 'المستشارون والاستشارات',
    services: 'خدمات التعهيد والإدارة',
    marketplace: 'السوق الإلكتروني',
    points: 'نظام النقاط والرصيد المالي',
    bookAppointment: 'حجز موعد',
    enterStore: 'دخول المتجر',
    paths: 'المسارات المتاحة',
    contact: 'تواصل معنا',
    send: 'إرسال الرسالة',
    name: 'اسمك',
    email: 'بريدك الإلكتروني',
    phone: 'رقم الهاتف',
    subject: 'الموضوع',
    message: 'رسالتك',
    about: 'من نحن',
    vision: 'رؤية منصة شراكة',
    visionText: 'منصة شراكة هي منصة أعمال رقمية متكاملة تهدف إلى ربط الأفراد والشركات والمستشارين والمتاجر في بيئة واحدة آمنة وموثوقة.',
  } : {
    platformName: 'Integrated Services Platform',
    description: 'An integrated digital business platform that brings together consultations, outsourcing and project management, e-commerce marketplace, and points system',
    startNow: 'Start Now',
    consultants: 'Consultants & Consultations',
    services: 'Outsourcing & Management Services',
    marketplace: 'E-Commerce Marketplace',
    points: 'Points & Financial Balance System',
    bookAppointment: 'Book Appointment',
    enterStore: 'Enter Store',
    paths: 'Available Paths',
    contact: 'Contact Us',
    send: 'Send Message',
    name: 'Your Name',
    email: 'Your Email',
    phone: 'Phone Number',
    subject: 'Subject',
    message: 'Your Message',
    about: 'About Us',
    vision: 'Sharaka Platform Vision',
    visionText: 'Sharaka is an integrated digital business platform that aims to connect individuals, companies, consultants and stores in one safe and reliable environment.',
  };

  const sendContactMutation = trpc.admin.sendContactMessage.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendContactMutation.mutateAsync(formData);
      alert('تم إرسال رسالتك بنجاح!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      alert('حدث خطأ في الإرسال');
      console.error(error);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-green-100 to-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setLanguage('ar')} className={`px-3 py-1 rounded ${language === 'ar' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
              العربية
            </button>
            <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
              English
            </button>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">{t.platformName}</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="w-32 h-32 mx-auto mb-8 bg-green-400 rounded-lg flex items-center justify-center">
            <span className="text-6xl">🇸🇦</span>
          </div>
          <h2 className="text-4xl font-bold text-orange-500 mb-4">{t.platformName}</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{t.description}</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
            {t.startNow}
          </Button>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-2">👨‍💼</div>
              <h3 className="font-bold text-blue-600">{t.consultants}</h3>
              <p className="text-sm text-gray-600">استشارات متخصصة</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-2">💼</div>
              <h3 className="font-bold text-blue-600">{t.services}</h3>
              <p className="text-sm text-gray-600">خدمات التعهيد</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-2">🛒</div>
              <h3 className="font-bold text-blue-600">{t.marketplace}</h3>
              <p className="text-sm text-gray-600">متاجر إلكترونية</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="font-bold text-blue-600">{t.points}</h3>
              <p className="text-sm text-gray-600">نظام الحوافز</p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultants Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">{t.consultants}</h2>
          <div className="grid grid-cols-3 gap-8">
            {['د. أحمد محمد', 'أ. فاطمة علي', 'م. سارة حسن'].map((name, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full mb-4"></div>
                <h3 className="font-bold mb-2">{name}</h3>
                <p className="text-sm text-gray-600 mb-4">متخصص في المجال</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  {t.bookAppointment}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">{t.services}</h2>
          <div className="grid grid-cols-3 gap-8">
            {['التوظيف والاستقطاب', 'إدارة الموظفين', 'إدارة المشاريع'].map((service, i) => (
              <div key={i} className="p-6 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="font-bold mb-2">{service}</h3>
                <p className="text-sm text-gray-600">خدمة متخصصة</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">{t.marketplace}</h2>
          <div className="grid grid-cols-4 gap-6">
            {['متجر التكنولوجيا', 'متجر الملابس', 'متجر الديكور', 'متجر الكتب'].map((store, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-full h-32 bg-gray-300 rounded mb-4"></div>
                <h3 className="font-bold mb-2">{store}</h3>
                <p className="text-sm text-yellow-500 mb-4">⭐ 4.8 (234 تقييم)</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  {t.enterStore}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paths Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">{t.paths}</h2>
          <div className="grid grid-cols-6 gap-4">
            {[
              { icon: '📚', name: 'المسار الطلابي' },
              { icon: '👔', name: 'مسار الموظف' },
              { icon: '🛍️', name: 'مسار التاجر' },
              { icon: '🚀', name: 'رائد الأعمال' },
              { icon: '🎯', name: 'الباحث عن عمل' },
              { icon: '🔬', name: 'الباحث' },
            ].map((path, i) => (
              <div key={i} className="text-center p-4">
                <div className="text-4xl mb-2">{path.icon}</div>
                <h3 className="font-bold text-sm">{path.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Points Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">{t.points}</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { num: '1', icon: '⭐', title: 'اكسب النقاط' },
              { num: '2', icon: '💵', title: 'تجميع الرصيد' },
              { num: '3', icon: '💳', title: 'استخدم الرصيد' },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-blue-600">{step.num}. {step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">{t.contact}</h2>
          <div className="max-w-2xl mx-auto bg-gradient-to-b from-orange-50 to-white rounded-lg p-8 border-2 border-dashed border-orange-300">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t.name}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder={t.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="tel"
                placeholder={t.phone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder={t.subject}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <textarea
                placeholder={t.message}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded h-32"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded">
                {t.send}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">{t.about}</h2>
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">{t.vision}</h3>
            <p className="text-gray-600">{t.visionText}</p>
          </div>
        </div>
      </section>

      {/* Chat Button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl shadow-lg">
        💬
      </button>
    </div>
  );
}
