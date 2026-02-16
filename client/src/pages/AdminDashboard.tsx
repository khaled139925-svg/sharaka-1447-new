import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Send, Loader2, ArrowLeft, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminDashboard() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [, setLocation] = useLocation();
  const [isAdminSession, setIsAdminSession] = useState(false);

  // التحقق من الجلسة عند تحميل الصفحة
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'true') {
      setIsAdminSession(true);
    } else {
      setLocation('/admin-login');
    }
  }, [setLocation]);

  // جلب جميع المحادثات
  const { data: conversations, isLoading: conversationsLoading, refetch: refetchConversations } = trpc.chat.getAllConversations.useQuery(
    undefined,
    { enabled: isAdminSession }
  );

  // جلب الرسائل للمحادثة المختارة
  const { data: messages, isLoading: messagesLoading, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { conversationId: selectedConversation || 0 },
    { enabled: selectedConversation !== null }
  );

  // إرسال رد من الإدارة
  const sendAdminReplyMutation = trpc.chat.sendAdminReply.useMutation({
    onSuccess: () => {
      setReplyMessage('');
      refetchMessages();
      refetchConversations();
    },
  });

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedConversation) return;

    await sendAdminReplyMutation.mutateAsync({
      conversationId: selectedConversation,
      content: replyMessage,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminLoginTime');
    setLocation('/admin-login');
  };

  // التحقق من الجلسة
  if (!isAdminSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">جاري التحميل...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-md border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <MessageCircle size={32} />
              لوحة تحكم الرسائل
            </h1>
            <p className="text-foreground/70 mt-1">إدارة المحادثات والرد على العملاء</p>
          </div>
          <Button
            onClick={handleLogout}
            className="btn-outline flex items-center gap-2"
          >
            <LogOut size={18} />
            تسجيل خروج
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* قائمة المحادثات */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <h2 className="text-2xl font-bold text-primary mb-4">المحادثات</h2>
              
              {conversationsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : conversations && conversations.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {conversations.map((conv: any) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                        selectedConversation === conv.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      <p className="font-semibold">محادثة #{conv.id}</p>
                      <p className="text-sm opacity-75">
                        {new Date(conv.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/70 text-center py-8">لا توجد محادثات</p>
              )}
            </div>
          </div>

          {/* تفاصيل المحادثة والرد */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} className="text-primary" />
                  </button>
                  <h2 className="text-2xl font-bold text-primary">محادثة #{selectedConversation}</h2>
                </div>

                {/* الرسائل */}
                <div className="bg-secondary rounded-lg p-4 mb-6 max-h-[400px] overflow-y-auto space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderType === 'user' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-3 rounded-lg ${
                            msg.senderType === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent text-accent-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-foreground/70 text-center py-8">لا توجد رسائل</p>
                  )}
                </div>

                {/* حقل الرد */}
                <div className="space-y-3">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="اكتب ردك هنا..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 resize-none"
                    rows={4}
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={sendAdminReplyMutation.isPending || !replyMessage.trim()}
                    className="w-full btn-primary justify-center gap-2"
                  >
                    {sendAdminReplyMutation.isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        إرسال الرد
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="card p-6 flex items-center justify-center min-h-[500px]">
                <p className="text-foreground/70 text-lg">اختر محادثة للبدء</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
