import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import BackgroundImage from '../../../assets/images/onboarding_background.jpg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Sizes.padding.large * 2 - Sizes.margin.medium) / 2;

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = [
    { id: 'english', name: 'Английский', flag: require('../../../assets/images/flags/england.png'), learners: '5M+' },
    { id: 'spanish', name: 'Испанский', flag: require('../../../assets/images/flags/spain.png'), learners: '3M+' },
    { id: 'japanese', name: 'Японский', flag: require('../../../assets/images/flags/japan.png'), learners: '2M+' },
    { id: 'korean', name: 'Корейский', flag: require('../../../assets/images/flags/korea.png'), learners: '1.5M+' }
  ];

  const handleSelect = (language) => {
    setSelectedLanguage(language);
    setTimeout(() => {
      navigation.navigate('WelcomeCharacter', { onboardingData: { selectedLanguage: language } });
    }, 300);
  };

  const renderLanguage = ({ item }) => (
    <Card
      style={[
        styles.languageCard,
        { borderColor: selectedLanguage?.id === item.id ? Colors.primary : 'transparent' }
      ]}
      onPress={() => handleSelect(item)}
    >
      <Image source={item.flag} style={styles.flag} />
      <Text style={styles.languageName}>{item.name}</Text>
      <Text style={styles.learners}>{item.learners} учеников</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.title}>Я хочу изучать...</Text>
          <FlatList
            data={languages}
            renderItem={renderLanguage}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  content: { flex: 1, paddingHorizontal: Sizes.padding.large, paddingTop: 120 },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.textDark, textAlign: 'center', marginBottom: Sizes.margin.xlarge },
  listContent: { paddingBottom: Sizes.padding.xlarge },
  row: { justifyContent: 'space-between', marginBottom: Sizes.margin.medium },
  languageCard: {
    width: CARD_WIDTH,
    alignItems: 'center',
    paddingVertical: Sizes.padding.large,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  flag: { width: 80, height: 80, marginBottom: Sizes.margin.medium },
  languageName: { fontSize: Sizes.fontSize.large, fontWeight: 'bold', color: Colors.textDark, marginBottom: 6, textAlign: 'center' },
  learners: { fontSize: Sizes.fontSize.small, color: Colors.textLight, textAlign: 'center' },
});

export default LanguageSelectionScreen;
