import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, LogOut, Users, Store, Coins, FileText, MessageSquare, ChevronRight, ChevronDown, Plus, Edit, Trash2, BookOpen, ArrowLeft } from 'lucide-react';

interface AdminUser {
  isAuthenticated: boolean;
  role: 'admin' | null;
}

interface AdminState {
  currentSection: 'consultants' | 'stores' | 'points' | 'bookings' | 'messages' | 'paths';
  expandedPath: string | null;
}

const PATHS_DATA = [
  {
    id: 'student',
    title: 'المسار الطلابي',
    icon: '📚',
    desc: 'دورات وتحضير للاختبارات',
    courses: [
      { name: 'دورة الرياضيات المتقدمة', duration: '12 أسبوع' },
      { name: 'دورة اللغة الإنجليزية', duration: '10 أسابيع' },
      { name: 'دورة العلوم', duration: '14 أسبوع' },
    ],
  },
  {
    id: 'employee',
    title: 'مسار الموظف',
    icon: '👔',
    desc: 'تطوير مهني وفرص عمل',
    courses: [
      { name: 'دورة القيادة والإدارة', duration: '8 أسابيع' },
      { name: 'دورة مهارات التواصل', duration: '6 أسابيع' },
      { name: 'دورة التطوير الذاتي', duration: '10 أسابيع' },
    ],
  },
  {
    id: 'trader',
    title: 'مسار التاجر',
    icon: '🛍️',
    desc: 'دعم المتاجر الإلكترونية',
    courses: [
      { name: 'دورة التجارة الإلكترونية', duration: '12 أسبوع' },
      { name: 'دورة التسويق الرقمي', duration: '10 أسابيع' },
      { name: 'دورة إدارة المبيعات', duration: '8 أسابيع' },
    ],
  },
  {
    id: 'entrepreneur',
    title: 'رائد الأعمال',
    icon: '🚀',
    desc: 'استشارات وتمويل',
    courses: [
      { name: 'دورة بدء المشروع', duration: '16 أسبوع' },
      { name: 'دورة التمويل والاستثمار', duration: '12 أسبوع' },
      { name: 'دورة التخطيط الاستراتيجي', duration: '14 أسبوع' },
    ],
  },
  {
    id: 'jobseeker',
    title: 'الباحث عن عمل',
    icon: '🎯',
    desc: 'فرص عمل وتطوير مهارات',
    courses: [
      { name: 'دورة إعداد السيرة الذاتية', duration: '4 أسابيع' },
      { name: 'دورة مهارات المقابلة', duration: '6 أسابيع' },
      { name: 'دورة تطوير المهارات المهنية', duration: '10 أسابيع' },
    ],
  },
  {
    id: 'researcher',
    title: 'الباحث',
    icon: '🔬',
    desc: 'موارد بحثية وتعاون',
    courses: [
      { name: 'دورة البحث العلمي', duration: '14 أسبوع' },
      { name: 'دورة كتابة الأوراق البحثية', duration: '10 أسابيع' },
      { name: 'دورة المنهجية البحثية', duration: '12 أسبوع' },
    ],
  },
];

export default function Admin({ onBack }: { onBack?: () => void }) {
  const [adminUser, setAdminUser] = useState<AdminUser>({ isAuthenticated: false, role: null });
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [adminState, setAdminState] = useState<AdminState>({
    currentSection: 'consultants',
    expandedPath: null,
  });

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
    setAdminState({
      currentSection: 'consultants',
      expandedPath: null,
    });
  };

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

  const sections = [
    { id: 'consultants', label: 'المستشارون', icon: Users },
    { id: 'stores', label: 'المتاجر', icon: Store },
    { id: 'points', label: 'النقاط', icon: Coins },
    { id: 'bookings', label: 'الحجوزات', icon: FileText },
    { id: 'paths', label: 'المسارات', icon: BookOpen },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50" dir="rtl">
      {/* الترويسة */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="w-full px-4 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">لوحة التحكم</h1>
            <Button
              onClick={handleAdminLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </header>

      {/* المحتوى */}
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* أزرار الأقسام */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = adminState.currentSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setAdminState({ ...adminState, currentSection: section.id as any, expandedPath: null })}
                  className={`p-4 rounded-lg font-bold flex flex-col items-center justify-center gap-2 transition-all duration-200 text-xs md:text-sm ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-center">{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* محتوى الأقسام */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 min-h-96">
            {/* قسم المستشارون */}
            {adminState.currentSection === 'consultants' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">إدارة المستشارين</h2>
                <p className="text-gray-600">قريباً: إضافة وتعديل وحذف المستشارين</p>
                <div className="flex gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة مستشار
                  </Button>
                </div>
              </div>
            )}

            {/* قسم المتاجر */}
            {adminState.currentSection === 'stores' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">إدارة المتاجر</h2>
                <p className="text-gray-600">قريباً: إنشاء وتعديل وحذف المتاجر</p>
                <div className="flex gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    إنشاء متجر
                  </Button>
                </div>
              </div>
            )}

            {/* قسم النقاط */}
            {adminState.currentSection === 'points' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">إدارة النقاط</h2>
                <p className="text-gray-600">قريباً: التحكم في النقاط والرصيد المالي</p>
                <div className="flex gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة نقاط
                  </Button>
                </div>
              </div>
            )}

            {/* قسم الحجوزات */}
            {adminState.currentSection === 'bookings' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">الحجوزات</h2>
                <p className="text-gray-600">قريباً: عرض وإدارة الحجوزات</p>
              </div>
            )}

            {/* قسم المسارات */}
            {adminState.currentSection === 'paths' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">إدارة المسارات</h2>
                <div className="space-y-3">
                  {PATHS_DATA.map((path) => (
                    <div key={path.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setAdminState({
                          ...adminState,
                          expandedPath: adminState.expandedPath === path.id ? null : path.id
                        })}
                        className="w-full bg-gray-50 hover:bg-gray-100 p-4 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3 text-right flex-1">
                          <span className="text-2xl">{path.icon}</span>
                          <div>
                            <h3 className="font-bold text-gray-800">{path.title}</h3>
                            <p className="text-sm text-gray-600">{path.desc}</p>
                          </div>
                        </div>
                        {adminState.expandedPath === path.id ? (
                          <ChevronDown className="w-5 h-5 text-blue-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {adminState.expandedPath === path.id && (
                        <div className="bg-white p-4 border-t border-gray-200 space-y-3">
                          {path.courses.map((course, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                              <div className="text-right">
                                <p className="font-semibold text-gray-800">{course.name}</p>
                                <p className="text-sm text-gray-600">المدة: {course.duration}</p>
                              </div>
                              <div className="flex gap-2">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">
                            <Plus className="w-4 h-4 mr-2" />
                            إضافة دورة
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* قسم الرسائل */}
            {adminState.currentSection === 'messages' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">الرسائل</h2>
                <p className="text-gray-600">قريباً: عرض والرد على الرسائل</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* زر العودة */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-40"
          title="Back to Home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
