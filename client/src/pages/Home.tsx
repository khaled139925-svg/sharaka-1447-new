'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useStores, PurchaseRecord } from '@/contexts/StoresContext';
import ExternalStoreViewer from './ExternalStoreViewer';

import ClientMessaging from '@/components/ClientMessaging';
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
    fullBio: 'د. أحمد محمد متخصص في إدارة الأعمال والمشاريع الكبرى مع خبرة تزيد عن 15 سنة في القطاع الخاص والحكومي. حصل على درجة الدكتوراه من جامعة عريقة وقاد عدداً من المشاريع الناجحة التي حققت نتائج استثنائية. متخصص في تطوير الاستراتيجيات التنظيمية وتحسين الأداء المؤسسي. يقدم استشارات في مجالات التخطيط الاستراتيجي وإدارة الموارد البشرية وتطوير القيادات.',
    fullBioEn: 'Dr. Ahmed Mohammed is a specialist in business management and large-scale projects with over 15 years of experience in both private and public sectors. He holds a doctorate degree from a prestigious university and has led numerous successful projects that achieved exceptional results. He specializes in developing organizational strategies and improving institutional performance. He provides consultations in strategic planning, human resource management, and leadership development.',
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
    fullBio: 'أ. فاطمة علي خبيرة تسويق رقمي معروفة بخبرتها الواسعة في بناء العلامات التجارية القوية وتطوير استراتيجيات التسويق الرقمي الفعالة. عملت مع أكثر من 50 شركة عالمية وساعدتها في زيادة مبيعاتها بنسبة تصل إلى 300%. متخصصة في إدارة وسائل التواصل الاجتماعي والإعلانات الرقمية وتحسين محركات البحث. حاصلة على شهادات متقدمة في التسويق الرقمي من أفضل المؤسسات العالمية.',
    fullBioEn: 'Fatima Ali is a renowned digital marketing expert known for her extensive experience in building strong brands and developing effective digital marketing strategies. She has worked with over 50 international companies and helped them increase their sales by up to 300%. She specializes in social media management, digital advertising, and search engine optimization. She holds advanced certifications in digital marketing from leading international institutions.',
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
    fullBio: 'م. سارة حسن مهندسة برمجيات متقدمة بخبرة تزيد عن 10 سنوات في تطوير التطبيقات والأنظمة البرمجية المعقدة. متخصصة في تطوير تطبيقات الويب والجوال باستخدام أحدث التقنيات والإطارات البرمجية. قادت فريق تطوير يضم أكثر من 20 مهندساً وسلمت أكثر من 30 مشروعاً ناجحاً. حاصلة على شهادة الهندسة من جامعة عريقة وتتمتع بخبرة عملية في إدارة المشاريع التقنية الكبرى.',
    fullBioEn: 'Sarah Hassan is an advanced software engineer with over 10 years of experience in developing applications and complex software systems. She specializes in web and mobile application development using the latest technologies and programming frameworks. She led a development team of over 20 engineers and delivered more than 30 successful projects. She holds an engineering degree from a prestigious university and has practical experience in managing large technical projects.',
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

