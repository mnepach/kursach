const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const progressRoutes = require('./routes/progress');
const beginnerLessonsRoutes = require('./routes/beginner-lessons');
const levelTestLessonsRoutes = require('./routes/level-test-lessons');
const lessonsRoutes = require('./routes/lessons');

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:3000'], 
  credentials: true
}));

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/beginner-lessons', beginnerLessonsRoutes);
app.use('/api/level-test-lessons', levelTestLessonsRoutes);
app.use('/api/lessons', lessonsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LinguaPlay API работает' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
