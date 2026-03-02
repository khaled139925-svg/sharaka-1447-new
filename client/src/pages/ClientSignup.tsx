import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Lock, Phone, User, ArrowLeft } from 'lucide-react';
interface ClientSignupProps {
  onNavigate?: (page: 'home' | 'client-signup' | 'consultant-signup') => void;
}

export default function ClientSignup({ onNavigate }: ClientSignupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const isRTL = language === 'ar';

  const translations = {
    ar: {
      title: 'تسجيل عميل جديد',
      subtitle: 'انضم إلى منصة الاستشارات',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      signup: 'إنشاء حساب',
      haveAccount: 'هل لديك حساب بالفعل؟',
      login: 'تسجيل الدخول',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      fillAllFields: 'يرجى ملء جميع الحقول',
      signupSuccess: 'تم التسجيل بنجاح! جاري التحويل...',
      english: 'English',
      arabic: 'العربية',
      back: 'رجوع',
    },
    en: {
      title: 'New Client Registration',
      subtitle: 'Join our consulting platform',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signup: 'Create Account',
      haveAccount: 'Already have an account?',
      login: 'Sign In',
      passwordMismatch: 'Passwords do not match',
      fillAllFields: 'Please fill in all fields',
      signupSuccess: 'Registration successful! Redirecting...',
      english: 'English',
      arabic: 'العربية',
      back: 'Back',
    },
  };

  const t = translations[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError(t.fillAllFields);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to register client
      console.log('Client signup:', formData);
      alert(t.signupSuccess);
      navigate('/');
    } catch (err) {
      setError('حدث خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
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
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">{t.title}</h1>
            <p className="text-gray-600 text-center mb-8">{t.subtitle}</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    {t.name}
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {t.email}
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {t.phone}
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.phone}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    {t.password}
                  </div>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.password}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    {t.confirmPassword}
                  </div>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t.confirmPassword}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {loading ? 'جاري التسجيل...' : t.signup}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t.haveAccount}{' '}
                <button
                  onClick={() => onNavigate?.('home')}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  {t.login}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
