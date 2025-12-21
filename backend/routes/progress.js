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
    
    const languageMap = {
      'Английский': 'english',
      'Испанский': 'spanish',
      'Японский': 'japanese',
      'Корейский': 'korean'
    };
    
    const languageKey = languageMap[language] || language.toLowerCase();
    
    let progress = await Progress.findOne({ 
      user: req.user._id, 
      language: languageKey 
    });
    
    if (!progress) {
      const languageFlags = {
        'english': '🇬🇧',
        'spanish': '🇪🇸',
        'japanese': '🇯🇵',
        'korean': '🇰🇷'
      };
      
      progress = new Progress({
        user: req.user._id,
        language: languageKey,
        languageFlag: languageFlags[languageKey] || '🌍',
        currentLevel: 'A1',
        overallProgress: 0,
        vocabularyLearned: 0,
        totalLessonsCompleted: 0,
        levelProgress: {
          A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0
        }
      });
      
      await progress.save();
    }
    
    res.json({ progress });
  } catch (error) {
    console.error('Ошибка получения прогресса для языка:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:language/complete', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    const { lessonId, score, lessonNumber, level } = req.body;
    
    const languageMap = {
      'Английский': 'english',
      'Испанский': 'spanish',
      'Японский': 'japanese',
      'Корейский': 'korean'
    };
    
    const languageKey = languageMap[language] || language.toLowerCase();
    
    let progress = await Progress.findOne({ 
      user: req.user._id, 
      language: languageKey 
    });
    
    if (!progress) {
      const languageFlags = {
        'english': '🇬🇧',
        'spanish': '🇪🇸',
        'japanese': '🇯🇵',
        'korean': '🇰🇷'
      };
      
      progress = new Progress({
        user: req.user._id,
        language: languageKey,
        languageFlag: languageFlags[languageKey] || '🌍',
        currentLevel: 'A1',
        overallProgress: 0,
        vocabularyLearned: 0,
        totalLessonsCompleted: 0,
        levelProgress: {
          A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0
        }
      });
    }
    
    await progress.updateProgress(lessonId, lessonNumber, level, score);
    
    const user = await User.findById(req.user._id);
    user.statistics.experience += score;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActivity = user.statistics.lastActivityDate 
      ? new Date(user.statistics.lastActivityDate) 
      : null;
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        user.statistics.streak += 1;
      } else if (dayDiff > 1) {
        user.statistics.streak = 1;
      }
    } else {
      user.statistics.streak = 1;
    }
    
    user.statistics.lastActivityDate = new Date();
    await user.save();
    
    res.json({ 
      message: 'Урок завершен', 
      progress,
      statistics: user.statistics
    });
  } catch (error) {
    console.error('Ошибка обновления прогресса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/stats/overall', authMiddleware, async (req, res) => {
  try {
    const allProgress = await Progress.find({ user: req.user._id });
    
    const totalLessonsCompleted = allProgress.reduce(
      (sum, p) => sum + (p.totalLessonsCompleted || 0), 
      0
    );
    
    const totalVocabulary = allProgress.reduce(
      (sum, p) => sum + (p.vocabularyLearned || 0), 
      0
    );
    
    const languages = allProgress.map(p => ({
      language: p.language.charAt(0).toUpperCase() + p.language.slice(1),
      currentLevel: p.currentLevel,
      progress: p.overallProgress,
      lessonsCompleted: p.totalLessonsCompleted,
      vocabularyLearned: p.vocabularyLearned,
      levelProgress: p.levelProgress
    }));
    
    res.json({
      stats: {
        totalLanguages: allProgress.length,
        totalLessonsCompleted,
        totalVocabulary,
        languages
      }
    });
  } catch (error) {
    console.error('Ошибка получения общей статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;