import { ShoppingBag, ExternalLink } from 'lucide-react';

const STORES = [
  {
    id: 1,
    name: 'متجر التكنولوجيا المتقدمة',
    category: 'إلكترونيات وتقنية',
    description: 'أحدث الأجهزة والمنتجات التقنية بأسعار تنافسية',
    logo: '🖥️',
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 2,
    name: 'متجر الملابس الفاخرة',
    category: 'ملابس وأزياء',
    description: 'تشكيلة واسعة من الملابس والأزياء العصرية',
    logo: '👔',
    rating: 4.6,
    reviews: 189,
  },
  {
    id: 3,
    name: 'متجر المنزل والديكور',
    category: 'ديكور وأثاث',
    description: 'كل ما تحتاجه لتزيين وتجميل منزلك',
    logo: '🏠',
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: 'متجر الكتب والمعرفة',
    category: 'كتب وتعليم',
    description: 'مكتبة شاملة من الكتب والمراجع العلمية',
    logo: '📚',
    rating: 4.9,
    reviews: 312,
  },
  {
    id: 5,
    name: 'متجر الجمال والعناية',
    category: 'عناية وجمال',
    description: 'منتجات جمال وعناية شخصية أصلية وآمنة',
    logo: '💄',
    rating: 4.8,
    reviews: 267,
  },
  {
    id: 6,
    name: 'متجر الرياضة واللياقة',
    category: 'رياضة وصحة',
    description: 'معدات رياضية وملابس رياضية عالية الجودة',
    logo: '⚽',
    rating: 4.7,
    reviews: 198,
  },
];

export default function MarketplaceSection() {
  return (
    <section id="marketplace" className="sharaka-section bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
            السوق الإلكتروني
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            منصة متكاملة تجمع أفضل المتاجر والعروض، مع نظام نقاط وحوافز لتحفيز المبيعات
          </p>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {STORES.map((store) => (
            <div
              key={store.id}
              className="sharaka-card p-6 group hover:scale-105 transition-transform duration-300 flex flex-col"
            >
              {/* Store Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl group-hover:scale-110 transition-transform">
                  {store.logo}
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold text-primary text-sm">{store.rating}</span>
                </div>
              </div>

              {/* Store Info */}
              <h3 className="text-xl font-bold text-primary mb-1">{store.name}</h3>
              <p className="text-accent text-sm font-semibold mb-3">{store.category}</p>
              <p className="text-foreground/70 text-sm mb-4 flex-grow">{store.description}</p>

              {/* Reviews */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border text-sm text-foreground/60">
                <span>{store.reviews} تقييم</span>
              </div>

              {/* CTA Button */}
              <button className="w-full sharaka-btn-secondary flex items-center justify-center gap-2 group/btn">
                <ShoppingBag size={18} />
                <span>دخول المتجر</span>
                <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Points System Info */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-5xl">🎁</div>
              <h4 className="text-xl font-bold text-primary">اكسب النقاط</h4>
              <p className="text-foreground/70">كل عملية شراء تمنحك نقاط قيمة</p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-5xl">💰</div>
              <h4 className="text-xl font-bold text-primary">رصيد مالي</h4>
              <p className="text-foreground/70">النقاط تتحول إلى رصيد حقيقي</p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-5xl">🛍️</div>
              <h4 className="text-xl font-bold text-primary">استخدم الرصيد</h4>
              <p className="text-foreground/70">استخدمه في أي متجر بدون خسارة</p>
            </div>
          </div>
        </div>

        {/* Add Store CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">هل لديك متجر إلكتروني؟</h3>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            انضم إلى منصة شراكة وعرض منتجاتك لآلاف العملاء المهتمين
          </p>
          <button className="sharaka-btn-primary">
            سجل متجرك الآن
          </button>
        </div>
      </div>
    </section>
  );
}
