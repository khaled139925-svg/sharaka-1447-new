import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { supabase } from '../lib/supabase'; // تأكد من صحة المسار

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initChat = async () => {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser) return;

      const apiKey = import.meta.env.VITE_STREAM_API_KEY;
      if (!apiKey) {
        console.error('Stream API key is missing');
        return;
      }

      // 1. إنشاء عميل Stream Chat
      const client = StreamChat.getInstance(apiKey);
      
      // 2. الحصول على الـ Token من الخادم (سننشئ الدالة لاحقاً)
      const getStreamToken = async (userId) => {
        // في التطوير المحلي، نستخدم Token مبدئي من Stream
        // للإنتاج، يجب استدعاء Supabase Function لإنشائه
        return client.devToken(userId.toString());
      };

      const token = await getStreamToken(currentUser.id);
      
      // 3. ربط المستخدم
      await client.connectUser(
        { id: currentUser.id.toString(), name: currentUser.full_name, image: currentUser.avatar_url },
        token
      );

      setChatClient(client);
      setIsReady(true);
    };

    initChat();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, []);

  return (
    <ChatContext.Provider value={{ chatClient, isReady }}>
      {children}
    </ChatContext.Provider>
  );
};