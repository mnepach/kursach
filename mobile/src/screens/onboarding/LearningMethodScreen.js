import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BackgroundImage from '../../../assets/images/onboarding_background.jpg';

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
          learningMethod: selected
        }
      });
    }
  };

  const renderMethod = ({ item }) => {
    const isMixed = item.id === 'mixed';
    return (
      <Card
        style={[
          styles.methodCard,
          isMixed && styles.mixedCard,
          { borderColor: selected === item.id ? Colors.primary : 'transparent' }
        ]}
        onPress={() => setSelected(item.id)}
      >
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.title}>Как вы любите учиться?</Text>
          <FlatList
            data={methods}
            renderItem={renderMethod}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
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
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Sizes.padding.large,
    marginTop: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  listContent: { paddingBottom: Sizes.padding.xlarge },
  row: { justifyContent: 'space-between', marginBottom: 10 },
  methodCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    paddingVertical: Sizes.padding.medium,
    paddingHorizontal: Sizes.padding.large,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  mixedCard: {
    paddingHorizontal: 1, 
  },
  icon: { fontSize: 28, marginBottom: 4 },
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
  button: { width: '100%' },
});

export default LearningMethodScreen;
