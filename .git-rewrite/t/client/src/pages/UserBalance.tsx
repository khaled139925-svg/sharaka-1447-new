import { useState } from 'react';
import { useStores } from '@/contexts/StoresContext';
import { Gift, TrendingUp, History, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UserBalance() {
  const { getUserBalance } = useStores();
  const userId = 'current-user'; // يمكن تحديثه لاحقاً مع نظام المستخدمين
  const balance = getUserBalance(userId);

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'gifts'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            رصيدك من النقاط
          </h1>
          <p className="text-gray-600">
            إدارة النقاط المكتسبة والهدايا المستلمة
          </p>
        </div>

        {/* Main Balance Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Available Points */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">النقاط المتاحة</h3>
              <div className="bg-green-100 p-3 rounded-lg">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600">
              {balance.availablePoints}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              جاهزة للاستخدام
            </p>
          </div>

          {/* Total Points */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">إجمالي النقاط</h3>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-600">
              {balance.totalPoints}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              منذ البداية
            </p>
          </div>

          {/* Used Points */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">النقاط المستخدمة</h3>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Send className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-orange-600">
              {balance.usedPoints}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تم استخدامها
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'history'
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              سجل الشراء
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'gifts'
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              الهدايا المستلمة
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">معلومات الرصيد</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">معدل التحويل:</span>
                      <span className="font-bold text-gray-800">1 ريال = 1 نقطة</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">عدد عمليات الشراء:</span>
                      <span className="font-bold text-gray-800">
                        {balance.purchaseHistory.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">الهدايا المستلمة:</span>
                      <span className="font-bold text-gray-800">
                        {balance.receivedGifts.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>نصيحة:</strong> استخدم نقاطك للحصول على خصومات وهدايا من المتاجر المشاركة!
                  </p>
                </div>
              </div>
            )}

            {/* Purchase History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {balance.purchaseHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد عمليات شراء حتى الآن</p>
                  </div>
                ) : (
                  balance.purchaseHistory.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {purchase.storeName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(purchase.timestamp).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            +{purchase.pointsEarned} نقطة
                          </p>
                          <p className="text-sm text-gray-500">
                            {purchase.purchaseAmount} ريال
                          </p>
                        </div>
                      </div>
                      {purchase.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          ملاحظات: {purchase.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Received Gifts Tab */}
            {activeTab === 'gifts' && (
              <div className="space-y-4">
                {balance.receivedGifts.length === 0 ? (
                  <div className="text-center py-8">
                    <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لم تستقبل أي هدايا حتى الآن</p>
                  </div>
                ) : (
                  balance.receivedGifts.map((gift) => (
                    <div
                      key={gift.id}
                      className="border border-blue-200 bg-blue-50 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            هدية من متجر
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(gift.timestamp).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            +{gift.points} نقطة
                          </p>
                        </div>
                      </div>
                      {gift.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          الرسالة: {gift.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button className="bg-green-600 hover:bg-green-700">
            استخدام النقاط
          </Button>
          <Button variant="outline">
            نقل النقاط
          </Button>
        </div>
      </div>
    </div>
  );
}
