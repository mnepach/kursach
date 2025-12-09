import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DailyGoalScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};
  const [selected, setSelected] = useState(null);

  const goals = [
    { id: '5', label: '5 минут в день', description: 'Легко', icon: '☕' },
    { id: '10', label: '10 минут в день', description: 'Нормально', icon: '🍵' },
    { id: '15', label: '15 минут в день', description: 'Серьезно', icon: '💪' },
    { id: '20', label: '20 минут в день', description: 'Интенсивно', icon: '🔥' },
  ];

  const handleNext = () => {
    if (selected) {
      navigation.navigate('LearningMethod', {
        onboardingData: {
          ...onboardingData,
          dailyGoal: selected
        }
      });
    }
  };

  const renderGoal = ({ item }) => (
    <Card
      style={[styles.goalCard, selected === item.id && styles.selected]}
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
        <Text style={styles.title}>Установите ежедневную цель</Text>
        
        <FlatList
          data={goals}
          renderItem={renderGoal}
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
  goalCard: {
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

export default DailyGoalScreen;