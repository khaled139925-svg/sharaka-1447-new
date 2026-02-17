'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import emailjs from '@emailjs/browser';
import { chatService } from '@/lib/chat-service';
import { MessageCircle } from 'lucide-react';

const LOGO_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663333045223/nOdruZWcjEkuqgXg.jpeg';
const USER_EMAIL = 'khaled139925@gmail.com';

const translations = {
  ar: {
    platformName: 'منصة الخدمات المتكاملة',
    description: 'نربط الخبرات بالفرص، نوفر الاستشارات، سوق إلكتروني، خدمات تعهيد وعمل عن بعد',
    chatSupport: 'دعم فوري',
    chatMessage: 'مرحبا! كيف يمكننا مساعدتك؟',
    chatClose: 'إغلاق',
    typeMessage: 'اكتب رسالتك...',
    allRights: 'جميع الحقوق محفوظة',
  },
  en: {
    platformName: 'Integrated Services Platform',
    description: 'We connect expertise with opportunities, provide consultations, e-commerce marketplace, outsourcing services and remote work',
    chatSupport: 'Live Support',
    chatMessage: 'Hello! How can we help you?',
    chatClose: 'Close',
    typeMessage: 'Type your message...',
    allRights: 'All rights reserved',
  }
};

const sendEmailNotification = async (subject: string, data: any) => {
  try {
    console.log('محاولة إرسال البريد الإلكتروني...', {
      service: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    });

    const templateParams = {
      to_email: USER_EMAIL,
      subject: subject,
      message: data.message || JSON.stringify(data),
      timestamp: new Date().toLocaleString('ar-SA'),
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      console.log(`✅ تم إرسال البريد بنجاح إلى ${USER_EMAIL}`);
      return true;
    } else {
      console.error('❌ فشل إرسال البريد');
      return false;
    }
  } catch (error) {
    console.error('خطأ في إرسال البريد:', error);
    return false;
  }
};

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const t = translations[language];
  const isRTL = language === 'ar';

  // تهيئة EmailJS
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    console.log('تهيئة EmailJS...', { publicKey: publicKey ? 'موجود' : 'غير موجود' });
    if (publicKey) {
      emailjs.init(publicKey);
      console.log('✅ تم تهيئة EmailJS بنجاح');
    } else {
      console.error('❌ مفتاح EmailJS العام غير موجود');
    }
  }, []);

  // تحميل الرسائل السابقة عند فتح الدردشة
  useEffect(() => {
    if (showChatWidget) {
      const currentSession = chatService.getCurrentSession();
      if (currentSession) {
        setChatMessages(currentSession.messages);
        setConversationId(currentSession.id);
      }
    }
  }, [showChatWidget]);

  const handleChatSend = async () => {
    if (!chatMessage.trim()) return;

    try {
      setIsLoadingChat(true);

      // إذا لم تكن هناك جلسة، أنشئ واحدة جديدة
      if (!conversationId) {
        const newSession = chatService.createSession({
          userName: 'زائر',
          userEmail: 'visitor@sharaka.com',
          subject: 'رسالة من الدردشة الفورية',
        });
        setConversationId(newSession.id);
      }

      // أضف الرسالة إلى الجلسة المحلية
      const newMessage = chatService.addMessage(chatMessage, 'user');
      setChatMessages(prev => [...prev, newMessage]);

      // أرسل البريد الإلكتروني
      const emailSent = await sendEmailNotification('رسالة دردشة فورية', {
        message: chatMessage,
        timestamp: new Date().toLocaleString('ar-SA')
      });

      if (!emailSent) {
        console.warn('⚠️ لم يتم إرسال البريد الإلكتروني');
      }

      setChatMessage('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      console.error('خطأ في إرسال الرسالة:', errorMessage);
      alert(`خطأ: ${errorMessage}`);
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} alt="Sharaka" className="h-16 w-auto object-contain" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage('ar')}
                  className={language === 'ar' ? 'bg-accent text-accent-foreground' : ''}
                >
                  العربية
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-accent text-accent-foreground' : ''}
                >
                  English
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t.platformName}</h1>
          <p className="text-lg text-foreground/70">{t.description}</p>
        </div>
      </main>

      {/* Chat Widget */}
      {showChatWidget && (
        <div className="fixed bottom-20 right-4 w-80 bg-card border border-border rounded-lg shadow-lg z-40">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">{t.chatSupport}</h3>
            <button
              onClick={() => setShowChatWidget(false)}
              className="text-primary-foreground hover:opacity-80"
            >
              ✕
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 bg-background">
            {chatMessages.length === 0 ? (
              <p className="text-center text-foreground/50 py-8">{t.chatMessage}</p>
            ) : (
              <div className="space-y-2">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border p-4 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleChatSend()}
              placeholder={t.typeMessage}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              disabled={isLoadingChat}
            />
            <Button
              onClick={handleChatSend}
              disabled={isLoadingChat || !chatMessage.trim()}
              size="sm"
            >
              {isLoadingChat ? '...' : '→'}
            </Button>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setShowChatWidget(!showChatWidget)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-40"
      >
        <MessageCircle size={24} />
      </button>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-foreground/70">
          <p>{t.allRights} © 2026 {t.platformName}</p>
        </div>
      </footer>
    </div>
  );
}
