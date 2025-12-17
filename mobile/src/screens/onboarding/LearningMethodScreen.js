import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BackgroundImage from '../../../assets/images/onboarding_background.jpg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Sizes.padding.large * 2 - Sizes.margin.medium) / 2;

const LearningMethodScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};
  const [selected, setSelected] = useState(null);

  const methods = [
    { id: 'games', label: 'Игры', description: 'Весело и эффективно', icon: '🎮' },
    { id: 'stories', label: 'Истории', description: 'Через контекст', icon: '📖' },
    { id: 'audio', label: 'Аудио', description: 'Слушайте и повторяйте', icon: '🎧' },
    { id: 'mixed', label: 'Смешанный', description: 'Всего понемногу', icon: '🎯' },
  ];

  const handleNext = () => {
    if (selected) {
      navigation.navigate('Register', {
        onboardingData: {
          ...onboardingData,
          learningMethod: selected,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.title}>Как вы любите учиться?</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.methodsContainer}
          >
            <View style={styles.grid}>
              {methods.map((method) => (
                <Card
                  key={method.id}
                  style={[
                    styles.methodCard,
                    {
                      borderColor: selected === method.id ? Colors.primary : 'transparent',
                    },
                  ]}
                  onPress={() => setSelected(method.id)}
                >
                  <Text style={styles.icon}>{method.icon}</Text>
                  <Text style={styles.label}>{method.label}</Text>
                  <Text style={styles.description}>{method.description}</Text>
                </Card>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Button
            title="Продолжить"
            onPress={handleNext}
            disabled={!selected}
            style={styles.button}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.padding.large,
    paddingTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  methodsContainer: {
    paddingBottom: Sizes.padding.large,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Sizes.margin.medium,
  },
  methodCard: {
    width: CARD_WIDTH,
    alignItems: 'center',
    paddingVertical: Sizes.padding.large,
    paddingHorizontal: Sizes.padding.medium,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 3,
    shadowOpacity: 0,
    elevation: 0,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  footer: {
    padding: Sizes.padding.large,
    paddingBottom: Sizes.padding.large + 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  button: {
    width: '100%',
  },
});

export default LearningMethodScreen;
