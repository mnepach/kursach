const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    required: true
  },
  lessonNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  exercises: [{
    type: {
      type: String,
      enum: ['listen', 'selectImage', 'translateToTarget', 'translateToRussian', 'fillBlank', 'matching'],
      required: true
    },
    question: String,
    audio: String,
    words: [String],
    options: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed,
    targetLanguage: String,
    russianText: String,
    targetText: String,
    word: String,
    points: {
      type: Number,
      default: 10
    }
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Вычисляем общее количество очков при сохранении
lessonSchema.pre('save', function(next) {
  this.totalPoints = this.exercises.reduce((sum, ex) => sum + (ex.points || 10), 0);
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);