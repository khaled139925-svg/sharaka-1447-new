import { Users, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const SERVICES = [
  {
    id: 1,
    title: 'التوظيف والاستقطاب',
    description: 'نساعدك في البحث عن أفضل الكوادر المتخصصة وفقاً لاحتياجات شركتك',
    icon: Users,
    details: ['البحث والاستقطاب', 'المقابلات والتقييم', 'التدقيق والتوثيق'],
  },
  {
    id: 2,
    title: 'إدارة الموظفين',
    description: 'إدارة متكاملة لموارد بشرية احترافية وفعالة',
    icon: Briefcase,
    details: ['الرواتب والمستحقات', 'الأداء والتقييم', 'التطوير والتدريب'],
  },
  {
    id: 3,
    title: 'إدارة المشاريع',
    description: 'تخطيط وتنفيذ المشاريع بكفاءة عالية وفي الموعد المحدد',
    icon: CheckCircle,
    details: ['التخطيط والجدولة', 'المتابعة والمراقبة', 'إدارة المخاطر'],
  },
];

const WHY_CHOOSE_US = [
  { title: 'خبرة عميقة', desc: 'فريق متخصص بخبرة أكثر من 15 سنة' },
  { title: 'مرونة عالية', desc: 'حلول مخصصة تناسب احتياجات شركتك' },
  { title: 'جودة مضمونة', desc: 'معايير عالية في تقديم الخدمات' },
  { title: 'دعم مستمر', desc: 'فريق دعم متاح 24/7' },
];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [requestData, setRequestData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    serviceType: '',
    details: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: ربط مع Google Sheets و Zoho CRM لاحقاً
    alert('تم استقبال طلبك بنجاح. سيتم التواصل معك قريباً');
    setSelectedService(null);
    setRequestData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      serviceType: '',
      details: '',
    });
  };

  return (
    <section id="services" className="sharaka-section">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
            خدمات التعهيد والإدارة
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            حلول متكاملة لإدارة موارد شركتك بكفاءة واحترافية عالية
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {SERVICES.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="sharaka-card p-8 group hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <div className="mb-6 inline-block p-4 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                  <IconComponent size={32} className="text-accent" />
                </div>

                <h3 className="text-2xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-foreground/70 mb-6">{service.description}</p>

                <div className="space-y-2 mb-6">
                  {service.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-foreground/80">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedService(service);
                  }}
                  className="text-accent font-semibold hover:text-primary transition-colors flex items-center gap-2"
                >
                  اطلب الخدمة →
                </button>
              </div>
            );
          })}
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-r-4 border-primary rounded-lg p-8 mb-12">
          <div className="flex gap-4">
            <AlertCircle className="text-primary flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-primary mb-2">التزام منصة شراكة</h4>
              <p className="text-foreground/80 leading-relaxed">
                <strong>تلتزم منصة شراكة بدفع راتب شهر كامل من كل 12 شهر للموظف الذي يعمل لدى العميل ضمن عقد التعهيد.</strong> هذا الالتزام يعكس التزامنا بالعدالة والشفافية مع جميع أطرافنا.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-secondary/50 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-primary mb-8 text-center">لماذا تختار شراكة؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="text-4xl font-bold text-accent mb-2">✓</div>
                <h4 className="font-bold text-primary">{item.title}</h4>
                <p className="text-foreground/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Request Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in scale-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-primary">طلب خدمة: {selectedService.title}</h3>
              <button
                onClick={() => setSelectedService(null)}
                className="text-foreground/60 hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">اسم الشركة</label>
                  <input
                    type="text"
                    required
                    value={requestData.companyName}
                    onChange={(e) => setRequestData({ ...requestData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="اسم شركتك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">اسم المتصل</label>
                  <input
                    type="text"
                    required
                    value={requestData.contactName}
                    onChange={(e) => setRequestData({ ...requestData, contactName: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="اسمك الكامل"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={requestData.email}
                    onChange={(e) => setRequestData({ ...requestData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    required
                    value={requestData.phone}
                    onChange={(e) => setRequestData({ ...requestData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+966 XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">تفاصيل الطلب</label>
                <textarea
                  required
                  value={requestData.details}
                  onChange={(e) => setRequestData({ ...requestData, details: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="اشرح احتياجاتك بالتفصيل"
                  rows={5}
                />
              </div>

              <button type="submit" className="w-full sharaka-btn-primary py-3 font-semibold">
                إرسال الطلب
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
