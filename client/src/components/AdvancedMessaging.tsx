import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'admin';
  senderName: string;
  senderEmail: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface Conversation {
  id: string;
  senderName: string;
  senderEmail: string;
  messages: Message[];
  lastMessageTime: number;
  unreadCount: number;
}

interface AdvancedMessagingProps {
  isAdmin?: boolean;
  onClose?: () => void;
}

export default function AdvancedMessaging({ isAdmin = false, onClose }: AdvancedMessagingProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(!isAdmin);

  // تحميل المحادثات من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sharaka_conversations');
    if (saved) {
      setConversations(JSON.parse(saved));
    }
  }, []);

  // حفظ المحادثات في localStorage
  useEffect(() => {
    localStorage.setItem('sharaka_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;

    if (!isAdmin && !senderName.trim() && !senderEmail.trim()) {
      alert('يرجى إدخال الاسم والبريد الإلكتروني');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: isAdmin ? 'admin' : 'user',
      senderName: isAdmin ? 'الإدارة' : senderName,
      senderEmail: isAdmin ? 'admin@sharaka.com' : senderEmail,
      content: messageContent,
      timestamp: Date.now(),
      read: false,
    };

    if (isAdmin && selectedConversation) {
      // الإدارة ترد على محادثة موجودة
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessageTime: Date.now(),
              }
            : conv
        )
      );
      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage],
      });
    } else if (!isAdmin) {
      // المستخدم يرسل رسالة جديدة
      const existingConv = conversations.find(
        (conv) => conv.senderEmail === senderEmail
      );

      if (existingConv) {
        // إضافة الرسالة إلى محادثة موجودة
        setConversations(
          conversations.map((conv) =>
            conv.id === existingConv.id
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  lastMessageTime: Date.now(),
                }
              : conv
          )
        );
      } else {
        // إنشاء محادثة جديدة
        const newConv: Conversation = {
          id: Date.now().toString(),
          senderName,
          senderEmail,
          messages: [newMessage],
          lastMessageTime: Date.now(),
          unreadCount: 1,
        };
        setConversations([...conversations, newConv]);
        setSelectedConversation(newConv);
      }

      // حفظ بيانات المرسل
      localStorage.setItem('sharaka_sender_name', senderName);
      localStorage.setItem('sharaka_sender_email', senderEmail);
    }

    setMessageContent('');
  };

  // تحميل بيانات المرسل المحفوظة
  useEffect(() => {
    if (!isAdmin) {
      const savedName = localStorage.getItem('sharaka_sender_name');
      const savedEmail = localStorage.getItem('sharaka_sender_email');
      if (savedName) setSenderName(savedName);
      if (savedEmail) setSenderEmail(savedEmail);
    }
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <div className="fixed bottom-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-screen max-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">المحادثات</h2>
            <Button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Conversations List */}
            <div className="w-1/3 border-l border-gray-300 overflow-y-auto bg-gray-50">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  لا توجد محادثات
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition ${
                      selectedConversation?.id === conv.id ? 'bg-blue-100' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-right">{conv.senderName}</p>
                        <p className="text-sm text-gray-500 text-right">{conv.senderEmail}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">
                    {selectedConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender === 'admin'
                              ? 'bg-green-100 text-gray-800 rounded-bl-none'
                              : 'bg-blue-100 text-gray-800 rounded-br-none'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="border-t border-gray-300 p-4 bg-gray-50 flex gap-2">
                    <input
                      type="text"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اكتب ردك هنا..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      dir="rtl"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  اختر محادثة للرد عليها
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // واجهة المستخدم (المرسل)
  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-96">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center justify-between rounded-t-lg">
        <h2 className="text-lg font-bold">راسل الإدارة</h2>
        <Button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedConversation?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg.sender === 'admin'
                  ? 'bg-green-100 text-gray-800 rounded-bl-none'
                  : 'bg-blue-100 text-gray-800 rounded-br-none'
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-300 p-4 bg-gray-50 space-y-2 rounded-b-lg">
        {!selectedConversation && (
          <>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="اسمك"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right text-sm"
              dir="rtl"
            />
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right text-sm"
              dir="ltr"
            />
          </>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب رسالتك..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right text-sm"
            dir="rtl"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-green-600 hover:bg-green-700 text-white p-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
