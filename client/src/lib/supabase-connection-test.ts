import { describe, it, expect } from 'vitest';
import { supabase } from './supabase';

describe('Supabase Connection', () => {
  it('should connect to Supabase and check if conversations table exists', async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Supabase Error:', error);
        throw new Error(`فشل الاتصال بـ Supabase: ${error.message}`);
      }

      expect(data).toBeDefined();
      console.log('✅ اتصال Supabase نجح');
    } catch (error) {
      console.error('❌ فشل اختبار الاتصال:', error);
      throw error;
    }
  });

  it('should check if messages table exists', async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Supabase Error:', error);
        throw new Error(`فشل الاتصال بـ Supabase: ${error.message}`);
      }

      expect(data).toBeDefined();
      console.log('✅ جدول messages موجود');
    } catch (error) {
      console.error('❌ فشل اختبار الجدول:', error);
      throw error;
    }
  });
});
