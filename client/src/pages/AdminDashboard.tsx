import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Lock, LogOut, MessageCircle, Trash2 } from 'lucide-react';
import { messagesService, Message } from '@/lib/supabase-messages';
import { sendEmailNotification } from '@/lib/chat-utils';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_PASSWORD = 'tariq';

  // التحقق من كلمة السر
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      loadMessages();
    } else {
      alert('كلمة السر غير صحيحة');
    }
  };

  // تحميل الرسائل
  const loadMessages = async () => {
    try {
      const data = await messagesService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error('خطأ في تحميل الرسائل:', error);
    }
  };

  // الرد على رسالة
  const handleReply = async () => {
    if (!replyText.trim() || selectedMessageId === null) return;

    try {
      setIsLoading(true);
      await messagesService.addMessage(replyText, 'admin', 'الإدارة', 'admin@sharaka.sa');
      
      // إرسال بريد إلكتروني
      await sendEmailNotification('رد من الإدارة', { message: replyText });
      
      setReplyText('');
      setSelectedMessageId(null);
      loadMessages();
    } catch (error) {
      console.error('خطأ في الرد:', error);
      alert('فشل الرد على الرسالة');
    } finally {
      setIsLoading(false);
    }
  };

  // حذف رسالة
  const handleDelete = async (id: number) => {
    if (!confirm('هل تريد حذف هذه الرسالة؟')) return;

    try {
      await messagesService.deleteMessage(id);
      loadMessages();
    } catch (error) {
      console.error('خطأ في حذف الرسالة:', error);
      alert('فشل حذف الرسالة');
    }
  };

  // تسجيل الخروج
  const handleLogout = () => {
    setIsAuthenticated(false);
    setMessages([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F46F2A]/10 to-[#2C3E68]/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock className="w-6 h-6 text-[#2C3E68]" />
            <h1 className="text-2xl font-bold text-[#2C3E68]">لوحة التحكم</h1>
          </div>
          
          <p className="text-gray-600 text-center mb-6">أدخل كلمة السر للوصول إلى لوحة التحكم</p>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="كلمة السر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="text-right"
              dir="rtl"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-[#2C3E68] hover:bg-[#1a2847]"
            >
              دخول
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-[#F46F2A]" />
            <h1 className="text-3xl font-bold text-[#2C3E68]">لوحة تحكم المحادثات</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            تسجيل خروج
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* قائمة الرسائل */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#2C3E68] mb-4">
                جميع الرسائل ({messages.length})
              </h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لا توجد رسائل</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessageId(msg.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        selectedMessageId === msg.id
                          ? 'border-[#F46F2A] bg-[#F46F2A]/5'
                          : 'border-gray-200 hover:border-[#F46F2A]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`text-sm font-bold px-2 py-1 rounded ${
                          msg.reply === 'visitor'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {msg.reply === 'visitor' ? '👤 زائر' : '👨‍💼 إدارة'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.created_at).toLocaleString('ar-SA')}
                        </span>
                      </div>
                      <p className="text-gray-800">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* لوحة الرد */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold text-[#2C3E68] mb-4">
                {selectedMessageId ? 'الرد على الرسالة' : 'اختر رسالة للرد'}
              </h3>

              {selectedMessageId && (
                <>
                  <div className="mb-4 p-3 bg-gray-100 rounded">
                    <p className="text-sm text-gray-700">
                      {messages.find(m => m.id === selectedMessageId)?.message}
                    </p>
                  </div>

                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="mb-4 resize-none"
                    rows={5}
                    dir="rtl"
                  />

                  <Button
                    onClick={handleReply}
                    disabled={!replyText.trim() || isLoading}
                    className="w-full bg-[#F46F2A] hover:bg-[#e55a1a] gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isLoading ? 'جاري الإرسال...' : 'إرسال الرد'}
                  </Button>

                  <Button
                    onClick={() => handleDelete(selectedMessageId)}
                    variant="destructive"
                    className="w-full mt-2 gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف الرسالة
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
