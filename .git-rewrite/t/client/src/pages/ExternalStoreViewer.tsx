import { useState } from 'react';
import { X, Gift, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PurchaseRecord {
  id: string;
  storeName: string;
  purchaseAmount: number;
  pointsRatio: number;
  pointsEarned: number;
  timestamp: number;
  notes: string;
}

export default function ExternalStoreViewer({ 
  storeUrl,
  storeName,
  pointsRatio,
  onClose,
  onPurchaseRecorded
}: { 
  storeUrl: string;
  storeName: string;
  pointsRatio: number;
  onClose: () => void;
  onPurchaseRecorded: (purchase: PurchaseRecord) => void;
}) {
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseNotes, setPurchaseNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecordPurchase = async () => {
    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }

    try {
      setIsSubmitting(true);
      const amount = parseFloat(purchaseAmount);
      const pointsEarned = Math.round(amount * pointsRatio);

      const purchase: PurchaseRecord = {
        id: `purchase-${Date.now()}`,
        storeName,
        purchaseAmount: amount,
        pointsRatio,
        pointsEarned,
        timestamp: Date.now(),
        notes: purchaseNotes
      };

      // استدعاء الدالة لحفظ الشراء
      onPurchaseRecorded(purchase);

      // إعادة تعيين النموذج
      setPurchaseAmount('');
      setPurchaseNotes('');
      setShowPurchaseForm(false);

      alert(`✅ تم تسجيل الشراء بنجاح!\nالنقاط المكتسبة: ${pointsEarned}`);
    } catch (error) {
      alert('حدث خطأ في تسجيل الشراء');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">{storeName}</h2>
          <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
            <Gift className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">
              {Math.round(pointsRatio * 100)}% نقاط
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content - iframe */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <iframe
          src={storeUrl}
          className="w-full h-full border-none"
          title="External Store"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
        />
      </div>

      {/* Footer with Purchase Recording */}
      <div className="bg-white border-t border-gray-200 p-4">
        {!showPurchaseForm ? (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              سجل عملية الشراء لكسب النقاط
            </div>
            <Button 
              onClick={() => setShowPurchaseForm(true)}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <ShoppingCart className="w-4 h-4" />
              تسجيل شراء
            </Button>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-800">تسجيل عملية شراء جديدة</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مبلغ الشراء (بالريال)
              </label>
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="أدخل مبلغ الشراء"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات (اختياري)
              </label>
              <textarea
                value={purchaseNotes}
                onChange={(e) => setPurchaseNotes(e.target.value)}
                placeholder="أضف ملاحظات عن الشراء"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
              />
            </div>

            {purchaseAmount && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  النقاط المتوقعة: <span className="font-bold text-green-600">
                    {Math.round(parseFloat(purchaseAmount) * pointsRatio)}
                  </span>
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleRecordPurchase}
                disabled={isSubmitting || !purchaseAmount}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
              </Button>
              <Button
                onClick={() => setShowPurchaseForm(false)}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
