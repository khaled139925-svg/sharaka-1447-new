/**
 * خدمة الدردشة المحلية
 * تحفظ الرسائل في localStorage وترسلها عبر البريد الإلكتروني
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  content: string;
  timestamp: number;
  userName?: string;
  userEmail?: string;
}

export interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  subject: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'sharaka_chat_sessions';
const CURRENT_SESSION_KEY = 'sharaka_current_session';

export const chatService = {
  /**
   * إنشاء جلسة دردشة جديدة
   */
  createSession(userData: {
    userName: string;
    userEmail: string;
    userPhone?: string;
    subject: string;
  }): ChatSession {
    const session: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userName: userData.userName || 'زائر',
      userEmail: userData.userEmail || 'visitor@sharaka.com',
      userPhone: userData.userPhone,
      subject: userData.subject || 'رسالة من الدردشة الفورية',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // حفظ الجلسة الحالية
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    
    // حفظ الجلسة في السجل
    const allSessions = chatService.getAllSessions();
    allSessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allSessions));

    console.log('تم إنشاء جلسة دردشة جديدة:', session.id);
    return session;
  },

  /**
   * الحصول على الجلسة الحالية
   */
  getCurrentSession(): ChatSession | null {
    try {
      const session = localStorage.getItem(CURRENT_SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('خطأ في جلب الجلسة الحالية:', error);
      return null;
    }
  },

  /**
   * إضافة رسالة إلى الجلسة الحالية
   */
  addMessage(content: string, sender: 'user' | 'admin' = 'user'): ChatMessage {
    const session = chatService.getCurrentSession();
    
    if (!session) {
      throw new Error('لا توجد جلسة دردشة نشطة');
    }

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender,
      content,
      timestamp: Date.now(),
      userName: session.userName,
      userEmail: session.userEmail,
    };

    // إضافة الرسالة إلى الجلسة
    session.messages.push(message);
    session.updatedAt = Date.now();

    // تحديث الجلسة الحالية
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));

    // تحديث السجل
    const allSessions = chatService.getAllSessions();
    const sessionIndex = allSessions.findIndex(s => s.id === session.id);
    if (sessionIndex !== -1) {
      allSessions[sessionIndex] = session;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allSessions));
    }

    console.log('تم إضافة رسالة:', message.id);
    return message;
  },

  /**
   * الحصول على جميع الرسائل في الجلسة الحالية
   */
  getMessages(): ChatMessage[] {
    const session = chatService.getCurrentSession();
    return session ? session.messages : [];
  },

  /**
   * الحصول على جميع الجلسات
   */
  getAllSessions(): ChatSession[] {
    try {
      const sessions = localStorage.getItem(STORAGE_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('خطأ في جلب جميع الجلسات:', error);
      return [];
    }
  },

  /**
   * الحصول على جلسة محددة
   */
  getSession(sessionId: string): ChatSession | null {
    const allSessions = chatService.getAllSessions();
    return allSessions.find(s => s.id === sessionId) || null;
  },

  /**
   * حذف جلسة
   */
  deleteSession(sessionId: string): void {
    const allSessions = chatService.getAllSessions();
    const filtered = allSessions.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    const currentSession = chatService.getCurrentSession();
    if (currentSession?.id === sessionId) {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }

    console.log('تم حذف الجلسة:', sessionId);
  },

  /**
   * إغلاق الجلسة الحالية
   */
  closeCurrentSession(): void {
    const session = chatService.getCurrentSession();
    if (session) {
      session.updatedAt = Date.now();
      const allSessions = chatService.getAllSessions();
      const sessionIndex = allSessions.findIndex(s => s.id === session.id);
      if (sessionIndex !== -1) {
        allSessions[sessionIndex] = session;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allSessions));
      }
      localStorage.removeItem(CURRENT_SESSION_KEY);
      console.log('تم إغلاق الجلسة:', session.id);
    }
  },

  /**
   * الحصول على ملخص الجلسة للبريد الإلكتروني
   */
  getSessionSummary(session: ChatSession): string {
    const messages = session.messages
      .map(msg => `[${new Date(msg.timestamp).toLocaleTimeString('ar-SA')}] ${msg.sender === 'user' ? 'الزائر' : 'الدعم'}: ${msg.content}`)
      .join('\n');

    return `
منصة شراكة - ملخص الدردشة الفورية
================================

المستخدم: ${session.userName}
البريد الإلكتروني: ${session.userEmail}
الهاتف: ${session.userPhone || 'لم يتم تقديمه'}
الموضوع: ${session.subject}
تاريخ الإنشاء: ${new Date(session.createdAt).toLocaleString('ar-SA')}

الرسائل:
--------
${messages}

================================
تم إنشاء هذا الملخص تلقائياً من نظام الدردشة الفورية
    `;
  },

  /**
   * تصدير جميع الجلسات
   */
  exportSessions(): string {
    const allSessions = chatService.getAllSessions();
    return JSON.stringify(allSessions, null, 2);
  },

  /**
   * مسح جميع البيانات
   */
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_SESSION_KEY);
    console.log('تم مسح جميع بيانات الدردشة');
  },
};
