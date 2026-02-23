import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useStores } from '@/contexts/StoresContext';

export default function EditStore({ onBack, storeId }: { onBack: () => void; storeId?: string }) {
  const { stores, updateStore } = useStores();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    logo: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
  });

  // تحميل بيانات المتجر عند الفتح
  useEffect(() => {
    if (storeId) {
      const store = stores.find(s => s.id === storeId);
      if (store) {
        setFormData({
          name: store.name,
          description: store.description,
          category: store.category,
          logo: store.logo,
          ownerName: store.ownerName,
          ownerEmail: store.ownerEmail,
          ownerPhone: store.ownerPhone,
        });
      }
    }
  }, [storeId, stores]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.ownerEmail.trim()) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    if (storeId) {
      updateStore(storeId, formData);
      alert('تم تحديث المتجر بنجاح');
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-right text-gray-800">تعديل المتجر</h1>
          <Button
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة
          </Button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Store Name */}
          <div>
            <label className="block text-right font-semibold text-gray-700 mb-2">اسم المتجر *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="اسم المتجر"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              dir="rtl"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-right font-semibold text-gray-700 mb-2">الوصف</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="وصف المتجر"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              dir="rtl"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-right font-semibold text-gray-700 mb-2">الفئة</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر الفئة</option>
              <option value="إلكترونيات">إلكترونيات</option>
              <option value="ملابس">ملابس</option>
              <option value="ديكور">ديكور</option>
              <option value="كتب">كتب</option>
              <option value="أثاث">أثاث</option>
              <option value="أطعمة">أطعمة</option>
              <option value="عطور">عطور</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-right font-semibold text-gray-700 mb-2">رابط الشعار</label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              dir="ltr"
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-right font-semibold text-gray-700 mb-2">اسم المالك</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              placeholder="اسم المالك"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              dir="rtl"
            />
          </div>

          {/* Owner Email */}
          <div>
            <label className="block text-right font-semibold text-gray-700 mb-2">البريد الإلكتروني *</label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleInputChange}
              placeholder="email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              dir="ltr"
            />
          </div>

          {/* Owner Phone */}
          <div>
            <label className="block text-right font-semibold text-gray-700 mb-2">رقم الهاتف</label>
            <input
              type="tel"
              name="ownerPhone"
              value={formData.ownerPhone}
              onChange={handleInputChange}
              placeholder="+966501234567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              dir="ltr"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
            >
              حفظ التعديلات
            </Button>
            <Button
              onClick={onBack}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
