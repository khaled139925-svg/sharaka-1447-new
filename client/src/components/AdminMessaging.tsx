'use client';

import { useState, useEffect } from 'react';
import { Send, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  messages: Array<{
    id: string;
    text: string;
    timestamp: number;
    isFromAdmin: boolean;
  }>;
  lastMessageTime: number;
  isRead: boolean;
}

export default function AdminMessaging() {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // تحميل الرسالل من localStorage
  useEffect(() => {
    const loadMessages = () => {
      const saved = localStorage.getItem('clientConversation');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConversations([parsed]);
        } catch (error) {
          console.error('خطأ في تحميل الرسالل:', error);
        }
      }
    };
    
    loadMessages();
    
    // تحديث دوري كل ثانية
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, []);

  // حفظ الرسالل في localStorage
  const saveMessages = (updatedConversations: Message[]) => {
    if (updatedConversations.length > 0) {
      localStorage.setItem('clientConversation', JSON.stringify(updatedConversations[0]));
    }
    setConversations(updatedConversations);
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;

    const updated = conversations.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: Date.now().toString(),
              text: replyText,
              timestamp: Date.now(),
              isFromAdmin: true
            }
          ],
          lastMessageTime: Date.now()
        };
      }
      return conv;
    });

    saveMessages(updated);
    setReplyText('');
  };

  const handleMarkAsRead = (conversationId: string) => {
    const updated = conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, isRead: true };
      }
      return conv;
    });
    saveMessages(updated);
  };

  const handleDeleteConversation = (conversationId: string) => {
    const updated = conversations.filter(c => c.id !== conversationId);
    saveMessages(updated);
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.senderName.includes(searchQuery) ||
    conv.senderEmail.includes(searchQuery) ||
    conv.senderPhone.includes(searchQuery)
  );

  const unreadCount = conversations.filter(c => !c.isRead).length;

  return (
    <div className="h-screen flex bg-gray-100">
      {/* قائمة المحادثات */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* رأس القائمة */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">الرسائل المباشرة</h2>
          {unreadCount > 0 && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold mb-3">
              {unreadCount} رسالة جديدة
            </div>
          )}
          <div className="relative">
            <Search size={18} className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن العميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* قائمة المحادثات */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              لا توجد رسائل
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv.id);
                  handleMarkAsRead(conv.id);
                }}
                className={`p-4 border-b border-gray-200 cursor-pointer transition ${
                  selectedConversation === conv.id
                    ? 'bg-blue-50 border-l-4 border-l-blue-600'
                    : 'hover:bg-gray-50'
                } ${!conv.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{conv.senderName}</h3>
                    <p className="text-sm text-gray-500">{conv.senderEmail}</p>
                  </div>
                  {!conv.isRead && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conv.messages[conv.messages.length - 1]?.text}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conv.lastMessageTime).toLocaleString('ar-SA')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* نافذة المحادثة */}
      <div className="flex-1 flex flex-col bg-white">
        {currentConversation ? (
          <>
            {/* رأس المحاثة */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold">{currentConversation.senderName}</h3>
                <p className="text-sm text-blue-100">{currentConversation.senderEmail}</p>
                <p className="text-sm text-blue-100">{currentConversation.senderPhone}</p>
              </div>
              <Button
                onClick={() => handleDeleteConversation(currentConversation.id)}
                className="bg-red-600 hover:bg-red-700 text-white ml-4 flex-shrink-0"
              >
                <Trash2 size={18} />
              </Button>
            </div>

            {/* محتوى المحادثة */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentConversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isFromAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.isFromAdmin
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* حقل الرد */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  placeholder="اكتب ردك هنا..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">اختر محادثة للبدء</p>
              <p className="text-sm">سيتم عرض جميع الرسائل هنا</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
