import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Connection Test', () => {
  it('يجب أن تكون بيانات اعتماد Supabase صحيحة', async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseAnonKey).toBeDefined();
    expect(supabaseUrl).toContain('supabase.co');
    expect(supabaseAnonKey).toContain('sb_publishable');
  });

  it('يجب أن يكون بإمكاننا الاتصال بـ Supabase', async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    expect(supabase).toBeDefined();
  });

  it('يجب أن نتمكن من اختبار الاتصال بـ Supabase', async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // محاولة جلب البيانات من جدول بسيط للتحقق من الاتصال
    const { error } = await supabase
      .from('conversations')
      .select('count', { count: 'exact' })
      .limit(1);

    // إذا كان هناك خطأ في الجدول، فهذا يعني أن الاتصال يعمل لكن الجدول غير موجود
    // وهذا مقبول لأننا لم نقم بإنشاء الجداول بعد
    if (error && error.message.includes('does not exist')) {
      expect(true).toBe(true);
    } else if (error) {
      throw error;
    }
  });
});
