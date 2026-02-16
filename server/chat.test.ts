import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1, role: "user" | "admin" = "user"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: `User ${userId}`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("chat router", () => {
  it("should get or create a conversation for authenticated user", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const conversation = await caller.chat.getOrCreateConversation();

    expect(conversation).toBeDefined();
    expect(conversation.userId).toBe(1);
    expect(conversation.id).toBeDefined();
  });

  it("should send a message from user", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // Get or create conversation
    const conversation = await caller.chat.getOrCreateConversation();

    // Send message
    const message = await caller.chat.sendMessage({
      conversationId: conversation.id,
      content: "Hello, I need help!",
    });

    expect(message).toBeDefined();
    expect(message.content).toBe("Hello, I need help!");
    expect(message.senderType).toBe("user");
    expect(message.conversationId).toBe(conversation.id);
  });

  it("should retrieve messages from a conversation", async () => {
    const { ctx } = createAuthContext(2);
    const caller = appRouter.createCaller(ctx);

    // Get or create conversation
    const conversation = await caller.chat.getOrCreateConversation();

    // Send multiple messages
    await caller.chat.sendMessage({
      conversationId: conversation.id,
      content: "First message",
    });

    await caller.chat.sendMessage({
      conversationId: conversation.id,
      content: "Second message",
    });

    // Get messages
    const messages = await caller.chat.getMessages({
      conversationId: conversation.id,
    });

    expect(messages).toBeDefined();
    expect(messages.length).toBeGreaterThanOrEqual(2);
    expect(messages[0]?.content).toBe("First message");
  });

  it("should only allow admins to send admin replies", async () => {
    const { ctx: userCtx } = createAuthContext(3, "user");
    const { ctx: adminCtx } = createAuthContext(4, "admin");

    const userCaller = appRouter.createCaller(userCtx);
    const adminCaller = appRouter.createCaller(adminCtx);

    // User creates conversation
    const conversation = await userCaller.chat.getOrCreateConversation();

    // User sends message
    await userCaller.chat.sendMessage({
      conversationId: conversation.id,
      content: "User message",
    });

    // Non-admin user should not be able to send admin reply
    try {
      await userCaller.chat.sendAdminReply({
        conversationId: conversation.id,
        content: "Admin reply",
      });
      expect.fail("Should have thrown error");
    } catch (error) {
      expect((error as Error).message).toContain("Only admins");
    }

    // Admin should be able to send reply
    const adminReply = await adminCaller.chat.sendAdminReply({
      conversationId: conversation.id,
      content: "Admin reply from support team",
    });

    expect(adminReply).toBeDefined();
    expect(adminReply.senderType).toBe("admin");
  });

  it("should return messages in chronological order", async () => {
    const { ctx } = createAuthContext(5);
    const caller = appRouter.createCaller(ctx);

    const conversation = await caller.chat.getOrCreateConversation();

    // Send messages with slight delays
    const msg1 = await caller.chat.sendMessage({
      conversationId: conversation.id,
      content: "Message 1",
    });

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const msg2 = await caller.chat.sendMessage({
      conversationId: conversation.id,
      content: "Message 2",
    });

    const messages = await caller.chat.getMessages({
      conversationId: conversation.id,
    });

    // Messages should be in order and have correct content
    expect(messages).toBeDefined();
    expect(messages.length).toBeGreaterThanOrEqual(2);
    const contents = messages.map(m => m.content);
    expect(contents.includes('Message 1')).toBe(true);
    expect(contents.includes('Message 2')).toBe(true);
    const msg1Idx = contents.indexOf('Message 1');
    const msg2Idx = contents.indexOf('Message 2');
    expect(msg1Idx).toBeLessThan(msg2Idx);
  });
});
