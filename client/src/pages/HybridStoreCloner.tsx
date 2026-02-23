'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useStores } from '@/contexts/StoresContext';
import { X, Upload, Plus, Trash2, Eye, EyeOff, Clock, MapPin, MessageSquare } from 'lucide-react';

interface ExtractedData {
  title?: string;
  description?: string;
  image?: string;
  products?: Array<{
    name: string;
    price: number;
    image?: string;
    description?: string;
  }>;
}

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

const QUICK_CONTACT_METHODS = [
  'WhatsApp',
  'Telegram',
  'Viber',
  'Signal',
  'Email',
  'Phone'
];

export default function HybridStoreCloner({ onClose, onStoreCreated }: { onClose: () => void; onStoreCreated?: () => void }) {
  const { addStore } = useStores();
  const [step, setStep] = useState<'url' | 'form' | 'preview'>('url');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    description: '',
    category: 'أخرى',
    logo: '',
    pointsRatio: 0.1,
    externalUrl: '',
    products: [],
    features: [],
    socialLinks: {},
    contactInfo: {},
    paymentMethods: [],
    shippingOptions: [],
    contactUs: {
      welcomeMessage: '',
      businessHours: '',
      mapLocation: '',
      quickContactMethods: []
    }
  });

  const handleExtractData = async () => {
    if (!urlInput.trim()) {
      setError('يرجى إدخال رابط الموقع');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // محاولة جلب البيانات من الموقع
      const response = await fetch(`/api/extract-store-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput })
      });

      if (!response.ok) {
        throw new Error('فشل جلب البيانات من الموقع');
      }

      const data = await response.json();
      setExtractedData(data);
      
      // ملء النموذج بالبيانات المستخرجة
      setFormData(prev => ({
        ...prev,
        name: data.title || '',
        description: data.description || '',
        logo: data.image || '',
        externalUrl: urlInput,
        products: data.products || []
      }));

      setStep('form');
    } catch (err: any) {
      // إذا فشل الجلب التلقائي، نسمح بالإدخال اليدوي
      setError('لم يتمكن من جلب البيانات تلقائياً. يمكنك إدخال البيانات يدويًا أدناه.');
      setFormData(prev => ({
        ...prev,
        externalUrl: urlInput
      }));
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof StoreFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        name: '',
        price: 0,
        image: '',
        description: '',
        category: ''
      }]
    }));
  };

  const handleUpdateProduct = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
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
      setStep('preview');
    } catch (err: any) {
      setError('فشل إنشاء المتجر: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">استنساخ متجر جديد</h2>
          <button onClick={onClose} className="hover:bg-blue-800 p-2 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Step 1: URL Input */}
          {step === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رابط الموقع الخارجي (اختياري)
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  أدخل رابط الموقع ليتم استخراج البيانات تلقائياً، أو اترك الحقل فارغاً لإدخال البيانات يدويًا
                </p>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleExtractData}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  {loading ? 'جاري الاستخراج...' : 'استخراج البيانات'}
                </Button>
                <Button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, externalUrl: '' }));
                    setStep('form');
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  إدخال يدوي
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Form */}
          {step === 'form' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">معلومات المتجر الأساسية</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المتجر *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">الفئة</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">رابط اللوجو</label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => handleFormChange('logo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">معلومات التواصل</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={formData.contactInfo.phone || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, phone: e.target.value }
                    }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.contactInfo.email || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, email: e.target.value }
                    }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="العنوان"
                    value={formData.contactInfo.address || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, address: e.target.value }
                    }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">ميزات المتجر</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FEATURES.map(feature => (
                    <label key={feature} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleToggleFeature(feature)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">طرق الدفع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes(method)}
                        onChange={() => handleTogglePaymentMethod(method)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipping Options */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">خيارات الشحن</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SHIPPING_OPTIONS.map(option => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.shippingOptions.includes(option)}
                        onChange={() => handleToggleShippingOption(option)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Us Section */}
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={24} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-800">اتصل بنا</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">رسالة الترحيب</label>
                    <textarea
                      placeholder="مثال: مرحباً بك في متجرنا. نحن هنا لخدمتك 24/7"
                      value={formData.contactUs.welcomeMessage || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contactUs: { ...prev.contactUs, welcomeMessage: e.target.value }
                      }))}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Clock size={18} /> ساعات العمل
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: من 9 صباحاً إلى 10 مساءً يومياً"
                      value={formData.contactUs.businessHours || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contactUs: { ...prev.contactUs, businessHours: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin size={18} /> موقع المتجر على الخريطة
                    </label>
                    <input
                      type="text"
                      placeholder="رابط Google Maps أو العنوان"
                      value={formData.contactUs.mapLocation || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contactUs: { ...prev.contactUs, mapLocation: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">طرق التواصل السريع</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {QUICK_CONTACT_METHODS.map(method => (
                        <label key={method} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.contactUs.quickContactMethods?.includes(method) || false}
                            onChange={() => setFormData(prev => ({
                              ...prev,
                              contactUs: {
                                ...prev.contactUs,
                                quickContactMethods: prev.contactUs.quickContactMethods?.includes(method)
                                  ? prev.contactUs.quickContactMethods.filter(m => m !== method)
                                  : [...(prev.contactUs.quickContactMethods || []), method]
                              }
                            }))}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-gray-700">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">المنتجات</h3>
                  <Button
                    onClick={handleAddProduct}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus size={18} /> إضافة منتج
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.products.map((product, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="اسم المنتج"
                          value={product.name}
                          onChange={(e) => handleUpdateProduct(index, 'name', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="السعر"
                          value={product.price}
                          onChange={(e) => handleUpdateProduct(index, 'price', parseFloat(e.target.value))}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="url"
                          placeholder="رابط الصورة"
                          value={product.image}
                          onChange={(e) => handleUpdateProduct(index, 'image', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="الفئة"
                          value={product.category}
                          onChange={(e) => handleUpdateProduct(index, 'category', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <textarea
                        placeholder="وصف المنتج"
                        value={product.description}
                        onChange={(e) => handleUpdateProduct(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="mt-2 text-red-600 hover:text-red-700 flex items-center gap-2"
                      >
                        <Trash2 size={18} /> حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateStore}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  إنشاء المتجر
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && (
            <div className="space-y-4 text-center">
              <div className="text-6xl">✅</div>
              <h3 className="text-2xl font-bold text-green-600">تم إنشاء المتجر بنجاح!</h3>
              <p className="text-gray-600">تم إضافة المتجر "{formData.name}" إلى المنصة</p>
              <Button
                onClick={() => {
                  onStoreCreated?.();
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                عودة إلى الرئيسية
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
