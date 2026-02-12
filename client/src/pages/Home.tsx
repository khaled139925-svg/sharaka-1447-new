'use client';

import { useState } from 'react';
import { ChevronRight, MapPin, Users, Briefcase, ShoppingBag, Award, MessageCircle, Info } from 'lucide-react';

const LOGO_URL = 'https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663333045223/rXaunJeoqnztcFsl.png?Expires=1802413495&Signature=gDDnBD9nDi8als-Qt0axako7NqvAn5H5sKYuDoKTREdV18rjB670Nxc495YhEr5tbpRsAgmyObWMsc29C-os0v5xR1Ie4TBw0Mw1vgBY0aUWug7VIUdwWgOnS4fkeLJSX4OF3dU8f9~yU91N~3XQyYnLzGPH7GM97RImmTditl2jlRsKhRcg57Ou5IftEHLJmIuc3P~lYKKilr8lGlllybAPmFaw-q7RSIHGhW87l0iIqBRy~7YIR6xRtfIp1ZXmSClWCDZeZ4Cpx1Lol5~GSXYDV2znITz4Y~uXPyEQn0F6zg7wYDUx67X81ZbqQZ2RN1CICj-RYJoXwlSVpzE16w__&Key-Pair-Id=K2HSFNDJXOU9YS';

