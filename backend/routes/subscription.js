const express = require('express');
const Subscription = require('../models/Subscription');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Получить все доступные планы
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Бесплатный',
      description: 'Базовые возможности обучения',
      price: 0,
      currency: 'RUB',
      billingPeriod: null,
      features: [
        '1 язык для изучения',
        'Базовые уроки',
        'Доступ к достижениям',
        'Реклама в приложении'
      ],
      ...Subscription.getPlanFeatures('free')
    },
    {
      id: 'basic',
      name: 'Базовый',
      description: 'Расширенные возможности',
      price: 499,
      currency: 'RUB',
      billingPeriod: 'monthly',
      features: [
        'До 3 языков одновременно',
        'Безлимитные уроки',
        'Без рекламы',
        'Оффлайн режим',
        'Приоритетная поддержка'
      ],
      ...Subscription.getPlanFeatures('basic')
    },
    {
      id: 'premium',
      name: 'Премиум',
      description: 'Полный доступ ко всем функциям',
      price: 899,
      currency: 'RUB',
      billingPeriod: 'monthly',
      features: [
        'Все языки без ограничений',
        'Персонализированное обучение',
        'Безлимитные уроки',
        'Без рекламы',
        'Оффлайн режим',
        'Доступ к сертификатам',
        'VIP поддержка 24/7'
      ],
      ...Subscription.getPlanFeatures('premium')
    }
  ];
  
  res.json({ plans });
});

// Получить текущую подписку
router.get('/current', authMiddleware, async (req, res) => {
  try {
    res.json({ subscription: req.user.subscription });
  } catch (error) {
    console.error('Ошибка получения подписки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить подписку (оформить новый план)
router.post('/upgrade', authMiddleware, async (req, res) => {
  try {
    const { planType, paymentMethod } = req.body;
    
    if (!['free', 'basic', 'premium'].includes(planType)) {
      return res.status(400).json({ message: 'Неверный тип плана' });
    }
    
    const subscription = await Subscription.findById(req.user.subscription);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Подписка не найдена' });
    }
    
    // Получаем возможности нового плана
    const planFeatures = Subscription.getPlanFeatures(planType);
    
    // Обновляем подписку
    subscription.planType = planType;
    subscription.features = planFeatures;
    subscription.paymentMethod = paymentMethod;
    subscription.price = planFeatures.price;
    
    // Устанавливаем дату окончания (30 дней для платных планов)
    if (planType !== 'free') {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      subscription.endDate = endDate;
    } else {
      subscription.endDate = null;
    }
    
    await subscription.save();
    
    res.json({
      message: 'Подписка успешно обновлена',
      subscription
    });
  } catch (error) {
    console.error('Ошибка обновления подписки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Отменить подписку
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.user.subscription);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Подписка не найдена' });
    }
    
    subscription.status = 'cancelled';
    await subscription.save();
    
    res.json({
      message: 'Подписка отменена',
      subscription
    });
  } catch (error) {
    console.error('Ошибка отмены подписки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;