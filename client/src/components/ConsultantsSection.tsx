import { Calendar, MessageSquare } from 'lucide-react';
import { useState } from 'react';

// Sample consultants data - يمكن ربطها لاحقاً مع Google Sheets
const CONSULTANTS = [
  {
    id: 1,
    name: 'د. أحمد السعيد',
    specialty: 'استشارات إدارية',
    bio: 'خبرة 15 سنة في إدارة الشركات والمشاريع الكبرى',
    image: '👨‍💼',
    rating: 4.9,
    reviews: 127,
  },
  {
    id: 2,
    name: 'أ. فاطمة محمد',
    specialty: 'تطوير الموارد البشرية',
    bio: 'متخصصة في تطوير الكوادر البشرية والتدريب',
    image: '👩‍💼',
    rating: 4.8,
    reviews: 98,
  },
  {
    id: 3,
    name: 'م. علي الخالد',
    specialty: 'تقنية المعلومات',
    bio: 'مهندس متخصص في التحول الرقمي والأتمتة',
    image: '👨‍💻',
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 4,
    name: 'أ. نور الدين',
    specialty: 'التسويق الرقمي',
    bio: 'خبير في استراتيجيات التسويق الحديثة والتحليلات',
    image: '📊',
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 5,
    name: 'د. سارة العتيبي',
    specialty: 'المالية والمحاسبة',
    bio: 'محاسبة قانونية معتمدة مع خبرة دولية',
    image: '💰',
    rating: 4.9,
    reviews: 142,
  },
  {
    id: 6,
    name: 'أ. محمود الشريف',
    specialty: 'إدارة المشاريع',
    bio: 'مدير مشاريع معتمد دولياً بخبرة 12 سنة',
    image: '🎯',
    rating: 4.8,
    reviews: 110,
  },
];

export default function ConsultantsSection() {
  const [selectedConsultant, setSelectedConsultant] = useState<typeof CONSULTANTS[0] | null>(null);
  const [bookingData, setBookingData] = useState({ name: '', email: '', date: '', time: '' });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: ربط مع Zoho Meetings API لاحقاً
    alert(`تم حجز موعد مع ${selectedConsultant?.name} في ${bookingData.date} الساعة ${bookingData.time}`);
    setSelectedConsultant(null);
    setBookingData({ name: '', email: '', date: '', time: '' });
  };

  return (
    <section id="consultants" className="sharaka-section bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
            المستشارون والخبراء
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            فريق من أفضل المستشارين والخبراء المتخصصين في مختلف المجالات، جاهزون لمساعدتك في تحقيق أهدافك
          </p>
        </div>

        {/* Consultants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CONSULTANTS.map((consultant) => (
            <div
              key={consultant.id}
              className="sharaka-card p-6 group hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => setSelectedConsultant(consultant)}
            >
              {/* Avatar */}
              <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                {consultant.image}
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold text-primary mb-2">{consultant.name}</h3>
              <p className="text-accent font-semibold mb-2">{consultant.specialty}</p>
              <p className="text-foreground/70 text-sm mb-4">{consultant.bio}</p>

              {/* Rating */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold text-primary">{consultant.rating}</span>
                  <span className="text-foreground/60 text-sm">({consultant.reviews})</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedConsultant(consultant);
                }}
                className="w-full sharaka-btn-primary flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                حجز موعد
              </button>
            </div>
          ))}
        </div>

        {/* Register New Consultant CTA */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">هل أنت مستشار متخصص؟</h3>
          <p className="text-lg mb-6 opacity-90">
            انضم إلى فريقنا واعرض خبراتك لآلاف العملاء المحتملين
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
            سجل كمستشار
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedConsultant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in scale-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-primary">حجز موعد</h3>
              <button
                onClick={() => setSelectedConsultant(null)}
                className="text-foreground/60 hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6 p-4 bg-secondary rounded-lg">
              <p className="text-sm text-foreground/70">مع</p>
              <p className="text-lg font-bold text-primary">{selectedConsultant.name}</p>
              <p className="text-sm text-accent">{selectedConsultant.specialty}</p>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">اسمك</label>
                <input
                  type="text"
                  required
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="أدخل اسمك"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">التاريخ</label>
                <input
                  type="date"
                  required
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">الوقت</label>
                <input
                  type="time"
                  required
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button type="submit" className="w-full sharaka-btn-primary py-3 font-semibold">
                تأكيد الحجز
              </button>
            </form>

            <p className="text-xs text-foreground/60 text-center mt-4">
              سيتم تأكيد الموعد عبر البريد الإلكتروني
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
