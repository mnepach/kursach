const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const lessonsRoutes = require('./routes/lessons');
const progressRoutes = require('./routes/progress');
const beginnerLessonsRoutes = require('./routes/beginner-lessons');
const levelTestLessonsRoutes = require('./routes/level-test-lessons');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linguaplay', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB подключена'))
.catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/beginner-lessons', beginnerLessonsRoutes); 
app.use('/api/level-test-lessons', levelTestLessonsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LinguaPlay API работает' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});