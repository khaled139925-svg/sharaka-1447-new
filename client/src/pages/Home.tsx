'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Users, Briefcase, ShoppingBag, Award, MessageCircle, Info, 
  ChevronRight, MapPin, TrendingUp, Zap, Mail, Phone, AlertCircle,
  ExternalLink, ArrowRight, Globe, Menu, X
} from 'lucide-react';

const LOGO_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/RqiKqWIUsupxHOCa.png';
const USER_EMAIL = 'khaled1399259@gmail.com';

// نظام اللغات
const translations = {
  ar: {
    selectCountry: 'اختر الدولة',
    selectLanguage: 'اللغة',
    tagline: 'شريك نجاحك',
    platformName: 'منصة الخدمات المتكاملة',
    description: 'منصة أعمال رقمية متكاملة تجمع الإستشارات، التعهيد وإدارة المشاريع، السوق الإلكتروني، ونظام نقاط وشريك نجاحك',
    startNow: 'ابدأ الآن',
    consultants: 'المستشارون والاستشارات',
    consultantsDesc: 'استشارات متخصصة من الخبراء',
    bookAppointment: 'حجز موعد',
    services: 'خدمات التعهيد والإدارة',
    servicesDesc: 'حلول متكاملة لإدارة موارد شركتك',
    marketplace: 'السوق الإلكتروني',
    marketplaceDesc: 'منصة متكاملة تجمع أفضل المتاجر والعروض',
    enterStore: 'دخول المتجر',
    paths: 'المسارات المتاحة',
    pathsDesc: 'اختر المسار المناسب لك',
    points: 'نظام النقاط والرصيد المالي',
    pointsDesc: 'نظام حوافز ذكي يحول عمليات الشراء إلى رصيد مالي حقيقي',
    earnPoints: '1. اكسب النقاط',
    earnPointsDesc: 'من كل عملية شراء',
    collectBalance: '2. تجميع الرصيد',
    collectBalanceDesc: 'رصيد مالي حقيقي',
    useBalance: '3. استخدم الرصيد',
    useBalanceDesc: 'في أي متجر',
    contact: 'تواصل معنا',
    contactDesc: 'نحن هنا للإجابة على جميع أسئلتك',
    email: 'البريد الإلكتروني',
    phoneLabel: 'الهاتف',
    address: 'العنوان',
    about: 'من نحن',
    vision: 'رؤية منصة شراكة',
    visionText: 'منصة شراكة هي منصة أعمال رقمية متكاملة تهدف إلى ربط الأفراد والشركات والمستشارين والمتاجر في بيئة واحدة آمنة وموثوقة.',
    commitment: 'التزام منصة شراكة',
    commitmentText: 'تلتزم منصة شراكة بدفع راتب شهر كامل من كل 12 شهر للموظف الذي يعمل لدى العميل ضمن عقد التعهيد.',
    name: 'اسمك',
    emailPlaceholder: 'بريدك الإلكتروني',
    phoneInput: 'رقم الهاتف',
    subject: 'الموضوع',
    message: 'رسالتك',
    send: 'إرسال الرسالة',
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    quickLinks: 'روابط سريعة',
    legal: 'قانوني',
    privacy: 'سياسة الخصوصية',
    terms: 'الشروط والأحكام',
    allRights: 'جميع الحقوق محفوظة',
    hiring: 'التوظيف والاستقطاب',
    hiringDesc: 'نساعدك في البحث عن أفضل الكوادر المتخصصة',
    staffManagement: 'إدارة الموظفين',
    staffManagementDesc: 'إدارة متكاملة لموارد بشرية احترافية',
    projectManagement: 'إدارة المشاريع',
    projectManagementDesc: 'تخطيط وتنفيذ المشاريع بكفاءة عالية',
    chatSupport: 'دعم فوري',
    chatMessage: 'مرحبا! كيف يمكننا مساعدتك؟',
    chatClose: 'إغلاق',
    typeMessage: 'اكتب رسالتك...',
  },
  en: {
    selectCountry: 'Select Country',
    selectLanguage: 'Language',
    tagline: 'Your Success Partner',
    platformName: 'Integrated Services Platform',
    description: 'An integrated digital business platform that brings together consultations, outsourcing and project management, e-commerce marketplace, points system and your success partner',
    startNow: 'Start Now',
    consultants: 'Consultants & Consultations',
    consultantsDesc: 'Specialized consultations from experts',
    bookAppointment: 'Book Appointment',
    services: 'Outsourcing & Management Services',
    servicesDesc: 'Integrated solutions for managing your company resources',
    marketplace: 'E-Commerce Marketplace',
    marketplaceDesc: 'An integrated platform that brings together the best stores and offers',
    enterStore: 'Enter Store',
    paths: 'Available Paths',
    pathsDesc: 'Choose the right path for you',
    points: 'Points & Financial Balance System',
    pointsDesc: 'A smart rewards system that converts purchases into real financial credit',
    earnPoints: '1. Earn Points',
    earnPointsDesc: 'From every purchase',
    collectBalance: '2. Collect Balance',
    collectBalanceDesc: 'Real financial credit',
    useBalance: '3. Use Balance',
    useBalanceDesc: 'In any store',
    contact: 'Contact Us',
    contactDesc: 'We are here to answer all your questions',
    email: 'Email',
    phoneLabel: 'Phone',
    address: 'Address',
    about: 'About Us',
    vision: 'Sharaka Platform Vision',
    visionText: 'Sharaka is an integrated digital business platform that aims to connect individuals, companies, consultants and stores in one safe and reliable environment.',
    commitment: 'Sharaka Platform Commitment',
    commitmentText: 'Sharaka commits to paying one full month salary for every 12 months for employees working with clients under outsourcing contracts.',
    name: 'Your Name',
    emailPlaceholder: 'Your Email',
    phoneInput: 'Phone Number',
    subject: 'Subject',
    message: 'Your Message',
    send: 'Send Message',
    confirm: 'Confirm',
    cancel: 'Cancel',
    quickLinks: 'Quick Links',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    allRights: 'All rights reserved',
    hiring: 'Recruitment & Hiring',
    hiringDesc: 'We help you find the best specialized talent',
    staffManagement: 'Staff Management',
    staffManagementDesc: 'Integrated professional human resources management',
    projectManagement: 'Project Management',
    projectManagementDesc: 'Planning and executing projects with high efficiency',
    chatSupport: 'Live Support',
    chatMessage: 'Hello! How can we help you?',
    chatClose: 'Close',
    typeMessage: 'Type your message...',
  }
};

