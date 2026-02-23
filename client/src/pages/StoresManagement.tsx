import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  logo: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  products: Product[];
}

export default function StoresManagement({ onBack, onNavigate }: { onBack: () => void; onNavigate: (page: string) => void }) {
  const [stores] = useState<Store[]>([
    {
      id: 1,
      name: 'متجر التكنولوجيا',
      description: 'متجر متخصص في الأجهزة الإلكترونية',
      category: 'إلكترونيات',
      logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      ownerName: 'أحمد محمد',
      ownerEmail: 'ahmed@tech.com',
      ownerPhone: '+966501234567',
      products: [
        {
          id: 1,
          name: 'هاتف ذكي',
          price: 1500,
          image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&h=300&fit=crop',
          description: 'هاتف ذكي حديث بمواصفات عالية'
        }
      ]
    },
    {
      id: 2,
      name: 'متجر الملابس',
      description: 'متجر متخصص في الملابس والأزياء',
      category: 'ملابس',
      logo: 'https://images.unsplash.com/photo-1441984904556-0ac8ce9fdf67?w=200&h=200&fit=crop',
      ownerName: 'فاطمة علي',
      ownerEmail: 'fatima@fashion.com',
      ownerPhone: '+966502345678',
      products: []
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-right text-gray-800">إدارة المتاجر</h1>
          <Button
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للأقسام
          </Button>
        </div>

        {/* Create Store Button */}
        <div className="mb-8">
          <Button
            onClick={() => onNavigate('create-store')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 w-full justify-center text-lg"
          >
            <Plus className="w-6 h-6" />
            إنشاء متجر جديد
          </Button>
        </div>

        {/* Stores List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {/* Store Logo */}
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Store Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-right text-gray-800">{store.name}</h3>
                  <p className="text-sm text-gray-500 text-right">{store.category}</p>
                </div>

                <p className="text-gray-600 text-right text-sm">{store.description}</p>

                <div className="space-y-2 text-sm text-right">
                  <p><span className="font-semibold">المالك:</span> {store.ownerName}</p>
                  <p><span className="font-semibold">البريد:</span> {store.ownerEmail}</p>
                  <p><span className="font-semibold">الهاتف:</span> {store.ownerPhone}</p>
                  <p><span className="font-semibold">الأصناف:</span> {store.products.length}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => onNavigate('store-detail', store.id.toString())}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                  >
                    عرض المتجر
                  </Button>
                  <Button
                    onClick={() => onNavigate('edit-store', store.id.toString())}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold"
                  >
                    تعديل
                  </Button>
                  <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold">
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
