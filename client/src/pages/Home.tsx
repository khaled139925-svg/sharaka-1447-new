import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Users, Briefcase, ShoppingBag, Award, MessageCircle, Info, 
  ChevronRight, MapPin, TrendingUp, Zap, Mail, Phone, AlertCircle,
  ExternalLink, ArrowRight, Globe
} from 'lucide-react';

const LOGO_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/nOdruZWcjEkuqgXg.jpeg';
const USER_EMAIL = 'khaled139925@gmail.com';

// نظام اللغات
const translations = {
  ar: {
    selectCountry: 'اختر الدولة',
    selectLanguage: 'اللغة',
    tagline: 'شريك نجاحك',
    platformName: 'منصة الخدمات المتكاملة',
    description: 'نربط الخبرات بالفرص، نوفر الاستشارات، سوق إلكتروني، خدمات تعهيد وعمل عن بعد',
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
  },
  en: {
    selectCountry: 'Select Country',
    selectLanguage: 'Language',
    tagline: 'Your Success Partner',
    platformName: 'Integrated Services Platform',
    description: 'We connect expertise with opportunities, provide consultations, e-commerce marketplace, outsourcing services and remote work',
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
  }
};

// قائمة الدول المحدثة
const COUNTRIES = [
  // دول الخليج
  { code: 'SA', name: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦', region: 'gulf' },
  { code: 'AE', name: 'الإمارات', nameEn: 'UAE', flag: '🇦🇪', region: 'gulf' },
  { code: 'KW', name: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼', region: 'gulf' },
  { code: 'QA', name: 'قطر', nameEn: 'Qatar', flag: '🇶🇦', region: 'gulf' },
  { code: 'BH', name: 'البحرين', nameEn: 'Bahrain', flag: '🇧🇭', region: 'gulf' },
  { code: 'OM', name: 'عمان', nameEn: 'Oman', flag: '🇴🇲', region: 'gulf' },
  // العالم العربي
  { code: 'EG', name: 'مصر', nameEn: 'Egypt', flag: '🇪🇬', region: 'arab' },
  { code: 'JO', name: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴', region: 'arab' },
  { code: 'LB', name: 'لبنان', nameEn: 'Lebanon', flag: '🇱🇧', region: 'arab' },
  { code: 'SY', name: 'سوريا', nameEn: 'Syria', flag: '🇸🇾', region: 'arab' },
  { code: 'IQ', name: 'العراق', nameEn: 'Iraq', flag: '🇮🇶', region: 'arab' },
  { code: 'MA', name: 'المغرب', nameEn: 'Morocco', flag: '🇲🇦', region: 'arab' },
  { code: 'TN', name: 'تونس', nameEn: 'Tunisia', flag: '🇹🇳', region: 'arab' },
  { code: 'DZ', name: 'الجزائر', nameEn: 'Algeria', flag: '🇩🇿', region: 'arab' },
  { code: 'SD', name: 'السودان', nameEn: 'Sudan', flag: '🇸🇩', region: 'arab' },
  // باكستان
  { code: 'PK', name: 'باكستان', nameEn: 'Pakistan', flag: '🇵🇰', region: 'asia' },
  // أوروبا
  { code: 'GB', name: 'بريطانيا', nameEn: 'United Kingdom', flag: '🇬🇧', region: 'europe' },
  { code: 'DE', name: 'ألمانيا', nameEn: 'Germany', flag: '🇩🇪', region: 'europe' },
  { code: 'FR', name: 'فرنسا', nameEn: 'France', flag: '🇫🇷', region: 'europe' },
  { code: 'IT', name: 'إيطاليا', nameEn: 'Italy', flag: '🇮🇹', region: 'europe' },
  { code: 'ES', name: 'إسبانيا', nameEn: 'Spain', flag: '🇪🇸', region: 'europe' },
  { code: 'NL', name: 'هولندا', nameEn: 'Netherlands', flag: '🇳🇱', region: 'europe' },
  { code: 'SE', name: 'السويد', nameEn: 'Sweden', flag: '🇸🇪', region: 'europe' },
  { code: 'CH', name: 'سويسرا', nameEn: 'Switzerland', flag: '🇨🇭', region: 'europe' },
  // أمريكا
  { code: 'US', name: 'أمريكا', nameEn: 'USA', flag: '🇺🇸', region: 'americas' },
  { code: 'CA', name: 'كندا', nameEn: 'Canada', flag: '🇨🇦', region: 'americas' },
  { code: 'MX', name: 'المكسيك', nameEn: 'Mexico', flag: '🇲🇽', region: 'americas' },
  { code: 'BR', name: 'البرازيل', nameEn: 'Brazil', flag: '🇧🇷', region: 'americas' },
];

// صور أشخاص وهميين (من Unsplash)
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
    courses: [
      { name: 'دورة الرياضيات المتقدمة', nameEn: 'Advanced Mathematics Course', duration: '12 أسبوع', durationEn: '12 weeks' },
      { name: 'دورة اللغة الإنجليزية', nameEn: 'English Language Course', duration: '10 أسابيع', durationEn: '10 weeks' },
      { name: 'دورة العلوم', nameEn: 'Science Course', duration: '14 أسبوع', durationEn: '14 weeks' },
    ],
    certificates: ['شهادة الكفاءة', 'شهادة التفوق'],
    certificatesEn: ['Competency Certificate', 'Excellence Certificate'],
  },
  { 
    id: 'employee', 
    title: 'مسار الموظف', 
    titleEn: 'Employee Path',
    icon: '👔', 
    desc: 'تطوير مهني وفرص عمل',
    descEn: 'Professional development and job opportunities',
    courses: [
      { name: 'دورة القيادة والإدارة', nameEn: 'Leadership & Management Course', duration: '8 أسابيع', durationEn: '8 weeks' },
      { name: 'دورة مهارات التواصل', nameEn: 'Communication Skills Course', duration: '6 أسابيع', durationEn: '6 weeks' },
      { name: 'دورة التطوير الذاتي', nameEn: 'Self-Development Course', duration: '10 أسابيع', durationEn: '10 weeks' },
    ],
    certificates: ['شهادة الموظف المتميز', 'شهادة القيادة'],
    certificatesEn: ['Outstanding Employee Certificate', 'Leadership Certificate'],
  },
  { 
    id: 'trader', 
    title: 'مسار التاجر', 
    titleEn: 'Trader Path',
    icon: '🛍️', 
    desc: 'دعم المتاجر الإلكترونية',
    descEn: 'E-commerce store support',
    courses: [
      { name: 'دورة التجارة الإلكترونية', nameEn: 'E-Commerce Course', duration: '12 أسبوع', durationEn: '12 weeks' },
      { name: 'دورة التسويق الرقمي', nameEn: 'Digital Marketing Course', duration: '10 أسابيع', durationEn: '10 weeks' },
      { name: 'دورة إدارة المبيعات', nameEn: 'Sales Management Course', duration: '8 أسابيع', durationEn: '8 weeks' },
    ],
    certificates: ['شهادة التاجر الإلكتروني', 'شهادة المبيعات'],
    certificatesEn: ['E-Commerce Trader Certificate', 'Sales Certificate'],
  },
  { 
    id: 'entrepreneur', 
    title: 'رائد الأعمال', 
    titleEn: 'Entrepreneur',
    icon: '🚀', 
    desc: 'استشارات وتمويل',
    descEn: 'Consultations and financing',
    courses: [
      { name: 'دورة بدء المشروع', nameEn: 'Project Startup Course', duration: '16 أسبوع', durationEn: '16 weeks' },
      { name: 'دورة التمويل والاستثمار', nameEn: 'Financing & Investment Course', duration: '12 أسبوع', durationEn: '12 weeks' },
      { name: 'دورة التخطيط الاستراتيجي', nameEn: 'Strategic Planning Course', duration: '14 أسبوع', durationEn: '14 weeks' },
    ],
    certificates: ['شهادة رائد الأعمال', 'شهادة الابتكار'],
    certificatesEn: ['Entrepreneur Certificate', 'Innovation Certificate'],
  },
  { 
    id: 'jobseeker', 
    title: 'الباحث عن عمل', 
    titleEn: 'Job Seeker',
    icon: '🎯', 
    desc: 'فرص عمل وتطوير مهارات',
    descEn: 'Job opportunities and skill development',
    courses: [
      { name: 'دورة إعداد السيرة الذاتية', nameEn: 'CV Preparation Course', duration: '4 أسابيع', durationEn: '4 weeks' },
      { name: 'دورة مهارات المقابلة', nameEn: 'Interview Skills Course', duration: '6 أسابيع', durationEn: '6 weeks' },
      { name: 'دورة تطوير المهارات المهنية', nameEn: 'Professional Skills Development', duration: '10 أسابيع', durationEn: '10 weeks' },
    ],
    certificates: ['شهادة الكفاءة المهنية', 'شهادة النجاح'],
    certificatesEn: ['Professional Competency Certificate', 'Success Certificate'],
  },
  { 
    id: 'researcher', 
    title: 'الباحث', 
    titleEn: 'Researcher',
    icon: '🔬', 
    desc: 'موارد بحثية وتعاون',
    descEn: 'Research resources and collaboration',
    courses: [
      { name: 'دورة البحث العلمي', nameEn: 'Scientific Research Course', duration: '14 أسبوع', durationEn: '14 weeks' },
      { name: 'دورة كتابة الأوراق البحثية', nameEn: 'Research Paper Writing Course', duration: '10 أسابيع', durationEn: '10 weeks' },
      { name: 'دورة المنهجية البحثية', nameEn: 'Research Methodology Course', duration: '12 أسبوع', durationEn: '12 weeks' },
    ],
    certificates: ['شهادة الباحث المتقدم', 'شهادة النشر العلمي'],
    certificatesEn: ['Advanced Researcher Certificate', 'Scientific Publication Certificate'],
  },
];

const sendEmailNotification = async (subject: string, data: any) => {
  try {
    const emailBody = `الموضوع: ${subject}\nالبريد المرسل إليه: ${USER_EMAIL}\nالوقت: ${new Date().toLocaleString('ar-SA')}\n\nالبيانات:\n${JSON.stringify(data, null, 2)}`;

    const response = await fetch('https://formspree.io/f/xyzpqwab', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: USER_EMAIL,
        message: emailBody,
        subject: subject,
      }),
    });

    if (response.ok) {
      alert(`✅ تم إرسال البيانات بنجاح إلى ${USER_EMAIL}`);
      return true;
    } else {
      alert('❌ حدث خطأ في الإرسال. يرجى المحاولة لاحقاً');
      return false;
    }
  } catch (error) {
    console.error('خطأ في الإرسال:', error);
    alert('❌ خطأ في الاتصال. تأكد من اتصالك بالإنترنت');
    return false;
  }
};

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<typeof CONSULTANTS[0] | null>(null);
  const [selectedPath, setSelectedPath] = useState<typeof PATHS[0] | null>(null);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const t = translations[language];
  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);
  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Sharaka" className="h-16 w-auto object-contain hover:scale-110 transition-transform duration-300" />
            <div className="hidden md:block">
              <p className="text-sm font-bold text-accent">منصة الخدمات المتكاملة</p>
              <p className="text-xs text-foreground/60">Integrated Services Platform</p>
            </div>
          </div>

          {/* Tagline - Right side */}
          <div className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2">
            <p className="text-lg font-bold text-accent animate-pulse">{t.tagline}</p>
          </div>

          {/* Controls - Right side */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-all duration-300 hover:shadow-md"
              >
                <Globe size={16} className="text-primary" />
                <span className="text-sm font-semibold text-primary">{language === 'ar' ? 'العربية' : 'English'}</span>
                <ChevronRight size={14} className={`transition-transform duration-300 ${showLanguageMenu ? 'rotate-90' : ''}`} />
              </button>

              {showLanguageMenu && (
                <div className="absolute top-full right-0 mt-2 bg-card rounded-lg shadow-lg border border-border z-50 min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-300">
                  {[
                    { code: 'ar', label: 'العربية' },
                    { code: 'en', label: 'English' },
                  ].map((lang: any) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-right hover:bg-secondary transition-all duration-300 ${
                        language === lang.code ? 'bg-secondary text-primary font-semibold' : ''
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCountryMenu(!showCountryMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-all duration-300 hover:shadow-md"
              >
                <span className="text-lg">{currentCountry?.flag}</span>
                <span className="text-sm font-semibold text-primary hidden sm:inline">{isRTL ? currentCountry?.name : currentCountry?.nameEn}</span>
                <ChevronRight size={14} className={`transition-transform duration-300 ${showCountryMenu ? 'rotate-90' : ''}`} />
              </button>

              {showCountryMenu && (
                <div className="absolute top-full right-0 mt-2 bg-card rounded-lg shadow-lg border border-border z-50 max-h-96 overflow-y-auto min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-300">
                  {COUNTRIES.map(country => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setShowCountryMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-secondary transition-all duration-300 ${
                        selectedCountry === country.code ? 'bg-secondary text-primary font-semibold' : ''
                      }`}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span>{isRTL ? country.name : country.nameEn}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary to-background">
          <div className="container mx-auto px-4 text-center space-y-6">
            {/* 3D Rotating Sphere Logo */}
            <div className="sphere-container">
              <div className="sphere-wrapper">
                <div className="sphere-inner">
                  <img src={LOGO_URL} alt="Sharaka" className="sphere-logo" />
                </div>
              </div>
            </div>
            
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-primary mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {t.tagline}
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-accent animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {t.platformName}
              </p>
            </div>

            <p className="text-sm md:text-base text-foreground/60 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 font-medium">
              {isRTL ? 'منصة أعمال رقمية متكاملة تجمع الاستشارات، التعهيد وإدارة المشاريع، السوق الإلكتروني، ونظام نقاط وشريك نجاحك' : 'An integrated digital business platform that brings together consultations, outsourcing and project management, e-commerce marketplace, points system and your success partner'}
            </p>
            <Button className="btn-primary hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
              {t.startNow}
            </Button>
          </div>
        </section>

        {/* Main Sections Cards */}
        <section id="sections" className="py-16 md:py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: isRTL ? 'المستشارون' : 'Consultants', desc: isRTL ? 'استشارات متخصصة' : 'Specialized consultations' },
              { icon: Briefcase, title: isRTL ? 'الخدمات' : 'Services', desc: isRTL ? 'خدمات التعهيد' : 'Outsourcing services' },
              { icon: ShoppingBag, title: isRTL ? 'السوق' : 'Marketplace', desc: isRTL ? 'متاجر إلكترونية' : 'E-commerce stores' },
              { icon: Award, title: isRTL ? 'النقاط' : 'Points', desc: isRTL ? 'نظام الحوافز' : 'Rewards system' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card p-6 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                  <Icon className="w-12 h-12 text-accent mb-4 group-hover:scale-125 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-foreground/70 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Consultants Section */}
        <section id="consultants" className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">{t.consultants}</h2>
              <p className="text-lg text-foreground/70">{t.consultantsDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CONSULTANTS.map(consultant => (
                <div key={consultant.id} className="card p-8 group hover:shadow-2xl hover:-translate-y-3 transition-all duration-300">
                  <img 
                    src={consultant.image} 
                    alt={consultant.name} 
                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-xl font-bold text-primary mb-2">{isRTL ? consultant.name : consultant.nameEn}</h3>
                  <p className="text-accent font-semibold text-sm mb-3">{isRTL ? consultant.specialty : consultant.specialtyEn}</p>
                  <p className="text-foreground/70 text-sm mb-6">{isRTL ? consultant.bio : consultant.bioEn}</p>
                  <Button 
                    onClick={() => setSelectedConsultant(consultant)}
                    className="w-full btn-primary justify-center hover:shadow-lg transition-all duration-300"
                  >
                    <ArrowRight size={18} className={isRTL ? 'ml-2' : 'mr-2'} />
                    {t.bookAppointment}
                  </Button>
                </div>
              ))}
            </div>

            {selectedConsultant && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-card rounded-lg shadow-2xl max-w-md w-full p-8 animate-in slide-in-from-bottom-4 duration-300">
                  <h3 className="text-2xl font-bold text-primary mb-4">{t.bookAppointment} - {isRTL ? selectedConsultant.name : selectedConsultant.nameEn}</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    sendEmailNotification('حجز موعد جديد', { consultant: selectedConsultant.name, country: currentCountry?.name });
                    setSelectedConsultant(null);
                  }} className="space-y-4">
                    <input type="text" placeholder={t.name} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" required />
                    <input type="email" placeholder={t.emailPlaceholder} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" required />
                    <input type="tel" placeholder={t.phoneInput} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" required />
                    <textarea placeholder={t.message} rows={3} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" />
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1 btn-primary justify-center hover:shadow-lg transition-all duration-300">{t.confirm}</Button>
                      <Button onClick={() => setSelectedConsultant(null)} className="flex-1 btn-outline">{t.cancel}</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">{t.services}</h2>
            <p className="text-lg text-foreground/70">{t.servicesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {SERVICES.map(service => {
              const Icon = service.icon;
              return (
                <div key={service.id} className="card p-8 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <Icon className="w-12 h-12 text-accent mb-4 group-hover:scale-125 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-primary mb-3">{isRTL ? service.title : service.titleEn}</h3>
                  <p className="text-foreground/70">{isRTL ? service.description : service.descriptionEn}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border-r-4 border-primary rounded-lg p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex gap-4">
              <AlertCircle className="text-primary flex-shrink-0" size={24} />
              <div>
                <h4 className="text-xl font-bold text-primary mb-2">{t.commitment}</h4>
                <p className="text-foreground/80">{t.commitmentText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace Section */}
        <section id="marketplace" className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">{t.marketplace}</h2>
              <p className="text-lg text-foreground/70">{t.marketplaceDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STORES.map(store => (
                <div key={store.id} className="card p-6 group hover:scale-110 hover:shadow-2xl transition-all duration-300">
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-primary">{isRTL ? store.name : store.nameEn}</h3>
                      <p className="text-accent text-sm font-semibold">{isRTL ? store.category : store.categoryEn}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-sm text-primary">{store.rating}</span>
                    </div>
                  </div>
                  <p className="text-foreground/70 text-sm mb-4">{store.reviews} {isRTL ? 'تقييم' : 'reviews'}</p>
                  <Button className="w-full btn-secondary justify-center hover:shadow-lg transition-all duration-300">
                    <ShoppingBag size={18} />
                    {t.enterStore}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Paths Section */}
        <section id="paths" className="py-16 md:py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">{t.paths}</h2>
            <p className="text-lg text-foreground/70">{t.pathsDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PATHS.map(path => (
              <div 
                key={path.id} 
                onClick={() => setSelectedPath(path)}
                className="card p-8 group hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer"
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{path.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{isRTL ? path.title : path.titleEn}</h3>
                <p className="text-foreground/70 text-sm mb-4">{isRTL ? path.desc : path.descEn}</p>
                <ArrowRight className="text-accent group-hover:translate-x-2 transition-transform duration-300" size={20} />
              </div>
            ))}
          </div>

          {selectedPath && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-card rounded-lg shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-5xl mb-2">{selectedPath.icon}</div>
                    <h3 className="text-3xl font-bold text-primary">{isRTL ? selectedPath.title : selectedPath.titleEn}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedPath(null)}
                    className="text-2xl text-foreground/50 hover:text-foreground transition-colors duration-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-4">{isRTL ? 'الدورات المتاحة:' : 'Available Courses:'}</h4>
                    <div className="space-y-3">
                      {selectedPath.courses.map((course, idx) => (
                        <div key={idx} className="p-4 bg-secondary rounded-lg hover:shadow-md transition-all duration-300">
                          <p className="font-semibold text-primary">{isRTL ? course.name : course.nameEn}</p>
                          <p className="text-sm text-foreground/70">{isRTL ? 'المدة:' : 'Duration:'} {isRTL ? course.duration : course.durationEn}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-primary mb-4">{isRTL ? 'الشهادات:' : 'Certificates:'}</h4>
                    <div className="space-y-2">
                      {selectedPath.certificates.map((cert, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                          <Award className="text-accent" size={20} />
                          <span className="text-primary font-semibold">{isRTL ? cert : selectedPath.certificatesEn[idx]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setSelectedPath(null)}
                    className="w-full btn-primary justify-center hover:shadow-lg transition-all duration-300"
                  >
                    {isRTL ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Points System */}
        <section id="points" className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{t.points}</h2>
              <p className="text-lg opacity-90">{t.pointsDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: TrendingUp, title: t.earnPoints, desc: t.earnPointsDesc },
                { icon: Award, title: t.collectBalance, desc: t.collectBalanceDesc },
                { icon: Zap, title: t.useBalance, desc: t.useBalanceDesc },
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="text-center hover:scale-105 transition-transform duration-300">
                    <Icon className="w-12 h-12 mx-auto mb-4 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="opacity-80">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">{t.contact}</h2>
              <p className="text-lg text-foreground/70">{t.contactDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: Mail, title: t.email, value: USER_EMAIL },
                { icon: Phone, title: t.phoneLabel, value: '+966 11 2345 6789' },
                { icon: MapPin, title: t.address, value: isRTL ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia' },
              ].map((contact, idx) => {
                const Icon = contact.icon;
                return (
                  <div key={idx} className="card p-8 text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                    <Icon className="w-12 h-12 text-accent mx-auto mb-4 hover:scale-125 transition-transform duration-300" />
                    <h4 className="font-bold text-primary mb-2">{contact.title}</h4>
                    <p className="text-foreground/70">{contact.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="max-w-2xl mx-auto card p-8 hover:shadow-lg transition-all duration-300">
              <form onSubmit={(e) => {
                e.preventDefault();
                sendEmailNotification('رسالة تواصل جديدة', contactData);
                setContactData({ name: '', email: '', phone: '', subject: '', message: '' });
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t.name}
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                    required
                  />
                  <input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                    required
                  />
                </div>
                <input
                  type="tel"
                  placeholder={t.phoneInput}
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                />
                <input
                  type="text"
                  placeholder={t.subject}
                  value={contactData.subject}
                  onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                />
                <textarea
                  placeholder={t.message}
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  rows={5}
                  required
                />
                <Button type="submit" className="w-full btn-primary justify-center hover:shadow-lg transition-all duration-300">
                  <MessageCircle size={20} />
                  {t.send}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">{t.about}</h2>
          </div>

          <div className="card max-w-3xl mx-auto p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex gap-4 mb-4">
              <Info className="w-8 h-8 text-accent flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">{t.vision}</h3>
                <p className="text-foreground/70 leading-relaxed">{t.visionText}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">{t.quickLinks}</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#consultants" className="hover:text-accent transition-colors duration-300">{t.consultants}</a></li>
                <li><a href="#services" className="hover:text-accent transition-colors duration-300">{t.services}</a></li>
                <li><a href="#marketplace" className="hover:text-accent transition-colors duration-300">{t.marketplace}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.services}</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors duration-300">{isRTL ? 'التعهيد' : 'Outsourcing'}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-300">{t.consultants}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-300">{t.points}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.legal}</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors duration-300">{t.privacy}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-300">{t.terms}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.contact}</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>{t.email}: {USER_EMAIL}</li>
                <li>{t.phoneLabel}: +966 11 2345 6789</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2026 {isRTL ? 'منصة شراكة' : 'Sharaka Platform'}. {t.allRights}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
