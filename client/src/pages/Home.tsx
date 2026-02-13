import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Users, Briefcase, ShoppingBag, Award, MessageCircle, Info, 
  ChevronRight, MapPin, TrendingUp, Zap, Mail, Phone, AlertCircle,
  ExternalLink
} from 'lucide-react';

const LOGO_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/ulkhpqXvgwOhgZuZ.jpeg';

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
  },
  {
    id: 2,
    name: 'أ. فاطمة علي',
    specialty: 'التسويق الرقمي',
    bio: 'متخصصة في التسويق الإلكتروني والعلامات التجارية',
    image: '👩‍💼',
  },
  {
    id: 3,
    name: 'م. سارة حسن',
    specialty: 'تطوير البرمجيات',
    bio: 'مهندسة برمجيات بخبرة 10 سنوات في التطوير',
    image: '👩‍💻',
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
  { id: 'student', title: 'المسار الطلابي', icon: '📚', desc: 'دورات وتحضير للاختبارات' },
  { id: 'employee', title: 'مسار الموظف', icon: '👔', desc: 'تطوير مهني وفرص عمل' },
  { id: 'trader', title: 'مسار التاجر', icon: '🛍️', desc: 'دعم المتاجر الإلكترونية' },
  { id: 'entrepreneur', title: 'رائد الأعمال', icon: '🚀', desc: 'استشارات وتمويل' },
  { id: 'jobseeker', title: 'الباحث عن عمل', icon: '🎯', desc: 'فرص عمل وتطوير مهارات' },
  { id: 'researcher', title: 'الباحث', icon: '🔬', desc: 'موارد بحثية وتعاون' },
];

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<typeof CONSULTANTS[0] | null>(null);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('شكراً لتواصلك معنا. سنرد عليك قريباً');
    setContactData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Sharaka" className="h-14 w-auto object-contain" />
          </div>

          {/* Country Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCountryMenu(!showCountryMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-colors"
            >
              <span className="text-lg">{currentCountry?.flag}</span>
              <span className="text-sm font-semibold text-primary">{currentCountry?.name}</span>
              <ChevronRight size={16} className={`transition-transform ${showCountryMenu ? 'rotate-90' : ''}`} />
            </button>

            {showCountryMenu && (
              <div className="absolute top-full right-0 mt-2 bg-card rounded-lg shadow-lg border border-border z-50 min-w-[180px]">
                {COUNTRIES.map(country => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country.code);
                      setShowCountryMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-right flex items-center gap-2 hover:bg-secondary transition-colors ${
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
            <img src={LOGO_URL} alt="Sharaka" className="h-40 w-auto mx-auto" />
            <h1 className="text-5xl md:text-6xl font-bold text-primary">شريك نجاحك</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              منصة أعمال رقمية متكاملة تجمع الاستشارات والتعهيد وإدارة المشاريع والسوق الإلكتروني ونظام النقاط
            </p>
            <Button className="btn-primary">ابدأ الآن</Button>
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
                <div key={idx} className="card p-6 group hover:shadow-lg transition-all cursor-pointer">
                  <Icon className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
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
                <div key={consultant.id} className="card p-8 group hover:shadow-lg transition-all">
                  <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">{consultant.image}</div>
                  <h3 className="text-xl font-bold text-primary mb-2">{consultant.name}</h3>
                  <p className="text-accent font-semibold text-sm mb-3">{consultant.specialty}</p>
                  <p className="text-foreground/70 text-sm mb-6">{consultant.bio}</p>
                  <Button 
                    onClick={() => setSelectedConsultant(consultant)}
                    className="w-full btn-primary justify-center"
                  >
                    حجز موعد
                  </Button>
                </div>
              ))}
            </div>

            {selectedConsultant && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-card rounded-lg shadow-2xl max-w-md w-full p-8">
                  <h3 className="text-2xl font-bold text-primary mb-4">حجز موعد مع {selectedConsultant.name}</h3>
                  <form className="space-y-4">
                    <input type="text" placeholder="اسمك" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="email" placeholder="بريدك الإلكتروني" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="tel" placeholder="رقم الهاتف" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    <textarea placeholder="ملاحظات" rows={3} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    <div className="flex gap-4">
                      <Button className="flex-1 btn-primary justify-center">تأكيد</Button>
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
                <div key={service.id} className="card p-8 group hover:shadow-lg transition-all">
                  <Icon className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                  <p className="text-foreground/70">{service.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border-r-4 border-primary rounded-lg p-8">
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
                <div key={store.id} className="card p-6 group hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">🏪</div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-sm text-primary">{store.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-1">{store.name}</h3>
                  <p className="text-accent text-sm font-semibold mb-3">{store.category}</p>
                  <p className="text-foreground/70 text-sm mb-4">{store.reviews} تقييم</p>
                  <Button className="w-full btn-secondary justify-center">
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
              <div key={path.id} className="card p-8 group hover:shadow-lg transition-all cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{path.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{path.title}</h3>
                <p className="text-foreground/70 text-sm">{path.desc}</p>
              </div>
            ))}
          </div>
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
                  <div key={idx} className="text-center">
                    <Icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
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
                { icon: Mail, title: 'البريد الإلكتروني', value: 'info@sharaka.sa' },
                { icon: Phone, title: 'الهاتف', value: '+966 11 2345 6789' },
                { icon: MapPin, title: 'العنوان', value: 'الرياض، السعودية' },
              ].map((contact, idx) => {
                const Icon = contact.icon;
                return (
                  <div key={idx} className="card p-8 text-center">
                    <Icon className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h4 className="font-bold text-primary mb-2">{contact.title}</h4>
                    <p className="text-foreground/70">{contact.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="max-w-2xl mx-auto card p-8">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="اسمك"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="الموضوع"
                  value={contactData.subject}
                  onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <textarea
                  placeholder="رسالتك"
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={5}
                  required
                />
                <Button type="submit" className="w-full btn-primary justify-center">
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

          <div className="card max-w-3xl mx-auto p-8">
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
                <li><a href="#consultants" className="hover:text-accent transition-colors">المستشارون</a></li>
                <li><a href="#services" className="hover:text-accent transition-colors">الخدمات</a></li>
                <li><a href="#marketplace" className="hover:text-accent transition-colors">السوق</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">الخدمات</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors">التعهيد</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">الاستشارات</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">النقاط</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">قانوني</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">الشروط والأحكام</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">تواصل</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>البريد: info@sharaka.sa</li>
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
