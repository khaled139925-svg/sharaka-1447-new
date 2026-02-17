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
  reply: 'admin' | 'visitor';
  is_read: boolean;
  created_at: string;
}

export const messagesService = {
  // إضافة رسالة جديدة
  async addMessage(
    messageText: string,
    replyType: 'admin' | 'visitor',
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
          reply: replyType,
          is_read: false,
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

  // تحديث حالة القراءة
  async markAsRead(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('❌ خطأ في تحديث حالة القراءة:', error);
        throw new Error(error.message);
      }

      console.log('✅ تم تحديث حالة القراءة');
    } catch (error) {
      console.error('❌ خطأ في تحديث حالة القراءة:', error);
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


};
