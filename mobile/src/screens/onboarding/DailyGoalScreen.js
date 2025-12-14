import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DailyGoalScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};
  const [selected, setSelected] = useState(null);

  const goals = [
    { id: '5', label: '5 минут', description: 'Легко', icon: '☕' },
    { id: '10', label: '10 минут', description: 'Нормально', icon: '🍵' },
    { id: '15', label: '15 минут', description: 'Серьёзно', icon: '💪' },
    { id: '20', label: '20 минут', description: 'Интенсивно', icon: '🔥' },
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
        <Text style={styles.title}>Ежедневная цель</Text>
        
        <FlatList
          data={goals}
          renderItem={renderGoal}
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
    paddingHorizontal: Sizes.padding.large,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Sizes.margin.large,
  },
  listContent: {
    gap: Sizes.margin.small,
  },
  goalCard: {
    alignItems: 'center',
    paddingVertical: Sizes.padding.medium,
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 32,
    marginBottom: 4,
  },
  label: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 2,
  },
  description: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
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

export default DailyGoalScreen;