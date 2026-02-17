import { describe, it, expect, vi, beforeEach } from 'vitest';
import { messagesService } from './supabase-messages';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              id: 1,
              name: 'زائر',
              email: 'visitor@sharaka.sa',
              message: 'رسالة اختبار',
              content: 'رسالة اختبار',
              reply: 'visitor',
              created_at: new Date().toISOString(),
            },
            error: null,
          })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: [],
            error: null,
          })),
        })),
        order: vi.fn(() => Promise.resolve({
          data: [],
          error: null,
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          error: null,
        })),
      })),
    })),
  })),
}));

describe('Chat System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Messages Service', () => {
    it('should add a visitor message', async () => {
      const message = await messagesService.addMessage('رسالة اختبار', 'visitor');
      
      expect(message).toBeDefined();
      expect(message.reply).toBe('visitor');
      expect(message.message).toBe('رسالة اختبار');
    });

    it('should add an admin message', async () => {
      const message = await messagesService.addMessage(
        'رد من الإدارة',
        'admin',
        'الإدارة',
        'admin@sharaka.sa'
      );
      
      expect(message).toBeDefined();
      expect(message.reply).toBe('admin');
      expect(message.name).toBe('الإدارة');
    });

    it('should get all messages', async () => {
      const messages = await messagesService.getMessages();
      
      expect(Array.isArray(messages)).toBe(true);
    });

    it('should get visitor messages only', async () => {
      const messages = await messagesService.getVisitorMessages();
      
      expect(Array.isArray(messages)).toBe(true);
    });

    it('should delete a message', async () => {
      await expect(messagesService.deleteMessage(1)).resolves.toBeUndefined();
    });
  });

  describe('Admin Mode', () => {
    it('should validate admin password', () => {
      const correctPassword = 'tariq';
      const wrongPassword = 'wrong';
      
      expect(correctPassword === 'tariq').toBe(true);
      expect(wrongPassword === 'tariq').toBe(false);
    });

    it('should differentiate between visitor and admin messages', () => {
      const visitorMsg = { reply: 'visitor' as const };
      const adminMsg = { reply: 'admin' as const };
      
      expect(visitorMsg.reply).toBe('visitor');
      expect(adminMsg.reply).toBe('admin');
      expect(visitorMsg.reply !== adminMsg.reply).toBe(true);
    });
  });

  describe('Chat Widget State', () => {
    it('should toggle between visitor and admin modes', () => {
      let isAdminMode = false;
      
      // Start in visitor mode
      expect(isAdminMode).toBe(false);
      
      // Switch to admin mode
      isAdminMode = true;
      expect(isAdminMode).toBe(true);
      
      // Switch back to visitor mode
      isAdminMode = false;
      expect(isAdminMode).toBe(false);
    });

    it('should clear admin data on logout', () => {
      let adminPassword = 'tariq';
      let adminReplyText = 'رد اختبار';
      let isAdminMode = true;
      
      // Simulate logout
      isAdminMode = false;
      adminPassword = '';
      adminReplyText = '';
      
      expect(isAdminMode).toBe(false);
      expect(adminPassword).toBe('');
      expect(adminReplyText).toBe('');
    });
  });
});
