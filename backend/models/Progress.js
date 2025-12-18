const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  languageFlag: {
    type: String,
    required: true
  },
  completedLessons: [{
    lessonId: String,
    lessonNumber: Number,
    level: String,
    completedAt: Date,
    score: Number
  }],
  currentLevel: {
    type: String,
    default: 'A1'
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  vocabularyLearned: {
    type: Number,
    default: 0
  },
  totalLessonsCompleted: {
    type: Number,
    default: 0
  },
  levelProgress: {
    A1: { type: Number, default: 0 },
    A2: { type: Number, default: 0 },
    B1: { type: Number, default: 0 },
    B2: { type: Number, default: 0 },
    C1: { type: Number, default: 0 },
    C2: { type: Number, default: 0 }
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

progressSchema.methods.updateProgress = function(lessonId, lessonNumber, level, score) {
  const existingLesson = this.completedLessons.find(
    cl => cl.lessonId === lessonId
  );
  
  if (existingLesson) {
    existingLesson.score = Math.max(existingLesson.score, score);
    existingLesson.completedAt = new Date();
  } else {
    this.completedLessons.push({
      lessonId,
      lessonNumber,
      level,
      completedAt: new Date(),
      score
    });
  }
  
  this.totalLessonsCompleted = this.completedLessons.length;
  this.vocabularyLearned += 5;
  
  const levelLessons = {
    A1: this.completedLessons.filter(l => l.level === 'A1').length,
    A2: this.completedLessons.filter(l => l.level === 'A2').length,
    B1: this.completedLessons.filter(l => l.level === 'B1').length,
    B2: this.completedLessons.filter(l => l.level === 'B2').length,
    C1: this.completedLessons.filter(l => l.level === 'C1').length,
    C2: this.completedLessons.filter(l => l.level === 'C2').length
  };
  
  this.levelProgress = levelLessons;
  
  if (levelLessons.A1 >= 6) this.currentLevel = 'A2';
  if (levelLessons.A2 >= 4) this.currentLevel = 'B1';
  if (levelLessons.B1 >= 10) this.currentLevel = 'B2';
  if (levelLessons.B2 >= 10) this.currentLevel = 'C1';
  if (levelLessons.C1 >= 10) this.currentLevel = 'C2';
  
  const totalPossibleLessons = 40;
  this.overallProgress = Math.min(100, Math.round((this.totalLessonsCompleted / totalPossibleLessons) * 100));
  
  this.lastActivityDate = new Date();
  
  return this.save();
};

progressSchema.methods.isLessonUnlocked = function(lessonNumber, lessonLevel) {
  if (lessonNumber === 1 && lessonLevel === 'A1') {
    return true;
  }
  
  const previousLessonNumber = lessonNumber - 1;
  const previousLesson = this.completedLessons.find(
    cl => cl.lessonNumber === previousLessonNumber && cl.level === lessonLevel
  );
  
  if (previousLesson) {
    return true;
  }
  
  if (lessonNumber === 1) {
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentLevelIndex = levelOrder.indexOf(lessonLevel);
    
    if (currentLevelIndex > 0) {
      const previousLevel = levelOrder[currentLevelIndex - 1];
      const previousLevelLessons = this.completedLessons.filter(l => l.level === previousLevel);
      
      const requiredLessons = {
        'A2': 6,
        'B1': 4,
        'B2': 10,
        'C1': 10,
        'C2': 10
      };
      
      return previousLevelLessons.length >= (requiredLessons[lessonLevel] || 0);
    }
  }
  
  return false;
};

module.exports = mongoose.model('Progress', progressSchema);