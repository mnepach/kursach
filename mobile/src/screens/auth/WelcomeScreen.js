import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../../assets/images/kitty.png')}
          style={styles.mascot}
        />
        
        <Text style={styles.title}>Добро пожаловать в LinguaPlay!</Text>
        <Text style={styles.subtitle}>
          Изучайте языки весело и эффективно
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="У меня есть аккаунт"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
          
          <Button
            title="Я новый пользователь"
            onPress={() => navigation.navigate('LanguageSelection')}
            variant="outline"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizes.padding.large,
  },
  mascot: {
    width: 200,
    height: 200,
    marginBottom: Sizes.margin.xlarge,
  },
  title: {
    fontSize: Sizes.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Sizes.margin.medium,
  },
  subtitle: {
    fontSize: Sizes.fontSize.large,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  buttonContainer: {
    width: '100%',
    gap: Sizes.margin.medium,
  },
  button: {
    width: '100%',
  },
});

export default WelcomeScreen;