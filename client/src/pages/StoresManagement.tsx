'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

const SAMPLE_STORES: Store[] = [
  {
    id: 1,
    name: 'متجر التكنولوجيا',
    description: 'متجر متخصص في الأجهزة الإلكترونية والتكنولوجيا',
    category: 'إلكترونيات',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    ownerName: 'أحمد محمد',
    ownerEmail: 'ahmed@tech.com',
    ownerPhone: '+966501234567',
  },
];

export default function StoresManagement({ onBack }: { onBack: () => void }) {
  const [stores, setStores] = useState<Store[]>(SAMPLE_STORES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setStores(
        stores.map((s) =>
          s.id === editingId
            ? { ...s, ...formData }
            : s
        )
      );
    } else {
      setStores([
        ...stores,
        {
          id: Math.max(...stores.map((s) => s.id), 0) + 1,
          ...formData,
        },
      ]);
    }
    setFormData({
      name: '',
      description: '',
      category: '',
      image: '',
      ownerName: '',
      ownerEmail: '',
      ownerPhone: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل تريد حذف هذا المتجر؟')) {
      setStores(stores.filter((s) => s.id !== id));
    }
  };

  const handleEdit = (store: Store) => {
    setEditingId(store.id);
    setFormData({
      name: store.name,
      description: store.description,
      category: store.category,
      image: store.image,
      ownerName: store.ownerName,
      ownerEmail: store.ownerEmail,
      ownerPhone: store.ownerPhone,
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* الترويسة */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">🏪 إدارة المتاجر</h1>
          <Button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            <ArrowLeft size={20} />
            العودة
          </Button>
        </div>

        {/* زر إضافة متجر */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            <Plus size={20} />
            إضافة متجر جديد
          </Button>
        )}

        {/* نموذج الإضافة/التعديل */}
        {showForm && (
          <Card className="p-8 mb-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'تعديل المتجر' : 'إضافة متجر جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="اسم المتجر"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  required
                />
                <input
                  type="text"
                  placeholder="الفئة"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  required
                />
                <input
                  type="text"
                  placeholder="اسم المالك"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  required
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  required
                />
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  required
                />
                <input
                  type="url"
                  placeholder="رابط الصورة"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
              <textarea
                placeholder="وصف المتجر"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[100px]"
                required
              />
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  {editingId ? 'تحديث المتجر' : 'إضافة المتجر'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      description: '',
                      category: '',
                      image: '',
                      ownerName: '',
                      ownerEmail: '',
                      ownerPhone: '',
                    });
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* قائمة المتاجر */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card key={store.id} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              {store.image && (
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
              <p className="text-gray-600 mb-2 text-sm">{store.description}</p>
              <p className="text-gray-500 text-sm mb-4">
                <strong>الفئة:</strong> {store.category}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                <strong>المالك:</strong> {store.ownerName}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(store)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  <Edit2 size={16} />
                  تعديل
                </Button>
                <Button
                  onClick={() => handleDelete(store.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  <Trash2 size={16} />
                  حذف
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
