'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { trpc } from '@/lib/trpc';
import { 
  Users, Briefcase, ShoppingBag, Award, MessageCircle, Info, 
  ChevronRight, MapPin, TrendingUp, Zap, Mail, Phone, AlertCircle,
  ExternalLink, ArrowRight, Globe
} from 'lucide-react';

const LOGO_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/nOdruZWcjEkuqgXg.jpeg';

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

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; text: string; sender: 'user' | 'admin'; timestamp: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // استخدام useQuery لجلب الرسائل
  const { data: messagesData, refetch: refetchMessages } = (trpc.admin.getConversationMessages as any).useQuery(
    { conversationId: conversationId || 0 },
    { enabled: !!conversationId }
  );

  // تحديث الرسائل عند تغير البيانات
  useEffect(() => {
    if (messagesData) {
      const formattedMessages = messagesData.map((msg: any) => ({
        id: msg.id,
        text: msg.content || msg.message,
        sender: (msg.senderType === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
        timestamp: new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }));
      setChatMessages(formattedMessages);
    }
  }, [messagesData]);

  // تحديث الرسائل كل ثانية عند فتح الدردشة
  useEffect(() => {
    if (showChat && conversationId) {
      const interval = setInterval(() => {
        refetchMessages();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showChat, conversationId, refetchMessages]);

  const t = translations[language];
  const isRTL = language === 'ar';

  // استخدام tRPC لإرسال الرسالة
  const sendContactMessageMutation = (trpc.admin.sendContactMessage as any).useMutation({
    onSuccess: () => {
      alert('✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
      setContactData({ name: '', email: '', phone: '', subject: '', message: '' });
    },
    onError: (error: any) => {
      alert(`❌ خطأ: ${error.message}`);
    },
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.phone || !contactData.subject || !contactData.message) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    sendContactMessageMutation.mutate(contactData, {
      onSuccess: (data: any) => {
        setConversationId(data.conversationId);
        setShowChat(true);
        // إعادة تحميل الرسائل بعد إنشاء المحادثة
        setTimeout(() => {
          refetchMessages();
        }, 500);
      }
    });
  };

  const handleChatSend = () => {
    if (chatInput.trim() && conversationId) {
      const messageText = chatInput;
      setChatInput('');
      
      // إرسال الرسالة إلى الخادم
      sendContactMessageMutation.mutate({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        subject: messageText.substring(0, 50),
        message: messageText,
      }, {
        onSuccess: () => {
          // جلب الرسائل المحدثة
          setTimeout(() => {
            refetchMessages();
          }, 300);
        },
        onError: (error: any) => {
          console.error('خطأ في إرسال الرسالة:', error);
          alert('حدث خطأ في إرسال الرسالة');
        }
      });
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Sharaka" className="h-16 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              🔐 إدارة
            </a>
            <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="px-3 py-2 bg-gray-200 rounded-lg">
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/10 to-primary/10 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.platformName}</h1>
          <p className="text-xl text-foreground/70 mb-8">{t.description}</p>
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
            {t.startNow}
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">{t.services}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.id} className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Icon className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">{language === 'ar' ? service.title : service.titleEn}</h3>
                  <p className="text-foreground/70">{language === 'ar' ? service.description : service.descriptionEn}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">{t.contact}</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t.name}
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <input
              type="tel"
              placeholder={t.phoneInput}
              value={contactData.phone}
              onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              placeholder={t.subject}
              value={contactData.subject}
              onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <textarea
              placeholder={t.message}
              value={contactData.message}
              onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={5}
              required
            />
            <Button
              type="submit"
              disabled={sendContactMessageMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3"
            >
              {sendContactMessageMutation.isPending ? 'جاري الإرسال...' : t.send}
            </Button>
          </form>
        </div>
      </section>

      {/* Chat Window */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-border">
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">💬 الدردشة</h3>
            <button onClick={() => setShowChat(false)} className="text-white hover:bg-primary/80 p-1 rounded">
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>مرحباً! كيف يمكننا مساعدتك؟</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <input
              type="text"
              placeholder="اكتب رسالتك..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              onClick={handleChatSend}
              className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Chat Button */}
      {!showChat && (
        <button
          onClick={() => {
            setShowChat(true);
            if (conversationId) {
              refetchMessages();
            }
          }}
          className="fixed bottom-4 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center text-2xl z-40 hover:scale-110"
          title="فتح الدردشة"
        >
          💬
        </button>
      )}

      {/* Footer */}
      <footer className="bg-primary text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2026 {t.platformName}. {t.allRights}</p>
        </div>
      </footer>
    </div>
  );
}
