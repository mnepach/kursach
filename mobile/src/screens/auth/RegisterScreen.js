import React, { useState } from 'react';
import {View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterScreen = ({ navigation, route }) => {
  const { register } = useAuth();
  const onboardingData = route.params?.onboardingData || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Введите имя';

    if (!email) newErrors.email = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Некорректный email';

    if (!password) newErrors.password = 'Введите пароль';
    else if (password.length < 6) newErrors.password = 'Минимум 6 символов';

    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Пароли не совпадают';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registrationData = {
        name: name.trim(),
        email,
        password,
        onboardingData: {
          selectedLanguage: onboardingData.selectedLanguage,
          howDidYouHear: onboardingData.howDidYouHear,
          learningGoal: onboardingData.learningGoal,
          languageLevel: onboardingData.languageLevel,
          dailyGoal: onboardingData.dailyGoal,
          learningMethod: onboardingData.learningMethod,
        },
        selectedPlan: 'free',
      };

      console.log('Registration data:', registrationData);
      
      await register(registrationData);
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Регистрация</Text>
            <Text style={styles.subtitle}>Создайте свой аккаунт</Text>
            {onboardingData.selectedLanguage && (
              <Text style={styles.selectedLanguage}>
                Выбранный язык: {onboardingData.selectedLanguage.name}
              </Text>
            )}
          </View>

          <View style={styles.form}>
            <Input
              label="Имя"
              value={name}
              onChangeText={setName}
              placeholder="Ваше имя"
              error={errors.name}
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Пароль"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Подтверждение пароля"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title="Зарегистрироваться"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
            />
          </View>
        </ScrollView>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Уже есть аккаунт? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Войти</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Sizes.padding.large,
    paddingBottom: Sizes.padding.xlarge,
  },
  header: {
    marginTop: Sizes.margin.xlarge,
    marginBottom: Sizes.margin.xlarge,
  },
  title: {
    fontSize: Sizes.fontSize.xxxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  subtitle: {
    fontSize: Sizes.fontSize.large,
    color: Colors.textLight,
  },
  selectedLanguage: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Sizes.margin.small,
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: Sizes.margin.medium,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizes.padding.large,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgLight,
  },
  loginText: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
  },
  loginLink: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;