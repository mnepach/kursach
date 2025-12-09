import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const LanguageLevelScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};
  const [selected, setSelected] = useState(null);

  const levels = [
    { 
      id: 'beginner', 
      label: 'Новичок', 
      description: 'Я только начинаю',
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
      style={[styles.levelCard, selected === item.id && styles.selected]}
      onPress={() => setSelected(item.id)}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ваш уровень языка?</Text>
        
        <FlatList
          data={levels}
          renderItem={renderLevel}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: Sizes.padding.large,
    paddingTop: Sizes.padding.xlarge,
  },
  title: {
    fontSize: Sizes.fontSize.xxxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  listContent: {
    paddingBottom: Sizes.padding.xlarge,
  },
  levelCard: {
    alignItems: 'center',
    marginBottom: Sizes.margin.medium,
    paddingVertical: Sizes.padding.large,
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 48,
    marginBottom: Sizes.margin.small,
  },
  label: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  description: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
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

export default LanguageLevelScreen;