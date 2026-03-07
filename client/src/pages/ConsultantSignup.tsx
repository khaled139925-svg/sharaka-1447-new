import { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Phone, User, ArrowLeft, Briefcase, DollarSign } from 'lucide-react';
interface ConsultantSignupProps {
  onNavigate?: (page: 'home' | 'client-signup' | 'consultant-signup') => void;
}

export default function ConsultantSignup({ onNavigate }: ConsultantSignupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
  // Basic Info
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',

  // Professional Info
  specialization: '',
  yearsOfExperience: '',
  hourlyRate: '',
  bio: '',
  certifications: '',
  languages: '',

  // Business Info
  entityType: '',
  entityName: '',
  website: '',

  // Media
  photo: null,
});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const isRTL = language === 'ar';

  const translations = {
    ar: {
      title: 'تسجيل مستشار جديد',
      subtitle: 'انضم إلى شبكة المستشارين',
      step1: 'المعلومات الأساسية',
      step2: 'المعلومات المهنية',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      specialization: 'التخصص',
      yearsOfExperience: 'سنوات الخبرة',
      hourlyRate: 'السعر بالساعة (ريال)',
      bio: 'السيرة الذاتية',
      certifications: 'الشهادات والتراخيص',
      languages: 'اللغات',
      signup: 'إنشاء حساب',
      next: 'التالي',
      previous: 'السابق',
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
      title: 'New Consultant Registration',
      subtitle: 'Join our consultant network',
      step1: 'Basic Information',
      step2: 'Professional Information',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      specialization: 'Specialization',
      yearsOfExperience: 'Years of Experience',
      hourlyRate: 'Hourly Rate (SAR)',
      bio: 'Biography',
      certifications: 'Certifications & Licenses',
      languages: 'Languages',
      signup: 'Create Account',
      next: 'Next',
      previous: 'Previous',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = () => {
  return true;
};

  const handleNext = () => {
    if (validateStep()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // if (!validateStep()) return;

  setLoading(true);

  try {
      // TODO: Call API to register consultant
    const { error } = await supabase
  .from("consultants")
  .insert([
    {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization,
      years_of_experience: formData.yearsOfExperience,
      hourly_rate: formData.hourlyRate,
      bio: formData.bio,
      certifications: formData.certifications,
      languages: formData.languages,
      entity_type: formData.entityType,
      entity_name: formData.entityName,
      country: formData.country,
      city: formData.city,
      website: formData.website
    }
  ]);

if (error) {
  throw error;
}
      alert(t.signupSuccess);
      navigate('/');
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ في التسجيل' : 'Registration error occurred');
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

            {/* Step Indicator */}
            <div className="flex gap-2 mb-8">
              <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.step1}</h2>

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

                  {/* Next Button */}
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    {t.next}
                  </Button>
                </>
              )}

              {/* Step 2: Professional Information */}
              {step === 2 && (
                <>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.step2}</h2>

                  {/* Specialization Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        {t.specialization}
                      </div>
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder={t.specialization}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.yearsOfExperience}
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      placeholder={t.yearsOfExperience}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        {t.hourlyRate}
                      </div>
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      placeholder={t.hourlyRate}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.bio}
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder={t.bio}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Certifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.certifications}
                    </label>
                    <input
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      placeholder={t.certifications}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.languages}
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      placeholder={t.languages}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
{/* Profile Photo */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    الصورة الشخصية
  </label>

  <input
    type="file"
    accept="image/*"
    capture="environment"
    onChange={(e) =>
      setFormData({
        ...formData,
        photo: e.target.files?.[0] || null
      })
    }
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  />
</div>

{/* Entity Type */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    نوع النشاط المهني
  </label>

  <select
    value={formData.entityType}
    onChange={(e) =>
      setFormData({ ...formData, entityType: e.target.value })
    }
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  >
    <option value="">اختر نوع النشاط</option>
    <option value="independent">مستشار مستقل</option>
<option value="company">شركة</option>
<option value="consulting_office">مكتب استشارات</option>
<option value="store">متجر</option>
<option value="ecommerce">متجر إلكتروني</option>
<option value="training_center">مركز تدريب</option>
<option value="organization">مؤسسة</option>
<option value="other">أخرى</option>
  </select>
</div>

{/* Entity Name */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    اسم النشاط المهني
  </label>

  <input
    type="text"
    value={formData.entityName}
    onChange={(e) =>
      setFormData({ ...formData, entityName: e.target.value })
    }
    placeholder="مثال: شركة الريادة للاستشارات"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  />
</div>
{/* Country */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    الدولة
  </label>

  <input
    type="text"
    value={formData.country || ""}
    onChange={(e) =>
      setFormData({ ...formData, country: e.target.value })
    }
    placeholder="مثال: السعودية"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  />
</div>

{/* City */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    المدينة
  </label>

  <input
    type="text"
    value={formData.city || ""}
    onChange={(e) =>
      setFormData({ ...formData, city: e.target.value })
    }
    placeholder="مثال: الرياض"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  />
</div>

{/* Website */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    الموقع الإلكتروني
  </label>

  <input
    type="text"
    value={formData.website}
    onChange={(e) =>
      setFormData({ ...formData, website: e.target.value })
    }
    placeholder="https://example.com"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  />
</div>
                  {/* Buttons */}
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
                    >
                      {t.previous}
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      {loading ? 'جاري التسجيل...' : t.signup}
                    </Button>
                  </div>
                </>
              )}
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
