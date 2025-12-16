const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Lesson = require('../models/Lesson');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linguaplay');
    console.log('✅ MongoDB подключена');
  } catch (err) {
    console.error('❌ Ошибка подключения к MongoDB:', err);
    process.exit(1);
  }
};

const loadLessonsFromFile = (language) => {
  const filePath = path.join(__dirname, `../data/lessons/${language}.json`);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const seedLessons = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Удаление существующих уроков...');
    await Lesson.deleteMany({});
    
    const languages = ['english', 'spanish', 'japanese', 'korean'];
    
    for (const language of languages) {
      console.log(`\n📚 Загрузка уроков для ${language}...`);
      
      const lessons = loadLessonsFromFile(language);
      
      for (const lessonData of lessons) {
        const lesson = new Lesson({
          language,
          level: lessonData.level,
          lessonNumber: lessonData.lessonNumber,
          title: lessonData.title,
          description: lessonData.description || '',
          exercises: lessonData.exercises,
          isPremium: lessonData.lessonNumber > 5
        });
        
        await lesson.save();
        console.log(`  ✓ Урок ${lessonData.lessonNumber}: ${lessonData.title}`);
      }
      
      console.log(`✅ Загружено ${lessons.length} уроков для ${language}`);
    }
    
    console.log('\n🎉 Все уроки успешно загружены!');
    
    const totalLessons = await Lesson.countDocuments();
    console.log(`📊 Всего уроков в базе: ${totalLessons}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при загрузке уроков:', error);
    process.exit(1);
  }
};

seedLessons();