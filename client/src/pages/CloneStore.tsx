import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, AlertCircle, CheckCircle } from 'lucide-react';

interface ClonedStoreData {
  name: string;
  description: string;
  logo: string;
  products: Array<{
    name: string;
    price: number;
    image: string;
    description: string;
    quantity: number;
  }>;
  category?: string;
  pointsRatio?: number;
}

export default function CloneStore() {
  const [storeUrl, setStoreUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clonedData, setClonedData] = useState<ClonedStoreData | null>(null);
  const [step, setStep] = useState<'input' | 'preview' | 'success'>('input');

  const handleCloneStore = async () => {
    if (!storeUrl.trim()) {
      setError('يرجى إدخال رابط المتجر');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // التحقق من صحة الرابط
      new URL(storeUrl);

      // جلب بيانات المتجر
      const response = await fetch('/api/clone-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل استنساخ المتجر');
      }

      const data: ClonedStoreData = await response.json();
      setClonedData(data);
      setStep('preview');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ في استنساخ المتجر';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmClone = () => {
    if (!clonedData) return;

    // حفظ البيانات في localStorage مؤقتاً
    localStorage.setItem('clonedStoreData', JSON.stringify(clonedData));
    setStep('success');

    // إعادة التوجيه بعد 2 ثانية
    setTimeout(() => {
      window.location.href = '/create-store';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">استنساخ متجر</h1>
          <p className="text-gray-600">انسخ محتويات متجر موجود بسهولة</p>
        </div>

        {/* Step 1: Input URL */}
        {step === 'input' && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                رابط المتجر المراد استنساخه
              </label>
              <input
                type="url"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                placeholder="https://example.com/store"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                dir="rtl"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                مثال: https://fato.me/s/themaralsuhol
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <Button
              onClick={handleCloneStore}
              disabled={loading || !storeUrl.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الاستنساخ...
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  استنساخ المتجر
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 'preview' && clonedData && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">معاينة البيانات المستنسخة</h2>

            {/* Store Logo */}
            {clonedData.logo && (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  شعار المتجر
                </label>
                <img
                  src={clonedData.logo}
                  alt="شعار المتجر"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Store Name */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                اسم المتجر
              </label>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{clonedData.name}</p>
            </div>

            {/* Store Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                وصف المتجر
              </label>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{clonedData.description}</p>
            </div>

            {/* Products Count */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                عدد المنتجات المستنسخة
              </label>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {clonedData.products.length} منتج
              </p>
            </div>

            {/* Products Preview */}
            {clonedData.products.length > 0 && (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  معاينة المنتجات
                </label>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {clonedData.products.slice(0, 5).map((product, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg flex gap-3 items-start"
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <p className="text-sm text-blue-600 font-semibold">
                          {product.price} ريال
                        </p>
                      </div>
                    </div>
                  ))}
                  {clonedData.products.length > 5 && (
                    <p className="text-center text-gray-500 text-sm">
                      ... و {clonedData.products.length - 5} منتجات أخرى
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleConfirmClone}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                تأكيد الاستنساخ
              </Button>
              <Button
                onClick={() => {
                  setStep('input');
                  setClonedData(null);
                  setStoreUrl('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">تم الاستنساخ بنجاح!</h2>
            <p className="text-gray-600">
              سيتم نقلك إلى صفحة إنشاء المتجر الجديد...
            </p>
            <div className="animate-spin inline-block">
              <Loader2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
