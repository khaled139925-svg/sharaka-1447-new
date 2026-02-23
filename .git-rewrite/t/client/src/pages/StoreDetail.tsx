import { Button } from '@/components/ui/button';
import { useStores } from '@/contexts/StoresContext';
import { Star, Mail, Phone, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface StoreDetailProps {
  onNavigate: (page: string, storeId?: string, productId?: string) => void;
  storeId: string | null;
}

export default function StoreDetail({ onNavigate, storeId }: StoreDetailProps) {
  const { getStore } = useStores();
  const [searchQuery, setSearchQuery] = useState('');

  if (!storeId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">خطأ: لم يتم تحديد المتجر</p>
          <Button onClick={() => onNavigate('home')} className="bg-blue-600 hover:bg-blue-700 text-white">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const store = getStore(storeId);

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">المتجر غير موجود</p>
          <Button onClick={() => onNavigate('home')} className="bg-blue-600 hover:bg-blue-700 text-white">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const filteredProducts = store.products.filter((product) =>
    product.name.includes(searchQuery) || product.description.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-right text-gray-800">المتجر</h1>
          <Button
            onClick={() => onNavigate('home')}
            className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة
          </Button>
        </div>
      </div>

      {/* Store Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={store.logo}
              alt={store.name}
              className="w-32 h-32 rounded-lg shadow-lg object-cover"
            />
            <div className="flex-1 text-right">
              <h2 className="text-4xl font-bold mb-2">{store.name}</h2>
              <p className="text-lg text-blue-100 mb-4">{store.description}</p>
              <div className="flex items-center justify-end gap-4 flex-wrap">
                <span className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">
                  {store.category}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-300">★★★★★</span>
                  <span>(4.8)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-right">
            <div className="flex items-center justify-end gap-3 mb-2">
              <p className="text-lg font-semibold text-gray-800">{store.ownerName}</p>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {store.ownerName.charAt(0)}
              </div>
            </div>
            <p className="text-gray-600 text-sm">مالك المتجر</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-right">
            <div className="flex items-center justify-end gap-3 mb-2">
              <a href={`mailto:${store.ownerEmail}`} className="text-lg font-semibold text-blue-600 hover:underline">
                {store.ownerEmail}
              </a>
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm">البريد الإلكتروني</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-right">
            <div className="flex items-center justify-end gap-3 mb-2">
              <a href={`tel:${store.ownerPhone}`} className="text-lg font-semibold text-blue-600 hover:underline">
                {store.ownerPhone}
              </a>
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm">رقم الهاتف</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن المنتجات..."
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
            dir="rtl"
          />
        </div>

        {/* Products Grid */}
        <div>
          <h3 className="text-2xl font-bold text-right text-gray-800 mb-6">
            المنتجات ({filteredProducts.length})
          </h3>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">لا توجد منتجات تطابق البحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onNavigate('product-detail', storeId, product.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform"
                  />
                  <div className="p-6 text-right">
                    <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-5 h-5" />
                        <span className="font-bold">{product.points}</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {product.price.toFixed(2)} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
