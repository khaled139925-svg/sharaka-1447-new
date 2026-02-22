import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, Plus, Trash2, Edit2 } from 'lucide-react';

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

export default function StoresManagement({ onBack }: { onBack: () => void }) {
  const [stores, setStores] = useState<Store[]>([
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
    }
  ]);

  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    productPrice: '',
    productImage: '',
    productDescription: ''
  });

  const currentStore = stores.find(s => s.id === selectedStore);

  const handleAddProduct = () => {
    if (!currentStore || !formData.productName || !formData.productPrice) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const updatedStores = stores.map(store => {
      if (store.id === selectedStore) {
        return {
          ...store,
          products: [
            ...store.products,
            {
              id: Date.now(),
              name: formData.productName,
              price: parseFloat(formData.productPrice),
              image: formData.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
              description: formData.productDescription
            }
          ]
        };
      }
      return store;
    });

    setStores(updatedStores);
    setFormData({ productName: '', productPrice: '', productImage: '', productDescription: '' });
    setShowAddProduct(false);
    alert('تم إضافة المنتج بنجاح!');
  };

  const handleDeleteProduct = (productId: number) => {
    const updatedStores = stores.map(store => {
      if (store.id === selectedStore) {
        return {
          ...store,
          products: store.products.filter(p => p.id !== productId)
        };
      }
      return store;
    });
    setStores(updatedStores);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStore) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedStores = stores.map(store => {
          if (store.id === selectedStore) {
            return {
              ...store,
              logo: event.target?.result as string
            };
          }
          return store;
        });
        setStores(updatedStores);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          productImage: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // شاشة إدارة أصناف المتجر
  if (selectedStore && currentStore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
        <div className="max-w-4xl mx-auto">
          {/* الترويسة */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => {
                setSelectedStore(null);
                setShowAddProduct(false);
              }}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة للمتاجر
            </button>
            <h1 className="text-3xl font-bold text-purple-900">إدارة أصناف {currentStore.name}</h1>
          </div>

          {/* معلومات المتجر */}
          <Card className="p-6 mb-8 bg-white shadow-lg">
            <div className="flex items-center gap-6">
              <img
                src={currentStore.logo}
                alt={currentStore.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">{currentStore.name}</h2>
                <p className="text-gray-600 mb-4">{currentStore.description}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">المالك</p>
                    <p className="font-semibold">{currentStore.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">البريد</p>
                    <p className="font-semibold">{currentStore.ownerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">الهاتف</p>
                    <p className="font-semibold">{currentStore.ownerPhone}</p>
                  </div>
                </div>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <div className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  تحديث الشعار
                </div>
              </label>
            </div>
          </Card>

          {/* الأصناف */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-900">الأصناف ({currentStore.products.length})</h2>
              <Button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة صنف جديد
              </Button>
            </div>

            {/* نموذج إضافة صنف */}
            {showAddProduct && (
              <Card className="p-6 mb-6 bg-white shadow-lg border-2 border-green-300">
                <h3 className="text-xl font-bold text-gray-800 mb-4">إضافة صنف جديد</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">اسم الصنف</label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="مثال: هاتف ذكي"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">السعر (ر.س)</label>
                      <input
                        type="number"
                        value={formData.productPrice}
                        onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
                        placeholder="1500"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">الصورة</label>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageUpload}
                          className="hidden"
                        />
                        <div className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-600">
                          <Upload className="w-4 h-4" />
                          اختر صورة
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">الوصف</label>
                    <textarea
                      value={formData.productDescription}
                      onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                      placeholder="وصف الصنف..."
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 h-24 resize-none"
                    />
                  </div>

                  {formData.productImage && (
                    <div>
                      <p className="text-gray-700 font-semibold mb-2">معاينة الصورة:</p>
                      <img
                        src={formData.productImage}
                        alt="معاينة"
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddProduct}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      حفظ الصنف
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddProduct(false);
                        setFormData({ productName: '', productPrice: '', productImage: '', productDescription: '' });
                      }}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* قائمة الأصناف */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentStore.products.map((product) => (
                <Card key={product.id} className="overflow-hidden shadow-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-purple-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-purple-600">{product.price} ر.س</span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2">
                        <Edit2 className="w-4 h-4" />
                        تعديل
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2"
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
      </div>
    );
  }

  // شاشة قائمة المتاجر
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* الترويسة */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة
          </button>
          <h1 className="text-4xl font-bold text-purple-900">إدارة المتاجر</h1>
        </div>

        {/* قائمة المتاجر */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            >
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{store.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{store.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    {store.category}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {store.products.length} أصناف
                  </span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
                  إدارة الأصناف
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
