import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, LogOut, ChevronRight, ArrowLeft } from 'lucide-react';
import AdminMessaging from '@/components/AdminMessaging';

interface AdminUser {
  isAuthenticated: boolean;
  role: 'admin' | null;
}

const SECTIONS = [
  {
    id: 'consultants',
    title: 'المستشارون',
    icon: '👨‍💼',
    buttons: [
      { label: 'تسجيل مستشار', action: 'create' },
      { label: 'عرض المستشارين', action: 'view' }
    ]
  },
  {
    id: 'stores',
    title: 'المتاجر',
    icon: '🏪',
    buttons: [
      { label: 'إنشاء متجر', action: 'create' },
      { label: 'عرض المتاجر', action: 'view' }
    ]
  },
  {
    id: 'points',
    title: 'النقاط',
    icon: '⭐',
    buttons: [
      { label: 'إضافة نقاط', action: 'create' },
      { label: 'عرض النقاط', action: 'view' }
    ]
  },
  {
    id: 'bookings',
    title: 'الحجوزات',
    icon: '📅',
    buttons: [
      { label: 'إنشاء حجز', action: 'create' },
      { label: 'عرض الحجوزات', action: 'view' }
    ]
  },
  {
    id: 'paths',
    title: 'المسارات',
    icon: '🛤️',
    buttons: [
      { label: 'إضافة مسار', action: 'create' },
      { label: 'عرض المسارات', action: 'view' }
    ]
  },
  {
    id: 'messages',
    title: 'الرسائل',
    icon: '💬',
    buttons: [
      { label: 'إرسال رسالة', action: 'create' },
      { label: 'عرض الرسائل', action: 'view' }
    ]
  }
];

export default function Admin({ onBack, onNavigate }: { onBack?: () => void; onNavigate?: (page: string) => void }) {
  const [adminUser, setAdminUser] = useState<AdminUser>({ isAuthenticated: false, role: null });
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleAdminLogin = () => {
    if (password === 'tariq') {
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
    setSelectedSection(null);
  };

  const handleButtonClick = (sectionId: string, action: string) => {
    console.log('handleButtonClick called:', sectionId, action, 'onNavigate:', !!onNavigate);
    if (sectionId === 'stores' && action === 'view') {
      if (onNavigate) {
        console.log('Calling onNavigate with stores-management');
        onNavigate('stores-management');
      }
    } else if (sectionId === 'stores' && action === 'create') {
      if (onNavigate) {
        console.log('Calling onNavigate with create-new-store');
        onNavigate('create-new-store');
      }
    } else if (sectionId === 'messages' && action === 'view') {
      setSelectedSection('messages-view');
    }
  };

  // شاشة تسجيل الدخول
  if (!adminUser.isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
            >
              دخول الإدارة
            </Button>
          ) : (
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="أدخل كلمة المرور"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
                >
                  دخول
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordInput(false);
                    setPassword('');
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg"
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

  // شاشة عرض الرسائل
  if (selectedSection === 'messages-view') {
    return (
      <div className="h-screen w-full bg-gray-50 flex flex-col">
        <header className="w-full bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">إدارة الرسائل</h1>
            <div className="flex gap-4">
              <Button
                onClick={() => setSelectedSection(null)}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة
              </Button>
              <Button
                onClick={handleAdminLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </header>
        <AdminMessaging />
      </div>
    );
  }

  // شاشة عرض القسم المختار
  if (selectedSection) {
    const section = SECTIONS.find(s => s.id === selectedSection);
    if (!section) return null;

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        {/* الترويسة */}
        <header className="w-full bg-white shadow-md mb-8 rounded-lg">
          <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">لوحة التحكم</h1>
            <Button
              onClick={handleAdminLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </header>

        <div className="w-full max-w-2xl">
          {/* رأس القسم */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {section.icon} {section.title}
            </h1>
            <p className="text-gray-600">إدارة {section.title.toLowerCase()}</p>
          </div>

          {/* أزرار الإجراءات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {section.buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleButtonClick(section.id, btn.action)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                {btn.label}
                <ChevronRight size={20} />
              </button>
            ))}
          </div>

          {/* زر العودة للأقسام */}
          <button
            onClick={() => setSelectedSection(null)}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            العودة للأقسام
          </button>
        </div>
      </div>
    );
  }

  // شاشة الأقسام الرئيسية
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* الترويسة */}
      <header className="w-full bg-white shadow-md mb-8 rounded-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">لوحة التحكم</h1>
          <Button
            onClick={handleAdminLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <div className="w-full max-w-4xl">
        {/* رأس الصفحة */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">إدارة المنصة</h1>
          <p className="text-xl text-gray-600">اختر القسم الذي تريد إدارته</p>
        </div>

        {/* شبكة الأقسام */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className="bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-lg p-8 transition-all duration-300 transform hover:scale-105 text-right shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-800">{section.title}</h3>
                  <p className="text-gray-600 mt-2">إدارة {section.title.toLowerCase()}</p>
                </div>
                <span className="text-5xl">{section.icon}</span>
              </div>
            </button>
            ))}
          </div>

        {/* زر العودة للرئيسية */}
        {onBack && (
          <button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            <ArrowLeft size={24} />
            العودة للرئيسية
          </button>
        )}
      </div>
    </div>
  );
}
