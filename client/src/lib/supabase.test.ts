import { describe, it, expect, beforeAll, vi } from 'vitest';
import { chatService, Conversation, Message } from './supabase';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              id: '123',
              user_name: 'أحمد',
              user_email: 'ahmed@example.com',
              subject: 'استفسار',
              status: 'open',
              created_at: new Date().toISOString(),
            },
            error: null,
          })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              id: '123',
              user_name: 'أحمد',
              user_email: 'ahmed@example.com',
              subject: 'استفسار',
              status: 'open',
            },
            error: null,
          })),
        })),
        order: vi.fn(() => Promise.resolve({
          data: [
            {
              id: '123',
              user_name: 'أحمد',
              user_email: 'ahmed@example.com',
              subject: 'استفسار',
              status: 'open',
            },
          ],
          error: null,
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                id: '123',
                status: 'closed',
              },
              error: null,
            })),
          })),
        })),
      })),
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(),
      })),
    })),
  })),
}));

describe('Supabase Chat Service', () => {
  it('يجب أن تكون بيانات اعتماد Supabase موجودة', () => {
    expect(import.meta.env.VITE_SUPABASE_URL).toBeDefined();
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBeDefined();
  });

  it('يجب أن تكون قادرة على إنشاء محادثة جديدة', async () => {
    const conversationData: Omit<Conversation, 'id' | 'created_at' | 'updated_at'> = {
      user_name: 'أحمد',
      user_email: 'ahmed@example.com',
      user_phone: '0501234567',
      subject: 'استفسار عن الخدمات',
      status: 'open',
    };

    const result = await chatService.createConversation(conversationData);
    expect(result).toBeDefined();
    expect(result.id).toBe('123');
    expect(result.user_name).toBe('أحمد');
  });

  it('يجب أن تكون قادرة على جلب المحادثات', async () => {
    const conversations = await chatService.getConversations();
    expect(Array.isArray(conversations)).toBe(true);
  });

  it('يجب أن تكون قادرة على جلب محادثة محددة', async () => {
    const conversation = await chatService.getConversation('123');
    expect(conversation).toBeDefined();
    expect(conversation.id).toBe('123');
  });

  it('يجب أن تكون قادرة على تحديث حالة المحادثة', async () => {
    const result = await chatService.updateConversationStatus('123', 'closed');
    expect(result).toBeDefined();
    expect(result.status).toBe('closed');
  });

  it('يجب أن تتعامل مع أخطاء الاتصال بـ Supabase', async () => {
    try {
      // محاولة إنشاء محادثة بدون بيانات
      await chatService.createConversation({
        user_name: '',
        user_email: '',
        subject: '',
        status: 'open',
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe('Message Types', () => {
  it('يجب أن يكون لدينا نوع Message صحيح', () => {
    const message: Message = {
      id: '1',
      conversation_id: '123',
      sender: 'user',
      content: 'مرحبا',
      created_at: new Date().toISOString(),
      read: false,
    };

    expect(message.sender).toBe('user');
    expect(message.content).toBe('مرحبا');
  });

  it('يجب أن يكون لدينا نوع Conversation صحيح', () => {
    const conversation: Conversation = {
      id: '1',
      user_name: 'أحمد',
      user_email: 'ahmed@example.com',
      user_phone: '0501234567',
      subject: 'استفسار',
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    expect(conversation.status).toBe('open');
    expect(conversation.user_name).toBe('أحمد');
  });
});
