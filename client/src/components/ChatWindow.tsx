<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ChatWindowProps {
  otherUserId: string;       // معرف المستخدم الآخر من auth.users
  otherUserName: string;     // اسم المستخدم الآخر
  onClose: () => void;       // دالة الإغلاق (ستقوم بإزالة ?openChat=true في المكون الأب)
}

export default function ChatWindow({ otherUserId, otherUserName, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // جلب المستخدم الحالي
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  // جلب الرسائل والاشتراك في التحديثات الفورية
  useEffect(() => {
    if (!currentUser || !otherUserId) return;

    // جلب الرسائل السابقة
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    // اسم قناة فريد لهذه المحادثة
    const channelName = `chat-${currentUser.id}-${otherUserId}`;
    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        // تأكد أن الرسالة تخص هذه المحادثة (بين المستخدمين)
        if ((msg.sender_id === currentUser.id && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === currentUser.id)) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser, otherUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: otherUserId,
      message: newMessage.trim(),
      created_at: new Date(),
    });
    if (!error) setNewMessage('');
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded shadow-lg border z-50">
      <div className="p-3 bg-orange-500 text-white rounded-t flex justify-between">
        <span>محادثة مع {otherUserName}</span>
        <button onClick={onClose} className="text-white">✕</button>
      </div>
      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={`p-2 rounded ${msg.sender_id === currentUser.id ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="p-2 flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-orange-500 text-white px-3 py-1 rounded">
          إرسال
        </button>
      </div>
    </div>
  );
}
=======
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';

interface ChatWindowProps {
  onClose: () => void;
  otherUser: { id: number; full_name: string; avatar_url?: string };
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, otherUser }) => {
  const { currentConversation, messages, sendMessage, startConversation } = useChat();
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentConversation) {
      startConversation(otherUser.id);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if ((!inputText.trim() && !selectedFile) || sending) return;
    setSending(true);
    await sendMessage(inputText, selectedFile || undefined);
    setInputText('');
    setSelectedFile(null);
    setSending(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>💬 {otherUser.full_name}</span>
        <button onClick={onClose} style={styles.closeBtn}>✖</button>
      </div>
      <div style={styles.messagesArea}>
        {messages.map((msg) => {
          const isMine = msg.sender_id === JSON.parse(localStorage.getItem('user') || '{}')?.id;
          return (
            <div
              key={msg.id}
              style={{
                ...styles.messageBubble,
                alignSelf: isMine ? 'flex-end' : 'flex-start',
                background: isMine ? '#dcf8c5' : '#fff',
              }}
            >
              {msg.media_url && (
                msg.media_type === 'image' ? (
                  <img src={msg.media_url} style={{ maxWidth: '200px', borderRadius: 8, cursor: 'pointer' }} />
                ) : (
                  <video src={msg.media_url} controls style={{ maxWidth: '200px', borderRadius: 8 }} />
                )
              )}
              {msg.content && <div>{msg.content}</div>}
              <div style={styles.time}>{new Date(msg.created_at).toLocaleTimeString()}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="اكتب رسالة..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={styles.textInput}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <label style={styles.fileLabel}>
          📎
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
        </label>
        <button onClick={handleSend} disabled={sending} style={styles.sendBtn}>
          إرسال
        </button>
      </div>
      {selectedFile && (
        <div style={styles.filePreview}>
          📁 {selectedFile.name}
          <button onClick={() => setSelectedFile(null)}>✖</button>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 360,
    height: 500,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    background: '#075e54',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  closeBtn: { background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: '#e5ddd5',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 8,
    borderRadius: 8,
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  time: { fontSize: 10, color: '#666', marginTop: 4, textAlign: 'right' },
  inputArea: {
    display: 'flex',
    padding: 8,
    gap: 8,
    borderTop: '1px solid #ddd',
    background: '#fff',
  },
  textInput: { flex: 1, padding: 8, borderRadius: 20, border: '1px solid #ccc' },
  fileLabel: { cursor: 'pointer', fontSize: 24, padding: '0 5px' },
  sendBtn: { background: '#25d366', color: '#fff', border: 'none', borderRadius: 20, padding: '0 16px', cursor: 'pointer' },
  filePreview: {
    padding: 8,
    background: '#f0f0f0',
    fontSize: 12,
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #ddd',
  },
};
>>>>>>> temp-preview
