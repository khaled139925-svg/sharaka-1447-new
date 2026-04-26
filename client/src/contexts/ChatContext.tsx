import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Message = {
  id: string;
  conversation_id: string;
  sender_id: number;
  content: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  created_at: string;
  is_read: boolean;
};

type Conversation = {
  id: string;
  user1_id: number;
  user2_id: number;
};

interface ChatContextType {
  currentConversation: Conversation | null;
  messages: Message[];
  sendMessage: (text: string, file?: File) => Promise<void>;
  startConversation: (otherUserId: number) => Promise<void>;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // الاشتراك في الرسائل الجديدة عندما تتغير المحادثة
  useEffect(() => {
    if (!currentConversation) return;

    // جلب الرسائل السابقة
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', currentConversation.id)
        .order('created_at', { ascending: true });
      if (!error && data) setMessages(data);
    };
    fetchMessages();

    // الاشتراك في التحديثات الفورية (Realtime)
    const channel = supabase
      .channel(`chat:${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${currentConversation.id}`,
        },
        (payload) => {
          console.log('رسالة جديدة:', payload.new);
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversation]);

  // بدء أو استئناف محادثة مع مستخدم آخر
  const startConversation = async (otherUserId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser) return;

    // البحث عن محادثة موجودة
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
      .or(`user1_id.eq.${otherUserId},user2_id.eq.${otherUserId}`)
      .maybeSingle();

    if (existing) {
      setCurrentConversation(existing);
      return;
    }

    // إنشاء محادثة جديدة
    const { data: newConv, error } = await supabase
      .from('conversations')
      .insert({ user1_id: currentUser.id, user2_id: otherUserId })
      .select()
      .single();

    if (!error && newConv) {
      setCurrentConversation(newConv);
    } else {
      console.error(error);
    }
  };

  // رفع ملف إلى Storage
  const uploadMedia = async (file: File): Promise<{ url: string; type: 'image' | 'video' } | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36)}.${fileExt}`;
    const filePath = `chat/${fileName}`;
    const { error } = await supabase.storage.from('chat-media').upload(filePath, file);
    if (error) {
      console.error(error);
      return null;
    }
    const { data } = supabase.storage.from('chat-media').getPublicUrl(filePath);
    const mediaType = file.type.startsWith('image') ? 'image' : 'video';
    return { url: data.publicUrl, type: mediaType };
  };

  // إرسال رسالة (نصية أو مع ملف)
  const sendMessage = async (text: string, file?: File) => {
    if (!currentConversation) {
      console.error('لا توجد محادثة نشطة');
      return;
    }
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser) return;

    let mediaUrl: string | null = null;
    let mediaType: 'image' | 'video' | null = null;

    if (file) {
      const uploaded = await uploadMedia(file);
      if (uploaded) {
        mediaUrl = uploaded.url;
        mediaType = uploaded.type;
      }
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversation.id,
        sender_id: currentUser.id,
        content: text || null,
        media_url: mediaUrl,
        media_type: mediaType,
      })
      .select()
      .single();

    if (error) {
      console.error('خطأ في إرسال الرسالة:', error);
    } else {
      // إضافة الرسالة محلياً فوراً لتجنب انتظار Realtime
      setMessages((prev) => [...prev, data]);
    }
  };

  return (
    <ChatContext.Provider
      value={{ currentConversation, messages, sendMessage, startConversation, loading }}
    >
      {children}
    </ChatContext.Provider>
  );
};