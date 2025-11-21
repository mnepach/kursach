const express = require('express');
const Progress = require('../models/Progress');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Получить весь прогресс пользователя
router.get('/', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id });
    res.json({ progress });
  } catch (error) {
    console.error('Ошибка получения прогресса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить прогресс по конкретному языку
router.get('/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    
    let progress = await Progress.findOne({ 
      user: req.user._id, 
      language 
    });
    
    // Если прогресса нет, создаем новый
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

// Обновить прогресс после завершения урока
router.post('/:language/complete', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    const { lessonId, score } = req.body;
    
    let progress = await Progress.findOne({ 
      user: req.user._id, 
      language 
    });
    
    if (!progress) {
      return res.status(404).json({ message: 'Прогресс не найден' });
    }
    
    // Обновляем прогресс
    await progress.updateProgress(lessonId, score);
    
    // Обновляем статистику пользователя
    const user = await User.findById(req.user._id);
    user.statistics.experience += score || 10;
    user.statistics.streak = calculateStreak(progress.lastActivityDate);
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

// Получить статистику пользователя
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
        currentLevel: p.currentLevel
      }))
    };
    
    res.json({ stats });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вспомогательная функция для расчета серии дней
function calculateStreak(lastActivity) {
  const now = new Date();
  const lastDate = new Date(lastActivity);
  const diffTime = Math.abs(now - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Если последняя активность была сегодня или вчера, увеличиваем серию
  if (diffDays <= 1) {
    return 1; // В реальном приложении это должно быть более сложным
  }
  
  return 0;
}

module.exports = router;