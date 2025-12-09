import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const LearningMethodScreen = ({ navigation, route }) => {
  const onboardingData = route.params?.onboardingData || {};
  const [selected, setSelected] = useState(null);

  const methods = [
    { id: 'games', label: 'Игры', description: 'Весело и эффективно', icon: '🎮' },
    { id: 'stories', label: 'Истории', description: 'Учите через контекст', icon: '📖' },
    { id: 'audio', label: 'Аудио', description: 'Слушайте и повторяйте', icon: '🎧' },
    { id: 'mixed', label: 'Смешанный', description: 'Всего понемногу', icon: '🎯' },
  ];

  const handleNext = () => {
    if (selected) {
      navigation.navigate('Register', {
        onboardingData: {
          ...onboardingData,
          learningMethod: selected
        }
      });
    }
  };

  const renderMethod = ({ item }) => (
    <Card
      style={[styles.methodCard, selected === item.id && styles.selected]}
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
        <Text style={styles.title}>Как вы любите учиться?</Text>
        
        <FlatList
          data={methods}
          renderItem={renderMethod}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Продолжить"
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
  row: {
    justifyContent: 'space-between',
    marginBottom: Sizes.margin.medium,
  },
  methodCard: {
    flex: 1,
    marginHorizontal: Sizes.margin.small,
    alignItems: 'center',
    paddingVertical: Sizes.padding.xlarge,
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 48,
    marginBottom: Sizes.margin.medium,
  },
  label: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
    textAlign: 'center',
  },
  description: {
    fontSize: Sizes.fontSize.small,
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

export default LearningMethodScreen;