export default function Home({ onAdminClick, onNavigate }: { onAdminClick?: () => void; onNavigate?: (page: string, storeId?: string) => void }) {
  console.log('Home component mounted, onNavigate:', typeof onNavigate);
  const { stores, recordPurchase } = useStores();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<typeof CONSULTANTS[0] | null>(null);
  const [showConsultantBio, setShowConsultantBio] = useState<typeof CONSULTANTS[0] | null>(null);
  const [selectedExternalStore, setSelectedExternalStore] = useState<{
    id: string;
    name: string;
    url: string;
    pointsRatio: number;
  } | null>(null);

  const [showMessages, setShowMessages] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    day: '',
    time: '',
  });

  const t = translations[language];
  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);
  const isRTL = language === 'ar';

  const handlePurchaseRecorded = (purchase: PurchaseRecord) => {
    recordPurchase(purchase);
  };

  // دالة حفظ الحجز وإرسال البريد
  const handleBookingSubmit = async () => {
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.day || !bookingData.time) {
      alert(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    if (!selectedConsultant) return;

    try {
      // حفظ البيانات في localStorage (قاعدة بيانات محلية)
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBooking = {
        id: Date.now(),
        consultantName: selectedConsultant.name,
        consultantEmail: 'consultant@sharaka.com',
        ...bookingData,
        createdAt: new Date().toISOString(),
      };
      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      // إرسال بريد للعميل
      const clientEmailResponse = await fetch('https://formspree.io/f/xyzpqwab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: bookingData.email,
          subject: `${isRTL ? 'تأكيد حجز موعد مع' : 'Appointment Confirmation with'} ${selectedConsultant.name}`,
          message: `${isRTL ? 'تم حجز موعدك بنجاح!' : 'Your appointment has been booked successfully!'}\n\n${isRTL ? 'المستشار' : 'Consultant'}: ${selectedConsultant.name}\n${isRTL ? 'التاريخ' : 'Date'}: ${bookingData.day}\n${isRTL ? 'الوقت' : 'Time'}: ${bookingData.time}`,
        }),
      });

      // إرسال بريد للمستشار
      const consultantEmailResponse = await fetch('https://formspree.io/f/xyzpqwab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'khaled1399259@gmail.com',
          subject: `${isRTL ? 'حجز موعد جديد' : 'New Appointment Booking'}`,
          message: `${isRTL ? 'لديك حجز موعد جديد!' : 'You have a new appointment booking!'}\n\n${isRTL ? 'العميل' : 'Client'}: ${bookingData.name}\n${isRTL ? 'البريد' : 'Email'}: ${bookingData.email}\n${isRTL ? 'الهاتف' : 'Phone'}: ${bookingData.phone}\n${isRTL ? 'الموضوع' : 'Subject'}: ${bookingData.subject}\n${isRTL ? 'التاريخ' : 'Date'}: ${bookingData.day}\n${isRTL ? 'الوقت' : 'Time'}: ${bookingData.time}`,
        }),
      });

      if (clientEmailResponse.ok && consultantEmailResponse.ok) {
        alert(isRTL ? 'تم حجز الموعد بنجاح! تم إرسال رسالة تأكيد إلى بريدك الإلكتروني' : 'Appointment booked successfully! A confirmation email has been sent to your email');
        setSelectedConsultant(null);
        setBookingData({name: '', email: '', phone: '', subject: '', day: '', time: ''});
      } else {
        alert(isRTL ? 'تم حجز الموعد لكن حدث خطأ في إرسال البريد' : 'Appointment booked but there was an error sending the email');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(isRTL ? 'حدث خطأ في حجز الموعد' : 'Error booking appointment');
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {selectedExternalStore && (
        <ExternalStoreViewer
          storeUrl={selectedExternalStore.url}
          storeName={selectedExternalStore.name}
          pointsRatio={selectedExternalStore.pointsRatio}
          onClose={() => setSelectedExternalStore(null)}
          onPurchaseRecorded={handlePurchaseRecorded}
        />
      )}

      {showMessages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">الرسائل المباشرة</h2>
              <button
                onClick={() => setShowMessages(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <Messages />
            </div>
          </div>
        </div>
      )}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 50, backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }} className="">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <img src={LOGO_URL} alt="Sharaka" className="h-16 w-auto object-contain" />
              <p className="text-xs md:text-sm text-orange-500 font-bold text-center">{t.tagline}</p>
            </div>
            <div className="hidden md:block">
              <p className="text-lg font-bold text-orange-500 leading-tight">منصة الخدمات المتكاملة</p>
              <p className="text-sm text-blue-600 font-semibold">Integrated Services Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* روابط التنقل السريع - مخفية على الأجهزة الصغيرة */}
            <div className="flex items-center gap-2">
              <a href="#consultants" className="px-1 md:px-3 py-2 text-xs md:text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-300">{t.consultants}</a>
              <a href="#services" className="px-1 md:px-3 py-2 text-xs md:text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-300">{t.services}</a>
              <a href="#marketplace" className="px-1 md:px-3 py-2 text-xs md:text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-300">{t.marketplace}</a>
              <a href="#points" className="px-1 md:px-3 py-2 text-xs md:text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-300">{t.points}</a>
            </div>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-orange-100 transition-all duration-300 lg:hidden"
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
                <svg className="w-4 h-4 text-blue-600 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
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
                className="flex items-center gap-2 px-4 py-3 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300"
              >
                <span className="text-lg">{currentCountry?.flag}</span>
                <span className="text-sm font-semibold text-blue-600">{isRTL ? currentCountry?.name : currentCountry?.nameEn}</span>
                <svg className="w-4 h-4 text-blue-600 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              </button>
              {showCountryMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-blue-300 z-50 max-h-96 overflow-y-auto w-[180px]">
                  {COUNTRIES.map(country => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setShowCountryMenu(false);
                      }}
                      className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <span className="text-sm">{isRTL ? country.name : country.nameEn}</span>
                      <span className="text-2xl leading-none">{country.flag}</span>
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
          <div className="container mx-auto px-4 text-center space-y-6">
            <img src={LOGO_URL} alt="Sharaka" className="h-64 md:h-80 w-auto mx-auto animate-bounce" style={{animationDuration: '3s'}} />
            <h1 className="text-7xl md:text-9xl font-bold text-orange-500 leading-tight">{t.platformName}</h1>
            <p className="text-3xl md:text-4xl text-gray-600 max-w-3xl mx-auto font-semibold">{t.description}</p>
            <button
              onClick={() => {
                console.log('Create store button clicked, onNavigate:', typeof onNavigate);
                onNavigate && onNavigate('create-new-store');
              }}
              className="inline-block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ✨ {isRTL ? 'إنشاء متجر جديد' : 'Create New Store'}
            </button>
          </div>
        </section>

        <section id="consultants" className="py-8 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-orange-500 mb-1 text-center">{t.consultants}</h2>
            <p className="text-3xl text-blue-600 mb-6 text-center font-semibold">{t.consultantsDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CONSULTANTS.map(consultant => (
                <div key={consultant.id} className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
                  <img src={consultant.image} alt={consultant.name} className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedConsultant(consultant)} />
                  <h3 className="text-3xl font-bold text-orange-500 mb-1 cursor-pointer hover:underline" onClick={() => setShowConsultantBio(consultant)}>{isRTL ? consultant.name : consultant.nameEn}</h3>
                  <p className="text-xl text-blue-600 mb-2 font-semibold">{isRTL ? consultant.specialty : consultant.specialtyEn}</p>
                  <p className="text-lg text-gray-600 mb-4">{isRTL ? consultant.bio : consultant.bioEn}</p>
                  <button onClick={() => setSelectedConsultant(consultant)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">{isRTL ? 'حجز موعد' : 'Book Appointment'}</button>
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

        <section className="py-8 bg-blue-100">
          <div className="container mx-auto px-4">
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <div className="flex items-start gap-4">
                <Info size={32} className="text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-orange-500 mb-3">{t.commitment}</h3>
                  <p className="text-xl text-blue-600 leading-relaxed font-semibold">{t.commitmentText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="marketplace" className="py-8 bg-orange-50">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-orange-500 mb-1 text-center">{t.marketplace}</h2>
            <p className="text-3xl text-blue-600 mb-6 text-center font-semibold">{t.marketplaceDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...STORES, ...stores].map(store => {
                // التعامل مع المتاجر الوهمية والحقيقية
                const displayImage = (store as any).image || (store as any).logo || 'https://via.placeholder.com/400x300?text=Store';
                let displayName = (store as any).name || 'متجر';
                // إزالة كلمات غير مرغوبة من الاسم
                displayName = displayName.replace(/مستنسخ|cloned|clone/gi, '').trim() || displayName;
                const displayCategory = (store as any).category || 'عام';
                const displayRating = (store as any).rating || 4.5;
                
                const pointsRatio = ((store as any).pointsRatio || 0.1) * 100;
                const storeUrl = (store as any).externalUrl || '';
                return (
                  <div key={store.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <img src={displayImage} alt={displayName} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="text-2xl font-bold text-orange-500 mb-1">{displayName}</h3>
                      <p className="text-lg text-blue-600 mb-2 font-semibold">{displayCategory}</p>
                      <p className="text-lg text-yellow-500">★ {displayRating}</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-green-600 font-bold mb-3">💰 نسبة النقاط: {pointsRatio.toFixed(0)}%</p>
                        {storeUrl ? (
                          <button
                            onClick={() => setSelectedExternalStore({
                              id: store.id,
                              name: displayName,
                              url: storeUrl,
                              pointsRatio: (store as any).pointsRatio || 0.1
                            })}
                            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            دخول المتجر
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigate?.('store-detail', String(store.id))}
                            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            عرض التفاصيل
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
              <h3 className="text-4xl font-bold text-orange-500 mb-4 text-right">{t.vision}</h3>
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

      {/* نافذة حجز الموعد */}
      {selectedConsultant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-600">{isRTL ? 'حجز موعد مع ' + selectedConsultant.name : 'Book Appointment with ' + selectedConsultant.nameEn}</h2>
              <button onClick={() => setSelectedConsultant(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="space-y-4">
              {/* الاسم */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{isRTL ? 'الاسم' : 'Name'}</label>
                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  placeholder={isRTL ? 'بريدك الإلكتروني' : 'your@email.com'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* الهاتف */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{isRTL ? 'الهاتف' : 'Phone'}</label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  placeholder={isRTL ? 'رقم هاتفك' : 'Your phone number'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* الموضوع */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{isRTL ? 'الموضوع' : 'Subject'}</label>
                <input
                  type="text"
                  value={bookingData.subject}
                  onChange={(e) => setBookingData({...bookingData, subject: e.target.value})}
                  placeholder={isRTL ? 'موضوع الاستشارة' : 'Consultation topic'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* اختيار اليوم */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{isRTL ? 'اختر اليوم' : 'Select Day'}</label>
                <select
                  value={bookingData.day}
                  onChange={(e) => setBookingData({...bookingData, day: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{isRTL ? 'اختر اليوم' : 'Select a day'}</option>
                  {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map((day, index) => (
                    <option key={index} value={day}>{isRTL ? day : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][index]}</option>
                  ))}
                </select>
              </div>

              {/* اختيار الساعة */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{isRTL ? 'اختر الساعة' : 'Select Time'}</label>
                <select
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{isRTL ? 'اختر الساعة' : 'Select a time'}</option>
                  {Array.from({length: 10}, (_, i) => {
                    const hour = 9 + i;
                    return (
                      <option key={i} value={`${hour}:00`}>{`${hour}:00`}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleBookingSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                {isRTL ? 'تأكيد' : 'Confirm'}
              </button>
              <button
                onClick={() => setSelectedConsultant(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consultant Full Bio Modal */}
      {showConsultantBio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowConsultantBio(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <div className="flex items-start gap-4 mb-4">
              <img src={showConsultantBio.image} alt={showConsultantBio.name} className="w-24 h-24 object-cover rounded-lg" />
              <div>
                <h2 className="text-3xl font-bold text-blue-600 mb-1">{isRTL ? showConsultantBio.name : showConsultantBio.nameEn}</h2>
                <p className="text-xl text-orange-500 font-semibold mb-2">{isRTL ? showConsultantBio.specialty : showConsultantBio.specialtyEn}</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              {isRTL ? showConsultantBio.fullBio : showConsultantBio.fullBioEn}
            </p>
            <button
              onClick={() => {
                setShowConsultantBio(null);
                setSelectedConsultant(showConsultantBio);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {isRTL ? 'حجز موعد' : 'Book Appointment'}
            </button>
          </div>
        </div>
      )}
      
      {/* مكون الرسائل الجديد */}
      <ClientMessaging />

      {/* زر الإدارة المخفي */}
      {onAdminClick && (
        <button
          onClick={onAdminClick}
          className="fixed bottom-4 left-4 w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg opacity-30 hover:opacity-100 transition-all duration-300 z-40 hover:scale-110"
          title="Admin Panel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}
