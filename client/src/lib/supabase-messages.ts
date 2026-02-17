import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ بيانات Supabase غير موجودة');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  content?: string;
  reply: 'admin' | 'visitor';
  conversation_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  name: string;
  email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  messages: Message[];
}

export const messagesService = {
  // إضافة رسالة جديدة مع conversation_id
  async addMessage(
    messageText: string,
    replyType: 'admin' | 'visitor',
    conversationId: string,
    name: string = 'زائر',
    email: string = 'visitor@sharaka.sa'
  ): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          name,
          email,
          message: messageText,
          content: messageText,
          reply: replyType,
          conversation_id: conversationId,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ خطأ في إضافة الرسالة:', error);
        throw new Error(error.message);
      }

      console.log('✅ تم إضافة الرسالة بنجاح:', data);
      return data;
    } catch (error) {
      console.error('❌ خطأ في إضافة الرسالة:', error);
      throw error;
    }
  },

  // الحصول على جميع الرسائل
  async getMessages(): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ خطأ في تحميل الرسائل:', error);
        throw new Error(error.message);
      }

      console.log('✅ تم تحميل الرسائل:', data);
      return data || [];
    } catch (error) {
      console.error('❌ خطأ في تحميل الرسائل:', error);
      throw error;
    }
  },

  // الحصول على رسائل محادثة معينة
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ خطأ في تحميل رسائل المحادثة:', error);
        throw new Error(error.message);
      }

      console.log('✅ تم تحميل رسائل المحادثة:', data);
      return data || [];
    } catch (error) {
      console.error('❌ خطأ في تحميل رسائل المحادثة:', error);
      throw error;
    }
  },

  // الحصول على جميع المحادثات المجمعة
  async getAllConversations(): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ خطأ في تحميل المحادثات:', error);
        throw new Error(error.message);
      }

      // تجميع الرسائل حسب conversation_id
      const conversationsMap = new Map<string, Message[]>();
      data?.forEach((message: Message) => {
        if (!conversationsMap.has(message.conversation_id)) {
          conversationsMap.set(message.conversation_id, []);
        }
        conversationsMap.get(message.conversation_id)!.push(message);
      });

      // تحويل الخريطة إلى قائمة المحادثات
      const conversations: Conversation[] = Array.from(conversationsMap.entries()).map(
        ([conversationId, messages]) => {
          const lastMessage = messages[messages.length - 1];
          const unreadCount = messages.filter(m => m.reply === 'visitor').length;

          return {
            id: conversationId,
            name: lastMessage.name,
            email: lastMessage.email,
            last_message: lastMessage.message,
            last_message_time: lastMessage.created_at,
            unread_count: unreadCount,
            messages: messages,
          };
        }
      );

      console.log('✅ تم تحميل المحادثات:', conversations);
      return conversations;
    } catch (error) {
      console.error('❌ خطأ في تحميل المحادثات:', error);
      throw error;
    }
  },

  // الحصول على الرسائل الواردة من الزوار فقط
  async getVisitorMessages(): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('reply', 'visitor')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ خطأ في تحميل رسائل الزوار:', error);
        throw new Error(error.message);
      }

      console.log('✅ تم تحميل رسائل الزوار:', data);
      return data || [];
    } catch (error) {
      console.error('❌ خطأ في تحميل رسائل الزوار:', error);
      throw error;
    }
  },

  // البحث عن الرسائل
  async searchMessages(searchText: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`name.ilike.%${searchText}%,message.ilike.%${searchText}%,email.ilike.%${searchText}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ خطأ في البحث عن الرسائل:', error);
        throw new Error(error.message);
      }

      console.log('✅ تم البحث عن الرسائل:', data);
      return data || [];
    } catch (error) {
      console.error('❌ خطأ في البحث عن الرسائل:', error);
      throw error;
    }
  },

  // حذف رسالة
  async deleteMessage(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ خطأ في حذف الرسالة:', error);
        throw new Error(error.message);
      }

      console.log('✅ تم حذف الرسالة');
    } catch (error) {
      console.error('❌ خطأ في حذف الرسالة:', error);
      throw error;
    }
  },

  // الاستماع للتحديثات الحية
  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    try {
      const subscription = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            console.log('✅ رسالة جديدة:', payload.new);
            callback(payload.new as Message);
          }
        )
        .subscribe();

      return subscription;
    } catch (error) {
      console.error('❌ خطأ في الاستماع للرسائل:', error);
      throw error;
    }
  },
};
