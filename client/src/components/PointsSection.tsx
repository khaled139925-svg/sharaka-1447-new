import { TrendingUp, Award, Zap } from 'lucide-react';

const BENEFITS = [
  { title: 'لا خسارة على أحد', desc: 'جميع الأطراف تستفيد من النظام' },
  { title: 'تنشيط المبيعات', desc: 'العملاء يتنقلون بين المتاجر باستخدام الرصيد' },
  { title: 'ولاء العملاء', desc: 'يبقى العملاء ضمن منصة شراكة' },
  { title: 'شفافية كاملة', desc: 'كل العمليات واضحة وموثقة' },
];

export default function PointsSection() {
  return (
    <section id="points" className="sharaka-section">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
            نظام النقاط والرصيد المالي
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            نظام حوافز ذكي يحول عمليات الشراء إلى رصيد مالي حقيقي
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="sharaka-card p-8 text-center group hover:shadow-xl transition-shadow">
            <div className="inline-block p-4 bg-accent/10 rounded-full mb-6 group-hover:bg-accent/20 transition-colors">
              <TrendingUp className="text-accent" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">1. اكسب النقاط</h3>
            <p className="text-foreground/70">
              كل عملية شراء من المتاجر المشاركة تمنحك نقاط بناءً على قيمة الشراء
            </p>
          </div>

          <div className="sharaka-card p-8 text-center group hover:shadow-xl transition-shadow">
            <div className="inline-block p-4 bg-accent/10 rounded-full mb-6 group-hover:bg-accent/20 transition-colors">
              <Award className="text-accent" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">2. تجميع الرصيد</h3>
            <p className="text-foreground/70">
              النقاط تتراكم تلقائياً وتتحول إلى رصيد مالي حقيقي في محفظتك
            </p>
          </div>

          <div className="sharaka-card p-8 text-center group hover:shadow-xl transition-shadow">
            <div className="inline-block p-4 bg-accent/10 rounded-full mb-6 group-hover:bg-accent/20 transition-colors">
              <Zap className="text-accent" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">3. استخدم الرصيد</h3>
            <p className="text-foreground/70">
              استخدم رصيدك في أي متجر مشارك بدون أي خسارة أو قيود
            </p>
          </div>
        </div>

        {/* Example Calculation */}
        <div className="bg-secondary/50 rounded-2xl p-12 mb-16">
          <h3 className="text-3xl font-bold text-primary mb-8 text-center">مثال عملي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border-r-4 border-accent">
                <p className="text-foreground/70 text-sm">السيناريو</p>
                <p className="font-semibold text-primary">متجر يمنح العميل 50 ريال هدية</p>
              </div>
              <div className="bg-card rounded-lg p-4 border-r-4 border-primary">
                <p className="text-foreground/70 text-sm">ما يحدث</p>
                <p className="font-semibold text-primary">تتحول الـ 50 ريال إلى نقاط في المنصة</p>
              </div>
              <div className="bg-card rounded-lg p-4 border-r-4 border-accent">
                <p className="text-foreground/70 text-sm">النتيجة</p>
                <p className="font-semibold text-primary">العميل يستخدمها في أي متجر آخر</p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center space-y-4">
              <div className="text-center space-y-2">
                <div className="text-6xl font-bold text-accent">50</div>
                <p className="text-foreground/70">ريال هدية</p>
              </div>
              <div className="text-3xl text-primary">↓</div>
              <div className="text-center space-y-2">
                <div className="text-6xl font-bold text-primary">50</div>
                <p className="text-foreground/70">نقطة في المنصة</p>
              </div>
              <div className="text-3xl text-primary">↓</div>
              <div className="text-center space-y-2">
                <div className="text-6xl font-bold text-accent">50</div>
                <p className="text-foreground/70">ريال للاستخدام</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">فوائد النظام</h3>
            {BENEFITS.map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-4 h-4 rounded-full bg-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">{benefit.title}</h4>
                  <p className="text-foreground/70 text-sm">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 flex flex-col justify-center">
            <h4 className="text-2xl font-bold text-primary mb-6">كيف يعمل النظام؟</h4>
            <div className="space-y-4 text-foreground/80">
              <p>
                <strong className="text-primary">للعملاء:</strong> احصل على نقاط من كل عملية شراء واستخدمها بحرية في أي متجر
              </p>
              <p>
                <strong className="text-primary">للمتاجر:</strong> زيادة الحركة والمبيعات من خلال جذب عملاء جدد
              </p>
              <p>
                <strong className="text-primary">للمنصة:</strong> نمو مستمر وعلاقات قوية مع جميع الأطراف
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="sharaka-btn-primary text-lg px-8 py-4">
            ابدأ جمع النقاط الآن
          </button>
        </div>
      </div>
    </section>
  );
}
