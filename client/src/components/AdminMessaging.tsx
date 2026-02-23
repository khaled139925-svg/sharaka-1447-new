'use client';

import { useState, useEffect, useRef } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // تحميل الرسائل من localStorage
  useEffect(() => {
    const loadMessages = () => {
      try {
        const saved = localStorage.getItem('clientConversation');
        if (saved) {
          const parsed = JSON.parse(saved);
          setConversations([parsed]);
        }
      } catch (error) {
        console.error('خطأ في تحميل الرسائل:', error);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, []);

  // التمرير إلى آخر رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation, conversations]);

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
          lastMessageTime: Date.now(),
          isRead: true
        };
      }
      return conv;
    });

    setConversations(updated);
    localStorage.setItem('clientConversation', JSON.stringify(updated[0]));
    setReplyText('');
  };

  const handleMarkAsRead = (conversationId: string) => {
    const updated = conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, isRead: true };
      }
      return conv;
    });
    setConversations(updated);
    localStorage.setItem('clientConversation', JSON.stringify(updated[0]));
  };

  const handleDeleteConversation = (conversationId: string) => {
    const updated = conversations.filter(c => c.id !== conversationId);
    setConversations(updated);
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
    }
    localStorage.removeItem('clientConversation');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.senderEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = conversations.filter(c => !c.isRead).length;

  return (
    <div className="h-screen w-full flex bg-gray-100">
      {/* قائمة المحادثات - الجانب الأيسر */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        {/* الرأس */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-800 mb-3">الرسائل</h2>
          {unreadCount > 0 && (
            <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm font-semibold mb-3">
              {unreadCount} جديدة
            </div>
          )}
          <div className="relative">
            <Search size={16} className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* قائمة المحادثات */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              لا توجد رسائل
            </div>
          ) : (
            filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv.id);
                  handleMarkAsRead(conv.id);
                }}
                className={`w-full text-right p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                  selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                } ${!conv.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{conv.senderName}</h3>
                    <p className="text-xs text-gray-500 mt-1">{conv.senderEmail}</p>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {conv.messages[conv.messages.length - 1]?.text}
                    </p>
                  </div>
                  {!conv.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* نافذة المحادثة - الجانب الأيمن */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {currentConversation ? (
          <>
            {/* رأس المحادثة */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{currentConversation.senderName}</h3>
                <p className="text-sm text-blue-100">{currentConversation.senderEmail}</p>
                <p className="text-sm text-blue-100">{currentConversation.senderPhone}</p>
              </div>
              <Button
                onClick={() => handleDeleteConversation(currentConversation.id)}
                className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                size="sm"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            {/* محتوى الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentConversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isFromAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.isFromAdmin
                        ? 'bg-green-100 text-green-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* حقل الإدخال */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
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
                  placeholder="اكتب ردك..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  size="sm"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg font-semibold">اختر محادثة</p>
              <p className="text-sm">لعرض الرسائل</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
