import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Lock, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const ADMIN_PIN = '1234'; // الرمز السري البسيط

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      // حفظ الجلسة في localStorage
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('adminLoginTime', new Date().toISOString());
      setError('');
      setLocation('/admin');
    } else {
      setError('الرمز السري غير صحيح');
      setPin('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background flex items-center justify-center p-4">
      <div className="card p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-4 rounded-full">
              <Lock size={32} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">لوحة التحكم</h1>
          <p className="text-foreground/70">أدخل الرمز السري للوصول</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* PIN Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              الرمز السري
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="أدخل الرمز السري"
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all duration-300 text-center text-2xl tracking-widest"
              maxLength={6}
              autoFocus
            />
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={pin.length === 0}
            className="w-full btn-primary justify-center py-3 text-lg font-semibold"
          >
            دخول
          </Button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            💡 الرمز السري الافتراضي: <span className="font-bold">1234</span>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-foreground/50 text-center mt-6">
          هذه الصفحة مخصصة للمسؤولين فقط
        </p>
      </div>
    </div>
  );
}
