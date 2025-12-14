import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BackgroundImage from '../../../assets/images/onboarding_background.jpg';

const LanguageLevelScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};
  const [selected, setSelected] = useState(null);

  const levels = [
    { 
      id: 'beginner', 
      label: 'Новичок', 
      description: 'Только начинаю',
      icon: '🌱'
    },
    { 
      id: 'elementary', 
      label: 'Базовый', 
      description: 'Знаю простые фразы',
      icon: '🌿'
    },
    { 
      id: 'intermediate', 
      label: 'Средний', 
      description: 'Могу поддержать беседу',
      icon: '🌳'
    },
    { 
      id: 'advanced', 
      label: 'Продвинутый', 
      description: 'Свободно общаюсь',
      icon: '🌲'
    },
  ];

  const handleNext = () => {
    if (selected) {
      navigation.navigate('DailyGoal', {
        onboardingData: {
          ...onboardingData,
          languageLevel: selected
        }
      });
    }
  };

  const renderLevel = ({ item }) => (
    <Card
      style={[
        styles.levelCard,
        { borderColor: selected === item.id ? Colors.primary : 'transparent' }
      ]}
      onPress={() => setSelected(item.id)}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.title}>Ваш уровень?</Text>
          <FlatList
            data={levels}
            renderItem={renderLevel}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
        <View style={styles.footer}>
          <Button
            title="Далее"
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
    justifyContent: 'center',
    paddingHorizontal: Sizes.padding.large,
    marginTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Sizes.margin.large,
  },
  listContent: {
    paddingBottom: Sizes.padding.xlarge,
  },
  levelCard: {
    alignItems: 'center',
    paddingVertical: Sizes.padding.medium,
    paddingHorizontal: Sizes.padding.large,
    marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 2,
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

export default LanguageLevelScreen;
