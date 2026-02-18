import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Lock, LogOut, MessageCircle, Trash2, RefreshCw } from 'lucide-react';
import { messagesService, Message } from '@/lib/supabase-messages';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      setIsRefreshing(true);
      const data = await messagesService.getMessages();
      setMessages(data);
      console.log('✅ تم تحميل الرسائل:', data);
    } catch (error) {
      console.error('خطأ في تحميل الرسائل:', error);
      alert('فشل تحميل الرسائل. تأكد من اتصالك بـ Supabase');
    } finally {
      setIsRefreshing(false);
    }
  };

  // تحديث تلقائي للرسائل كل 5 ثوانٍ
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      loadMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // الرد على رسالة
  const handleReply = async () => {
    if (!replyText.trim() || selectedMessageId === null) {
      alert('يرجى كتابة رد قبل الإرسال');
      return;
    }

    try {
      setIsLoading(true);
      
      // إضافة الرد كرسالة جديدة
      await messagesService.addMessage(
        replyText,
        'admin',
        'الإدارة',
        'admin@sharaka.sa'
      );

      console.log('✅ تم إرسال الرد بنجاح');
      
      // تنظيف الحقول
      setReplyText('');
      setSelectedMessageId(null);
      
      // تحديث قائمة الرسائل
      await loadMessages();
      
      alert('✅ تم إرسال الرد بنجاح');
    } catch (error) {
      console.error('خطأ في الرد:', error);
      alert('❌ فشل إرسال الرد. حاول مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  // حذف رسالة
  const handleDelete = async (id: number | null) => {
    if (id === null) return;
    if (!confirm('هل تريد حذف هذه الرسالة؟')) return;

    try {
      await messagesService.deleteMessage(id);
      console.log('✅ تم حذف الرسالة');
      
      if (selectedMessageId === id) {
        setSelectedMessageId(null);
        setReplyText('');
      }
      
      await loadMessages();
      alert('✅ تم حذف الرسالة بنجاح');
    } catch (error) {
      console.error('خطأ في حذف الرسالة:', error);
      alert('❌ فشل حذف الرسالة');
    }
  };

  // تسجيل الخروج
  const handleLogout = () => {
    setIsAuthenticated(false);
    setMessages([]);
    setSelectedMessageId(null);
    setReplyText('');
  };

  // الحصول على الرسالة المختارة
  const selectedMessage = messages.find(m => m.id === selectedMessageId);

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
          <div className="flex gap-2">
            <Button
              onClick={loadMessages}
              disabled={isRefreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </Button>
          </div>
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
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg">لا توجد رسائل حالياً</p>
                    <p className="text-gray-400 text-sm mt-2">سيتم تحديث الرسائل تلقائياً كل 5 ثوانٍ</p>
                  </div>
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
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold px-2 py-1 rounded ${
                            msg.reply === 'visitor'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {msg.reply === 'visitor' ? '👤 زائر' : '👨‍💼 إدارة'}
                          </span>
                          <span className="text-sm font-semibold text-gray-800">{msg.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.created_at).toLocaleString('ar-SA')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{msg.email}</p>
                      <p className="text-gray-800 mt-2 line-clamp-2">{msg.message}</p>
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
                {selectedMessage ? 'الرد على الرسالة' : 'اختر رسالة للرد'}
              </h3>

              {selectedMessage ? (
                <>
                  {/* عرض الرسالة الأصلية */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-500 mb-2">من: {selectedMessage.name}</p>
                    <p className="text-xs text-gray-500 mb-2">البريد: {selectedMessage.email}</p>
                    <p className="text-sm text-gray-700 font-semibold mb-2">الرسالة:</p>
                    <p className="text-sm text-gray-800 bg-white p-2 rounded">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* حقل الرد */}
                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="mb-4 resize-none border-2 focus:border-[#F46F2A]"
                    rows={5}
                    dir="rtl"
                  />

                  {/* زر الإرسال */}
                  <Button
                    onClick={handleReply}
                    disabled={!replyText.trim() || isLoading}
                    className="w-full bg-[#F46F2A] hover:bg-[#e55a1a] gap-2 mb-2"
                  >
                    <Send className="w-4 h-4" />
                    {isLoading ? 'جاري الإرسال...' : 'إرسال الرد'}
                  </Button>

                  {/* زر الحذف */}
                  <Button
                    onClick={() => handleDelete(selectedMessageId)}
                    variant="destructive"
                    className="w-full gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف الرسالة
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">اختر رسالة من القائمة لكي تتمكن من الرد عليها</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
