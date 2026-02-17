import { useState, useEffect } from 'react';
import { messagesService, Conversation, Message } from '@/lib/supabase-messages';
import { Button } from '@/components/ui/button';
import { MessageCircle, LogOut, Search, Bell } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // تحميل المحادثات
  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await messagesService.getAllConversations();
      setConversations(data);
      setHasNewMessages(false);
    } catch (error) {
      console.error('خطأ في تحميل المحادثات:', error);
      alert('خطأ في تحميل المحادثات');
    } finally {
      setIsLoading(false);
    }
  };

  // الاستماع للتحديثات الحية
  useEffect(() => {
    if (!isAuthenticated || !selectedConversation) return;

    const subscription = messagesService.subscribeToMessages(
      selectedConversation.id,
      (newMessage: Message) => {
        // تحديث المحادثة المحددة
        setSelectedConversation((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            last_message: newMessage.message,
            last_message_time: newMessage.created_at,
          };
        });

        // تحديث قائمة المحادثات
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  last_message: newMessage.message,
                  last_message_time: newMessage.created_at,
                }
              : conv
          )
        );

        // إشعار صوتي إذا كانت الرسالة من زائر
        if (newMessage.reply === 'visitor') {
          playNotificationSound();
          setHasNewMessages(true);
          setNotificationCount((prev) => prev + 1);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [isAuthenticated, selectedConversation]);

  // تشغيل صوت الإشعار
  const playNotificationSound = () => {
    try {
      // إنشاء صوت إشعار بسيط باستخدام Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('خطأ في تشغيل الصوت:', error);
    }
  };

  // التحقق من كلمة السر
  const handleLogin = () => {
    if (password === 'tariq') {
      setIsAuthenticated(true);
      setPassword('');
      loadConversations();
    } else {
      alert('كلمة السر غير صحيحة');
      setPassword('');
    }
  };

  // إرسال الرد
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    try {
      setIsSendingReply(true);
      const newMessage = await messagesService.addMessage(
        replyText,
        'admin',
        selectedConversation.id,
        'الإدارة',
        'admin@sharaka.sa'
      );

      // تحديث المحادثة المحددة
      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage],
        last_message: replyText,
        last_message_time: new Date().toISOString(),
      });

      // تحديث قائمة المحادثات
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              last_message: replyText,
              last_message_time: new Date().toISOString(),
            }
          : conv
      );
      setConversations(updatedConversations);
      setReplyText('');
    } catch (error) {
      console.error('خطأ في إرسال الرد:', error);
      alert('خطأ في إرسال الرد');
    } finally {
      setIsSendingReply(false);
    }
  };

  // تصفية المحادثات حسب البحث
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchText.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchText.toLowerCase()) ||
    conv.last_message.toLowerCase().includes(searchText.toLowerCase())
  );

  // شاشة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <MessageCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
            <p className="text-gray-600 mt-2">منصة شراكة - إدارة المحادثات</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كلمة السر</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="أدخل كلمة السر"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              دخول
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // لوحة التحكم الرئيسية
  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* الرأس */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
            {hasNewMessages && (
              <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                <Bell className="w-4 h-4 animate-bounce" />
                <span>{notificationCount} رسائل جديدة</span>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              setIsAuthenticated(false);
              setSelectedConversation(null);
              setConversations([]);
              setNotificationCount(0);
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* قائمة المحادثات */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="بحث عن محادثة..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">لا توجد محادثات</div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full text-right p-3 rounded-lg border-2 transition-colors ${
                        selectedConversation?.id === conv.id
                          ? 'bg-orange-50 border-orange-500'
                          : 'bg-gray-50 border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{conv.name}</p>
                          <p className="text-sm text-gray-600">{conv.email}</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{conv.last_message}</p>
                        </div>
                        {conv.unread_count > 0 && (
                          <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ml-2">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* نافذة المحادثة */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-96">
                {/* رأس المحادثة */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
                  <h2 className="text-lg font-bold">{selectedConversation.name}</h2>
                  <p className="text-sm opacity-90">{selectedConversation.email}</p>
                </div>

                {/* رسائل المحادثة */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.reply === 'admin' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.reply === 'admin'
                            ? 'bg-orange-500 text-white rounded-tl-none'
                            : 'bg-blue-500 text-white rounded-tr-none'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* حقل الرد */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder="اكتب ردك..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={isSendingReply || !replyText.trim()}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {isSendingReply ? 'جاري...' : 'إرسال'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">اختر محادثة لعرض التفاصيل</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
