import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../services/api';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      setError('Введите email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Некорректный email');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.forgotPassword(email);
      Alert.alert(
        'Успешно',
        'Инструкция по восстановлению пароля отправлена на ваш email',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      setError(error.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Забыли пароль?</Text>
            <Text style={styles.subtitle}>
              Введите ваш email и мы отправим инструкцию по восстановлению пароля
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
            />

            <Button
              title="Отправить"
              onPress={handleSubmit}
              loading={loading}
              style={styles.button}
            />

            <Button
              title="Вернуться к входу"
              onPress={() => navigation.navigate('Login')}
              variant="outline"
              style={styles.button}
            />
          </View>
        </ScrollView>
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
    flexGrow: 1,
    padding: Sizes.padding.large,
    paddingBottom: Sizes.padding.xlarge + 20,
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
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: Sizes.margin.medium,
  },
});

export default ForgotPasswordScreen;