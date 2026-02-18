'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Lock, LogOut, MessageCircle, Trash2, RefreshCw } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface Conversation {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  messages: any[];
  lastMessage: any;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const ADMIN_PASSWORD = 'tariq';

  // استخدام useQuery للحصول على المحادثات
  const { data: conversations = [], isLoading, refetch } = trpc.admin.getAllConversations.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // التحقق من كلمة السر
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('كلمة السر غير صحيحة');
    }
  };

  // الرد على محادثة
  const sendReplyMutation = trpc.admin.sendAdminReply.useMutation({
    onSuccess: () => {
      setReplyText('');
      refetch();
      alert('✅ تم إرسال الرد بنجاح');
    },
    onError: (error) => {
      alert(`❌ خطأ: ${error.message}`);
    },
  });

  const handleReply = async () => {
    if (!replyText.trim() || selectedConversationId === null) {
      alert('يرجى كتابة رد قبل الإرسال');
      return;
    }

    sendReplyMutation.mutate({
      conversationId: selectedConversationId,
      content: replyText,
      userId: 0,
    });
  };

  // حذف رسالة
  const deleteMessageMutation = trpc.admin.deleteMessage.useMutation({
    onSuccess: () => {
      refetch();
      alert('✅ تم حذف الرسالة بنجاح');
    },
    onError: (error) => {
      alert(`❌ خطأ: ${error.message}`);
    },
  });

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('هل تريد حذف هذه الرسالة؟')) return;
    deleteMessageMutation.mutate({ messageId });
  };

  // حذف محادثة كاملة
  const deleteConversationMutation = trpc.admin.deleteConversation.useMutation({
    onSuccess: () => {
      setSelectedConversationId(null);
      setReplyText('');
      refetch();
      alert('✅ تم حذف المحادثة بنجاح');
    },
    onError: (error) => {
      alert(`❌ خطأ: ${error.message}`);
    },
  });

  const handleDeleteConversation = async (conversationId: number) => {
    if (!confirm('هل تريد حذف هذه المحادثة بالكامل؟')) return;
    deleteConversationMutation.mutate({ conversationId });
  };

  // تسجيل الخروج
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedConversationId(null);
    setReplyText('');
  };

  // الحصول على المحادثة المختارة
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

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
              onClick={() => refetch()}
              disabled={isLoading}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
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
          {/* قائمة المحادثات */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#2C3E68] mb-4">
                جميع المحادثات ({conversations.length})
              </h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg">لا توجد محادثات حالياً</p>
                  </div>
                ) : (
                  conversations.map((conv: any) => {
                    const lastMsg = conv.lastMessage;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversationId(conv.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedConversationId === conv.id
                            ? 'border-[#F46F2A] bg-[#F46F2A]/5'
                            : 'border-gray-200 hover:border-[#F46F2A]/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold px-2 py-1 rounded ${
                              lastMsg?.senderType === 'user'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {lastMsg?.senderType === 'user' ? '👤 زائر' : '👨‍💼 إدارة'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(conv.updatedAt).toLocaleString('ar-SA')}
                          </span>
                        </div>
                        <p className="text-gray-800 mt-2 line-clamp-2">{lastMsg?.content || 'لا توجد رسائل'}</p>
                        <p className="text-xs text-gray-500 mt-1">عدد الرسائل: {conv.messages.length}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* لوحة الرد */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold text-[#2C3E68] mb-4">
                {selectedConversation ? 'الرد على المحادثة' : 'اختر محادثة للرد'}
              </h3>

              {selectedConversation ? (
                <>
                  {/* عرض رسائل المحادثة */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-h-[300px] overflow-y-auto">
                    <p className="text-xs text-gray-500 mb-3 font-bold">الرسائل ({selectedConversation.messages.length}):</p>
                    <div className="space-y-2">
                      {selectedConversation.messages.map((msg: any) => (
                        <div key={msg.id} className="bg-white p-2 rounded border border-gray-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-bold ${msg.senderType === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                              {msg.senderType === 'user' ? '👤 زائر' : '👨‍💼 إدارة'}
                            </span>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                              title="حذف الرسالة"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-gray-800">{msg.content}</p>
                          <p className="text-gray-400 text-xs mt-1">{new Date(msg.createdAt).toLocaleTimeString('ar-SA')}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* حقل الرد */}
                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="mb-4 resize-none border-2 focus:border-[#F46F2A]"
                    rows={4}
                    dir="rtl"
                  />

                  {/* زر الإرسال */}
                  <Button
                    onClick={handleReply}
                    disabled={!replyText.trim() || sendReplyMutation.isPending}
                    className="w-full bg-[#F46F2A] hover:bg-[#e55a1a] gap-2 mb-2"
                  >
                    <Send className="w-4 h-4" />
                    {sendReplyMutation.isPending ? 'جاري الإرسال...' : 'إرسال الرد'}
                  </Button>

                  {/* زر حذف المحادثة */}
                  <Button
                    onClick={() => handleDeleteConversation(selectedConversationId!)}
                    disabled={deleteConversationMutation.isPending}
                    variant="destructive"
                    className="w-full gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف المحادثة
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">اختر محادثة من القائمة لكي تتمكن من الرد عليها</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
