import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { getDb } from '../db';
import { messages } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

interface WebSocketMessage {
  type: 'send_message' | 'get_messages' | 'subscribe';
  conversationId?: string;
  content?: string;
  senderType?: 'user' | 'admin';
  email?: string;
  name?: string;
  phone?: string;
  subject?: string;
}

interface WebSocketClient {
  conversationId?: string;
  send?: (data: string) => void;
}

const clients: Map<string, WebSocketClient[]> = new Map();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/api/ws' });

  wss.on('connection', (ws) => {
    console.log('[WebSocket] Client connected');

    ws.on('message', async (data) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());

        switch (message.type) {
          case 'subscribe': {
            const conversationId = message.conversationId;
            if (conversationId) {
              if (!clients.has(conversationId)) {
                clients.set(conversationId, []);
              }
              clients.get(conversationId)!.push(ws as unknown as WebSocketClient);
              console.log(`[WebSocket] Client subscribed to conversation ${conversationId}`);
            }
            break;
          }

          case 'send_message': {
            const conversationId = message.conversationId;
            const content = message.content;
            const senderType = message.senderType || 'visitor';

            if (!conversationId || !content) {
              ws.send(JSON.stringify({ error: 'Missing conversationId or content' }));
              break;
            }

            // Save message to database
            const db = await getDb();
            if (!db) {
              ws.send(JSON.stringify({ error: 'Database not available' }));
              break;
            }
            const result = await db.insert(messages).values({
              conversationId: parseInt(conversationId),
              content,
              senderType: senderType as 'user' | 'admin',
              createdAt: new Date(),
            });

            // Broadcast to all clients subscribed to this conversation
            const conversationClients = clients.get(conversationId.toString()) || [];
            const broadcastData = JSON.stringify({
              type: 'new_message',
              conversationId,
              message: {
                content,
                senderType,
                createdAt: new Date().toISOString(),
              },
            });

            conversationClients.forEach((client) => {
              try {
                (client as any).send(broadcastData);
              } catch (e) {
                // Client may be closed
              }
            });

            // Also notify admin panel
            const adminClients = clients.get('admin') || [];
            adminClients.forEach((client) => {
              try {
                (client as any).send(broadcastData);
              } catch (e) {
                // Client may be closed
              }
            });

            break;
          }

          case 'get_messages': {
            const conversationId = message.conversationId;
            if (!conversationId) {
              ws.send(JSON.stringify({ error: 'Missing conversationId' }));
              break;
            }

            // Get all messages for this conversation
            const db = await getDb();
            if (!db) {
              ws.send(JSON.stringify({ error: 'Database not available' }));
              break;
            }
            const conversationMessages = await db
              .select()
              .from(messages)
              .where(eq(messages.conversationId, parseInt(conversationId)));

            ws.send(
              JSON.stringify({
                type: 'messages_list',
                conversationId,
                messages: conversationMessages,
              })
            );
            break;
          }
        }
      } catch (error) {
        console.error('[WebSocket] Error processing message:', error);
        ws.send(JSON.stringify({ error: 'Failed to process message' }));
      }
    });

    ws.on('close', () => {
      console.log('[WebSocket] Client disconnected');
      // Remove client from all subscriptions
      clients.forEach((clientList) => {
        const index = clientList.findIndex((c) => c.send === ws.send);
        if (index !== -1) {
          clientList.splice(index, 1);
        }
      });
    });

    ws.on('error', (error) => {
      console.error('[WebSocket] Error:', error);
    });
  });

  return wss;
}
