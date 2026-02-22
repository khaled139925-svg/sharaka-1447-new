import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, ArrowLeft, Star } from 'lucide-react';

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

interface Product {
  id: number;
  storeId: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: number;
  isActive: boolean;
}

export default function StoresShowcase({ onBack }: { onBack: () => void }) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  const { data: stores = [] } = trpc.stores.getAll.useQuery();
  const { data: products = [] } = trpc.products.getByStore.useQuery(
    { storeId: selectedStore?.id || 0 },
    { enabled: !!selectedStore }
  );

  const filteredStores = stores.filter((store: Store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalPrice = cart.reduce((sum, product) => sum + parseFloat(product.price), 0);

  if (selectedStore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Store Header */}
          <div className="mb-8">
            <button
              onClick={() => {
                setSelectedStore(null);
                setCart([]);
              }}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة للمتاجر
            </button>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={selectedStore.image}
                alt={selectedStore.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <h1 className="text-4xl font-bold text-purple-900 mb-2">
                  {selectedStore.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-700">
                      {selectedStore.rating} ({selectedStore.reviewCount} تقييم)
                    </span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">{selectedStore.category}</span>
                </div>
                <p className="text-gray-700 mb-4">{selectedStore.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">المالك</p>
                    <p className="font-semibold text-gray-900">{selectedStore.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">البريد</p>
                    <p className="font-semibold text-gray-900">{selectedStore.ownerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">الهاتف</p>
                    <p className="font-semibold text-gray-900">{selectedStore.ownerPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products and Cart */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Products */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-purple-900 mb-6">المنتجات</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product: Product) => (
                  <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-purple-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-purple-600">
                          {product.price} ر.س
                        </span>
                        <span className="text-sm text-gray-600">
                          المخزون: {product.stock}
                        </span>
                      </div>
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        أضف للسلة
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Shopping Cart */}
            <div>
              <Card className="p-6 bg-white shadow-lg sticky top-8">
                <h2 className="text-xl font-bold text-purple-900 mb-4">سلة التسوق</h2>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">السلة فارغة</p>
                  ) : (
                    cart.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {product.name}
                          </p>
                          <p className="text-purple-600 font-bold text-sm">
                            {product.price} ر.س
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <>
                    <div className="border-t pt-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">المجموع:</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {totalPrice.toFixed(2)} ر.س
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        عدد المنتجات: {cart.length}
                      </p>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 mb-2">
                      إتمام الشراء
                    </Button>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-purple-600" />
            </button>
            <h1 className="text-4xl font-bold text-purple-900">السوق الإلكتروني</h1>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="ابحث عن متجر أو فئة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store: Store) => (
            <Card
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            >
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{store.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {store.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-700">
                      {store.rating}
                    </span>
                  </div>
                  <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    {store.category}
                  </span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  زيارة المتجر
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">لم يتم العثور على متاجر</p>
          </div>
        )}
      </div>
    </div>
  );
}
