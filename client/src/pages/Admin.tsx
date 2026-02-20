import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, LogOut, Users, Store, Coins, FileText, MessageSquare, ChevronRight, ChevronDown, Plus, Edit, Trash2, BookOpen } from 'lucide-react';

interface AdminUser {
  isAuthenticated: boolean;
  role: 'admin' | null;
}

interface AdminState {
  currentSection: 'consultants' | 'stores' | 'points' | 'bookings' | 'messages' | 'paths';
  consultants: any[];
  stores: any[];
  users: any[];
  bookings: any[];
  messages: any[];
  paths: any[];
  expandedPath: string | null;
}

const PATHS_DATA = [
  {
    id: 'student',
    title: 'المسار الطلابي',
    titleEn: 'Student Path',
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
    titleEn: 'Employee Path',
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
    titleEn: 'Trader Path',
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
    titleEn: 'Entrepreneur',
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
    titleEn: 'Job Seeker',
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
    titleEn: 'Researcher',
    icon: '🔬',
    desc: 'موارد بحثية وتعاون',
    courses: [
      { name: 'دورة البحث العلمي', duration: '14 أسبوع' },
      { name: 'دورة كتابة الأوراق البحثية', duration: '10 أسابيع' },
      { name: 'دورة المنهجية البحثية', duration: '12 أسبوع' },
    ],
  },
];

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
    paths: PATHS_DATA,
    expandedPath: null,
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
      paths: PATHS_DATA,
      expandedPath: null,
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
    { id: 'paths', label: 'المسارات', icon: BookOpen },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50" dir="rtl">
      {/* الترويسة */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600">لوحة التحكم الإدارية</h1>
          <Button
            onClick={handleAdminLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </Button>
        </div>
      </header>

      <div className="w-full px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
        {/* أزرار الأقسام */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mb-6 md:mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = adminState.currentSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setAdminState({ ...adminState, currentSection: section.id as any, expandedPath: null })}
                className={`p-3 md:p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 text-xs md:text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-center">{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* محتوى الأقسام */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 min-h-96 animate-fadeIn mt-6 md:mt-8">
          {/* قسم المستشارون */}
          {adminState.currentSection === 'consultants' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  إدارة المستشارين
                </h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg">قريباً: إضافة وتعديل وحذف المستشارين وإدارة بياناتهم</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  إضافة مستشار جديد
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  عرض المستشارين
                </Button>
              </div>
            </div>
          )}

          {/* قسم المتاجر */}
          {adminState.currentSection === 'stores' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Store className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  إدارة المتاجر
                </h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg">قريباً: إنشاء وتعديل وحذف المتاجر وإدارة منتجاتها</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  إنشاء متجر جديد
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  عرض المتاجر
                </Button>
              </div>
            </div>
          )}

          {/* قسم النقاط */}
          {adminState.currentSection === 'points' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Coins className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  إدارة النقاط والرصيد المالي
                </h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg">قريباً: التحكم في النقاط والرصيد المالي للمستخدمين</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  إضافة نقاط
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  عرض الرصيد
                </Button>
              </div>
            </div>
          )}

          {/* قسم الحجوزات */}
          {adminState.currentSection === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  عرض الحجوزات والطلبات
                </h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg">قريباً: عرض وإدارة جميع الحجوزات والطلبات الجديدة</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  الحجوزات الجديدة
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  جميع الحجوزات
                </Button>
              </div>
            </div>
          )}

          {/* قسم المسارات */}
          {adminState.currentSection === 'paths' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  إدارة المسارات التعليمية
                </h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg">إدارة المسارات التعليمية والدورات المتاحة</p>
              
              {/* قائمة المسارات */}
              <div className="space-y-3 md:space-y-4">
                {adminState.paths.map((path) => (
                  <div key={path.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* رأس المسار */}
                    <button
                      onClick={() => setAdminState({
                        ...adminState,
                        expandedPath: adminState.expandedPath === path.id ? null : path.id
                      })}
                      className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 flex items-center justify-between transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 flex-1 text-right">
                        <span className="text-2xl">{path.icon}</span>
                        <div className="text-right">
                          <h3 className="font-bold text-gray-800 text-base md:text-lg">{path.title}</h3>
                          <p className="text-gray-600 text-xs md:text-sm">{path.desc}</p>
                        </div>
                      </div>
                      {adminState.expandedPath === path.id ? (
                        <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {/* محتوى المسار */}
                    {adminState.expandedPath === path.id && (
                      <div className="bg-white p-4 md:p-6 border-t border-gray-200 space-y-4 animate-fadeIn">
                        {/* الدورات */}
                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            الدورات المتاحة
                          </h4>
                          <div className="space-y-2">
                            {path.courses.map((course, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="text-right flex-1">
                                  <p className="font-semibold text-gray-800 text-sm md:text-base">{course.name}</p>
                                  <p className="text-gray-500 text-xs md:text-sm">المدة: {course.duration}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* أزرار التحكم */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                            <Plus className="w-4 h-4" />
                            إضافة دورة
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                            <Edit className="w-4 h-4" />
                            تعديل المسار
                          </Button>
                          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                            <Trash2 className="w-4 h-4" />
                            حذف المسار
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* زر إضافة مسار جديد */}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-base">
                <Plus className="w-5 h-5" />
                إضافة مسار جديد
              </Button>
            </div>
          )}

          {/* قسم الرسائل */}
          {adminState.currentSection === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  رسائل التواصل
                </h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg">قريباً: عرض والرد على رسائل التواصل من العملاء</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  الرسائل الجديدة
                </Button>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  جميع الرسائل
                </Button>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
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
        body, html {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
