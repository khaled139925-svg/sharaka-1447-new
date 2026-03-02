import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft, CheckCircle } from 'lucide-react';

interface PaymentPageProps {
  sessionId?: number;
  amount?: number;
  consultantName?: string;
  onNavigate?: (page: string) => void;
}

export default function PaymentPage({ sessionId, amount = 100, consultantName = 'المستشار', onNavigate }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const isRTL = language === 'ar';

  const translations = {
    ar: {
      title: 'الدفع',
      subtitle: 'أكمل عملية الدفع للجلسة',
      consultantName: 'اسم المستشار',
      amount: 'المبلغ',
      paymentMethod: 'طريقة الدفع',
      creditCard: 'بطاقة ائتمان',
      bankTransfer: 'تحويل بنكي',
      wallet: 'محفظة رقمية',
      cardNumber: 'رقم البطاقة',
      expiryDate: 'تاريخ الانتهاء',
      cvv: 'CVV',
      cardHolder: 'اسم حامل البطاقة',
      pay: 'الدفع الآن',
      paymentSuccess: 'تم الدفع بنجاح!',
      bookingConfirmed: 'تم تأكيد الحجز',
      backToHome: 'العودة للرئيسية',
      english: 'English',
      arabic: 'العربية',
      back: 'رجوع',
      sar: 'ريال',
    },
    en: {
      title: 'Payment',
      subtitle: 'Complete the payment for your session',
      consultantName: 'Consultant Name',
      amount: 'Amount',
      paymentMethod: 'Payment Method',
      creditCard: 'Credit Card',
      bankTransfer: 'Bank Transfer',
      wallet: 'Digital Wallet',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      cardHolder: 'Card Holder Name',
      pay: 'Pay Now',
      paymentSuccess: 'Payment Successful!',
      bookingConfirmed: 'Booking Confirmed',
      backToHome: 'Back to Home',
      english: 'English',
      arabic: 'العربية',
      back: 'Back',
      sar: 'SAR',
    },
  };

  const t = translations[language];

  const handlePayment = async () => {
    setLoading(true);
    // محاكاة معالجة الدفع
    setTimeout(() => {
      setPaymentSuccess(true);
      setLoading(false);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              {language === 'ar' ? t.english : t.arabic}
            </button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-center mb-6">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">{t.paymentSuccess}</h1>
              <p className="text-gray-600 mb-6">{t.bookingConfirmed}</p>
              <p className="text-lg font-semibold text-gray-800 mb-8">
                {t.amount}: {amount} {t.sar}
              </p>
              <Button
                onClick={() => onNavigate?.('home')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
              >
                {t.backToHome}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition"
          >
            <ArrowLeft size={20} />
            <span>{t.back}</span>
          </button>

          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            {language === 'ar' ? t.english : t.arabic}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-orange-500 mb-2 text-center">{t.title}</h1>
            <p className="text-gray-600 text-center mb-8">{t.subtitle}</p>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-gray-700">{t.consultantName}:</span>
                <span className="text-gray-900">{consultantName}</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="font-semibold text-gray-700">{t.amount}:</span>
                <span className="text-2xl font-bold text-orange-500">{amount} {t.sar}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                {t.paymentMethod}
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" style={{ borderColor: paymentMethod === 'card' ? '#FF9800' : '#E0E0E0' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard size={20} className="mr-2" style={{ color: '#1976D2' }} />
                  <span>{t.creditCard}</span>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" style={{ borderColor: paymentMethod === 'transfer' ? '#FF9800' : '#E0E0E0' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>{t.bankTransfer}</span>
                </label>
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.cardHolder}
                  </label>
                  <input
                    type="text"
                    placeholder={t.cardHolder}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.cardNumber}
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.expiryDate}
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.cvv}
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'جاري معالجة الدفع...' : t.pay}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
