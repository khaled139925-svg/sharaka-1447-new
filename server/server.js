const express = require('express');
const cors = require('cors');
const { StreamChat } = require('stream-chat');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const STREAM_API_KEY = process.env.VITE_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.VITE_STREAM_API_SECRET;

if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  console.error('❌ مفاتيح Stream Chat غير موجودة في ملف .env');
  process.exit(1);
}

const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

app.post('/token', async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const token = serverClient.createToken(user_id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ خادم التوكن يعمل على http://localhost:${PORT}`);
});