import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BackgroundImage from '../../../assets/images/onboarding_background.jpg';

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
      style={[
        styles.optionCard,
        { borderColor: selected === item.id ? Colors.primary : 'transparent' },
      ]}
      onPress={() => setSelected(item.id)}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.label}>{item.label}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.title}>Как вы узнали о нас?</Text>
          <FlatList
            data={options}
            renderItem={renderOption}
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
    marginTop: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 52,
  },
  listContent: {
    paddingBottom: Sizes.padding.xlarge,
  },
  optionCard: {
    flexDirection: 'row',
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
    marginRight: Sizes.margin.medium,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
  },
  footer: {
    paddingHorizontal: Sizes.padding.large,
    paddingVertical: Sizes.padding.large,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  button: {
    width: '100%',
  },
});

export default HowDidYouHearScreen;
