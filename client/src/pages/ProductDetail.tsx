import { Button } from '@/components/ui/button';
import { useStores } from '@/contexts/StoresContext';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface ProductDetailProps {
  onNavigate: (page: string, storeId?: string) => void;
  storeId: string | null;
  productId: string | null;
}

export default function ProductDetail({ onNavigate, storeId, productId }: ProductDetailProps) {
  const { getStore, getProduct, addToCart } = useStores();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!storeId || !productId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">خطأ: لم يتم تحديد المنتج</p>
          <Button onClick={() => onNavigate('home')} className="bg-blue-600 hover:bg-blue-700 text-white">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const store = getStore(storeId);
  const product = getProduct(storeId, productId);

  if (!store || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">المنتج غير موجود</p>
          <Button onClick={() => onNavigate('home')} className="bg-blue-600 hover:bg-blue-700 text-white">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(storeId, productId, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-right text-gray-800">تفاصيل المنتج</h1>
          <Button
            onClick={() => onNavigate('store-detail', storeId)}
            className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للمتجر
          </Button>
        </div>

        {/* Store Info Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex items-center gap-4">
          <img src={store.logo} alt={store.name} className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex-1 text-right">
            <p className="text-sm text-gray-600">من متجر</p>
            <p className="text-2xl font-bold text-gray-800">{store.name}</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md h-auto rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {/* Product Name */}
            <div>
              <h2 className="text-4xl font-bold text-right text-gray-800 mb-2">{product.name}</h2>
              <div className="flex items-center justify-end gap-2">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-gray-600">(245 تقييم)</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">الوصف</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-gray-600 text-sm">السعر</p>
                  <p className="text-4xl font-bold text-blue-600">{product.price.toFixed(2)} ر.س</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm">النقاط</p>
                  <p className="text-3xl font-bold text-green-600 flex items-center gap-1">
                    <Star className="w-6 h-6 text-yellow-500" />
                    {product.points}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800 text-right">الكمية</label>
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-12 border border-gray-300 rounded-lg text-center font-bold text-lg"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                addedToCart
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <ShoppingCart className="w-6 h-6" />
              {addedToCart ? 'تمت الإضافة إلى السلة!' : 'إضافة إلى السلة'}
            </Button>

            {/* Additional Info */}
            <div className="border-t-2 border-gray-200 pt-6 space-y-3">
              <div className="flex items-center justify-between text-right">
                <span className="text-gray-600">التوفر</span>
                <span className="text-green-600 font-bold">متوفر</span>
              </div>
              <div className="flex items-center justify-between text-right">
                <span className="text-gray-600">الشحن</span>
                <span className="text-gray-800 font-semibold">شحن مجاني</span>
              </div>
              <div className="flex items-center justify-between text-right">
                <span className="text-gray-600">الضمان</span>
                <span className="text-gray-800 font-semibold">ضمان سنة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-right text-gray-800 mb-6">منتجات أخرى من المتجر</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.products
              .filter((p) => p.id !== productId)
              .slice(0, 3)
              .map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => onNavigate('product-detail', storeId, relatedProduct.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 text-right">
                    <p className="font-bold text-gray-800 mb-2">{relatedProduct.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold">{relatedProduct.price.toFixed(2)} ر.س</span>
                      <span className="text-yellow-500 flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {relatedProduct.points}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
