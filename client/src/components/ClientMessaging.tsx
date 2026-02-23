'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientMessage {
  id: string;
  text: string;
  timestamp: number;
  isFromAdmin: boolean;
}

interface ClientConversation {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  messages: ClientMessage[];
  lastMessageTime: number;
}

export default function ClientMessaging() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<ClientConversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // تحميل المحادثة من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('clientConversation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversation(parsed);
        setShowForm(false);
        setFormData({ name: parsed.senderName, email: parsed.senderEmail, phone: parsed.senderPhone });
      } catch (error) {
        console.error('خطأ في تحميل المحادثة:', error);
      }
    }
  }, []);

  // تحديث الرسالل من localStorage باستمرار
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('clientConversation');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConversation(parsed);
        } catch (error) {
          console.error('خطأ في تحديث الرسالل:', error);
        }
      }
    }, 1000); // تحديث كل ثانية
    return () => clearInterval(interval);
  }, []);

  // تمرير تلقائي للرسالة الأخيرة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleStartConversation = () => {
    if (!formData.name.trim()) {
      alert('يرجى إدخال اسمك');
      return;
    }

    const newConversation: ClientConversation = {
      id: Date.now().toString(),
      senderName: formData.name,
      senderEmail: 'hidden',
      senderPhone: 'hidden',
      messages: [],
      lastMessageTime: Date.now()
    };

    setConversation(newConversation);
    localStorage.setItem('clientConversation', JSON.stringify(newConversation));
    setShowForm(false);

    // حفظ أيضاً في قائمة الرسائل للإدارة
    const allMessages = JSON.parse(localStorage.getItem('directMessages') || '[]');
    const existingIndex = allMessages.findIndex((m: any) => m.senderEmail === formData.email);
    
    if (existingIndex === -1) {
      allMessages.push(newConversation);
    }
    localStorage.setItem('directMessages', JSON.stringify(allMessages));
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !conversation) return;

    const updated = {
      ...conversation,
      messages: [
        ...conversation.messages,
        {
          id: Date.now().toString(),
          text: messageText,
          timestamp: Date.now(),
          isFromAdmin: false
        }
      ],
      lastMessageTime: Date.now()
    };

    setConversation(updated);
    localStorage.setItem('clientConversation', JSON.stringify(updated));

    // تحديث في قائمة الرسائل للإدارة
    const allMessages = JSON.parse(localStorage.getItem('directMessages') || '[]');
    const index = allMessages.findIndex((m: any) => m.senderEmail === conversation.senderEmail);
    if (index !== -1) {
      allMessages[index] = updated;
      localStorage.setItem('directMessages', JSON.stringify(allMessages));
    }

    setMessageText('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition transform hover:scale-110 z-40"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl flex flex-col max-h-96 z-50">
      {/* رأس النافذة */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h3 className="font-bold">دعم العملاء</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-green-700 p-1 rounded transition"
        >
          <X size={20} />
        </button>
      </div>

      {showForm ? (
        // نموذج البيانات الأولية
        <div className="p-4 space-y-3 overflow-y-auto">
          <p className="text-sm text-gray-600">يرجى إدخال بيانات التواصل:</p>
          <input
            type="text"
            placeholder="اسمك"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right"
            dir="rtl"
          />

          <Button
            onClick={handleStartConversation}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            ابدأ المحادثة
          </Button>
        </div>
      ) : conversation ? (
        <>
          {/* رأس المحادثة */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <p className="text-sm font-semibold text-gray-800">{conversation.senderName}</p>
          </div>

          {/* محتوى الرسائل */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {conversation.messages.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">ابدأ محادثتك معنا</p>
            ) : (
              conversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isFromAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.isFromAdmin
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* حقل الإرسال */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="اكتب رسالتك..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right text-sm"
                dir="rtl"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg disabled:opacity-50 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
