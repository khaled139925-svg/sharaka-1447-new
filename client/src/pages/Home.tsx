'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  Users, Briefcase, ShoppingBag, Award, MessageCircle, Info, 
  ChevronRight, MapPin, TrendingUp, Zap, Mail, Phone, AlertCircle,
  ExternalLink, ArrowRight, Globe, Loader2
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
    chatSupport: 'دعم فوري',
    chatMessage: 'مرحبا! كيف يمكننا مساعدتك؟',
    chatClose: 'إغلاق',
    typeMessage: 'اكتب رسالتك...',
    loginToChat: 'يرجى تسجيل الدخول للدردشة',
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
    chatSupport: 'Live Support',
    chatMessage: 'Hello! How can we help you?',
    chatClose: 'Close',
    typeMessage: 'Type your message...',
    loginToChat: 'Please login to chat',
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

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // tRPC queries and mutations
  const { data: conversation, isLoading: convLoading } = trpc.chat.getOrCreateConversation.useQuery(
    undefined,
    { enabled: isAuthenticated && showChatWidget }
  );

  const { data: messages, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { conversationId: conversation?.id || 0 },
    { enabled: !!conversation?.id }
  );

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setChatMessage('');
      refetchMessages();
    },
  });

  const t = translations[language];
  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);
  const isRTL = language === 'ar';

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !conversation) return;
    
    await sendMessageMutation.mutateAsync({
      conversationId: conversation.id,
      content: chatMessage,
    });
  };

  useEffect(() => {
    if (showChatWidget && conversation?.id) {
      const interval = setInterval(() => {
        refetchMessages();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showChatWidget, conversation?.id, refetchMessages]);

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} alt="Sharaka" className="h-16 w-auto object-contain hover:scale-110 transition-transform duration-300" />
              <div className="hidden md:block">
                <p className="text-sm font-bold text-accent">منصة الخدمات المتكاملة</p>
                <p className="text-xs text-foreground/60">Integrated Services Platform</p>
              </div>
            </div>

            {/* Controls - Right side */}
            <div className="flex items-center gap-3 relative">
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
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-secondary to-background">
          <div className="container mx-auto px-4 text-center">
            <img src={LOGO_URL} alt="Sharaka" className="h-32 md:h-40 mx-auto mb-8 hover:scale-110 transition-transform duration-300" />
            <h1 className="text-7xl md:text-8xl font-bold text-accent mb-6">{t.platformName}</h1>
            <p className="text-3xl md:text-4xl text-foreground/70 mb-8 leading-relaxed">{t.description}</p>
            <Button className="btn-primary text-lg md:text-2xl px-8 md:px-12 py-4 md:py-6 hover:shadow-lg transition-all duration-300">
              {t.startNow}
            </Button>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-7xl md:text-8xl font-bold text-primary mb-4">{t.contact}</h2>
              <p className="text-3xl md:text-4xl text-foreground/70">{t.contactDesc}</p>
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
                    <Icon className="w-16 h-16 text-accent mx-auto mb-4 hover:scale-125 transition-transform duration-300" />
                    <h4 className="text-2xl md:text-3xl font-bold text-primary mb-2">{contact.title}</h4>
                    <p className="text-xl md:text-2xl text-foreground/70">{contact.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {showChatWidget ? (
          <div className="bg-card rounded-lg shadow-2xl w-80 md:w-96 max-h-96 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Chat Header */}
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={24} />
                <div>
                  <h3 className="text-lg md:text-xl font-bold">{t.chatSupport}</h3>
                  <p className="text-xs md:text-sm opacity-80">نحن متاحون الآن</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatWidget(false)}
                className="text-primary-foreground hover:opacity-80 transition-opacity duration-300"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 bg-secondary overflow-y-auto">
              {!isAuthenticated ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-center text-foreground/70 text-lg">{t.loginToChat}</p>
                </div>
              ) : convLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Welcome Message */}
                  <div className="flex justify-start">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs text-sm md:text-base">
                      {t.chatMessage}
                    </div>
                  </div>

                  {/* User Messages */}
                  {messages?.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`p-3 rounded-lg max-w-xs text-sm md:text-base ${
                          msg.senderType === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent text-accent-foreground'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Footer */}
            {isAuthenticated && (
              <div className="border-t border-border p-3 bg-card rounded-b-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.typeMessage}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending || !chatMessage.trim()}
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
                  >
                    {sendMessageMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowChatWidget(true)}
            className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce"
            title={t.chatSupport}
          >
            <MessageCircle size={28} />
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-base md:text-lg opacity-80">
            <p>&copy; 2026 {isRTL ? 'منصة شراكة' : 'Sharaka Platform'}. {t.allRights}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
