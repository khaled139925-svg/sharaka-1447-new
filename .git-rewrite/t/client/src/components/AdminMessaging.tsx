'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Minus, X } from 'lucide-react';

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 600, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('clientConversation');
    if (saved) {
      try {
        setConversations([JSON.parse(saved)]);
        const parsed = JSON.parse(saved);
        setSelectedId(parsed.id);
      } catch (e) {
        console.error('خطأ في تحميل الرسائل:', e);
      }
    }
  }, []);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const current = conversations.find(c => c.id === selectedId);

  const handleSend = () => {
    if (!reply.trim() || !selectedId) return;

    const updated = conversations.map(c => {
      if (c.id === selectedId) {
        return {
          ...c,
          messages: [...c.messages, {
            id: Date.now().toString(),
            text: reply,
            timestamp: Date.now(),
            isFromAdmin: true
          }],
          isRead: true
        };
      }
      return c;
    });

    setConversations(updated);
    localStorage.setItem('clientConversation', JSON.stringify(updated[0]));
    setReply('');
  };

  const handleDelete = (id: string) => {
    setConversations(conversations.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
    localStorage.removeItem('clientConversation');
  };

  return (
    <div
      ref={windowRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '350px' : `${size.width}px`,
        height: isMinimized ? '50px' : `${size.height}px`,
        backgroundColor: '#fff',
        border: '3px solid #2196f3',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* الرأس - قابل للتحريك */}
      <div
        ref={headerRef}
        onMouseDown={handleHeaderMouseDown}
        style={{
          padding: '16px 20px',
          backgroundColor: '#2196f3',
          color: 'white',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '9px 9px 0 0',
          userSelect: 'none',
          flexShrink: 0
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>الرسائل المباشرة</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => setConversations([])}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* المحتوى الرئيسي */}
          <div style={{
            display: 'flex',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden'
          }}>
            {/* قائمة المحادثات الجانبية */}
            <div style={{
              width: '280px',
              borderRight: '2px solid #ddd',
              overflowY: 'auto',
              padding: '12px',
              backgroundColor: '#f9f9f9',
              flexShrink: 0
            }}>
              {conversations.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '20px' }}>
                  لا توجد رسائل
                </div>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      border: '2px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: selectedId === conv.id ? '#e3f2fd' : '#fff',
                      borderColor: selectedId === conv.id ? '#2196f3' : '#ddd',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
                      {conv.senderName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                      {conv.senderEmail}
                    </div>
                    <div style={{ fontSize: '10px', color: '#999' }}>
                      {conv.senderPhone}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* محتوى الرسائل */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}>
              {/* الرسائل */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: '#fff'
              }}>
                {current ? (
                  current.messages.map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.isFromAdmin ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: msg.isFromAdmin ? '#c8e6c9' : '#bbdefb',
                          color: msg.isFromAdmin ? '#1b5e20' : '#0d47a1',
                          fontSize: '14px',
                          wordWrap: 'break-word'
                        }}
                      >
                        <div>{msg.text}</div>
                        <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.7 }}>
                          {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: '#999', fontSize: '14px', margin: 'auto' }}>
                    اختر محادثة
                  </div>
                )}
              </div>

              {/* حقل الإدخال + زر الحذف */}
              {current && (
                <div style={{
                  padding: '8px 12px',
                  borderTop: '2px solid #ddd',
                  backgroundColor: '#f9f9f9',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="اكتب..."
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#2196f3';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                      }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!reply.trim()}
                      style={{
                        backgroundColor: reply.trim() ? '#2196f3' : '#ccc',
                        color: 'white',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: reply.trim() ? 'pointer' : 'not-allowed',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Send size={14} /> إرسال
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(current.id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} /> حذف
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
