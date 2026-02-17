/**
 * دوال مساعدة للدردشة
 */

import emailjs from '@emailjs/browser';

export const initializeEmailJS = () => {
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (emailjsPublicKey) {
    emailjs.init(emailjsPublicKey);
    console.log('✅ تم تهيئة EmailJS بنجاح');
  } else {
    console.error('❌ مفتاح EmailJS العام غير موجود');
  }
};

export const sendEmailNotification = async (subject: string, data: any) => {
  try {
    const templateParams = {
      to_email: 'khaled139925@gmail.com',
      subject: subject,
      message: data.message || JSON.stringify(data),
      timestamp: new Date().toLocaleString('ar-SA'),
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
      templateParams
    );

    console.log('✅ تم إرسال البريد بنجاح:', response);
    return true;
  } catch (error) {
    console.error('❌ خطأ في إرسال البريد:', error);
    return false;
  }
};
