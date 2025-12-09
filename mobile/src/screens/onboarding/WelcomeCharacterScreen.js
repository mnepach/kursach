import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  Image
} from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';

const WelcomeCharacterScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};

  const handleNext = () => {
    navigation.navigate('HowDidYouHear', { onboardingData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mascotContainer}>
          <Image 
            source={require('../../../assets/images/mascot.gif')}
            style={styles.mascot}
          />
        </View>

        <View style={styles.speechBubble}>
          <Text style={styles.greeting}>Привет! Я Hello Kitty 👋</Text>
          <Text style={styles.message}>
            Я буду твоим проводником в мире LinguaPlay! 
            Нажми "Далее", чтобы продолжить.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Далее"
          onPress={handleNext}
          style={styles.button}
        />
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
  mascotContainer: {
    marginBottom: Sizes.margin.xlarge,
  },
  mascot: {
    width: 250,
    height: 250,
  },
  speechBubble: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.xlarge,
    borderWidth: 3,
    borderColor: Colors.primary,
    padding: Sizes.padding.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  greeting: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  message: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textDark,
    lineHeight: 24,
  },
  footer: {
    padding: Sizes.padding.large,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    width: '100%',
  },
});

export default WelcomeCharacterScreen;