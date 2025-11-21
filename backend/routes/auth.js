const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Регистрация
router.post('/register', [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
  body('name').notEmpty().withMessage('Имя обязательно')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, onboardingData } = req.body;

    // Проверяем, существует ли пользователь
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создаем нового пользователя
    user = new User({
      email,
      password,
      name,
      onboardingData: onboardingData || {}
    });

    await user.save();

    // Создаем бесплатную подписку
    const planFeatures = Subscription.getPlanFeatures('free');
    const subscription = new Subscription({
      user: user._id,
      planType: 'free',
      features: planFeatures
    });

    await subscription.save();

    // Связываем подписку с пользователем
    user.subscription = subscription._id;
    await user.save();

    // Генерируем токен
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        subscription: subscription,
        statistics: user.statistics
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

// Вход
router.post('/login', [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').notEmpty().withMessage('Пароль обязателен')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Находим пользователя
    const user = await User.findOne({ email }).populate('subscription');
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Проверяем пароль
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Генерируем токен
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        subscription: user.subscription,
        statistics: user.statistics
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

// Получить профиль пользователя
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        subscription: req.user.subscription,
        statistics: req.user.statistics,
        onboardingData: req.user.onboardingData
      }
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить профиль
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, avatar, onboardingData } = req.body;
    
    if (name) req.user.name = name;
    if (avatar) req.user.avatar = avatar;
    if (onboardingData) req.user.onboardingData = { ...req.user.onboardingData, ...onboardingData };
    
    await req.user.save();
    
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        statistics: req.user.statistics,
        onboardingData: req.user.onboardingData
      }
    });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;