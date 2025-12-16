const express = require('express');
const Lesson = require('../models/Lesson');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    const { level } = req.query;
    
    const languageMap = {
      'Английский': 'english',
      'Испанский': 'spanish',
      'Японский': 'japanese',
      'Корейский': 'korean'
    };
    
    const languageKey = languageMap[language] || language.toLowerCase();
    
    const query = { language: languageKey };
    if (level) {
      query.level = level;
    }
    
    const lessons = await Lesson.find(query).sort({ lessonNumber: 1 });
    
    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ message: 'Уроки для этого языка не найдены' });
    }
    
    const userPlan = req.user.subscription?.planType || 'free';
    const filteredLessons = lessons.map(lesson => {
      const lessonObj = lesson.toObject();
      if (lessonObj.isPremium && userPlan === 'free') {
        return { ...lessonObj, locked: true };
      }
      return lessonObj;
    });
    
    res.json({ lessons: filteredLessons });
  } catch (error) {
    console.error('Ошибка получения уроков:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:language/:lessonNumber', authMiddleware, async (req, res) => {
  try {
    const { language, lessonNumber } = req.params;
    
    const languageMap = {
      'Английский': 'english',
      'Испанский': 'spanish',
      'Японский': 'japanese',
      'Корейский': 'korean'
    };
    
    const languageKey = languageMap[language] || language.toLowerCase();
    
    const lesson = await Lesson.findOne({
      language: languageKey,
      lessonNumber: parseInt(lessonNumber)
    });
    
    if (!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }
    
    const userPlan = req.user.subscription?.planType || 'free';
    if (lesson.isPremium && userPlan === 'free') {
      return res.status(403).json({ 
        message: 'Этот урок доступен только для премиум пользователей',
        locked: true 
      });
    }
    
    res.json({ lesson });
  } catch (error) {
    console.error('Ошибка получения урока:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:language/levels/available', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    
    const languageMap = {
      'Английский': 'english',
      'Испанский': 'spanish',
      'Японский': 'japanese',
      'Корейский': 'korean'
    };
    
    const languageKey = languageMap[language] || language.toLowerCase();
    
    const levels = await Lesson.distinct('level', { language: languageKey });
    
    res.json({ levels: levels.sort() });
  } catch (error) {
    console.error('Ошибка получения уровней:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;