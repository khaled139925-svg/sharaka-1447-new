import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useStores } from '@/contexts/StoresContext';
import { Upload, Plus, Trash2 } from 'lucide-react';

interface StoreFormData {
  name: string;
  description: string;
  category: string;
  logo: string;
  pointsRatio: number;
  externalUrl: string;
  products: Array<{
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
  }>;
  features: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
  };
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
  paymentMethods: string[];
  shippingOptions: string[];
}

const CATEGORIES = [
  'إلكترونيات',
  'ملابس وأزياء',
  'ديكور وأثاث',
  'كتب وتعليم',
  'جمال وعناية',
  'رياضة واللياقة',
  'طعام ومشروبات',
  'ألعاب وترفيه',
  'سيارات وملحقات',
  'أخرى'
];

const PAYMENT_METHODS = [
  'بطاقة ائتمان',
  'تحويل بنكي',
  'محفظة رقمية',
  'الدفع عند الاستلام',
  'Apple Pay',
  'Google Pay'
];

const SHIPPING_OPTIONS = [
  'شحن سريع (24 ساعة)',
  'شحن عادي (3-5 أيام)',
  'استلام من المتجر',
  'شحن دولي',
  'بدون شحن (تحميل رقمي)'
];

const FEATURES = [
  'ضمان المنتج',
  'استرجاع مجاني',
  'عرض خاص',
  'منتجات جديدة',
  'أكثر المنتجات مبيعاً',
  'خصم للعملاء المتكررين',
  'برنامج الولاء',
  'دعم العملاء 24/7'
];

interface CreateNewStoreProps {
  onBack?: () => void;
}

export default function CreateNewStore({ onBack }: CreateNewStoreProps) {
  console.log('CreateNewStore component loaded with props:', { onBack: !!onBack });
  const { addStore } = useStores();
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    description: '',
    category: 'إلكترونيات',
    logo: '',
    pointsRatio: 0.1,
    externalUrl: '',
    products: [],
    features: [],
    socialLinks: {},
    contactInfo: {},
    paymentMethods: [],
    shippingOptions: [],
  });
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', description: '', category: '' });

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price) {
      setError('يرجى إدخال اسم المنتج والسعر');
      return;
    }

    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        image: newProduct.image,
        description: newProduct.description,
        category: newProduct.category
      }]
    }));

    setNewProduct({ name: '', price: '', image: '', description: '', category: '' });
    setError('');
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleToggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleTogglePaymentMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };

  const handleToggleShippingOption = (option: string) => {
    setFormData(prev => ({
      ...prev,
      shippingOptions: prev.shippingOptions.includes(option)
        ? prev.shippingOptions.filter(o => o !== option)
        : [...prev.shippingOptions, option]
    }));
  };

  const handleCreateStore = async () => {
    if (!formData.name.trim()) {
      setError('يرجى إدخال اسم المتجر');
      return;
    }

    try {
      const newStore = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        logo: formData.logo,
        pointsRatio: formData.pointsRatio,
        externalUrl: formData.externalUrl,
        rating: 4.5,
        reviews: 0,
        products: formData.products,
        features: formData.features,
        socialLinks: formData.socialLinks,
        contactInfo: formData.contactInfo,
        paymentMethods: formData.paymentMethods,
        shippingOptions: formData.shippingOptions,
        createdAt: new Date().toISOString()
      };

      addStore(newStore);
      setError('');
      setFormData({
        name: '',
        description: '',
        category: 'إلكترونيات',
        logo: '',
        pointsRatio: 0.1,
        externalUrl: '',
        products: [],
        features: [],
        socialLinks: {},
        contactInfo: {},
        paymentMethods: [],
        shippingOptions: [],
      });
    } catch (err: any) {
      setError('فشل إنشاء المتجر: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">إنشاء متجر جديد</h1>
          <Button
            onClick={onBack || (() => window.history.back())}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            العودة
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* معلومات المتجر الأساسية */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">معلومات المتجر الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المتجر *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل اسم المتجر"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الفئة</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">نسبة النقاط (%)</label>
                <input
                  type="number"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={formData.pointsRatio}
                  onChange={(e) => handleFormChange('pointsRatio', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الرابط الخارجي</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) => handleFormChange('externalUrl', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                  <Button
                    onClick={() => {
                      if (!formData.externalUrl) {
                        setError('يرجى إدخال رابط الموقع أولاً');
                        return;
                      }
                      // TODO: استنساخ الموقع من الرابط
                      alert('جاري استنساخ الموقع من: ' + formData.externalUrl);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-lg whitespace-nowrap"
                  >
                    استنساخ الموقع
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">أدخل رابط موقعك الخارجي واضغط "استنساخ الموقع" لنسخ المنتجات تلقائياً</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل وصف المتجر"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">الشعار (اللوجو)</label>
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <div className="text-center">
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">انقر لتحميل الشعار</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handleFormChange('logo', event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
              {formData.logo && (
                <div className="mt-4 flex justify-center">
                  <img src={formData.logo} alt="الشعار" className="max-h-32 max-w-32 object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* بيانات الاتصال */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">بيانات الاتصال</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={formData.contactInfo.phone || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, phone: e.target.value }
                }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.contactInfo.email || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, email: e.target.value }
                }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="العنوان"
                value={formData.contactInfo.address || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, address: e.target.value }
                }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* المنتجات */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">المنتجات</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="اسم المنتج"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="السعر"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                placeholder="وصف المنتج"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleAddProduct}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                إضافة منتج
              </Button>
            </div>

            {formData.products.length > 0 && (
              <div className="space-y-3">
                {formData.products.map((product, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.price} ريال</p>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* الميزات */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ميزات المتجر</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURES.map(feature => (
                <label key={feature} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleToggleFeature(feature)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* طرق الدفع */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">طرق الدفع</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map(method => (
                <label key={method} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.includes(method)}
                    onChange={() => handleTogglePaymentMethod(method)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* خيارات الشحن */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">خيارات الشحن</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SHIPPING_OPTIONS.map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shippingOptions.includes(option)}
                    onChange={() => handleToggleShippingOption(option)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* زر الإنشاء */}
          <div className="flex gap-4">
            <Button
              onClick={handleCreateStore}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition text-lg"
            >
              إنشاء المتجر
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
