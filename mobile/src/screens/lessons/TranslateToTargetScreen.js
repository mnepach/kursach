import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';
import OptionCard from '../../components/lesson/OptionCard';
import ProgressBar from '../../components/lesson/ProgressBar';

const TranslateToTargetScreen = ({ route, navigation }) => {
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
      const correct = selected === lesson.correctAnswer;
      setIsCorrect(correct);
      setChecked(true);
    }
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
          <Text style={styles.title}>
            Переведите на {lesson.targetLanguage}
          </Text>
          
          <View style={styles.questionBox}>
            <Text style={styles.question}>{lesson.russianText}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {shuffledOptions.map((option, index) => (
              <OptionCard
                key={index}
                option={option}
                selected={selected === option}
                onPress={() => handleSelect(option)}
                disabled={checked}
                isCorrect={option === lesson.correctAnswer}
                showResult={checked}
              />
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
  title: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.large,
    textAlign: 'center',
  },
  questionBox: {
    backgroundColor: Colors.secondary,
    borderRadius: Sizes.borderRadius.large,
    padding: Sizes.padding.xlarge,
    marginBottom: Sizes.margin.xlarge,
  },
  question: {
    fontSize: Sizes.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  footer: {
    padding: Sizes.padding.large,
    paddingBottom: Platform.OS === 'ios' ? Sizes.padding.xlarge : Sizes.padding.large,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

export default TranslateToTargetScreen;