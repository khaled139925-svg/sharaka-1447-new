import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

// جميع النصوص التي نحتاج ترجمتها
const translations: Translations = {
  // عام
  appName: { ar: 'شراكة', en: 'Sharaka' },
  tagline: { ar: 'منصة إلكترونية شاملة لكل الأنشطة والخدمات', en: 'Comprehensive platform for all activities and services' },
  login: { ar: 'دخول', en: 'Login' },
  signup: { ar: 'تسجيل', en: 'Sign up' },
  logout: { ar: 'تسجيل خروج', en: 'Logout' },
  adminPanel: { ar: '🛠️ لوحة التحكم', en: '🛠️ Admin Panel' },
  profile: { ar: 'الملف الشخصي', en: 'Profile' },
  editProfile: { ar: 'تعديل الحساب', en: 'Edit Profile' },
  addStore: { ar: 'إضافة متجر', en: 'Add Store' },
  invoices: { ar: 'فواتيري', en: 'My Invoices' },
  followers: { ar: 'متابع', en: 'Follower' },
  following: { ar: 'يتابع', en: 'Following' },
  posts: { ar: 'منشورات', en: 'Posts' },
  noPosts: { ar: 'لا توجد منشورات بعد', en: 'No posts yet' },
  noBio: { ar: 'لا يوجد نبذة', en: 'No bio' },
  noSpecialty: { ar: 'بدون تخصص', en: 'No specialty' },
  noPhone: { ar: 'غير مضاف', en: 'Not added' },
  noEmail: { ar: 'غير مضاف', en: 'Not added' },
  
  // تسجيل الدخول
  loginTitle: { ar: 'تسجيل الدخول', en: 'Login' },
  email: { ar: 'البريد الإلكتروني', en: 'Email' },
  password: { ar: 'كلمة المرور', en: 'Password' },
  forgotPassword: { ar: 'نسيت كلمة المرور؟', en: 'Forgot password?' },
  loginError: { ar: 'الإيميل أو كلمة المرور غير صحيحة', en: 'Incorrect email or password' },
  accountFrozen: { ar: 'هذا الحساب مجمد، رجاء التواصل مع الإدارة', en: 'This account is frozen, contact admin' },
  
  // التسجيل (نافذة التسجيل المنبثقة في Home والتسجيل المنفصل)
  signupTitle: { ar: 'إنشاء حساب جديد', en: 'Create new account' },
  fullName: { ar: 'الاسم الكامل', en: 'Full name' },
  phone: { ar: 'رقم الجوال', en: 'Phone number' },
  specialty: { ar: 'التخصص (اختياري)', en: 'Specialty (optional)' },
  bio: { ar: 'نبذة عنك (اختياري)', en: 'Bio (optional)' },
  register: { ar: 'تسجيل', en: 'Register' },
  registerSuccess: { ar: 'تم التسجيل بنجاح، يمكنك الآن تسجيل الدخول', en: 'Registration successful, you can now log in' },
  emailRequired: { ar: 'الاسم والإيميل وكلمة المرور إجبارية', en: 'Name, email and password are required' },
  phoneRequired: { ar: 'رقم الجوال إجباري', en: 'Phone number is required' },
  emailExists: { ar: 'هذا البريد مسجل مسبقًا', en: 'Email already registered' },
  avatarUploadFail: { ar: 'فشل رفع الصورة', en: 'Failed to upload image' },
  chooseCountryCode: { ar: 'اختر مفتاح الدولة', en: 'Select country code' },
  enterPhone: { ar: 'أدخل رقم الجوال', en: 'Enter phone number' },
  phoneHint: { ar: '📌 اختر مفتاح الدولة ثم أدخل رقم الجوال', en: '📌 Select country code then enter phone number' },
  
  // الفلاتر
  allCountries: { ar: '🌍 جميع البلدان', en: '🌍 All countries' },
  noCountries: { ar: '⚠️ لا توجد بلدان مسجلة بعد', en: '⚠️ No countries registered yet' },
  
  // عام في البطاقات
  followersCount: { ar: 'متابع', en: 'Followers' },
  
  // أزرار
  close: { ar: 'إغلاق', en: 'Close' },
  back: { ar: 'رجوع', en: 'Back' },
  
  // فاتورة
  createInvoice: { ar: '🧾 أفادير', en: '🧾 Invoice' },
  sendInvoice: { ar: 'إرسال الفاتورة', en: 'Send invoice' },
  receiverName: { ar: 'اسم المستلم', en: 'Receiver name' },
  receiverPhone: { ar: 'رقم الجوال', en: 'Phone number' },
  service: { ar: 'الخدمة', en: 'Service' },
  price: { ar: 'السعر', en: 'Price' },
  paymentMethod: { ar: 'طريقة الدفع', en: 'Payment method' },
  invoiceSent: { ar: '✅ تم إرسال الفاتورة وحفظها', en: '✅ Invoice sent and saved' },
  invoiceFailed: { ar: '❌ فشل إرسال الفاتورة', en: '❌ Failed to send invoice' },
  
  // تفاعلات
  like: { ar: 'إعجاب', en: 'Like' },
  comment: { ar: 'تعليق', en: 'Comment' },
  writeComment: { ar: 'اكتب تعليقاً...', en: 'Write a comment...' },
  postComment: { ar: 'نشر', en: 'Post' },
  
  // إضافات عامة
  loading: { ar: 'جاري التحميل...', en: 'Loading...' },
  checking: { ar: 'جاري التحقق...', en: 'Checking...' },
  noUsers: { ar: 'لا يوجد مستخدمون', en: 'No users found' },
};

type LanguageContextType = {
  lang: Language;
  t: (key: string) => string;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('ar');
  
  const t = (key: string): string => {
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return key; // fallback
  };
  
  const toggleLanguage = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };
  
  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};