/**
 * خدمة الدردشة البسيطة (بدون Supabase)
 * تستخدم localStorage لحفظ الرسائل
 */

export const chatService = {
  createConversation: async (data: any) => {
    const id = `conv-${Date.now()}`;
    return { id, ...data };
  },

  addMessage: async (data: any) => {
    return {
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleString('ar-SA'),
      ...data,
    };
  },
};
