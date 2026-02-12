import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactSection() {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: ربط مع Google Sheets أو Zoho CRM لاحقاً
    alert('شكراً لتواصلك معنا. سنرد عليك قريباً');
    setContactData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <>
      <section id="contact" className="sharaka-section bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              تواصل معنا
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              نحن هنا للإجابة على جميع أسئلتك والاستماع إلى اقتراحاتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="sharaka-card p-8 text-center group hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 transition-colors">
                <Mail className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">البريد الإلكتروني</h3>
              <a href="mailto:info@sharaka.sa" className="text-accent hover:text-primary transition-colors">
                info@sharaka.sa
              </a>
            </div>

            <div className="sharaka-card p-8 text-center group hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 transition-colors">
                <Phone className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">الهاتف</h3>
              <a href="tel:+966112345678" className="text-accent hover:text-primary transition-colors">
                +966 11 2345 6789
              </a>
            </div>

            <div className="sharaka-card p-8 text-center group hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 transition-colors">
                <MapPin className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">العنوان</h3>
              <p className="text-foreground/70">
                الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="sharaka-card p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">الاسم</label>
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="أدخل اسمك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+966 XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">الموضوع</label>
                <input
                  type="text"
                  required
                  value={contactData.subject}
                  onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="موضوع الرسالة"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">الرسالة</label>
                <textarea
                  required
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="اكتب رسالتك هنا"
                  rows={6}
                />
              </div>

              <button type="submit" className="w-full sharaka-btn-primary flex items-center justify-center gap-2 py-3 font-semibold">
                <Send size={20} />
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">شراكة</h3>
              <p className="text-primary-foreground/80">شريك نجاحك في رحلة النمو والتطور</p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">روابط سريعة</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#consultants" className="hover:text-primary-foreground transition-colors">المستشارون</a></li>
                <li><a href="#services" className="hover:text-primary-foreground transition-colors">الخدمات</a></li>
                <li><a href="#marketplace" className="hover:text-primary-foreground transition-colors">السوق</a></li>
                <li><a href="#points" className="hover:text-primary-foreground transition-colors">النقاط</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">الخدمات</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">التوظيف</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">إدارة الموظفين</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">إدارة المشاريع</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">الاستشارات</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">قانوني</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">شروط الاستخدام</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">الشروط والأحكام</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2026 منصة شراكة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
