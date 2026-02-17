import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Message {
  id: number;
  content: string;
  reply: 'visitor' | 'admin';
  timestamp: string;
  conversation_id?: string;
}

export const messagesService = {
  // إضافة رسالة جديدة
  async addMessage(content: string, reply: 'visitor' | 'admin'): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          content,
          reply,
          timestamp: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('خطأ في إضافة الرسالة:', error);
      throw new Error(`فشل إضافة الرسالة: ${error.message}`);
    }

    return data;
  },

  // الحصول على جميع الرسائل
  async getMessages(): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('خطأ في جلب الرسائل:', error);
      throw new Error(`فشل جلب الرسائل: ${error.message}`);
    }

    return data || [];
  },

  // الاستماع للرسائل الجديدة (Realtime)
  subscribeToMessages(callback: (message: Message) => void) {
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: any) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return subscription;
  },

  // حذف رسالة (للإدارة فقط)
  async deleteMessage(id: number): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`فشل حذف الرسالة: ${error.message}`);
    }
  },
};
