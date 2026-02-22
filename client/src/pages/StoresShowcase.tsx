import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Search, Star } from 'lucide-react';

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
  rating?: number;
}

export default function StoresShowcase({ onBack }: { onBack: () => void }) {
  const [stores] = useState<Store[]>([
    {
      id: 1,
      name: 'متجر التكنولوجيا',
      description: 'متجر متخصص في الأجهزة الإلكترونية والتكنولوجيا الحديثة',
      category: 'إلكترونيات',
      logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      ownerName: 'أحمد محمد',
      ownerEmail: 'ahmed@tech.com',
      ownerPhone: '+966501234567',
      rating: 4.8,
      products: [
        {
          id: 1,
          name: 'هاتف ذكي',
          price: 1500,
          image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&h=300&fit=crop',
          description: 'هاتف ذكي حديث بمواصفات عالية'
        },
        {
          id: 2,
          name: 'سماعات لاسلكية',
          price: 450,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
          description: 'سماعات بلوتوث عالية الجودة'
        },
        {
          id: 3,
          name: 'شاشة ذكية',
          price: 2500,
          image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=300&fit=crop',
          description: 'شاشة ذكية بدقة 4K'
        }
      ]
    },
    {
      id: 2,
      name: 'متجر الملابس',
      description: 'متجر متخصص في الملابس والأزياء الحديثة',
      category: 'ملابس',
      logo: 'https://images.unsplash.com/photo-1441984904556-0ac8ce9fdf67?w=200&h=200&fit=crop',
      ownerName: 'فاطمة علي',
      ownerEmail: 'fatima@fashion.com',
      ownerPhone: '+966501234568',
      rating: 4.6,
      products: [
        {
          id: 4,
          name: 'فستان نسائي',
          price: 350,
          image: 'https://images.unsplash.com/photo-1595777707802-a9f1dd37d6b0?w=300&h=300&fit=crop',
          description: 'فستان أنيق مصنوع من أجود الخامات'
        },
        {
          id: 5,
          name: 'قميص رجالي',
          price: 200,
          image: 'https://images.unsplash.com/photo-1596399579883-e5fe5a934df0?w=300&h=300&fit=crop',
          description: 'قميص رجالي كلاسيكي'
        }
      ]
    }
  ]);

  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const currentStore = stores.find(s => s.id === selectedStore);

  const filteredProducts = currentStore?.products.filter(p =>
    p.name.includes(searchTerm) || p.description.includes(searchTerm)
  ) || [];

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // شاشة المتجر المتكامل
  if (selectedStore && currentStore) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* الترويسة */}
        <div className="bg-white shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedStore(null);
                setSearchTerm('');
                setCart([]);
                setShowCart(false);
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة للمتاجر
            </button>
            <div className="flex-1 mx-8">
              <div className="relative">
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن منتج..."
                  className="w-full pr-10 pl-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              السلة ({cart.length})
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* معلومات المتجر */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center gap-8 mb-6">
              <img
                src={currentStore.logo}
                alt={currentStore.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">{currentStore.name}</h1>
                  {currentStore.rating && (
                    <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-700">{currentStore.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-lg mb-4">{currentStore.description}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">الفئة</p>
                    <p className="font-bold text-gray-900">{currentStore.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">البريد الإلكتروني</p>
                    <p className="font-bold text-gray-900">{currentStore.ownerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">الهاتف</p>
                    <p className="font-bold text-gray-900">{currentStore.ownerPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* المنتجات */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                المنتجات ({filteredProducts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">{product.price} ر.س</span>
                        <Button
                          onClick={() => addToCart(product)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          أضف
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* السلة */}
            {showCart && (
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">سلة التسوق</h3>
                  {cart.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">السلة فارغة</p>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.product.id} className="border-b pb-4">
                            <p className="font-semibold text-gray-900 mb-2">{item.product.name}</p>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-blue-600 font-bold">{item.product.price} ر.س</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
                                >
                                  -
                                </button>
                                <span className="font-bold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              الإجمالي: {item.product.price * item.quantity} ر.س
                            </p>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-semibold mt-2"
                            >
                              إزالة
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-bold text-gray-900">الإجمالي:</span>
                          <span className="text-2xl font-bold text-blue-600">{totalPrice} ر.س</span>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
                          إتمام الشراء
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // شاشة قائمة المتاجر
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* الترويسة */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة
          </button>
          <h1 className="text-4xl font-bold text-gray-900">السوق الإلكتروني</h1>
        </div>

        {/* قائمة المتاجر */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <Card
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              className="overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
            >
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                  {store.rating && (
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold">{store.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{store.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {store.category}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {store.products.length} منتج
                  </span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  تصفح المتجر
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
