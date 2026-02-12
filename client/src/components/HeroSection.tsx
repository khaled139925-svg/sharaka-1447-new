import { ArrowRight } from 'lucide-react';

const LOGO_URL = 'https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663333045223/sbAbhoRnZZJtbbxK.png?Expires=1802412272&Signature=TD8nd1FdHrkqTkCCxY-ZVhHyATSQtPAzuY-8zMApcpr3U9DoydyTZmQEqpV6HpBzGAE-cEWp52ssRVXttra5Wk0tukbavZchGFT~uH4cv0AUyuSDEhvALRh-1MYxb1aGdizSy7Ao4jj2RK-iCDlbOaZLv45AnC2srGd5nzJjHn0T4JJ7h0UXgboUkeiGg-vXsFoomH5Jz0Xh~~fRRUR~5o3e3wTUgleUkY0knQFtx4y-DYDdb1l5yBh9WsO~GQuK3AAkU~hp7EkE3mmd0ITu5JWpQ4WDbEKxsws7lRE13upZLEp7iLrohTOLV0AAMqSUw34dSFUdM8UgoBkFuUSC-Q__&Key-Pair-Id=K2HSFNDJXOU9YS';

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-32 pb-16 md:pt-40 md:pb-24 sharaka-pattern relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
                شريك نجاحك
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed">
                منصة شراكة هي منصة أعمال رقمية متكاملة تجمع بين الاستشارات المهنية، خدمات التعهيد، إدارة المشاريع والموظفين، والسوق الإلكتروني.
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <span className="text-foreground/80">استشارات مهنية متخصصة من خبراء</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <span className="text-foreground/80">خدمات تعهيد وإدارة موظفين احترافية</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <span className="text-foreground/80">نظام نقاط ورصيد مالي لتحفيز المبيعات</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <span className="text-foreground/80">سوق إلكتروني متطور للمتاجر</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => scrollToSection('consultants')}
                className="sharaka-btn-primary flex items-center justify-center gap-2 group"
              >
                ابدأ الآن
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="sharaka-btn-outline flex items-center justify-center gap-2"
              >
                تواصل معنا
              </button>
            </div>
          </div>

          {/* Right Content - Logo */}
          <div className="flex justify-center animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <div className="relative w-full max-w-md">
              {/* Decorative Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
              
              {/* Logo Container */}
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <img src={LOGO_URL} alt="Sharaka" className="w-full h-auto" />
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-4 border border-border animate-bounce" style={{ animationDelay: '0s' }}>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">100+</p>
                  <p className="text-xs text-foreground/60">شريك ناجح</p>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-card rounded-xl shadow-lg p-4 border border-border animate-bounce" style={{ animationDelay: '0.2s' }}>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">24/7</p>
                  <p className="text-xs text-foreground/60">دعم فني</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
