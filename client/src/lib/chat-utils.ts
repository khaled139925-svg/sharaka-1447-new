/**
 * دوال مساعدة للدردشة
 */

export const initializeEmailJS = () => {
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (emailjsPublicKey) {
    const emailjs = require('@emailjs/browser');
    emailjs.init(emailjsPublicKey);
  }
};

export const sendEmailNotification = async (subject: string, data: any) => {
  try {
    const emailjs = require('@emailjs/browser');
    
    const templateParams = {
      to_email: 'khaled139925@gmail.com',
      subject: subject,
      message: data.message || JSON.stringify(data),
      timestamp: new Date().toLocaleString('ar-SA'),
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ تم إرسال البريد بنجاح:', response);
    return true;
  } catch (error) {
    console.error('❌ خطأ في إرسال البريد:', error);
    return false;
  }
};
