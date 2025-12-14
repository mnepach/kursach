import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/lesson/ProgressBar';

const SelectWordByImageScreen = ({ route, navigation }) => {
  const { lesson, currentIndex, totalLessons } = route.params;
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    const shuffled = [...lesson.options].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
    setSelected(null);
    setChecked(false);
    setIsCorrect(false);
  }, [lesson]);

  const handleSelect = (option) => {
    if (checked) return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (checked) {
      navigation.goBack();
    } else {
      const correct = selected.text === lesson.correctAnswer;
      setIsCorrect(correct);
      setChecked(true);
    }
  };

  const getCardStyle = (option) => {
    if (!checked) {
      return selected?.text === option.text ? styles.selected : {};
    }
    
    if (option.text === lesson.correctAnswer) {
      return styles.correct;
    }
    
    if (selected?.text === option.text && !isCorrect) {
      return styles.incorrect;
    }
    
    return {};
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color={Colors.textDark} />
        </TouchableOpacity>
        
        <ProgressBar current={currentIndex + 1} total={totalLessons} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.question}>{lesson.word}</Text>
          <Text style={styles.subtitle}>Выберите правильный перевод</Text>

          <View style={styles.optionsContainer}>
            {shuffledOptions.map((option, index) => (
              <Card
                key={index}
                style={[styles.optionCard, getCardStyle(option)]}
                onPress={() => handleSelect(option)}
                disabled={checked}
              >
                <Text style={styles.emoji}>{option.emoji}</Text>
                <Text style={styles.optionText}>{option.text}</Text>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={checked ? 'Далее' : 'Проверить'}
          onPress={handleCheck}
          disabled={!selected}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: Colors.white,
    paddingBottom: Sizes.padding.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Sizes.padding.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: Sizes.padding.large,
  },
  question: {
    fontSize: Sizes.fontSize.xxxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Sizes.margin.small,
  },
  subtitle: {
    fontSize: Sizes.fontSize.large,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    alignItems: 'center',
    paddingVertical: Sizes.padding.xlarge,
    marginBottom: Sizes.margin.medium,
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  correct: {
    borderWidth: 3,
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  incorrect: {
    borderWidth: 3,
    borderColor: Colors.error,
    backgroundColor: '#FEF2F2',
  },
  emoji: {
    fontSize: 64,
    marginBottom: Sizes.margin.medium,
  },
  optionText: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  footer: {
    padding: Sizes.padding.large,
    paddingBottom: Platform.OS === 'ios' ? Sizes.padding.xlarge : Sizes.padding.large,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

export default SelectWordByImageScreen;