// قائمة الدول المحدثة
const COUNTRIES = [
  { code: 'SA', name: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦', region: 'gulf' },
  { code: 'AE', name: 'الإمارات', nameEn: 'UAE', flag: '🇦🇪', region: 'gulf' },
  { code: 'KW', name: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼', region: 'gulf' },
  { code: 'QA', name: 'قطر', nameEn: 'Qatar', flag: '🇶🇦', region: 'gulf' },
  { code: 'BH', name: 'البحرين', nameEn: 'Bahrain', flag: '🇧🇭', region: 'gulf' },
  { code: 'OM', name: 'عمان', nameEn: 'Oman', flag: '🇴🇲', region: 'gulf' },
  { code: 'YE', name: 'اليمن', nameEn: 'Yemen', flag: '🇾🇪', region: 'gulf' },
  { code: 'EG', name: 'مصر', nameEn: 'Egypt', flag: '🇪🇬', region: 'arab' },
  { code: 'JO', name: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴', region: 'arab' },
  { code: 'LB', name: 'لبنان', nameEn: 'Lebanon', flag: '🇱🇧', region: 'arab' },
  { code: 'SY', name: 'سوريا', nameEn: 'Syria', flag: '🇸🇾', region: 'arab' },
  { code: 'IQ', name: 'العراق', nameEn: 'Iraq', flag: '🇮🇶', region: 'arab' },
  { code: 'MA', name: 'المغرب', nameEn: 'Morocco', flag: '🇲🇦', region: 'arab' },
  { code: 'TN', name: 'تونس', nameEn: 'Tunisia', flag: '🇹🇳', region: 'arab' },
  { code: 'DZ', name: 'الجزائر', nameEn: 'Algeria', flag: '🇩🇿', region: 'arab' },
  { code: 'SD', name: 'السودان', nameEn: 'Sudan', flag: '🇸🇩', region: 'arab' },
  { code: 'PK', name: 'باكستان', nameEn: 'Pakistan', flag: '🇵🇰', region: 'asia' },
  { code: 'GB', name: 'بريطانيا', nameEn: 'United Kingdom', flag: '🇬🇧', region: 'europe' },
  { code: 'DE', name: 'ألمانيا', nameEn: 'Germany', flag: '🇩🇪', region: 'europe' },
  { code: 'FR', name: 'فرنسا', nameEn: 'France', flag: '🇫🇷', region: 'europe' },
  { code: 'IT', name: 'إيطاليا', nameEn: 'Italy', flag: '🇮🇹', region: 'europe' },
  { code: 'ES', name: 'إسبانيا', nameEn: 'Spain', flag: '🇪🇸', region: 'europe' },
  { code: 'NL', name: 'هولندا', nameEn: 'Netherlands', flag: '🇳🇱', region: 'europe' },
  { code: 'SE', name: 'السويد', nameEn: 'Sweden', flag: '🇸🇪', region: 'europe' },
  { code: 'CH', name: 'سويسرا', nameEn: 'Switzerland', flag: '🇨🇭', region: 'europe' },
  { code: 'US', name: 'أمريكا', nameEn: 'USA', flag: '🇺🇸', region: 'americas' },
  { code: 'CA', name: 'كندا', nameEn: 'Canada', flag: '🇨🇦', region: 'americas' },
  { code: 'MX', name: 'المكسيك', nameEn: 'Mexico', flag: '🇲🇽', region: 'americas' },
  { code: 'BR', name: 'البرازيل', nameEn: 'Brazil', flag: '🇧🇷', region: 'americas' },
];

const CONSULTANTS = [
  {
    id: 1,
    name: 'د. أحمد محمد',
    nameEn: 'Dr. Ahmed Mohammed',
    specialty: 'استشارات إدارة الأعمال',
    specialtyEn: 'Business Management Consultations',
    bio: 'خبرة 15 سنة في إدارة المشاريع والشركات',
    bioEn: '15 years of experience in project and company management',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    zohoDuration: 60,
  },
  {
    id: 2,
    name: 'أ. فاطمة علي',
    nameEn: 'Fatima Ali',
    specialty: 'التسويق الرقمي',
    specialtyEn: 'Digital Marketing',
    bio: 'متخصصة في التسويق الإلكتروني والعلامات التجارية',
    bioEn: 'Specialized in e-marketing and branding',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    zohoDuration: 45,
  },
  {
    id: 3,
    name: 'م. سارة حسن',
    nameEn: 'Sarah Hassan',
    specialty: 'تطوير البرمجيات',
    specialtyEn: 'Software Development',
    bio: 'مهندسة برمجيات بخبرة 10 سنوات في التطوير',
    bioEn: '10 years of software engineering experience',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    zohoDuration: 90,
  },
];

const SERVICES = [
  {
    id: 1,
    title: 'التوظيف والاستقطاب',
    titleEn: 'Recruitment & Hiring',
    description: 'نساعدك في البحث عن أفضل الكوادر المتخصصة',
    descriptionEn: 'We help you find the best specialized talent',
    icon: Users,
  },
  {
    id: 2,
    title: 'إدارة الموظفين',
    titleEn: 'Staff Management',
    description: 'إدارة متكاملة لموارد بشرية احترافية',
    descriptionEn: 'Integrated professional human resources management',
    icon: Briefcase,
  },
  {
    id: 3,
    title: 'إدارة المشاريع',
    titleEn: 'Project Management',
    description: 'تخطيط وتنفيذ المشاريع بكفاءة عالية',
    descriptionEn: 'Planning and executing projects with high efficiency',
    icon: Award,
  },
];

const STORES = [
  { id: 1, name: 'متجر التكنولوجيا', nameEn: 'Tech Store', category: 'إلكترونيات', categoryEn: 'Electronics', rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop' },
  { id: 2, name: 'متجر الملابس', nameEn: 'Fashion Store', category: 'ملابس', categoryEn: 'Clothing', rating: 4.6, reviews: 189, image: 'https://images.unsplash.com/photo-1441984904556-0ac8ce9fdf67?w=400&h=300&fit=crop' },
  { id: 3, name: 'متجر الديكور', nameEn: 'Decor Store', category: 'ديكور', categoryEn: 'Decor', rating: 4.7, reviews: 156, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
  { id: 4, name: 'متجر الكتب', nameEn: 'Book Store', category: 'كتب', categoryEn: 'Books', rating: 4.9, reviews: 312, image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop' },
];

const PATHS = [
  { 
    id: 'student', 
    title: 'المسار الطلابي', 
    titleEn: 'Student Path',
    icon: '📚', 
    desc: 'دورات وتحضير للاختبارات',
    descEn: 'Courses and exam preparation',
  },
  { 
    id: 'employee', 
    title: 'مسار الموظف', 
    titleEn: 'Employee Path',
    icon: '👔', 
    desc: 'تطوير مهني وفرص عمل',
    descEn: 'Professional development and job opportunities',
  },
  { 
    id: 'trader', 
    title: 'مسار التاجر', 
    titleEn: 'Trader Path',
    icon: '🛍️', 
    desc: 'دعم المتاجر الإلكترونية',
    descEn: 'E-commerce store support',
  },
  { 
    id: 'entrepreneur', 
    title: 'رائد الأعمال', 
    titleEn: 'Entrepreneur',
    icon: '🚀', 
    desc: 'استشارات وتمويل',
    descEn: 'Consultations and financing',
  },
  { 
    id: 'jobseeker', 
    title: 'الباحث عن عمل', 
    titleEn: 'Job Seeker',
    icon: '🎯', 
    desc: 'فرص عمل وتطوير مهارات',
    descEn: 'Job opportunities and skill development',
  },
  { 
    id: 'researcher', 
    title: 'الباحث', 
    titleEn: 'Researcher',
    icon: '🔬', 
    desc: 'موارد بحثية وتعاون',
    descEn: 'Research resources and collaboration',
  },
];

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const t = translations[language];
  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);
  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 50, backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }} className="">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Sharaka" className="h-16 w-auto object-contain" />
            <div className="hidden md:block">
              <p className="text-lg font-bold text-orange-500 leading-tight">منصة الخدمات المتكاملة</p>
              <p className="text-sm text-blue-600 font-semibold">Integrated Services Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-orange-100 transition-all duration-300 md:hidden"
            >
              {showMenu ? (
                <X size={24} className="text-orange-500" />
              ) : (
                <Menu size={24} className="text-orange-500" />
              )}
            </button>

            <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-4 py-3 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300"
            >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span className="text-sm font-semibold text-blue-600">{language === 'ar' ? 'العربية' : 'English'}</span>
              </button>
              {showLanguageMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-blue-300 z-50 min-w-[140px]">
                  {[
                    { code: 'ar', label: 'العربية' },
                    { code: 'en', label: 'English' },
                  ].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as 'ar' | 'en');
                        setShowLanguageMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowCountryMenu(!showCountryMenu)}
                className="flex items-center gap-2 px-4 py-3 rounded-md border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-all duration-300"
              >
                <span className="text-lg">{currentCountry?.flag}</span>
                <span className="text-sm font-semibold text-orange-600">{isRTL ? currentCountry?.name : currentCountry?.nameEn}</span>
              </button>
              {showCountryMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-orange-300 z-50 max-h-96 overflow-y-auto min-w-[200px]">
                  {COUNTRIES.map(country => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setShowCountryMenu(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-sm">{isRTL ? country.name : country.nameEn}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showMenu && (
          <div className="md:hidden">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <a href="#consultants" onClick={() => setShowMenu(false)} className="block px-4 py-2 transition-all duration-300 font-semibold">المستشارون</a>
              <a href="#services" onClick={() => setShowMenu(false)} className="block px-4 py-2 transition-all duration-300 font-semibold">الخدمات</a>
              <a href="#marketplace" onClick={() => setShowMenu(false)} className="block px-4 py-2 transition-all duration-300 font-semibold">السوق</a>
              <a href="#paths" onClick={() => setShowMenu(false)} className="block px-4 py-2 transition-all duration-300 font-semibold">المسارات</a>
              <a href="#points" onClick={() => setShowMenu(false)} className="block px-4 py-2 transition-all duration-300 font-semibold">النقاط</a>
              <a href="#contact" onClick={() => setShowMenu(false)} className="block px-4 py-2 transition-all duration-300 font-semibold">تواصل</a>
            </div>
          </div>
        )}
      </header>

      <main style={{ marginTop: '80px' }}>
        <section className="py-8 bg-gradient-to-b from-green-50 to-background">
          <div className="container mx-auto px-4 text-center space-y-2">
            <img src={LOGO_URL} alt="Sharaka" className="h-64 md:h-80 w-auto mx-auto animate-bounce" style={{animationDuration: '3s'}} />
            <h1 className="text-7xl md:text-9xl font-bold text-orange-500 leading-tight">{t.platformName}</h1>
            <p className="text-3xl md:text-4xl text-gray-600 max-w-3xl mx-auto font-semibold">{t.description}</p>
          </div>
        </section>

        <section id="consultants" className="py-8 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-orange-500 mb-1 text-center">{t.consultants}</h2>
            <p className="text-3xl text-blue-600 mb-6 text-center font-semibold">{t.consultantsDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CONSULTANTS.map(consultant => (
                <div key={consultant.id} className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                  <img src={consultant.image} alt={consultant.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 className="text-3xl font-bold text-orange-500 mb-1">{isRTL ? consultant.name : consultant.nameEn}</h3>
                  <p className="text-xl text-blue-600 mb-2 font-semibold">{isRTL ? consultant.specialty : consultant.specialtyEn}</p>
                  <p className="text-lg text-gray-600">{isRTL ? consultant.bio : consultant.bioEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="py-8 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-orange-500 mb-1 text-center">{t.services}</h2>
            <p className="text-3xl text-blue-600 mb-6 text-center font-semibold">{t.servicesDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map(service => {
                const IconComponent = service.icon;
                return (
                  <div key={service.id} className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                    <IconComponent size={40} className="text-orange-500 mb-4" />
                    <h3 className="text-3xl font-bold text-orange-500 mb-2">{isRTL ? service.title : service.titleEn}</h3>
                    <p className="text-xl text-blue-600 font-semibold">{isRTL ? service.description : service.descriptionEn}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="marketplace" className="py-8 bg-orange-50">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-orange-500 mb-1 text-center">{t.marketplace}</h2>
            <p className="text-3xl text-blue-600 mb-6 text-center font-semibold">{t.marketplaceDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {STORES.map(store => (
                <div key={store.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-200">
                  <img src={store.image} alt={store.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-2xl font-bold text-orange-500 mb-1">{isRTL ? store.name : store.nameEn}</h3>
                    <p className="text-lg text-blue-600 mb-2 font-semibold">{isRTL ? store.category : store.categoryEn}</p>
                    <p className="text-lg text-yellow-500">★ {store.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="paths" className="py-8 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-orange-500 mb-1 text-center">{t.paths}</h2>
            <p className="text-3xl text-blue-600 mb-6 text-center font-semibold">{t.pathsDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PATHS.map(path => (
                <div key={path.id} className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                  <div className="text-4xl mb-4">{path.icon}</div>
                  <h3 className="text-2xl font-bold text-orange-500 mb-2">{isRTL ? path.title : path.titleEn}</h3>
                  <p className="text-lg text-blue-600 font-semibold">{isRTL ? path.desc : path.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="points" className="py-8 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-6xl font-bold text-orange-500 mb-1 text-center">{t.points}</h2>
            <p className="text-3xl text-blue-600 mb-6 text-center font-semibold">{t.pointsDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                <div className="text-4xl mb-4">⚡</div>
                <p className="text-xl text-blue-600 font-semibold">{t.earnPoints}</p>
                <p className="text-lg text-gray-600">{t.earnPointsDesc}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                <div className="text-4xl mb-4">🏅</div>
                <p className="text-xl text-blue-600 font-semibold">{t.collectBalance}</p>
                <p className="text-lg text-gray-600">{t.collectBalanceDesc}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-xl text-blue-600 font-semibold">{t.useBalance}</p>
                <p className="text-lg text-gray-600">{t.useBalanceDesc}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-8 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-orange-500 mb-1 text-center">{t.contact}</h2>
            <p className="text-3xl text-blue-600 mb-6 text-center font-semibold">{t.contactDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                <Mail size={32} className="text-orange-500 mb-4" />
                <p className="text-lg text-orange-500 font-semibold">{USER_EMAIL}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                <Phone size={32} className="text-orange-500 mb-4" />
                <p className="text-lg text-orange-500 font-semibold">+966 11 2345 6789</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                <MapPin size={32} className="text-orange-500 mb-4" />
                <p className="text-lg text-orange-500 font-semibold">الرياض، السعودية</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-8 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-orange-500 mb-4 text-center">{t.about}</h2>
            <div className="bg-white rounded-lg shadow-md p-8 border border-blue-200">
              <h3 className="text-4xl font-bold text-orange-500 mb-4 text-center">{t.vision}</h3>
              <p className="text-2xl text-blue-600 leading-relaxed font-semibold">{t.visionText}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8 mb-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#consultants" className="hover:opacity-80">المستشارون والاستشارات</a></li>
                <li><a href="#services" className="hover:opacity-80">خدمات التعهيد والإدارة</a></li>
                <li><a href="#marketplace" className="hover:opacity-80">السوق الإلكتروني</a></li>
                <li><a href="#points" className="hover:opacity-80">نظام النقاط والرصيد المالي</a></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">قانوني</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy" className="hover:opacity-80">سياسة الخصوصية</a></li>
                <li><a href="#terms" className="hover:opacity-80">الشروط والأحكام</a></li>
              </ul>
            </div>
            {/* Services */}
            <div>
              <h4 className="font-bold text-lg mb-4">خدمات التعهيد والإدارة</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:opacity-80">استشارات متخصصة</a></li>
                <li><a href="#" className="hover:opacity-80">إدارة الموظفين</a></li>
                <li><a href="#" className="hover:opacity-80">نظام النقاط والرصيد المالي</a></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:khaled139925@gmail.com" className="hover:opacity-80">البريد الإلكتروني</a></li>
                <li><a href="tel:+966112345678" className="hover:opacity-80">الهاتف</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2026 {isRTL ? 'منصة شراكة' : 'Sharaka Platform'}. {t.allRights}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
