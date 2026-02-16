import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('تحذير: بيانات اعتماد Supabase غير موجودة');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// أنواع البيانات
export interface Message {
  id?: string;
  conversation_id: string;
  sender: 'user' | 'admin';
  content: string;
  created_at?: string;
  read?: boolean;
}

export interface Conversation {
  id?: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  subject: string;
  status: 'open' | 'closed';
  created_at?: string;
  updated_at?: string;
}

// وظائف الدردشة
export const chatService = {
  // إنشاء محادثة جديدة
  async createConversation(data: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const conversationData = {
        user_name: data.user_name || 'زائر',
        user_email: data.user_email || 'visitor@sharaka.com',
        user_phone: data.user_phone || null,
        subject: data.subject || 'رسالة من الدردشة الفورية',
        status: data.status || 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert([conversationData])
        .select()
        .single();

      if (error) {
        console.error('خطأ Supabase في createConversation:', error);
        throw new Error(`فشل إنشاء المحادثة: ${error.message}`);
      }
      return conversation;
    } catch (error) {
      console.error('خطأ في إنشاء المحادثة:', error);
      throw error;
    }
  },

  // الحصول على جميع المحادثات
  async getConversations() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب المحادثات:', error);
      throw error;
    }
  },

  // الحصول على محادثة محددة
  async getConversation(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب المحادثة:', error);
      throw error;
    }
  },

  // إضافة رسالة جديدة
  async addMessage(message: Message) {
    try {
      const messageData = {
        conversation_id: message.conversation_id,
        sender: message.sender,
        content: message.content,
        created_at: new Date().toISOString(),
        read: false,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) {
        console.error('خطأ Supabase في addMessage:', error);
        throw new Error(`فشل إضافة الرسالة: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error('خطأ في إضافة الرسالة:', error);
      throw error;
    }
  },

  // الحصول على رسائل المحادثة
  async getMessages(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب الرسائل:', error);
      throw error;
    }
  },

  // الاستماع للرسائل الجديدة (Realtime)
  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    return supabase
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
          callback(payload.new as Message);
        }
      )
      .subscribe();
  },

  // تحديث حالة المحادثة
  async updateConversationStatus(conversationId: string, status: 'open' | 'closed') {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في تحديث حالة المحادثة:', error);
      throw error;
    }
  },
};
