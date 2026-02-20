import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, LogOut, Users, Store, Coins, FileText, MessageSquare } from 'lucide-react';

interface AdminUser {
  isAuthenticated: boolean;
  role: 'admin' | null;
}

interface AdminState {
  currentSection: 'consultants' | 'stores' | 'points' | 'bookings' | 'messages';
  consultants: any[];
  stores: any[];
  users: any[];
  bookings: any[];
  messages: any[];
}

export default function Admin() {
  const [adminUser, setAdminUser] = useState<AdminUser>({ isAuthenticated: false, role: null });
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [adminState, setAdminState] = useState<AdminState>({
    currentSection: 'consultants',
    consultants: [],
    stores: [],
    users: [],
    bookings: [],
    messages: [],
  });

  const ADMIN_PASSWORD = 'tariq'; // كلمة المرور الإدارية

  const handleAdminLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAdminUser({ isAuthenticated: true, role: 'admin' });
      setPassword('');
      setShowPasswordInput(false);
    } else {
      alert('كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  const handleAdminLogout = () => {
    setAdminUser({ isAuthenticated: false, role: null });
    setAdminState({
      currentSection: 'consultants',
      consultants: [],
      stores: [],
      users: [],
      bookings: [],
      messages: [],
    });
  };

  if (!adminUser.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <Lock className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-center text-gray-600 mb-6">Admin Control Panel</p>

          {!showPasswordInput ? (
            <Button
              onClick={() => setShowPasswordInput(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
            >
              دخول الإدارة
            </Button>
          ) : (
            <div className="space-y-4">
              <input
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                  تأكيد
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordInput(false);
                    setPassword('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg"
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* الترويسة */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">لوحة التحكم الإدارية</h1>
          <Button
            onClick={handleAdminLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* أزرار الأقسام */}
          <button
            onClick={() => setAdminState({ ...adminState, currentSection: 'consultants' })}
            className={`p-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              adminState.currentSection === 'consultants'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            المستشارون
          </button>

          <button
            onClick={() => setAdminState({ ...adminState, currentSection: 'stores' })}
            className={`p-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              adminState.currentSection === 'stores'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Store className="w-5 h-5" />
            المتاجر
          </button>

          <button
            onClick={() => setAdminState({ ...adminState, currentSection: 'points' })}
            className={`p-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              adminState.currentSection === 'points'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Coins className="w-5 h-5" />
            النقاط
          </button>

          <button
            onClick={() => setAdminState({ ...adminState, currentSection: 'bookings' })}
            className={`p-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              adminState.currentSection === 'bookings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            الحجوزات
          </button>

          <button
            onClick={() => setAdminState({ ...adminState, currentSection: 'messages' })}
            className={`p-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              adminState.currentSection === 'messages'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            الرسائل
          </button>
        </div>

        {/* محتوى الأقسام */}
        <div className="bg-white rounded-lg shadow p-6">
          {adminState.currentSection === 'consultants' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">إدارة المستشارين</h2>
              <p className="text-gray-600 mb-4">قريباً: إضافة وتعديل وحذف المستشارين</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                إضافة مستشار جديد
              </Button>
            </div>
          )}

          {adminState.currentSection === 'stores' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">إدارة المتاجر</h2>
              <p className="text-gray-600 mb-4">قريباً: إنشاء وتعديل وحذف المتاجر</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                إنشاء متجر جديد
              </Button>
            </div>
          )}

          {adminState.currentSection === 'points' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">إدارة النقاط والرصيد المالي</h2>
              <p className="text-gray-600 mb-4">قريباً: التحكم في النقاط والرصيد المالي للمستخدمين</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                إدارة النقاط
              </Button>
            </div>
          )}

          {adminState.currentSection === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">عرض الحجوزات</h2>
              <p className="text-gray-600 mb-4">قريباً: عرض وإدارة جميع الحجوزات والطلبات</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                تحديث الحجوزات
              </Button>
            </div>
          )}

          {adminState.currentSection === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">رسائل التواصل</h2>
              <p className="text-gray-600 mb-4">قريباً: عرض والرد على رسائل التواصل</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                تحديث الرسائل
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
