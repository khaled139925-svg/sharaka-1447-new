import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStores, Product, Store } from '@/contexts/StoresContext';
import { X, Plus, Copy, Loader2 } from 'lucide-react';
import { ImageUploadField } from '@/components/ImageUploadField';

export default function CreateStore({ onNavigate }: { onNavigate: (page: string, storeId?: string) => void }) {
  const { addStore } = useStores();
  
  const [cloneUrl, setCloneUrl] = useState('');
  const [cloneLoading, setCloneLoading] = useState(false);
  const [cloneError, setCloneError] = useState<string | null>(null);
  const [showCloneForm, setShowCloneForm] = useState(false);
  
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeCategory, setStoreCategory] = useState('');
  const [storeLogoUrl, setStoreLogoUrl] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [storePointsRatio, setStorePointsRatio] = useState('10');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoreLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!productName || !productName.trim()) {
      alert('يرجى إدخال اسم المنتج');
      return;
    }
    if (!productPrice || parseFloat(productPrice) <= 0) {
      alert('يرجى إدخال سعر صحيح');
      return;
    }
    if (!productImage) {
      alert('يرجى تحميل صورة المنتج');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productName,
      price: parseFloat(productPrice),
      image: productImage,
      description: productDescription || productName,
      points: Math.floor(parseFloat(productPrice) * 0.1),
      quantity: parseInt(productQuantity) || 1
    };

    setProducts([...products, newProduct]);
    setProductName('');
    setProductPrice('');
    setProductImage('');
    setProductDescription('');
    setProductQuantity('');
    setShowAddProduct(false);
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleCreateStore = () => {
    if (!storeName.trim()) {
      alert('يرجى إدخال اسم المتجر');
      return;
    }
    if (!storeDescription.trim()) {
      alert('يرجى إدخال وصف المتجر');
      return;
    }
    if (!storeCategory.trim()) {
      alert('يرجى اختيار فئة المتجر');
      return;
    }
    if (!ownerName.trim()) {
      alert('يرجى إدخال اسم المالك');
      return;
    }
    if (!ownerEmail.trim()) {
      alert('يرجى إدخال بريد المالك');
      return;
    }
    if (!ownerPhone.trim()) {
      alert('يرجى إدخال هاتف المالك');
      return;
    }

    const newStore: Store = {
      id: Date.now().toString(),
      name: storeName,
      description: storeDescription,
      category: storeCategory,
      logo: storeLogoUrl || 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(storeName),
      ownerName,
      ownerEmail,
      ownerPhone,
      pointsRatio: parseFloat(storePointsRatio) / 100 || 0.1,
      products
    };

    addStore(newStore);
    alert('تم إنشاء المتجر بنجاح!');
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-right text-blue-900">إنشاء متجر جديد</h1>
          <Button
            onClick={() => onNavigate('home')}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            العودة
          </Button>
        </div>

        {/* Clone Store Section */}
        <div className="bg-blue-50 rounded-lg border-2 border-blue-300 p-6 mb-8">
          <h2 className="text-xl font-bold text-right text-blue-900 mb-4">استنسخ موقعاً خارجياً</h2>
          <p className="text-sm text-blue-700 mb-4 text-right">أدخل رابط أي موقع وسيتم استنساخه كمتجر جديد تلقائياً (الصور والمنتجات والبيانات)</p>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="أدخل رابط الموقع (مثال: https://example.com)"
              value={cloneUrl}
              onChange={(e) => setCloneUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
              dir="rtl"
              disabled={cloneLoading}
            />
            <Button
              onClick={async () => {
                if (!cloneUrl.trim()) {
                  alert('يرجى إدخال رابط الموقع');
                  return;
                }
                try {
                  setCloneLoading(true);
                  setCloneError(null);
                  
                  const response = await fetch('/api/scrape-store', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: cloneUrl })
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'فشل استنساخ الموقع');
                  }

                  const data = await response.json();
                  const scrapedStore = data.store;

                  setStoreName(scrapedStore.name);
                  setStoreDescription(scrapedStore.description);
                  setStoreCategory(scrapedStore.category);
                  setStorePointsRatio((scrapedStore.pointsRatio * 100).toString());
                  setStoreLogoUrl(scrapedStore.logo);
                  setOwnerName(scrapedStore.ownerName);
                  setOwnerEmail(scrapedStore.ownerEmail);
                  setOwnerPhone(scrapedStore.ownerPhone);
                  setProducts(scrapedStore.products);
                  setCloneUrl('');
                  
                  alert('✅ تم استنساخ الموقع بنجاح!\n\nالبيانات:\n- الاسم: ' + scrapedStore.name + '\n- المنتجات: ' + scrapedStore.products.length + '\n\nالآن اضغط "إنشاء المتجر" لحفظ المتجر الجديد');
                } catch (error) {
                  const errorMsg = error instanceof Error ? error.message : 'خطأ غير معروف';
                  setCloneError(errorMsg);
                  alert('❌ فشل استنساخ الموقع\n\n' + errorMsg);
                } finally {
                  setCloneLoading(false);
                }
              }}
              disabled={cloneLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold whitespace-nowrap disabled:bg-gray-400"
            >
              {cloneLoading ? <Loader2 className="animate-spin" /> : 'استنسخ الموقع'}
            </Button>
          </div>
          {cloneError && <p className="text-red-600 text-sm mt-2">خطأ: {cloneError}</p>}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Section 1: Store Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-right text-gray-800 border-b-2 border-blue-500 pb-3">بيانات المتجر</h2>
            
            <div>
              <label className="block text-right font-semibold text-gray-700 mb-2">اسم المتجر</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="أدخل اسم المتجر"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-right font-semibold text-gray-700 mb-2">وصف المتجر</label>
              <textarea
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                placeholder="أدخل وصف المتجر"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows={3}
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-right font-semibold text-gray-700 mb-2">الفئة</label>
                <select
                  value={storeCategory}
                  onChange={(e) => setStoreCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  dir="rtl"
                >
                  <option value="">اختر الفئة</option>
                  <option value="إلكترونيات">إلكترونيات</option>
                  <option value="ملابس">ملابس</option>
                  <option value="طعام">طعام</option>
                  <option value="العناية بالبشرة">العناية بالبشرة</option>
                  <option value="الرياضة">الرياضة</option>
                  <option value="الكتب">الكتب</option>
                  <option value="الأثاث">الأثاث</option>
                  <option value="الديكور">الديكور</option>
                  <option value="الخدمات">الخدمات</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-right font-semibold text-gray-700 mb-2">💰 نسبة النقاط (%)</label>
                <input
                  type="number"
                  value={storePointsRatio}
                  onChange={(e) => setStorePointsRatio(e.target.value)}
                  placeholder="10"
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-green-50"
                />
                <p className="text-xs text-green-600 mt-1">مثال: 10 = 10% من سعر المنتج</p>
              </div>
            </div>

            <div>
              <label className="block text-right font-semibold text-gray-700 mb-2">شعار المتجر</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {storeLogoUrl && (
                <img src={storeLogoUrl} alt="شعار المتجر" className="mt-4 w-32 h-32 object-cover rounded-lg" />
              )}
            </div>
          </div>

          {/* Section 2: Owner Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-right text-gray-800 border-b-2 border-blue-500 pb-3">بيانات الاتصال</h2>
            
            <div>
              <label className="block text-right font-semibold text-gray-700 mb-2">اسم المالك</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="أدخل اسم المالك"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-right font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-right font-semibold text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+966501234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Products */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} />
                إضافة منتج
              </Button>
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-3">المنتجات ({products.length})</h2>
            </div>

            {showAddProduct && (
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <label className="block text-right font-semibold text-gray-700 mb-2">اسم المنتج</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="أدخل اسم المنتج"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-right font-semibold text-gray-700 mb-2">السعر</label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-right font-semibold text-gray-700 mb-2">الكمية</label>
                    <input
                      type="number"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-right font-semibold text-gray-700 mb-2">صورة المنتج</label>
                  <ImageUploadField onImageUpload={setProductImage} />
                </div>

                <div>
                  <label className="block text-right font-semibold text-gray-700 mb-2">وصف المنتج</label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="أدخل وصف المنتج"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    rows={2}
                    dir="rtl"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddProduct}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    إضافة
                  </Button>
                  <Button
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-sm text-blue-600 font-semibold">السعر: {product.price} ريال</p>
                  </div>
                  <Button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                  >
                    <X size={20} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Create Store Button */}
          <Button
            onClick={handleCreateStore}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
          >
            إنشاء المتجر
          </Button>
        </div>
      </div>
    </div>
  );
}
