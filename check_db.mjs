import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
console.log('Database URL:', dbUrl?.replace(/:[^:]*@/, ':***@'));

const connection = await mysql.createConnection(dbUrl);

try {
  const [conversations] = await connection.execute('SELECT COUNT(*) as count FROM conversations');
  const [messages] = await connection.execute('SELECT COUNT(*) as count FROM messages');
  const [messagesSample] = await connection.execute('SELECT id, conversationId, userId, senderType, content, createdAt FROM messages ORDER BY createdAt DESC LIMIT 10');

  console.log('\n✅ عدد المحادثات:', conversations[0].count);
  console.log('✅ عدد الرسائل:', messages[0].count);
  console.log('\n📋 آخر 10 رسائل:');
  messagesSample.forEach((msg, idx) => {
    console.log(`${idx + 1}. ID: ${msg.id}, ConvID: ${msg.conversationId}, Type: ${msg.senderType}, Content: "${msg.content.substring(0, 40)}...", Date: ${msg.createdAt}`);
  });
} catch (error) {
  console.error('❌ خطأ:', error.message);
} finally {
  await connection.end();
}
