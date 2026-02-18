import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createOrGetConversation, addMessage, getConversationMessages, getUserConversation } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  chat: router({
    getOrCreateConversation: protectedProcedure.query(async ({ ctx }) => {
      return await createOrGetConversation(ctx.user.id);
    }),
    
    getMessages: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ input }) => {
        return await getConversationMessages(input.conversationId);
      }),
    
    sendMessage: protectedProcedure
      .input(z.object({ conversationId: z.number(), content: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        return await addMessage(input.conversationId, ctx.user.id, input.content, "user");
      }),
    
    sendAdminReply: protectedProcedure
      .input(z.object({ conversationId: z.number(), content: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        // تحقق من أن المستخدم هو admin
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can send replies");
        }
        return await addMessage(input.conversationId, ctx.user.id, input.content, "admin");
      }),
  }),

  admin: router({
    getAllConversations: publicProcedure.query(async ({ ctx }) => {
      const db = await (await import("./db")).getDb();
      if (!db) throw new Error("Database not available");
      
      const { conversations: convsTable, messages: msgsTable } = await import("../drizzle/schema");
      const { desc } = await import("drizzle-orm");
      
      // الحصول على جميع المحادثات مع آخر رسالة
      const allConversations = await db.select().from(convsTable).orderBy(desc(convsTable.updatedAt));
      
      const result = await Promise.all(
        allConversations.map(async (conv) => {
          const msgs = await db.select().from(msgsTable).where((await import("drizzle-orm")).eq(msgsTable.conversationId, conv.id)).orderBy(desc(msgsTable.createdAt));
          return {
            ...conv,
            messages: msgs,
            lastMessage: msgs[0] || null,
          };
        })
      );
      
      return result;
    }),

    getConversationMessages: publicProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ input }) => {
        return await getConversationMessages(input.conversationId);
      }),

    sendAdminReply: publicProcedure
      .input(z.object({ conversationId: z.number(), content: z.string().min(1), userId: z.number() }))
      .mutation(async ({ input }) => {
        return await addMessage(input.conversationId, input.userId, input.content, "admin");
      }),

    deleteMessage: publicProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        const { messages: msgsTable } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.delete(msgsTable).where(eq(msgsTable.id, input.messageId));
        return { success: true };
      }),

    deleteConversation: publicProcedure
      .input(z.object({ conversationId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        const { conversations: convsTable, messages: msgsTable } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // حذف جميع الرسائل أولاً
        await db.delete(msgsTable).where(eq(msgsTable.conversationId, input.conversationId));
        // ثم حذف المحادثة
        await db.delete(convsTable).where(eq(convsTable.id, input.conversationId));
        return { success: true };
      }),

    sendContactMessage: publicProcedure
      .input(z.object({ 
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        subject: z.string().min(1),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        const { conversations: convsTable, messages: msgsTable } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // إنشاء محادثة جديدة أو الحصول على محادثة موجودة
        let conversation = await db.select().from(convsTable).where(eq(convsTable.userId, 0)).limit(1);
        
        let conversationId: number;
        if (conversation.length === 0) {
          // إنشاء محادثة جديدة للرسائل العامة
          const result = await db.insert(convsTable).values({
            userId: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          // الحصول على المحادثة المنشأة للحصول على ID
          const newConv = await db.select().from(convsTable).where(eq(convsTable.userId, 0)).orderBy((await import("drizzle-orm")).desc(convsTable.id)).limit(1);
          conversationId = newConv[0]?.id || 0;
        } else {
          conversationId = conversation[0].id;
        }
        
        // إضافة الرسالة
        const messageContent = `الاسم: ${input.name}\nالبريد: ${input.email}\nالهاتف: ${input.phone}\nالموضوع: ${input.subject}\n\nالرسالة:\n${input.message}`;
        await db.insert(msgsTable).values({
          conversationId: conversationId,
          userId: 0,
          content: messageContent,
          senderType: "user",
          createdAt: new Date(),
        });
        
        return { success: true, conversationId };
      }),
  }),
});

export type AppRouter = typeof appRouter;
