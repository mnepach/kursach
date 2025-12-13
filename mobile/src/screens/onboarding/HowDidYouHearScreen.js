import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const HowDidYouHearScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};
  const [selected, setSelected] = useState(null);

  const options = [
    { id: 'social', label: 'Социальные сети', icon: '📱' },
    { id: 'friends', label: 'От друзей', icon: '👥' },
    { id: 'ads', label: 'Реклама', icon: '📺' },
    { id: 'search', label: 'Поиск', icon: '🔍' },
    { id: 'other', label: 'Другое', icon: '💡' },
  ];

  const handleNext = () => {
    if (selected) {
      navigation.navigate('LearningGoal', {
        onboardingData: {
          ...onboardingData,
          howDidYouHear: selected,
        },
      });
    }
  };

  const renderOption = ({ item }) => (
    <Card
      style={[styles.optionCard, selected === item.id && styles.selected]}
      onPress={() => setSelected(item.id)}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.label}>{item.label}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Основной контент — прижат к низу */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Как вы узнали о нас?</Text>

        <FlatList
          data={options}
          renderItem={renderOption}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Футер с кнопкой */}
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
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',        // ← прижимаем контент к низу
    paddingHorizontal: Sizes.padding.large,
    paddingBottom: Sizes.padding.xlarge, // отступ от кнопки сверху
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  listContent: {
    gap: Sizes.margin.small,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.padding.medium,
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 24,
    marginRight: Sizes.margin.medium,
  },
  label: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: '600',
    color: Colors.textDark,
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

export default HowDidYouHearScreen;