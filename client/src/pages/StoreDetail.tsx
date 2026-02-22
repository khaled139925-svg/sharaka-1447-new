import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'سماعات بلوتوث',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    description: 'سماعات بلوتوث عالية الجودة مع بطارية تدوم 24 ساعة',
  },
  {
    id: 2,
    name: 'هاتف ذكي',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&h=300&fit=crop',
    description: 'هاتف ذكي حديث مع كاميرا احترافية',
  },
  {
    id: 3,
    name: 'شاشة LED',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    description: 'شاشة LED عالية الدقة 4K',
  },
  {
    id: 4,
    name: 'لوحة مفاتيح ميكانيكية',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1587829191301-4b47a0ec2d71?w=300&h=300&fit=crop',
    description: 'لوحة مفاتيح ميكانيكية RGB',
  },
];

export default function StoreDetail({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) =>
    product.name.includes(searchTerm) || product.description.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => onNavigate('home')}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            العودة للرئيسية
          </Button>
          <h1 className="text-3xl font-bold text-center flex-1">متجر التكنولوجيا</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
              dir="rtl"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-3">
                  <h3 className="text-xl font-bold text-right text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 text-right text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      أضف للسلة
                    </Button>
                    <span className="text-2xl font-bold text-blue-600">{product.price.toFixed(2)} ر.س</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 space-y-4">
            <h2 className="text-2xl font-bold text-right text-gray-800">🛒 السلة</h2>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-8">السلة فارغة</p>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <p className="font-semibold text-right text-gray-800">{item.name}</p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ✕
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-semibold text-blue-600">{(item.price * item.quantity).toFixed(2)} ر.س</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Total */}
                <div className="border-t-2 border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span className="text-blue-600">{cartTotal.toFixed(2)} ر.س</span>
                    <span className="text-gray-800">الإجمالي:</span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
                    الدفع الآن
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
