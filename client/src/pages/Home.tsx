'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const LOGO_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/nOdruZWcjEkuqgXg.jpeg';

const translations = {
  ar: {
    platformName: 'منصة الخدمات المتكاملة',
    description: 'منصة أعمال رقمية متكاملة تجمع الاستشارات، التعهيد وإدارة المشاريع، السوق الإلكتروني، ونظام نقاط وشريك نجاحك',
    startNow: 'ابدأ الآن',
    consultants: 'المستشارون',
    consultantsDesc: 'استشارات متخصصة',
    services: 'الخدمات',
    servicesDesc: 'خدمات التعهيد',
    marketplace: 'السوق',
    marketplaceDesc: 'متاجر إلكترونية',
    points: 'النقاط',
    pointsDesc: 'نظام الحوافز',
    consultationsTitle: 'المستشارون والاستشارات',
    consultationsSubtitle: 'استشارات متخصصة من الخبراء',
    bookAppointment: 'حجز موعد',
    servicesTitle: 'خدمات التعهيد والإدارة',
    servicesSubtitle: 'حلول متكاملة لإدارة موارد شركتك',
    marketplaceTitle: 'السوق الإلكتروني',
    marketplaceSubtitle: 'منصة متكاملة تجمع أفضل المتاجر والعروض',
    enterStore: 'دخول المتجر',
    pathsTitle: 'المسارات المتاحة',
    pathsSubtitle: 'اختر المسار المناسب لك',
    pointsTitle: 'نظام النقاط والرصيد المالي',
    pointsSubtitle: 'نظام حوافز ذكي يحول عمليات الشراء إلى رصيد مالي حقيقي',
    contact: 'تواصل معنا',
    contactDesc: 'نحن هنا للإجابة على جميع أسئلتك',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    name: 'اسمك',
    emailPlaceholder: 'بريدك الإلكتروني',
    phoneInput: 'رقم الهاتف',
    subject: 'الموضوع',
    message: 'رسالتك',
    send: 'إرسال الرسالة',
    about: 'من نحن',
    vision: 'رؤية منصة شراكة',
    visionText: 'منصة شراكة هي منصة أعمال رقمية متكاملة تهدف إلى ربط الأفراد والشركات والمستشارين والمتاجر في بيئة واحدة آمنة وموثوقة.',
    liveSupport: 'دعم فوري',
  },
  en: {
    platformName: 'Integrated Services Platform',
    description: 'An integrated digital business platform that brings together consultations, outsourcing and project management, e-commerce marketplace, and points system',
    startNow: 'Start Now',
    consultants: 'Consultants',
    consultantsDesc: 'Specialized consultations',
    services: 'Services',
    servicesDesc: 'Outsourcing services',
    marketplace: 'Marketplace',
    marketplaceDesc: 'E-commerce stores',
    points: 'Points',
    pointsDesc: 'Rewards system',
    consultationsTitle: 'Consultants & Consultations',
    consultationsSubtitle: 'Specialized consultations from experts',
    bookAppointment: 'Book Appointment',
    servicesTitle: 'Outsourcing & Management Services',
    servicesSubtitle: 'Integrated solutions for managing your company resources',
    marketplaceTitle: 'E-Commerce Marketplace',
    marketplaceSubtitle: 'An integrated platform that brings together the best stores and offers',
    enterStore: 'Enter Store',
    pathsTitle: 'Available Paths',
    pathsSubtitle: 'Choose the right path for you',
    pointsTitle: 'Points & Financial Balance System',
    pointsSubtitle: 'A smart rewards system that converts purchases into real financial credit',
    contact: 'Contact Us',
    contactDesc: 'We are here to answer all your questions',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    name: 'Your Name',
    emailPlaceholder: 'Your Email',
    phoneInput: 'Phone Number',
    subject: 'Subject',
    message: 'Your Message',
    send: 'Send Message',
    about: 'About Us',
    vision: 'Sharaka Platform Vision',
    visionText: 'Sharaka is an integrated digital business platform that aims to connect individuals, companies, consultants and stores in one safe and reliable environment.',
    liveSupport: 'Live Support',
  }
};

