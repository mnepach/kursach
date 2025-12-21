const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Progress = require('../models/Progress');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

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

    const { email, password, name, onboardingData, selectedPlan } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    user = new User({
      email,
      password,
      name,
      onboardingData: onboardingData || {},
      hasCompletedOnboarding: !!onboardingData
    });

    await user.save();

    const planType = selectedPlan || 'free';
    const planFeatures = Subscription.getPlanFeatures(planType);
    const subscription = new Subscription({
      user: user._id,
      planType: planType,
      features: planFeatures,
      price: planFeatures.price
    });

    if (planType !== 'free') {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      subscription.endDate = endDate;
    }

    await subscription.save();

    user.subscription = subscription._id;
    await user.save();

    // ИСПРАВЛЕНИЕ: Создаем прогресс для выбранного языка
    if (onboardingData && onboardingData.selectedLanguage) {
      const languageMap = {
        'Английский': 'english',
        'Испанский': 'spanish',
        'Японский': 'japanese',
        'Корейский': 'korean',
        'english': 'english',
        'spanish': 'spanish',
        'japanese': 'japanese',
        'korean': 'korean'
      };

      const languageFlags = {
        'english': '🇬🇧',
        'spanish': '🇪🇸',
        'japanese': '🇯🇵',
        'korean': '🇰🇷'
      };

      // Получаем название языка из onboardingData
      let languageName;
      if (typeof onboardingData.selectedLanguage === 'string') {
        languageName = onboardingData.selectedLanguage;
      } else if (onboardingData.selectedLanguage.name) {
        languageName = onboardingData.selectedLanguage.name;
      }

      const languageKey = languageMap[languageName] || languageName?.toLowerCase();

      if (languageKey) {
        console.log(`Creating progress for language: ${languageKey}`);
        
        const progress = new Progress({
          user: user._id,
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
        console.log(`Progress created successfully for ${languageKey}`);
      }
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Загружаем полные данные пользователя с подпиской
    const fullUser = await User.findById(user._id).populate('subscription');

    res.status(201).json({
      token,
      user: {
        id: fullUser._id,
        email: fullUser.email,
        name: fullUser.name,
        avatar: fullUser.avatar,
        subscription: fullUser.subscription,
        statistics: fullUser.statistics,
        hasCompletedOnboarding: fullUser.hasCompletedOnboarding,
        onboardingData: fullUser.onboardingData
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

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

    const user = await User.findOne({ email }).populate('subscription');
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

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
        statistics: user.statistics,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        onboardingData: user.onboardingData
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Некорректный email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь с таким email не найден' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    console.log(`Reset token для ${email}: ${resetToken}`);

    res.json({ message: 'Письмо с инструкциями отправлено на email' });
  } catch (error) {
    console.error('Ошибка сброса пароля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Токен обязателен'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Токен недействителен или истёк' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    console.error('Ошибка смены пароля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

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
        onboardingData: req.user.onboardingData,
        hasCompletedOnboarding: req.user.hasCompletedOnboarding
      }
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, avatar, onboardingData } = req.body;
    
    if (name) req.user.name = name;
    if (avatar) req.user.avatar = avatar;
    if (onboardingData) {
      req.user.onboardingData = { ...req.user.onboardingData, ...onboardingData };
      req.user.hasCompletedOnboarding = true;
    }
    
    await req.user.save();
    
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        statistics: req.user.statistics,
        onboardingData: req.user.onboardingData,
        hasCompletedOnboarding: req.user.hasCompletedOnboarding,
        subscription: req.user.subscription
      }
    });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;