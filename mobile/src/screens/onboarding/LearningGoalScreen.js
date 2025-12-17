import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BackgroundImage from '../../../assets/images/onboarding_background.jpg';

const LearningGoalScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};
  const [selected, setSelected] = useState(null);

  const goals = [
    { id: 'travel', label: 'Путешествия', icon: '✈️' },
    { id: 'work', label: 'Работа', icon: '💼' },
    { id: 'study', label: 'Учеба', icon: '📚' },
    { id: 'culture', label: 'Культура', icon: '🎭' },
    { id: 'family', label: 'Друзья', icon: '❤️' },
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

  const renderGoal = ({ item }) => {
    const isTravel = item.id === 'travel';
    return (
      <Card
        style={[
          styles.goalCard,
          { borderColor: selected === item.id ? Colors.primary : 'transparent' },
          isTravel && styles.travelCard
        ]}
        onPress={() => setSelected(item.id)}
      >
        <Text style={styles.icon}>{item.icon}</Text>
        <Text
          style={[styles.label, isTravel && styles.travelLabel]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.title}>Для чего вы изучаете язык?</Text>
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
    marginTop: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  listContent: {
    paddingBottom: Sizes.padding.xlarge,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    paddingVertical: Sizes.padding.medium,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  travelCard: {
    paddingHorizontal: Sizes.padding.medium,
  },
  icon: {
    fontSize: 32,
    marginBottom: Sizes.margin.small,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  travelLabel: {
    fontSize: 16,
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
