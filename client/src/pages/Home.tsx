'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import emailjs from '@emailjs/browser';
import { chatService } from '@/lib/chat-service';
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
  }
};

const COUNTRIES = [
  { code: 'SA', name: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦', region: 'gulf' },
  { code: 'AE', name: 'الإمارات', nameEn: 'UAE', flag: '🇦🇪', region: 'gulf' },
  { code: 'EG', name: 'مصر', nameEn: 'Egypt', flag: '🇪🇬', region: 'arab' },
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
      console.log(`✅ تم إرسال البيانات بنجاح إلى ${USER_EMAIL}`);
      return true;
    } else {
      console.error('❌ حدث خطأ في الإرسال');
      return false;
    }
  } catch (error) {
    console.error('خطأ في الإرسال:', error);
    return false;
  }
};

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const t = translations[language];
  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);
  const isRTL = language === 'ar';

  // تهيئة EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  // تحميل الرسائل السابقة عند فتح الدردشة
  useEffect(() => {
    if (showChatWidget) {
      const currentSession = chatService.getCurrentSession();
      if (currentSession) {
        setChatMessages(currentSession.messages);
        setConversationId(currentSession.id);
      }
    }
  }, [showChatWidget]);

  const handleChatSend = async () => {
    if (!chatMessage.trim()) return;

    try {
      setIsLoadingChat(true);

      // إذا لم تكن هناك جلسة، أنشئ واحدة جديدة
      if (!conversationId) {
        const newSession = chatService.createSession({
          userName: 'زائر',
          userEmail: 'visitor@sharaka.com',
          subject: 'رسالة من الدردشة الفورية',
        });
        setConversationId(newSession.id);
      }

      // أضف الرسالة إلى الجلسة المحلية
      const newMessage = chatService.addMessage(chatMessage, 'user');
      setChatMessages(prev => [...prev, newMessage]);

      // أرسل البريد الإلكتروني
      await sendEmailNotification('رسالة دردشة فورية', {
        message: chatMessage,
        timestamp: new Date().toLocaleString('ar-SA')
      });

      setChatMessage('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      console.error('خطأ في إرسال الرسالة:', errorMessage);
      alert(`خطأ: ${errorMessage}`);
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} alt="Sharaka" className="h-16 w-auto object-contain" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage('ar')}
                  className={language === 'ar' ? 'bg-accent text-accent-foreground' : ''}
                >
                  العربية
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-accent text-accent-foreground' : ''}
                >
                  English
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t.platformName}</h1>
          <p className="text-lg text-foreground/70">{t.description}</p>
        </div>
      </main>

      {/* Chat Widget */}
      {showChatWidget && (
        <div className="fixed bottom-20 right-4 w-80 bg-card border border-border rounded-lg shadow-lg z-40">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">{t.chatSupport}</h3>
            <button
              onClick={() => setShowChatWidget(false)}
              className="text-primary-foreground hover:opacity-80"
            >
              ✕
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 bg-background">
            {chatMessages.length === 0 ? (
              <p className="text-center text-foreground/50 py-8">{t.chatMessage}</p>
            ) : (
              <div className="space-y-2">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border p-4 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleChatSend()}
              placeholder={t.typeMessage}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              disabled={isLoadingChat}
            />
            <Button
              onClick={handleChatSend}
              disabled={isLoadingChat || !chatMessage.trim()}
              size="sm"
            >
              {isLoadingChat ? '...' : '→'}
            </Button>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setShowChatWidget(!showChatWidget)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-40"
      >
        <MessageCircle size={24} />
      </button>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-foreground/70">
          <p>{t.allRights} © 2026 {t.platformName}</p>
        </div>
      </footer>
    </div>
  );
}
