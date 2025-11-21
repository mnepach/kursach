const express = require('express');
const Lesson = require('../models/Lesson');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Загрузить уроки из JSON в базу данных (одноразовая операция)
router.post('/seed', async (req, res) => {
  try {
    const lessonsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/lessons.json'), 'utf8')
    );
    
    // Очищаем старые уроки
    await Lesson.deleteMany({});
    
    const allLessons = [];
    
    for (const [langKey, lessons] of Object.entries(lessonsData)) {
      for (const lesson of lessons) {
        allLessons.push(lesson);
      }
    }
    
    await Lesson.insertMany(allLessons);
    
    res.json({ message: 'Уроки успешно загружены', count: allLessons.length });
  } catch (error) {
    console.error('Ошибка загрузки уроков:', error);
    res.status(500).json({ message: 'Ошибка загрузки уроков' });
  }
});

// Получить все уроки для языка
router.get('/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    const { level } = req.query;
    
    const query = { language };
    if (level) query.level = level;
    
    const lessons = await Lesson.find(query).sort({ lessonNumber: 1 });
    
    // Фильтруем премиум уроки для бесплатных пользователей
    const subscription = req.user.subscription;
    const filteredLessons = lessons.filter(lesson => {
      if (!lesson.isPremium) return true;
      if (subscription && subscription.planType !== 'free') return true;
      return false;
    });
    
    res.json({ lessons: filteredLessons });
  } catch (error) {
    console.error('Ошибка получения уроков:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить конкретный урок
router.get('/:language/:lessonNumber', authMiddleware, async (req, res) => {
  try {
    const { language, lessonNumber } = req.params;
    
    const lesson = await Lesson.findOne({ 
      language, 
      lessonNumber: parseInt(lessonNumber) 
    });
    
    if (!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }
    
    // Проверяем доступ к премиум урокам
    const subscription = req.user.subscription;
    if (lesson.isPremium && subscription.planType === 'free') {
      return res.status(403).json({ 
        message: 'Этот урок доступен только для премиум пользователей' 
      });
    }
    
    res.json({ lesson });
  } catch (error) {
    console.error('Ошибка получения урока:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить доступные уровни для языка
router.get('/:language/levels', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    
    const levels = await Lesson.distinct('level', { language });
    
    res.json({ levels: levels.sort() });
  } catch (error) {
    console.error('Ошибка получения уровней:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;