const COUNTRIES = [
  { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', name: 'عمان', flag: '🇴🇲' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
];

const PATHS = [
  {
    id: 'student',
    title: 'المسار الطلابي',
    icon: '📚',
    description: 'مسار شامل للطلاب يتضمن دورات تطوير وتحضير للاختبارات',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'employee',
    title: 'مسار الموظف',
    icon: '👔',
    description: 'تطوير مهني وترقيات وفرص عمل جديدة',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'trader',
    title: 'مسار التاجر',
    icon: '🛍️',
    description: 'دعم كامل للتجار والمتاجر الإلكترونية',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'entrepreneur',
    title: 'مسار رائد الأعمال',
    icon: '🚀',
    description: 'استشارات وتمويل وإدارة مشاريع',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'jobseeker',
    title: 'الباحث عن عمل',
    icon: '🎯',
    description: 'فرص عمل وتطوير مهارات وتحضير للمقابلات',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'researcher',
    title: 'مسار الباحث',
    icon: '🔬',
    description: 'موارد بحثية وفرص تعاون علمي',
    color: 'from-indigo-500 to-indigo-600',
  },
];

const MAIN_SECTIONS = [
  {
    id: 'paths',
    title: 'المسارات',
    icon: MapPin,
    description: 'مسارات تطوير شاملة لكل فئة',
    color: 'text-blue-600',
  },
  {
    id: 'consultants',
    title: 'الاستشارات',
    icon: Users,
    description: 'استشارات متخصصة من الخبراء',
    color: 'text-green-600',
  },
  {
    id: 'marketplace',
    title: 'السوق',
    icon: ShoppingBag,
    description: 'متاجر وعروض حصرية',
    color: 'text-purple-600',
  },
  {
    id: 'outsourcing',
    title: 'التعهيد',
    icon: Briefcase,
    description: 'خدمات تعهيد احترافية',
    color: 'text-orange-600',
  },
];

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string>('SA');
  const [showCountryMenu, setShowCountryMenu] = useState(false);

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f1e8] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#d9cfc0] shadow-sm">
        <div className="container flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Sharaka" className="h-12 w-12 object-contain" />
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg text-[#2d5a4a]">شراكة</span>
              <span className="text-xs text-[#d4a574]">شريك نجاحك</span>
            </div>
          </div>

          {/* Country Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCountryMenu(!showCountryMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f5f1e8] border border-[#d9cfc0] hover:bg-[#e8dcc8] transition-colors"
            >
              <span className="text-lg">{currentCountry?.flag}</span>
              <span className="text-sm font-semibold text-[#2d5a4a]">{currentCountry?.name}</span>
              <ChevronRight size={16} className={`transition-transform ${showCountryMenu ? 'rotate-90' : ''}`} />
            </button>

            {showCountryMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-[#d9cfc0] z-50 min-w-[200px]">
                {COUNTRIES.map(country => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country.code);
                      setShowCountryMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-right flex items-center gap-2 hover:bg-[#f5f1e8] transition-colors ${
                      selectedCountry === country.code ? 'bg-[#e8dcc8] text-[#2d5a4a] font-semibold' : ''
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

      {/* Hero Section */}
      <section className="section container">
        <div className="text-center space-y-6 mb-12">
          <img src={LOGO_URL} alt="Sharaka" className="h-32 w-32 mx-auto" />
          <h1 className="text-5xl md:text-6xl font-bold text-[#2d5a4a]">شريك نجاحك</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            منصة أعمال رقمية متكاملة تجمع الاستشارات والتعهيد وإدارة المشاريع والسوق الإلكتروني ونظام النقاط
          </p>
          <p className="text-lg text-[#d4a574] font-semibold">
            اختر مسارك وابدأ رحلة النمو والتطور
          </p>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-2 mb-12">
          {MAIN_SECTIONS.map(section => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="card group cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className={`${section.color} w-12 h-12`} />
                  <ChevronRight className="text-[#d4a574] group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-[#2d5a4a] mb-2">{section.title}</h3>
                <p className="text-gray-600">{section.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Paths Section */}
      <section className="section bg-gradient-to-r from-[#2d5a4a]/5 to-[#d4a574]/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2d5a4a] mb-4">المسارات المتاحة</h2>
            <p className="text-lg text-gray-600">اختر المسار المناسب لك واستفد من خدمات متخصصة</p>
          </div>

          <div className="grid grid-3">
            {PATHS.map(path => (
              <div
                key={path.id}
                className="card group cursor-pointer hover:shadow-lg transform hover:-translate-y-2 transition-all"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{path.icon}</div>
                <h3 className="text-xl font-bold text-[#2d5a4a] mb-2">{path.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{path.description}</p>
                <button className="btn btn-primary w-full justify-center">
                  اكتشف المسار
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2d5a4a] mb-4">لماذا شراكة؟</h2>
        </div>

        <div className="grid grid-2 md:grid-4">
          {[
            { icon: '⚡', title: 'سريعة', desc: 'خدمات فورية وفعالة' },
            { icon: '🎯', title: 'موثوقة', desc: 'معايير عالية الجودة' },
            { icon: '🌍', title: 'محلية', desc: 'متخصصة لكل دولة' },
            { icon: '💰', title: 'اقتصادية', desc: 'أسعار تنافسية' },
          ].map((feature, idx) => (
            <div key={idx} className="text-center p-6">
              <div className="text-5xl mb-3">{feature.icon}</div>
              <h4 className="font-bold text-[#2d5a4a] mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Points System */}
      <section className="section bg-gradient-to-r from-[#2d5a4a] to-[#3a7a68] text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">نظام النقاط والرصيد</h2>
            <p className="text-lg opacity-90">اكسب نقاط من كل عملية شراء وحولها إلى رصيد حقيقي</p>
          </div>

          <div className="grid grid-3 gap-8">
            {[
              { num: '1', title: 'اكسب النقاط', desc: 'من كل عملية شراء' },
              { num: '2', title: 'تجميع الرصيد', desc: 'رصيد مالي حقيقي' },
              { num: '3', title: 'استخدم الرصيد', desc: 'في أي متجر' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold mb-3 text-[#d4a574]">{step.num}</div>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="opacity-80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outsourcing Commitment */}
      <section className="section container">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-r-4 border-[#2d5a4a] rounded-lg p-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Award className="w-8 h-8 text-[#2d5a4a]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#2d5a4a] mb-3">التزام منصة شراكة</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>تلتزم منصة شراكة بدفع راتب شهر كامل من كل 12 شهر للموظف الذي يعمل لدى العميل ضمن عقد التعهيد.</strong>
                <br />
                هذا الالتزام يعكس التزامنا بالعدالة والشفافية مع جميع أطرافنا.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-[#f5f1e8]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2d5a4a] mb-4">تواصل معنا</h2>
            <p className="text-lg text-gray-600">نحن هنا للإجابة على جميع أسئلتك</p>
          </div>

          <div className="grid grid-3 gap-8 mb-12">
            {[
              { icon: '📧', title: 'البريد', value: 'info@sharaka.sa' },
              { icon: '📞', title: 'الهاتف', value: '+966 11 2345 6789' },
              { icon: '📍', title: 'العنوان', value: 'الرياض، السعودية' },
            ].map((contact, idx) => (
              <div key={idx} className="card text-center">
                <div className="text-4xl mb-3">{contact.icon}</div>
                <h4 className="font-bold text-[#2d5a4a] mb-2">{contact.title}</h4>
                <p className="text-gray-600">{contact.value}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto card">
            <form className="space-y-4">
              <div className="grid grid-2 gap-4">
                <input
                  type="text"
                  placeholder="اسمك"
                  className="px-4 py-2 border border-[#d9cfc0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a4a]"
                />
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="px-4 py-2 border border-[#d9cfc0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a4a]"
                />
              </div>
              <textarea
                placeholder="رسالتك"
                rows={5}
                className="w-full px-4 py-2 border border-[#d9cfc0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a4a]"
              />
              <button type="submit" className="btn btn-primary w-full justify-center">
                <MessageCircle size={20} />
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2d5a4a] mb-4">من نحن</h2>
        </div>

        <div className="card max-w-3xl mx-auto">
          <div className="flex gap-4 mb-4">
            <Info className="w-8 h-8 text-[#d4a574] flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-[#2d5a4a] mb-4">رؤية منصة شراكة</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                منصة شراكة هي منصة أعمال رقمية متكاملة تهدف إلى ربط الأفراد والشركات والمستشارين والمتاجر في بيئة واحدة آمنة وموثوقة.
              </p>
              <p className="text-gray-700 leading-relaxed">
                نؤمن بأن النجاح يأتي من خلال التعاون والشراكة الحقيقية، لذلك نعمل على توفير أدوات وخدمات تساعد كل فئة على تحقيق أهدافها.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d5a4a] text-white py-12">
        <div className="container">
          <div className="grid grid-2 md:grid-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-[#d4a574] transition-colors">المسارات</a></li>
                <li><a href="#" className="hover:text-[#d4a574] transition-colors">الاستشارات</a></li>
                <li><a href="#" className="hover:text-[#d4a574] transition-colors">السوق</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">الخدمات</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-[#d4a574] transition-colors">التعهيد</a></li>
                <li><a href="#" className="hover:text-[#d4a574] transition-colors">الاستشارات</a></li>
                <li><a href="#" className="hover:text-[#d4a574] transition-colors">النقاط</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">قانوني</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-[#d4a574] transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-[#d4a574] transition-colors">الشروط والأحكام</a></li>
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

          <div className="border-t border-white/20 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2026 منصة شراكة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
