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