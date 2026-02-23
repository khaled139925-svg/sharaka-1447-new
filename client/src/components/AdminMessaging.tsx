'use client';

import { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
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
    <div style={{ display: 'flex', height: '100%', gap: '0' }}>
      {/* القائمة اليسرى */}
      <div style={{ width: '300px', borderRight: '1px solid #ddd', overflowY: 'auto', padding: '16px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>الرسائل</h2>
        {conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => setSelectedId(conv.id)}
            style={{
              padding: '12px',
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedId === conv.id ? '#e3f2fd' : '#fff',
              borderLeft: selectedId === conv.id ? '4px solid #2196f3' : 'none'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{conv.senderName}</div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{conv.senderEmail}</div>
            <div style={{ fontSize: '12px', color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {conv.messages[conv.messages.length - 1]?.text}
            </div>
          </div>
        ))}
      </div>

      {/* المحادثة */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
        {current ? (
          <>
            {/* الرأس */}
            <div style={{
              padding: '16px',
              backgroundColor: '#2196f3',
              color: 'white',
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{current.senderName}</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>{current.senderEmail}</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>{current.senderPhone}</div>
              </div>
              <Button
                onClick={() => handleDelete(current.id)}
                style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </Button>
            </div>

            {/* الرسائل */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {current.messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.isFromAdmin ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '60%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: msg.isFromAdmin ? '#c8e6c9' : '#bbdefb',
                      color: msg.isFromAdmin ? '#1b5e20' : '#0d47a1'
                    }}
                  >
                    <div>{msg.text}</div>
                    <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>
                      {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* حقل الإدخال */}
            <div style={{
              padding: '16px',
              backgroundColor: '#fff',
              borderTop: '1px solid #ddd',
              display: 'flex',
              gap: '8px'
            }}>
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
                placeholder="اكتب ردك..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!reply.trim()}
                style={{
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  cursor: reply.trim() ? 'pointer' : 'not-allowed',
                  opacity: reply.trim() ? 1 : 0.5
                }}
              >
                <Send size={16} />
              </Button>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '16px'
          }}>
            اختر محادثة
          </div>
        )}
      </div>
    </div>
  );
}
