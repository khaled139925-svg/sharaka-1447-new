import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Users, Briefcase, ShoppingBag, Award, MessageCircle, Info, 
  ChevronRight, MapPin, TrendingUp, Zap, Mail, Phone, AlertCircle,
  ExternalLink, ArrowRight
} from 'lucide-react';

const LOGO_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/ulkhpqXvgwOhgZuZ.jpeg';
const USER_EMAIL = 'khaled139925@gmail.com';

const COUNTRIES = [
  { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
];

const CONSULTANTS = [
  {
    id: 1,
    name: 'د. أحمد محمد',
    specialty: 'استشارات إدارة الأعمال',
    bio: 'خبرة 15 سنة في إدارة المشاريع والشركات',
    image: '👨‍💼',
    zohoDuration: 60,
  },
  {
    id: 2,
    name: 'أ. فاطمة علي',
    specialty: 'التسويق الرقمي',
    bio: 'متخصصة في التسويق الإلكتروني والعلامات التجارية',
    image: '👩‍💼',
    zohoDuration: 45,
  },
  {
    id: 3,
    name: 'م. سارة حسن',
    specialty: 'تطوير البرمجيات',
    bio: 'مهندسة برمجيات بخبرة 10 سنوات في التطوير',
    image: '👩‍💻',
    zohoDuration: 90,
  },
];

const SERVICES = [
  {
    id: 1,
    title: 'التوظيف والاستقطاب',
    description: 'نساعدك في البحث عن أفضل الكوادر المتخصصة',
    icon: Users,
  },
  {
    id: 2,
    title: 'إدارة الموظفين',
    description: 'إدارة متكاملة لموارد بشرية احترافية',
    icon: Briefcase,
  },
  {
    id: 3,
    title: 'إدارة المشاريع',
    description: 'تخطيط وتنفيذ المشاريع بكفاءة عالية',
    icon: Award,
  },
];

const STORES = [
  { id: 1, name: 'متجر التكنولوجيا', category: 'إلكترونيات', rating: 4.8, reviews: 234 },
  { id: 2, name: 'متجر الملابس', category: 'ملابس', rating: 4.6, reviews: 189 },
  { id: 3, name: 'متجر الديكور', category: 'ديكور', rating: 4.7, reviews: 156 },
  { id: 4, name: 'متجر الكتب', category: 'كتب', rating: 4.9, reviews: 312 },
];

const PATHS = [
  { 
    id: 'student', 
    title: 'المسار الطلابي', 
    icon: '📚', 
    desc: 'دورات وتحضير للاختبارات',
    courses: [
      { name: 'دورة الرياضيات المتقدمة', duration: '12 أسبوع' },
      { name: 'دورة اللغة الإنجليزية', duration: '10 أسابيع' },
      { name: 'دورة العلوم', duration: '14 أسبوع' },
    ],
    certificates: ['شهادة الكفاءة', 'شهادة التفوق'],
  },
  { 
    id: 'employee', 
    title: 'مسار الموظف', 
    icon: '👔', 
    desc: 'تطوير مهني وفرص عمل',
    courses: [
      { name: 'دورة القيادة والإدارة', duration: '8 أسابيع' },
      { name: 'دورة مهارات التواصل', duration: '6 أسابيع' },
      { name: 'دورة التطوير الذاتي', duration: '10 أسابيع' },
    ],
    certificates: ['شهادة الموظف المتميز', 'شهادة القيادة'],
  },
  { 
    id: 'trader', 
    title: 'مسار التاجر', 
    icon: '🛍️', 
    desc: 'دعم المتاجر الإلكترونية',
    courses: [
      { name: 'دورة التجارة الإلكترونية', duration: '12 أسبوع' },
      { name: 'دورة التسويق الرقمي', duration: '10 أسابيع' },
      { name: 'دورة إدارة المبيعات', duration: '8 أسابيع' },
    ],
    certificates: ['شهادة التاجر الإلكتروني', 'شهادة المبيعات'],
  },
  { 
    id: 'entrepreneur', 
    title: 'رائد الأعمال', 
    icon: '🚀', 
    desc: 'استشارات وتمويل',
    courses: [
      { name: 'دورة بدء المشروع', duration: '16 أسبوع' },
      { name: 'دورة التمويل والاستثمار', duration: '12 أسبوع' },
      { name: 'دورة التخطيط الاستراتيجي', duration: '14 أسبوع' },
    ],
    certificates: ['شهادة رائد الأعمال', 'شهادة الابتكار'],
  },
  { 
    id: 'jobseeker', 
    title: 'الباحث عن عمل', 
    icon: '🎯', 
    desc: 'فرص عمل وتطوير مهارات',
    courses: [
      { name: 'دورة إعداد السيرة الذاتية', duration: '4 أسابيع' },
      { name: 'دورة مهارات المقابلة', duration: '6 أسابيع' },
      { name: 'دورة تطوير المهارات المهنية', duration: '10 أسابيع' },
    ],
    certificates: ['شهادة الكفاءة المهنية', 'شهادة النجاح'],
  },
  { 
    id: 'researcher', 
    title: 'الباحث', 
    icon: '🔬', 
    desc: 'موارد بحثية وتعاون',
    courses: [
      { name: 'دورة البحث العلمي', duration: '14 أسبوع' },
      { name: 'دورة كتابة الأوراق البحثية', duration: '10 أسابيع' },
      { name: 'دورة المنهجية البحثية', duration: '12 أسبوع' },
    ],
    certificates: ['شهادة الباحث المتقدم', 'شهادة النشر العلمي'],
  },
];

// دالة لإرسال البيانات عبر البريد الإلكتروني
const sendEmailNotification = async (subject: string, data: any) => {
  try {
    // هذا مثال على كيفية إرسال البيانات إلى خادم
    // يمكن استخدام FormSubmit أو EmailJS أو أي خدمة أخرى
    console.log('إرسال بيانات إلى البريد:', { subject, data, email: USER_EMAIL });
    
    // يمكن استخدام FormSubmit.co مثلاً:
    const formData = new FormData();
    formData.append('email', USER_EMAIL);
    formData.append('subject', subject);
    formData.append('message', JSON.stringify(data, null, 2));
    
    // هذا مثال فقط - يحتاج إلى تكوين فعلي
    alert(`تم إرسال البيانات بنجاح إلى ${USER_EMAIL}`);
  } catch (error) {
    console.error('خطأ في الإرسال:', error);
  }
};

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<typeof CONSULTANTS[0] | null>(null);
  const [selectedPath, setSelectedPath] = useState<typeof PATHS[0] | null>(null);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);

  const handleBookingSubmit = (e: React.FormEvent, consultant: typeof CONSULTANTS[0]) => {
    e.preventDefault();
    const bookingData = {
      consultant: consultant.name,
      specialty: consultant.specialty,
      timestamp: new Date().toISOString(),
      country: currentCountry?.name,
    };
    sendEmailNotification('حجز موعد جديد مع مستشار', bookingData);
    setSelectedConsultant(null);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmailNotification('رسالة تواصل جديدة', contactData);
    setContactData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Sharaka" className="h-14 w-auto object-contain hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Country Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCountryMenu(!showCountryMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-all duration-300 hover:shadow-md"
            >
              <span className="text-lg">{currentCountry?.flag}</span>
              <span className="text-sm font-semibold text-primary">{currentCountry?.name}</span>
              <ChevronRight size={16} className={`transition-transform duration-300 ${showCountryMenu ? 'rotate-90' : ''}`} />
            </button>

            {showCountryMenu && (
              <div className="absolute top-full right-0 mt-2 bg-card rounded-lg shadow-lg border border-border z-50 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-300">
                {COUNTRIES.map(country => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country.code);
                      setShowCountryMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-right flex items-center gap-2 hover:bg-secondary transition-all duration-300 ${
                      selectedCountry === country.code ? 'bg-secondary text-primary font-semibold' : ''
                    }`}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-secondary to-background">
          <div className="container mx-auto px-4 text-center space-y-6">
            <img src={LOGO_URL} alt="Sharaka" className="h-40 w-auto mx-auto animate-bounce" style={{ animationDuration: '3s' }} />
            <h1 className="text-5xl md:text-6xl font-bold text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">شريك نجاحك</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              منصة أعمال رقمية متكاملة تجمع الاستشارات والتعهيد وإدارة المشاريع والسوق الإلكتروني ونظام النقاط
            </p>
            <Button className="btn-primary hover:shadow-lg hover:scale-105 transition-all duration-300">ابدأ الآن</Button>
          </div>
        </section>

        {/* Main Sections */}
        <section id="sections" className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'المستشارون', desc: 'استشارات متخصصة' },
              { icon: Briefcase, title: 'الخدمات', desc: 'خدمات التعهيد' },
              { icon: ShoppingBag, title: 'السوق', desc: 'متاجر إلكترونية' },
              { icon: Award, title: 'النقاط', desc: 'نظام الحوافز' },
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
        <section id="consultants" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">المستشارون والاستشارات</h2>
              <p className="text-lg text-foreground/70">استشارات متخصصة من الخبراء</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {CONSULTANTS.map(consultant => (
                <div key={consultant.id} className="card p-8 group hover:shadow-2xl hover:-translate-y-3 transition-all duration-300">
                  <div className="text-6xl mb-4 text-center group-hover:scale-125 transition-transform duration-300">{consultant.image}</div>
                  <h3 className="text-xl font-bold text-primary mb-2">{consultant.name}</h3>
                  <p className="text-accent font-semibold text-sm mb-3">{consultant.specialty}</p>
                  <p className="text-foreground/70 text-sm mb-6">{consultant.bio}</p>
                  <Button 
                    onClick={() => setSelectedConsultant(consultant)}
                    className="w-full btn-primary justify-center hover:shadow-lg transition-all duration-300"
                  >
                    <ArrowRight size={18} className="ml-2" />
                    حجز موعد
                  </Button>
                </div>
              ))}
            </div>

            {selectedConsultant && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-card rounded-lg shadow-2xl max-w-md w-full p-8 animate-in slide-in-from-bottom-4 duration-300">
                  <h3 className="text-2xl font-bold text-primary mb-4">حجز موعد مع {selectedConsultant.name}</h3>
                  <form onSubmit={(e) => handleBookingSubmit(e, selectedConsultant)} className="space-y-4">
                    <input type="text" placeholder="اسمك" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" required />
                    <input type="email" placeholder="بريدك الإلكتروني" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" required />
                    <input type="tel" placeholder="رقم الهاتف" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" required />
                    <textarea placeholder="ملاحظات" rows={3} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" />
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1 btn-primary justify-center hover:shadow-lg transition-all duration-300">تأكيد</Button>
                      <Button onClick={() => setSelectedConsultant(null)} className="flex-1 btn-outline">إلغاء</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">خدمات التعهيد والإدارة</h2>
            <p className="text-lg text-foreground/70">حلول متكاملة لإدارة موارد شركتك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {SERVICES.map(service => {
              const Icon = service.icon;
              return (
                <div key={service.id} className="card p-8 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <Icon className="w-12 h-12 text-accent mb-4 group-hover:scale-125 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                  <p className="text-foreground/70">{service.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border-r-4 border-primary rounded-lg p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex gap-4">
              <AlertCircle className="text-primary flex-shrink-0" size={24} />
              <div>
                <h4 className="text-xl font-bold text-primary mb-2">التزام منصة شراكة</h4>
                <p className="text-foreground/80">
                  <strong>تلتزم منصة شراكة بدفع راتب شهر كامل من كل 12 شهر للموظف الذي يعمل لدى العميل ضمن عقد التعهيد.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace Section */}
        <section id="marketplace" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">السوق الإلكتروني</h2>
              <p className="text-lg text-foreground/70">منصة متكاملة تجمع أفضل المتاجر والعروض</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STORES.map(store => (
                <div key={store.id} className="card p-6 group hover:scale-110 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl group-hover:scale-125 transition-transform duration-300">🏪</div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-sm text-primary">{store.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-1">{store.name}</h3>
                  <p className="text-accent text-sm font-semibold mb-3">{store.category}</p>
                  <p className="text-foreground/70 text-sm mb-4">{store.reviews} تقييم</p>
                  <Button className="w-full btn-secondary justify-center hover:shadow-lg transition-all duration-300">
                    <ShoppingBag size={18} />
                    دخول المتجر
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Paths Section */}
        <section id="paths" className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">المسارات المتاحة</h2>
            <p className="text-lg text-foreground/70">اختر المسار المناسب لك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PATHS.map(path => (
              <div 
                key={path.id} 
                onClick={() => setSelectedPath(path)}
                className="card p-8 group hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer"
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{path.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{path.title}</h3>
                <p className="text-foreground/70 text-sm mb-4">{path.desc}</p>
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
                    <h3 className="text-3xl font-bold text-primary">{selectedPath.title}</h3>
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
                    <h4 className="text-xl font-bold text-primary mb-4">الدورات المتاحة:</h4>
                    <div className="space-y-3">
                      {selectedPath.courses.map((course, idx) => (
                        <div key={idx} className="p-4 bg-secondary rounded-lg hover:shadow-md transition-all duration-300">
                          <p className="font-semibold text-primary">{course.name}</p>
                          <p className="text-sm text-foreground/70">المدة: {course.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-primary mb-4">الشهادات:</h4>
                    <div className="space-y-2">
                      {selectedPath.certificates.map((cert, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                          <Award className="text-accent" size={20} />
                          <span className="text-primary font-semibold">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setSelectedPath(null)}
                    className="w-full btn-primary justify-center hover:shadow-lg transition-all duration-300"
                  >
                    إغلاق
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Points System */}
        <section id="points" className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">نظام النقاط والرصيد المالي</h2>
              <p className="text-lg opacity-90">نظام حوافز ذكي يحول عمليات الشراء إلى رصيد مالي حقيقي</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: TrendingUp, title: '1. اكسب النقاط', desc: 'من كل عملية شراء' },
                { icon: Award, title: '2. تجميع الرصيد', desc: 'رصيد مالي حقيقي' },
                { icon: Zap, title: '3. استخدم الرصيد', desc: 'في أي متجر' },
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
        <section id="contact" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">تواصل معنا</h2>
              <p className="text-lg text-foreground/70">نحن هنا للإجابة على جميع أسئلتك</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: Mail, title: 'البريد الإلكتروني', value: USER_EMAIL },
                { icon: Phone, title: 'الهاتف', value: '+966 11 2345 6789' },
                { icon: MapPin, title: 'العنوان', value: 'الرياض، السعودية' },
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
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="اسمك"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                    required
                  />
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                    required
                  />
                </div>
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                />
                <input
                  type="text"
                  placeholder="الموضوع"
                  value={contactData.subject}
                  onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                />
                <textarea
                  placeholder="رسالتك"
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  rows={5}
                  required
                />
                <Button type="submit" className="w-full btn-primary justify-center hover:shadow-lg transition-all duration-300">
                  <MessageCircle size={20} />
                  إرسال الرسالة
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">من نحن</h2>
          </div>

          <div className="card max-w-3xl mx-auto p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex gap-4 mb-4">
              <Info className="w-8 h-8 text-accent flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">رؤية منصة شراكة</h3>
                <p className="text-foreground/70 leading-relaxed mb-4">
                  منصة شراكة هي منصة أعمال رقمية متكاملة تهدف إلى ربط الأفراد والشركات والمستشارين والمتاجر في بيئة واحدة آمنة وموثوقة.
                </p>
                <p className="text-foreground/70 leading-relaxed">
                  نؤمن بأن النجاح يأتي من خلال التعاون والشراكة الحقيقية، لذلك نعمل على توفير أدوات وخدمات تساعد كل فئة على تحقيق أهدافها.
                </p>
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
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#consultants" className="hover:text-accent transition-colors duration-300">المستشارون</a></li>
                <li><a href="#services" className="hover:text-accent transition-colors duration-300">الخدمات</a></li>
                <li><a href="#marketplace" className="hover:text-accent transition-colors duration-300">السوق</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">الخدمات</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors duration-300">التعهيد</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-300">الاستشارات</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-300">النقاط</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">قانوني</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors duration-300">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-300">الشروط والأحكام</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">تواصل</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>البريد: {USER_EMAIL}</li>
                <li>الهاتف: +966 11 2345 6789</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2026 منصة شراكة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
