const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/:language', async (req, res) => {
  try {
    const { language } = req.params;
    
    const languageMap = {
      'Английский': 'english',
      'Испанский': 'spanish',
      'Японский': 'japanese',
      'Корейский': 'korean'
    };
    
    const languageKey = languageMap[language] || language.toLowerCase();
    
    const lessonsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/beginner-lessons.json'), 'utf8')
    );
    
    const lessons = lessonsData[languageKey];
    
    if (!lessons) {
      return res.status(404).json({ message: 'Уроки для этого языка не найдены' });
    }
    
    console.log(`Загружены уроки для начинающих (${language}):`, lessons.length);
    
    res.json({ lessons });
  } catch (error) {
    console.error('Ошибка получения начальных уроков:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;