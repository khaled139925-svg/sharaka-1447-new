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