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
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Метод для обновления прогресса
progressSchema.methods.updateProgress = function(lessonId, score) {
  // Добавляем урок в завершенные
  this.completedLessons.push({
    lessonId,
    completedAt: new Date(),
    score
  });
  
  this.totalLessonsCompleted = this.completedLessons.length;
  this.vocabularyLearned += 5; 
  
  this.overallProgress = Math.min(100, this.totalLessonsCompleted * 5);
  
  this.lastActivityDate = new Date();
  
  return this.save();
};

module.exports = mongoose.model('Progress', progressSchema);