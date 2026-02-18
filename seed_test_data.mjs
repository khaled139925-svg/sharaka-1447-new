import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
const connection = await mysql.createConnection(dbUrl);

try {
  // إنشاء محادثة اختبار 1
  const [conv1] = await connection.execute(
    'INSERT INTO conversations (userId) VALUES (?)',
    [1]
  );
  const convId1 = conv1.insertId;

  // إضافة رسائل للمحادثة الأولى
  await connection.execute(
    'INSERT INTO messages (conversationId, userId, senderType, content) VALUES (?, ?, ?, ?)',
    [convId1, 1, 'user', 'مرحبا، أحتاج إلى استشارة في مشروعي الجديد']
  );

  await connection.execute(
    'INSERT INTO messages (conversationId, userId, senderType, content) VALUES (?, ?, ?, ?)',
    [convId1, 1, 'user', 'هل يمكنك مساعدتي في التخطيط؟']
  );

  // إنشاء محادثة اختبار 2
  const [conv2] = await connection.execute(
    'INSERT INTO conversations (userId) VALUES (?)',
    [2]
  );
  const convId2 = conv2.insertId;

  // إضافة رسائل للمحادثة الثانية
  await connection.execute(
    'INSERT INTO messages (conversationId, userId, senderType, content) VALUES (?, ?, ?, ?)',
    [convId2, 2, 'user', 'أريد معرفة المزيد عن خدماتكم']
  );

  // إنشاء محادثة اختبار 3
  const [conv3] = await connection.execute(
    'INSERT INTO conversations (userId) VALUES (?)',
    [3]
  );
  const convId3 = conv3.insertId;

  // إضافة رسائل للمحادثة الثالثة
  await connection.execute(
    'INSERT INTO messages (conversationId, userId, senderType, content) VALUES (?, ?, ?, ?)',
    [convId3, 3, 'user', 'هل توفرون خدمات التعهيد؟']
  );

  await connection.execute(
    'INSERT INTO messages (conversationId, userId, senderType, content) VALUES (?, ?, ?, ?)',
    [convId3, 3, 'admin', 'نعم، نوفر خدمات تعهيد متكاملة. كيف يمكننا مساعدتك؟']
  );

  console.log('✅ تم إنشاء بيانات الاختبار بنجاح!');
  console.log(`- محادثة 1: ${convId1} (رسالتان من الزائر)`);
  console.log(`- محادثة 2: ${convId2} (رسالة واحدة من الزائر)`);
  console.log(`- محادثة 3: ${convId3} (رسالتان من الزائر + رد من الإدارة)`);
} catch (error) {
  console.error('❌ خطأ:', error.message);
} finally {
  await connection.end();
}
