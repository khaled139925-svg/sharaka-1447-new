import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  image: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  rating: string;
  reviewCount: number;
  isActive: boolean;
}

export default function StoresManagement({ onBack }: { onBack: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    category: '',
    categoryEn: '',
    image: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
  });

  const { data: stores = [] } = trpc.stores.getAll.useQuery();
  const createMutation = trpc.stores.create.useMutation();
  const updateMutation = trpc.stores.update.useMutation();
  const deleteMutation = trpc.stores.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setFormData({
        name: '',
        nameEn: '',
        description: '',
        descriptionEn: '',
        category: '',
        categoryEn: '',
        image: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (store: Store) => {
    setFormData({
      name: store.name,
      nameEn: store.nameEn,
      description: store.description,
      descriptionEn: store.descriptionEn,
      category: store.category,
      categoryEn: store.categoryEn,
      image: store.image,
      ownerName: store.ownerName,
      ownerEmail: store.ownerEmail,
      ownerPhone: store.ownerPhone,
    });
    setEditingId(store.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المتجر؟')) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-blue-600" />
            </button>
            <h1 className="text-4xl font-bold text-blue-900">إدارة المتاجر</h1>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: '',
                nameEn: '',
                description: '',
                descriptionEn: '',
                category: '',
                categoryEn: '',
                image: '',
                ownerName: '',
                ownerEmail: '',
                ownerPhone: '',
              });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            إضافة متجر جديد
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-8 mb-8 bg-white shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              {editingId ? 'تعديل المتجر' : 'إضافة متجر جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المتجر (عربي)
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المتجر (إنجليزي)
                  </label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة (عربي)
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة (إنجليزي)
                  </label>
                  <Input
                    value={formData.categoryEn}
                    onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المالك
                  </label>
                  <Input
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بريد المالك
                  </label>
                  <Input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    هاتف المالك
                  </label>
                  <Input
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط الصورة
                  </label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف (عربي)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف (إنجليزي)
                </label>
                <Textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? 'تحديث' : 'إضافة'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store: Store) => (
            <Card key={store.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{store.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{store.description}</p>
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">الفئة:</span> {store.category}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">المالك:</span> {store.ownerName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">التقييم:</span> {store.rating} ⭐
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(store)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    تعديل
                  </Button>
                  <Button
                    onClick={() => handleDelete(store.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
