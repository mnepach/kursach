const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planType: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  features: {
    maxLanguages: {
      type: Number,
      default: 1
    },
    offlineMode: {
      type: Boolean,
      default: false
    },
    adFree: {
      type: Boolean,
      default: false
    },
    personalizedLearning: {
      type: Boolean,
      default: false
    },
    unlimitedLessons: {
      type: Boolean,
      default: false
    },
    certificateAccess: {
      type: Boolean,
      default: false
    }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'apple_pay', 'google_pay', null],
    default: null
  },
  price: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'RUB'
    },
    billingPeriod: {
      type: String,
      enum: ['monthly', 'yearly', null],
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Определение возможностей планов
subscriptionSchema.statics.getPlanFeatures = function(planType) {
  const plans = {
    free: {
      maxLanguages: 1,
      offlineMode: false,
      adFree: false,
      personalizedLearning: false,
      unlimitedLessons: false,
      certificateAccess: false,
      price: { amount: 0, currency: 'RUB', billingPeriod: null }
    },
    basic: {
      maxLanguages: 3,
      offlineMode: true,
      adFree: true,
      personalizedLearning: false,
      unlimitedLessons: true,
      certificateAccess: false,
      price: { amount: 499, currency: 'RUB', billingPeriod: 'monthly' }
    },
    premium: {
      maxLanguages: 999,
      offlineMode: true,
      adFree: true,
      personalizedLearning: true,
      unlimitedLessons: true,
      certificateAccess: true,
      price: { amount: 899, currency: 'RUB', billingPeriod: 'monthly' }
    }
  };
  return plans[planType] || plans.free;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);