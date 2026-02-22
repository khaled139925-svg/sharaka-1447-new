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
  const [storePointsRatio, setStorePointsRatio] = useState('');
  
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
    // التحقق من جميع الحقول
    if (!productName || !productName.trim()) {
      alert('يرجى إدخال اسم المنتج');
      return;
    }
    if (!productPrice || parseFloat(productPrice) <= 0) {
      alert('يرجى إدخال سعر صحيح');
      return;
    }
    if (!productImage || productImage.trim() === '') {
      alert('يرجى تحميل صورة المنتج');
      return;
    }
    if (!productDescription || !productDescription.trim()) {
      alert('يرجى إدخال وصف المنتج');
      return;
    }
    if (!productQuantity || parseInt(productQuantity) <= 0) {
      alert('يرجى إدخال كمية صحيحة');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productName,
      price: parseFloat(productPrice),
      image: productImage,
      description: productDescription,
      quantity: parseInt(productQuantity),
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
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleCreateStore = () => {
    if (!storeName || !storeDescription || !storeCategory || !storeLogoUrl || !ownerName || !ownerEmail || !ownerPhone || !storePointsRatio) {
      alert('يرجى ملء جميع بيانات المتجر');
      return;
    }

    if (products.length === 0) {
      alert('يرجى إضافة منتج واحد على الأقل');
      return;
    }

    const newStore: Store = {
      id: Date.now().toString(),
      name: storeName,
      description: storeDescription,
      category: storeCategory,
      logo: storeLogoUrl,
      ownerName,
      ownerEmail,
      ownerPhone,
      pointsRatio: parseFloat(storePointsRatio),
      products,
    };

    addStore(newStore);
    alert('تم إنشاء المتجر بنجاح!');
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-right text-gray-800">إنشاء متجر جديد</h1>
          <Button
            onClick={() => onNavigate('home')}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            العودة
          </Button>
        </div>

        {/* Clone Store Section */}
        <div className="bg-blue-50 rounded-lg border-2 border-blue-300 p-6 mb-8">
          <h2 className="text-xl font-bold text-right text-blue-900 mb-4">استنسخ متجراً موجوداً</h2>
          <p className="text-sm text-blue-700 mb-4 text-right">ملاحظة: إذا فشل جلب البيانات من الرابط، يمكنك إدخال البيانات يدويًا في النموذج أدناه</p>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="أدخل رابط المتجر الخارجي (اختياري)"
              value={cloneUrl}
              onChange={(e) => setCloneUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
              dir="rtl"
            />
            <Button
              onClick={async () => {
                if (!cloneUrl.trim()) {
                  alert('يرجى إدخال رابط المتجر');
                  return;
                }
                try {
                  // محاولة جلب بيانات المتجر من الرابط
                  const response = await fetch(cloneUrl, {
                    method: 'GET',
                    headers: {
                      'Accept': 'text/html',
                    }
                  });
                  if (!response.ok) {
                    throw new Error('لم يتم العثور على الرابط أو الموقع لا يسمح بالوصول');
                  }
                  const html = await response.text();
                  
                  // استخراج البيانات من HTML
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(html, 'text/html');
                  
                  // استخراج العنوان والوصف
                  const title = doc.querySelector('title')?.textContent || doc.querySelector('h1')?.textContent || 'متجر مستنسخ';
                  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || 'تم استنساخ هذا المتجر من رابط خارجي';
                  
                  // تعيين البيانات
                  setStoreName(title.trim());
                  setStoreDescription(description.trim());
                  setStoreCategory('عام');
                  setStorePointsRatio('1');
                  setCloneUrl('');
                  alert('تم تحميل بيانات المتجر بنجاح! يمكنك الآن تعديل البيانات وإضافة المنتجات');
                } catch (error) {
                  const errorMsg = error instanceof Error ? error.message : 'خطأ غير معروف';
                  alert('⚠️ لم يتم جلب البيانات من الرابط.\n\nالسبب: ' + errorMsg + '\n\nيمكنك إدخال البيانات يدويًا في النموذج أدناه');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold whitespace-nowrap"
            >
              جرب الاستنساخ
            </Button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Section 1: Store Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-right text-gray-800 border-b-2 border-blue-500 pb-3">
              📋 بيانات المتجر
            </h2>

            {/* Store Logo */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 text-right">شعار المتجر</label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer text-center w-full">
                  {storeLogoUrl ? (
                    <div className="space-y-3">
                      <img
                        src={storeLogoUrl}
                        alt="Store Logo"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm text-blue-600">اضغط لتغيير الشعار</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-2xl">📸</p>
                      <p className="text-gray-600">اضغط لتحميل شعار المتجر</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Store Name */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700 text-right">اسم المتجر</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="أدخل اسم المتجر"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                dir="rtl"
              />
            </div>

            {/* Store Description */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700 text-right">وصف المتجر</label>
              <textarea
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                placeholder="أدخل وصف المتجر"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right resize-none"
                dir="rtl"
              />
            </div>

            {/* Store Category */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700 text-right">فئة المتجر</label>
              <select
                value={storeCategory}
                onChange={(e) => setStoreCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                dir="rtl"
              >
                <option value="">اختر الفئة</option>
                <option value="إلكترونيات">إلكترونيات</option>
                <option value="ملابس">ملابس</option>
                <option value="ديكور">ديكور</option>
                <option value="كتب">كتب</option>
                <option value="أغذية">أغذية</option>
                <option value="أثاث">أثاث</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            {/* Store Points Ratio */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700 text-right">نسبة النقاط من السعر (%)</label>
              <input
                type="number"
                value={storePointsRatio}
                onChange={(e) => setStorePointsRatio(e.target.value)}
                placeholder="أدخل نسبة النقاط (مثلاً 5 لـ 5%)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Section 2: Owner Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-right text-gray-800 border-b-2 border-blue-500 pb-3">
              👤 بيانات المالك
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700 text-right">اسم المالك</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="أدخل اسم المالك"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700 text-right">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700 text-right">رقم الهاتف</label>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="أدخل رقم الهاتف"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Products */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-right text-gray-800 border-b-2 border-blue-500 pb-3 flex-1">
                🛍️ الأصناف والمنتجات
              </h2>
              <Button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إضافة منتج
              </Button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 border-2 border-green-300">
                <h3 className="text-xl font-bold text-right text-gray-800">إضافة منتج جديد</h3>

                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 text-right">اسم المنتج</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="أدخل اسم المنتج"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-700 text-right">السعر</label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="أدخل السعر"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="صورة المنتج"
                  value={productImage}
                  onChange={setProductImage}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 text-right">الكمية</label>
                  <input
                    type="number"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    placeholder="أدخل الكمية"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                    dir="rtl"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 text-right">وصف المنتج</label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="أدخل وصف المنتج"
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right resize-none"
                    dir="rtl"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddProduct}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    إضافة المنتج
                  </Button>
                  <Button
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="space-y-3">
              {products.length === 0 ? (
                <p className="text-center text-gray-500 py-8">لم تضف أي منتجات بعد</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="flex-1 text-right pr-4">
                      <p className="font-bold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.price} ر.س</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <Button
              onClick={handleCreateStore}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg"
            >
              إنشاء المتجر
            </Button>
            <Button
              onClick={() => onNavigate('home')}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold text-lg"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
