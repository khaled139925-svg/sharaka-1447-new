'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Minus, X } from 'lucide-react';
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 500, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('clientConversation');
    if (saved) {
      try {
        setConversations([JSON.parse(saved)]);
      } catch (e) {
        console.error('خطأ في تحميل الرسائل:', e);
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
    if (isResizing) {
      setSize({
        width: Math.max(300, e.clientX - position.x),
        height: Math.max(300, e.clientY - position.y)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, position, dragOffset]);

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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '300px' : `${size.width}px`,
        height: isMinimized ? '40px' : `${size.height}px`,
        backgroundColor: '#fff',
        border: '2px solid #2196f3',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* الرأس - قابل للتحريك */}
      <div
        onMouseDown={handleMouseDown}
        data-no-drag="false"
        style={{
          padding: '12px 16px',
          backgroundColor: '#2196f3',
          color: 'white',
          cursor: 'grab',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '6px 6px 0 0',
          userSelect: 'none'
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>الرسائل</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px'
            }}
            data-no-drag="true"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => setSelectedId(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px'
            }}
            data-no-drag="true"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* قائمة المحادثات */}
          <div style={{
            flex: '0 0 150px',
            overflowY: 'auto',
            padding: '8px',
            borderBottom: '1px solid #ddd'
          }}>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                style={{
                  padding: '8px',
                  marginBottom: '4px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedId === conv.id ? '#e3f2fd' : '#fff',
                  borderLeft: selectedId === conv.id ? '3px solid #2196f3' : 'none'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '2px' }}>
                  {conv.senderName}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  {conv.senderEmail}
                </div>
              </div>
            ))}
          </div>

          {/* محتوى الرسائل */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
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
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: msg.isFromAdmin ? '#c8e6c9' : '#bbdefb',
                      color: msg.isFromAdmin ? '#1b5e20' : '#0d47a1',
                      fontSize: '13px',
                      wordWrap: 'break-word'
                    }}
                  >
                    <div>{msg.text}</div>
                    <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7 }}>
                      {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>
                اختر محادثة
              </div>
            )}
          </div>

          {/* حقل الإدخال + زر الحذف */}
          {current && (
            <div style={{
              padding: '12px',
              borderTop: '1px solid #ddd',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
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
                    fontSize: '12px'
                  }}
                  data-no-drag="true"
                />
                <button
                  onClick={handleSend}
                  disabled={!reply.trim()}
                  style={{
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    cursor: reply.trim() ? 'pointer' : 'not-allowed',
                    opacity: reply.trim() ? 1 : 0.5,
                    fontSize: '12px'
                  }}
                  data-no-drag="true"
                >
                  <Send size={14} />
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
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
                data-no-drag="true"
              >
                <Trash2 size={14} /> حذف
              </button>
            </div>
          )}

          {/* مقبض التقليص */}
          <div
            onMouseDown={() => setIsResizing(true)}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '20px',
              height: '20px',
              backgroundColor: '#2196f3',
              cursor: 'nwse-resize',
              borderRadius: '0 0 6px 0'
            }}
          />
        </>
      )}
    </div>
  );
}
