import React from 'react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from "../components/ui/button";
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
      signupSuccess: 'تم التسجيل بنجاح!',
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
      signupSuccess: 'Registration successful!',
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

    const { error } = await supabase.from("clients").insert([
      {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      },
    ]);

    if (error) {
      console.log("ERROR:", error);
      alert(JSON.stringify(error));
      setLoading(false);
      return;
    }

    alert(t.signupSuccess);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          
          <button onClick={() => onNavigate?.('home')} className="flex items-center gap-2 text-indigo-600">
            <ArrowLeft size={20} />
            <span>{t.back}</span>
          </button>

          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-3 py-2 text-sm bg-gray-100 rounded-lg"
          >
            {language === 'ar' ? t.english : t.arabic}
          </button>

        </div>
      </header>

      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">

          <h1 className="text-2xl font-bold text-center mb-4">{t.title}</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input name="name" placeholder={t.name} value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="email" placeholder={t.email} value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="phone" placeholder={t.phone} value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="password" name="password" placeholder={t.password} value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="password" name="confirmPassword" placeholder={t.confirmPassword} value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded" />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '...' : t.signup}
            </Button>

          </form>

        </div>
      </div>
    </div>
  );
}