import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, X, MessageCircle } from 'lucide-react';

export interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  storeId?: string;
  storeName?: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  reply?: string;
  replyTimestamp?: number;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    storeId: '',
    storeName: '',
    message: ''
  });

  // تحميل الرسائل من localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('ownerMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('خطأ في تحميل الرسائل:', error);
      }
    }
  }, []);

  // حفظ الرسائل في localStorage
  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem('ownerMessages', JSON.stringify(msgs));
    setMessages(msgs);
  };

  // إضافة رسالة جديدة
  const handleSendMessage = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderName: formData.name,
      senderEmail: formData.email,
      senderPhone: formData.phone,
      storeId: formData.storeId,
      storeName: formData.storeName,
      message: formData.message,
      timestamp: Date.now(),
      isRead: false
    };

    const updatedMessages = [newMessage, ...messages];
    saveMessages(updatedMessages);
    
    // إعادة تعيين النموذج
    setFormData({
      name: '',
      email: '',
      phone: '',
      storeId: '',
      storeName: '',
      message: ''
    });
    setShowForm(false);
    alert('✅ تم إرسال الرسالة بنجاح');
  };

  // الرد على الرسالة
  const handleReply = () => {
    if (!selectedMessage || !replyText.trim()) {
      alert('يرجى كتابة الرد');
      return;
    }

    const updatedMessages = messages.map(msg => 
      msg.id === selectedMessage.id
        ? {
            ...msg,
            reply: replyText,
            replyTimestamp: Date.now(),
            isRead: true
          }
        : msg
    );

    saveMessages(updatedMessages);
    setSelectedMessage(updatedMessages.find(m => m.id === selectedMessage.id) || null);
    setReplyText('');
    alert('✅ تم إرسال الرد بنجاح');
  };

  // حذف الرسالة
  const handleDeleteMessage = (id: string) => {
    if (confirm('هل تريد حذف هذه الرسالة؟')) {
      const updatedMessages = messages.filter(msg => msg.id !== id);
      saveMessages(updatedMessages);
      setSelectedMessage(null);
    }
  };

  // تحديد الرسالة كمقروءة
  const handleMarkAsRead = (message: Message) => {
    if (!message.isRead) {
      const updatedMessages = messages.map(msg =>
        msg.id === message.id ? { ...msg, isRead: true } : msg
      );
      saveMessages(updatedMessages);
    }
    setSelectedMessage(message);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* قائمة الرسائل */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              الرسائل ({messages.length})
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-full mb-4 bg-blue-500 hover:bg-blue-600"
          >
            + رسالة جديدة
          </Button>

          {/* نموذج الرسالة الجديدة */}
          {showForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <input
                type="text"
                placeholder="اسمك"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف (اختياري)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="الرسالة"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleSendMessage}
                className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                إرسال
              </Button>
            </div>
          )}

          {/* قائمة الرسائل */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">لا توجد رسائل</p>
            ) : (
              messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleMarkAsRead(msg)}
                  className={`w-full text-right p-3 rounded-lg border-l-4 transition-all ${
                    selectedMessage?.id === msg.id
                      ? 'bg-blue-100 border-blue-500'
                      : msg.isRead
                      ? 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                      : 'bg-yellow-50 border-yellow-500 font-semibold'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{msg.senderName}</p>
                      <p className="text-xs text-gray-500">{msg.senderEmail}</p>
                      <p className="text-sm text-gray-700 line-clamp-2 mt-1">{msg.message}</p>
                    </div>
                    {!msg.isRead && (
                      <span className="w-2 h-2 bg-red-500 rounded-full ml-2 mt-1"></span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* تفاصيل الرسالة والرد */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">تفاصيل الرسالة</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* معلومات المرسل */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">معلومات المرسل</h4>
                <p className="text-gray-700"><strong>الاسم:</strong> {selectedMessage.senderName}</p>
                <p className="text-gray-700"><strong>البريد:</strong> {selectedMessage.senderEmail}</p>
                {selectedMessage.senderPhone && (
                  <p className="text-gray-700"><strong>الهاتف:</strong> {selectedMessage.senderPhone}</p>
                )}
                {selectedMessage.storeName && (
                  <p className="text-gray-700"><strong>المتجر:</strong> {selectedMessage.storeName}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(selectedMessage.timestamp).toLocaleString('ar-SA')}
                </p>
              </div>

              {/* الرسالة الأصلية */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-2">الرسالة</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* الرد إن وجد */}
              {selectedMessage.reply && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-800 mb-2">الرد</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.reply}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(selectedMessage.replyTimestamp || 0).toLocaleString('ar-SA')}
                  </p>
                </div>
              )}

              {/* نموذج الرد */}
              {!selectedMessage.reply && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">الرد على الرسالة</h4>
                  <textarea
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReply}
                      className="flex-1 bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      إرسال الرد
                    </Button>
                    <Button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      حذف الرسالة
                    </Button>
                  </div>
                </div>
              )}

              {selectedMessage.reply && (
                <Button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  حذف الرسالة
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <p>اختر رسالة لعرض التفاصيل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
