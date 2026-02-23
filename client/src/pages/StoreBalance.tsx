import { useState } from 'react';
import { useStores } from '@/contexts/StoresContext';
import { Gift, Send, History, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoreBalanceProps {
  storeId: string;
}

export default function StoreBalance({ storeId }: StoreBalanceProps) {
  const { getStore, getStoreBalance, getStoreGiftHistory, giftPointsToUser } = useStores();
  const store = getStore(storeId);
  const storeBalance = getStoreBalance(storeId);
  const giftHistory = getStoreGiftHistory(storeId);

  const [showGiftForm, setShowGiftForm] = useState(false);
  const [giftData, setGiftData] = useState({
    toUserId: '',
    toUserName: '',
    points: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">المتجر غير موجود</p>
        </div>
      </div>
    );
  }

  const handleGiftSubmit = async () => {
    if (!giftData.toUserId || !giftData.toUserName || !giftData.points) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const points = parseInt(giftData.points);
    if (points <= 0 || points > storeBalance) {
      alert('الرجاء إدخال عدد نقاط صحيح ولا يتجاوز رصيدك');
      return;
    }

    try {
      setIsSubmitting(true);
      giftPointsToUser(
        storeId,
        giftData.toUserId,
        giftData.toUserName,
        points,
        giftData.notes
      );

      alert(`✅ تم إرسال ${points} نقطة إلى ${giftData.toUserName} بنجاح!`);
      setGiftData({ toUserId: '', toUserName: '', points: '', notes: '' });
      setShowGiftForm(false);
    } catch (error) {
      alert('حدث خطأ في إرسال الهدية');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {store.logo && (
              <img
                src={store.logo}
                alt={store.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {store.name}
              </h1>
              <p className="text-gray-600">إدارة رصيد النقاط والهدايا</p>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Store Balance */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold text-lg">رصيد النقاط</h3>
              <div className="bg-purple-100 p-4 rounded-lg">
                <Wallet className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <p className="text-5xl font-bold text-purple-600 mb-2">
              {storeBalance}
            </p>
            <p className="text-sm text-gray-500">
              نقطة متاحة للهدايا والتبادل
            </p>
          </div>

          {/* Store Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-gray-600 font-semibold text-lg mb-4">معلومات المتجر</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">اسم المالك</p>
                <p className="font-semibold text-gray-800">{store.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="font-semibold text-gray-800">{store.ownerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">نسبة النقاط</p>
                <p className="font-semibold text-gray-800">
                  {Math.round(store.pointsRatio * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gift Form */}
        {!showGiftForm ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  أرسل هدية نقاط
                </h3>
                <p className="text-gray-600">
                  شارك نقاطك مع عملائك كهدايا وحوافز
                </p>
              </div>
              <Button
                onClick={() => setShowGiftForm(true)}
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
                إرسال هدية
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              إرسال هدية نقاط جديدة
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معرّف العميل
                  </label>
                  <input
                    type="text"
                    value={giftData.toUserId}
                    onChange={(e) =>
                      setGiftData({ ...giftData, toUserId: e.target.value })
                    }
                    placeholder="مثال: user-123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم العميل
                  </label>
                  <input
                    type="text"
                    value={giftData.toUserName}
                    onChange={(e) =>
                      setGiftData({ ...giftData, toUserName: e.target.value })
                    }
                    placeholder="أدخل اسم العميل"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد النقاط
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={giftData.points}
                    onChange={(e) =>
                      setGiftData({ ...giftData, points: e.target.value })
                    }
                    placeholder="أدخل عدد النقاط"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max={storeBalance}
                  />
                  <div className="bg-purple-50 px-4 py-2 rounded-lg text-center">
                    <p className="text-xs text-gray-600">المتاح</p>
                    <p className="font-bold text-purple-600">{storeBalance}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رسالة (اختياري)
                </label>
                <textarea
                  value={giftData.notes}
                  onChange={(e) =>
                    setGiftData({ ...giftData, notes: e.target.value })
                  }
                  placeholder="أضف رسالة شخصية للعميل"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>

              {giftData.points && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    سيتم تحويل <span className="font-bold text-purple-600">{giftData.points}</span> نقطة
                    {' '}إلى <span className="font-bold text-gray-800">{giftData.toUserName}</span>
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleGiftSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الهدية'}
                </Button>
                <Button
                  onClick={() => setShowGiftForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Gift History */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            سجل الهدايا المُرسلة
          </h3>

          {giftHistory.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">لم تُرسل أي هدايا حتى الآن</p>
            </div>
          ) : (
            <div className="space-y-3">
              {giftHistory.map((gift) => (
                <div
                  key={gift.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {gift.toUserName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(gift.timestamp).toLocaleDateString('ar-SA')}
                      </p>
                      {gift.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          الرسالة: {gift.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">
                        -{gift.points} نقطة
                      </p>
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
