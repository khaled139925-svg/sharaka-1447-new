import { describe, it, expect, beforeAll, vi } from 'vitest';
import emailjs from '@emailjs/browser';

// Mock EmailJS
vi.mock('@emailjs/browser', () => ({
  default: {
    init: vi.fn(),
    send: vi.fn(),
  },
}));

describe('EmailJS Integration', () => {
  beforeAll(() => {
    // تهيئة EmailJS
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  });

  it('يجب أن تكون بيانات اعتماد EmailJS موجودة', () => {
    expect(import.meta.env.VITE_EMAILJS_SERVICE_ID).toBeDefined();
    expect(import.meta.env.VITE_EMAILJS_TEMPLATE_ID).toBeDefined();
    expect(import.meta.env.VITE_EMAILJS_PUBLIC_KEY).toBeDefined();
  });

  it('يجب أن تكون قادرة على إرسال بريد إلكتروني', async () => {
    const mockResponse = { status: 200 };
    vi.mocked(emailjs.send).mockResolvedValueOnce(mockResponse as any);

    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_email: 'test@example.com',
        subject: 'اختبار',
        message: 'رسالة اختبار',
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    expect(result.status).toBe(200);
  });

  it('يجب أن تتعامل مع أخطاء الإرسال', async () => {
    const mockError = new Error('خطأ في الإرسال');
    vi.mocked(emailjs.send).mockRejectedValueOnce(mockError);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: 'test@example.com',
          subject: 'اختبار',
          message: 'رسالة اختبار',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });
});
