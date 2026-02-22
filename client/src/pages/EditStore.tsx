import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useStores } from '@/contexts/StoresContext';

interface EditStoreProps {
  onNavigate: (page: string) => void;
  storeId: string | null;
}

export default function EditStore({ onNavigate, storeId }: EditStoreProps) {
  const { getStore, updateStore } = useStores();
  const store = storeId ? getStore(storeId) : null;

  const [formData, setFormData] = useState({
    name: store?.name || '',
    description: store?.description || '',
    category: store?.category || '',
    ownerName: store?.ownerName || '',
    ownerEmail: store?.ownerEmail || '',
    ownerPhone: store?.ownerPhone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!storeId) return;
    updateStore(storeId, formData);
    alert('تم تحديث المتجر بنجاح');
    onNavigate('stores-management');
  };

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">المتجر غير موجود</p>
          <Button onClick={() => onNavigate('stores-management')} className="bg-blue-600 hover:bg-blue-700 text-white">
            العودة لإدارة المتاجر
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-right text-gray-800">تعديل المتجر</h1>
          <Button
            onClick={() => onNavigate('stores-management')}
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
            <label className="block text-right text-gray-700 font-semibold mb-2">اسم المتجر</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-right"
              placeholder="أدخل اسم المتجر"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-right text-gray-700 font-semibold mb-2">الوصف</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-right"
              placeholder="أدخل وصف المتجر"
              rows={4}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-right text-gray-700 font-semibold mb-2">الفئة</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-right"
              placeholder="أدخل فئة المتجر"
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-right text-gray-700 font-semibold mb-2">اسم المالك</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-right"
              placeholder="أدخل اسم المالك"
            />
          </div>

          {/* Owner Email */}
          <div>
            <label className="block text-right text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-right"
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>

          {/* Owner Phone */}
          <div>
            <label className="block text-right text-gray-700 font-semibold mb-2">رقم الهاتف</label>
            <input
              type="tel"
              name="ownerPhone"
              value={formData.ownerPhone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-right"
              placeholder="أدخل رقم الهاتف"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              حفظ التغييرات
            </Button>
            <Button
              onClick={() => onNavigate('stores-management')}
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
