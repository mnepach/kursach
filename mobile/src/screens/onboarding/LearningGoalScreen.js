import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const LearningGoalScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};
  const [selected, setSelected] = useState(null);

  const goals = [
    { id: 'travel', label: 'Путешествия', icon: '✈️' },
    { id: 'work', label: 'Работа', icon: '💼' },
    { id: 'study', label: 'Учеба', icon: '📚' },
    { id: 'culture', label: 'Культура', icon: '🎭' },
    { id: 'family', label: 'Семья', icon: '❤️' },
    { id: 'brain', label: 'Развитие', icon: '🧠' },
  ];

  const handleNext = () => {
    if (selected) {
      navigation.navigate('LanguageLevel', {
        onboardingData: {
          ...onboardingData,
          learningGoal: selected
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
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Зачем вы изучаете язык?</Text>
        
        <FlatList
          data={goals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
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
    marginBottom: Sizes.margin.xlarge,
  },
  listContent: {
    gap: Sizes.margin.small,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Sizes.margin.small,
  },
  goalCard: {
    flex: 1,
    marginHorizontal: Sizes.margin.small,
    alignItems: 'center',
    paddingVertical: Sizes.padding.large,
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 36,
    marginBottom: Sizes.margin.small,
  },
  label: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: '600',
    color: Colors.textDark,
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

export default LearningGoalScreen;