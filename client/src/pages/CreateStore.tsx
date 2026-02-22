import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CreateStore({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeCategory, setStoreCategory] = useState('');
  const [storeLogoUrl, setStoreLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoreLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStore = () => {
    if (!storeName || !storeDescription || !storeCategory || !storeLogoUrl) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    // هنا سيتم حفظ المتجر في قاعدة البيانات
    console.log({
      storeName,
      storeDescription,
      storeCategory,
      storeLogoUrl,
    });

    alert('تم إنشاء المتجر بنجاح!');
    onNavigate('stores-management');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-right text-gray-800">إنشاء متجر جديد</h1>
          <Button
            onClick={() => onNavigate('stores-management')}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            العودة
          </Button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Store Logo Upload */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-700 text-right">
              شعار المتجر
            </label>
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
            <label className="block text-lg font-semibold text-gray-700 text-right">
              اسم المتجر
            </label>
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
            <label className="block text-lg font-semibold text-gray-700 text-right">
              وصف المتجر
            </label>
            <textarea
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              placeholder="أدخل وصف المتجر"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right resize-none"
              dir="rtl"
            />
          </div>

          {/* Store Category */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700 text-right">
              فئة المتجر
            </label>
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              onClick={handleCreateStore}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg"
            >
              إنشاء المتجر
            </Button>
            <Button
              onClick={() => onNavigate('stores-management')}
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