const CONSULTANTS = [
  {
    id: 1,
    name: 'د. أحمد محمد',
    specialty: 'استشارات إدارة الأعمال',
    bio: 'خبرة 15 سنة في إدارة المشاريع والشركات',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'أ. فاطمة علي',
    specialty: 'التسويق الرقمي',
    bio: 'متخصصة في التسويق الإلكتروني والعلامات التجارية',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'م. سارة حسن',
    specialty: 'تطوير البرمجيات',
    bio: 'مهندسة برمجيات بخبرة 10 سنوات في التطوير',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
];

const SERVICES = [
  { title: 'التوظيف والاستقطاب', description: 'نساعدك في البحث عن أفضل الكوادر المتخصصة' },
  { title: 'إدارة الموظفين', description: 'إدارة متكاملة لموارد بشرية احترافية' },
  { title: 'إدارة المشاريع', description: 'تخطيط وتنفيذ المشاريع بكفاءة عالية' },
];

const STORES = [
  { name: 'متجر التكنولوجيا', category: 'إلكترونيات', rating: 4.8, reviews: 234 },
  { name: 'متجر الملابس', category: 'ملابس', rating: 4.6, reviews: 189 },
  { name: 'متجر الديكور', category: 'ديكور', rating: 4.7, reviews: 156 },
  { name: 'متجر الكتب', category: 'كتب', rating: 4.9, reviews: 312 },
];

const PATHS = [
  { icon: '📚', title: 'المسار الطلابي', description: 'دورات وتحضير للاختبارات' },
  { icon: '👔', title: 'مسار الموظف', description: 'تطوير مهني وفرص عمل' },
  { icon: '🛍️', title: 'مسار التاجر', description: 'دعم المتاجر الإلكترونية' },
  { icon: '🚀', title: 'رائد الأعمال', description: 'استشارات وتمويل' },
  { icon: '🎯', title: 'الباحث عن عمل', description: 'فرص عمل وتطوير مهارات' },
  { icon: '🔬', title: 'الباحث', description: 'موارد بحثية وتعاون' },
];

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  
  const sendContactMutation = trpc.admin.sendContactMessage.useMutation();
  const t = translations[language];
  const isRTL = language === 'ar';

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
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">منصة الخدمات المتكاملة</div>
          <div className="flex gap-4">
            <button onClick={() => setLanguage('ar')} className={`px-3 py-2 ${language === 'ar' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
              العربية
            </button>
            <button onClick={() => setLanguage('en')} className={`px-3 py-2 ${language === 'en' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
              English
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-100 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 bg-green-400 rounded-lg flex items-center justify-center">
              <div className="text-6xl">🇸🇦</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-orange-500 mb-4">{t.platformName}</h1>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">{t.description}</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg">
            {t.startNow}
          </Button>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="text-blue-600 font-bold mb-2">{t.points}</h3>
              <p className="text-gray-600 text-sm">{t.pointsDesc}</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🛒</div>
              <h3 className="text-blue-600 font-bold mb-2">{t.marketplace}</h3>
              <p className="text-gray-600 text-sm">{t.marketplaceDesc}</p>
            </div>
            <div>
              <div className="text-4xl mb-2">💼</div>
              <h3 className="text-blue-600 font-bold mb-2">{t.services}</h3>
              <p className="text-gray-600 text-sm">{t.servicesDesc}</p>
            </div>
            <div>
              <div className="text-4xl mb-2">👨‍💼</div>
              <h3 className="text-blue-600 font-bold mb-2">{t.consultants}</h3>
              <p className="text-gray-600 text-sm">{t.consultantsDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultants */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-12">{t.consultationsTitle}</h2>
          <p className="text-center text-gray-600 mb-12">{t.consultationsSubtitle}</p>
          <div className="grid grid-cols-3 gap-8">
            {CONSULTANTS.map(consultant => (
              <div key={consultant.id} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2">{consultant.name}</h3>
                <p className="text-blue-600 font-semibold mb-2">{consultant.specialty}</p>
                <p className="text-gray-600 text-sm mb-4">{consultant.bio}</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">{t.bookAppointment}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-12">{t.servicesTitle}</h2>
          <p className="text-center text-gray-600 mb-12">{t.servicesSubtitle}</p>
          <div className="grid grid-cols-3 gap-8">
            {SERVICES.map((service, idx) => (
              <div key={idx} className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-12">{t.marketplaceTitle}</h2>
          <p className="text-center text-gray-600 mb-12">{t.marketplaceSubtitle}</p>
          <div className="grid grid-cols-4 gap-8">
            {STORES.map((store, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-full h-32 bg-gray-300 rounded mb-4"></div>
                <h3 className="font-bold mb-2">{store.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{store.category}</p>
                <div className="flex justify-center items-center gap-2 mb-4">
                  <span className="text-yellow-500">★{store.rating}</span>
                  <span className="text-gray-600 text-sm">({store.reviews} تقييم)</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">{t.enterStore}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paths */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-12">{t.pathsTitle}</h2>
          <p className="text-center text-gray-600 mb-12">{t.pathsSubtitle}</p>
          <div className="grid grid-cols-6 gap-6">
            {PATHS.map((path, idx) => (
              <div key={idx} className="bg-green-50 rounded-lg p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl mb-3">{path.icon}</div>
                <h3 className="font-bold mb-2 text-sm">{path.title}</h3>
                <p className="text-gray-600 text-xs">{path.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Points System */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-12">{t.pointsTitle}</h2>
          <p className="text-center text-gray-600 mb-12">{t.pointsSubtitle}</p>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="font-bold mb-2">1. اكسب النقاط</h3>
              <p className="text-gray-600">من كل عملية شراء</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💵</div>
              <h3 className="font-bold mb-2">2. تجميع الرصيد</h3>
              <p className="text-gray-600">رصيد مالي حقيقي</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="font-bold mb-2">3. استخدم الرصيد</h3>
              <p className="text-gray-600">في أي متجر</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-4">{t.contact}</h2>
          <p className="text-center text-gray-600 mb-12">{t.contactDesc}</p>
          
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="font-bold mb-4">📧 {t.email}</h3>
              <p className="text-gray-600">khaled139925@gmail.com</p>
              
              <h3 className="font-bold mt-6 mb-4">📞 {t.phone}</h3>
              <p className="text-gray-600">+966 11 2345 6789</p>
              
              <h3 className="font-bold mt-6 mb-4">📍 {t.address}</h3>
              <p className="text-gray-600">الرياض، السعودية</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-green-50 rounded-lg p-8">
              <input
                type="text"
                placeholder={t.name}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                required
              />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                required
              />
              <input
                type="tel"
                placeholder={t.phoneInput}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                required
              />
              <input
                type="text"
                placeholder={t.subject}
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                required
              />
              <textarea
                placeholder={t.message}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-2 mb-4 h-24"
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                {t.send}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">{t.about}</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-8">
            <h3 className="text-xl font-bold mb-4">{t.vision}</h3>
            <p className="text-gray-700">{t.visionText}</p>
          </div>
        </div>
      </section>

      {/* Chat Button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-2xl">
        💬
      </button>
    </div>
  );
}
