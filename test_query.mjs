import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
const connection = await mysql.createConnection(dbUrl);

try {
  const [conversations] = await connection.execute('SELECT * FROM conversations');
  const [messages] = await connection.execute('SELECT * FROM messages');

  console.log('✅ عدد المحادثات:', conversations.length);
  console.log('✅ عدد الرسائل:', messages.length);
  
  console.log('\n📋 المحادثات:');
  conversations.forEach(c => {
    console.log(`- ID: ${c.id}, UserID: ${c.userId}, Created: ${c.createdAt}`);
  });

  console.log('\n📋 الرسائل:');
  messages.forEach(m => {
    console.log(`- ID: ${m.id}, ConvID: ${m.conversationId}, Type: ${m.senderType}, Content: "${m.content.substring(0, 30)}..."`);
  });
} catch (error) {
  console.error('❌ خطأ:', error.message);
} finally {
  await connection.end();
}
