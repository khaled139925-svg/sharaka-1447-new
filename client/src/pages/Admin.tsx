import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, LogOut, Users, Store, Coins, FileText, MessageSquare, ChevronRight } from 'lucide-react';

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

  const ADMIN_PASSWORD = 'tariq';

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
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">لوحة التحكم</h1>
          <p className="text-center text-gray-500 mb-8 text-sm">Admin Control Panel</p>

          {!showPasswordInput ? (
            <Button
              onClick={() => setShowPasswordInput(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              دخول الإدارة
            </Button>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              <input
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  تأكيد
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordInput(false);
                    setPassword('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-all duration-300"
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

  const sections = [
    { id: 'consultants', label: 'المستشارون', icon: Users },
    { id: 'stores', label: 'المتاجر', icon: Store },
    { id: 'points', label: 'النقاط', icon: Coins },
    { id: 'bookings', label: 'الحجوزات', icon: FileText },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* الترويسة */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">لوحة التحكم الإدارية</h1>
          <Button
            onClick={handleAdminLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* أزرار الأقسام */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = adminState.currentSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setAdminState({ ...adminState, currentSection: section.id as any })}
                className={`p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* محتوى الأقسام */}
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-96 animate-fadeIn">
          {adminState.currentSection === 'consultants' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  إدارة المستشارين
                </h2>
              </div>
              <p className="text-gray-600 text-lg">قريباً: إضافة وتعديل وحذف المستشارين وإدارة بياناتهم</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  إضافة مستشار جديد
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  عرض المستشارين
                </Button>
              </div>
            </div>
          )}

          {adminState.currentSection === 'stores' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Store className="w-8 h-8 text-blue-600" />
                  إدارة المتاجر
                </h2>
              </div>
              <p className="text-gray-600 text-lg">قريباً: إنشاء وتعديل وحذف المتاجر وإدارة منتجاتها</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  إنشاء متجر جديد
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  عرض المتاجر
                </Button>
              </div>
            </div>
          )}

          {adminState.currentSection === 'points' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Coins className="w-8 h-8 text-blue-600" />
                  إدارة النقاط والرصيد المالي
                </h2>
              </div>
              <p className="text-gray-600 text-lg">قريباً: التحكم في النقاط والرصيد المالي للمستخدمين</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  إضافة نقاط
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  عرض الرصيد
                </Button>
              </div>
            </div>
          )}

          {adminState.currentSection === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  عرض الحجوزات والطلبات
                </h2>
              </div>
              <p className="text-gray-600 text-lg">قريباً: عرض وإدارة جميع الحجوزات والطلبات الجديدة</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  الحجوزات الجديدة
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  جميع الحجوزات
                </Button>
              </div>
            </div>
          )}

          {adminState.currentSection === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                  رسائل التواصل
                </h2>
              </div>
              <p className="text-gray-600 text-lg">قريباً: عرض والرد على رسائل التواصل من العملاء</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  الرسائل الجديدة
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  جميع الرسائل
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
