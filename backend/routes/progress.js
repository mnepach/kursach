const express = require('express');
const Progress = require('../models/Progress');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id });
    res.json({ progress });
  } catch (error) {
    console.error('Ошибка получения прогресса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    
    let progress = await Progress.findOne({ 
      user: req.user._id, 
      language 
    });
    
    if (!progress) {
      const languageData = {
        'Английский': '../trickle/assets/england.png',
        'Испанский': '../trickle/assets/spain.png',
        'Японский': '../trickle/assets/japan.png',
        'Корейский': '../trickle/assets/korea.png'
      };
      
      progress = new Progress({
        user: req.user._id,
        language,
        languageFlag: languageData[language] || '../trickle/assets/icon.jpg'
      });
      
      await progress.save();
    }
    
    res.json({ progress });
  } catch (error) {
    console.error('Ошибка получения прогресса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:language/complete', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    const { lessonId, lessonNumber, level, score } = req.body;
    
    let progress = await Progress.findOne({ 
      user: req.user._id, 
      language 
    });
    
    if (!progress) {
      return res.status(404).json({ message: 'Прогресс не найден' });
    }
    
    await progress.updateProgress(lessonId, lessonNumber, level, score);
    
    const user = await User.findById(req.user._id);
    user.statistics.experience += score || 10;
    user.statistics.streak = calculateStreak(progress.lastActivityDate, user.statistics.lastActivityDate);
    user.statistics.lastActivityDate = new Date();
    await user.save();
    
    res.json({ 
      progress,
      statistics: user.statistics,
      message: 'Прогресс обновлен' 
    });
  } catch (error) {
    console.error('Ошибка обновления прогресса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/stats/overall', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id });
    
    const stats = {
      totalLanguages: progress.length,
      totalLessonsCompleted: progress.reduce((sum, p) => sum + p.totalLessonsCompleted, 0),
      totalVocabulary: progress.reduce((sum, p) => sum + p.vocabularyLearned, 0),
      languages: progress.map(p => ({
        language: p.language,
        flag: p.languageFlag,
        progress: p.overallProgress,
        lessonsCompleted: p.totalLessonsCompleted,
        currentLevel: p.currentLevel,
        levelProgress: p.levelProgress
      }))
    };
    
    res.json({ stats });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

function calculateStreak(lastActivity, previousActivity) {
  const now = new Date();
  const lastDate = new Date(lastActivity);
  const prevDate = previousActivity ? new Date(previousActivity) : null;
  
  const hoursSinceLastActivity = Math.abs(now - lastDate) / 36e5;
  
  if (hoursSinceLastActivity > 48) {
    return 1;
  }
  
  if (prevDate) {
    const hoursBetweenActivities = Math.abs(lastDate - prevDate) / 36e5;
    if (hoursBetweenActivities <= 48) {
      return 1;
    }
  }
  
  return 1;
}

module.exports = router;