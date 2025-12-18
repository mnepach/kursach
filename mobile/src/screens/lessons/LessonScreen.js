import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ProgressBar from '../../components/lesson/ProgressBar';
import OptionCard from '../../components/lesson/OptionCard';
import WordButton from '../../components/lesson/WordButton';
import Card from '../../components/common/Card';
import LessonCompleteScreen from './LessonCompleteScreen';
import api from '../../services/api';

const LessonScreen = ({ navigation, route }) => {
  const params = route?.params || {};
  const { lesson, language } = params;
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isRetry, setIsRetry] = useState(false);
  const [retryAttempted, setRetryAttempted] = useState(new Set());

  const shuffledOptions = useMemo(() => {
    if (!currentExercise) return [];
    if (currentExercise.type === 'selectImage' || 
        currentExercise.type === 'translateToTarget' || 
        currentExercise.type === 'translateToRussian') {
      return [...currentExercise.options].sort(() => Math.random() - 0.5);
    }
    return [];
  }, [currentExerciseIndex]);

  const listenWords = useMemo(() => {
    if (!currentExercise || currentExercise.type !== 'listen') return [];
    const words = [...currentExercise.words];
    const extraWords = ['the', 'a', 'is', 'and'];
    const numExtras = Math.min(2, extraWords.length);
    for (let i = 0; i < numExtras; i++) {
      const extraWord = extraWords[Math.floor(Math.random() * extraWords.length)];
      if (!words.includes(extraWord)) {
        words.push(extraWord);
      }
    }
    return words.sort(() => Math.random() - 0.5);
  }, [currentExerciseIndex]);

  useEffect(() => {
    if (currentExercise?.type === 'listen') {
      setAvailableWords([...listenWords]);
    }
  }, [currentExerciseIndex]);

  if (!lesson || !language) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Данные урока не найдены</Text>
          <Button title="Назад" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const totalExercises = 7;

  const handleCheck = () => {
    if (checked) {
      handleNext();
    } else {
      let correct = false;
      if (currentExercise.type === 'listen') {
        const userAnswer = selectedWords.join(' ');
        correct = userAnswer === currentExercise.correctAnswer;
      } else {
        correct = selected === currentExercise.correctAnswer;
      }
      setIsCorrect(correct);
      setChecked(true);
      
      if (correct) {
        if (!isRetry) {
          setCorrectAnswers(correctAnswers + 1);
        }
      } else {
        if (!retryAttempted.has(currentExerciseIndex)) {
          setWrongAnswers([...wrongAnswers, currentExerciseIndex]);
        }
      }
    }
  };

  const handleNext = () => {
    if (!isCorrect && !retryAttempted.has(currentExerciseIndex)) {
      setRetryAttempted(new Set([...retryAttempted, currentExerciseIndex]));
      setIsRetry(true);
      resetExerciseState();
      return;
    }

    setIsRetry(false);
    
    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      resetExerciseState();
    } else {
      if (wrongAnswers.length > 0 && wrongAnswers.some(idx => !retryAttempted.has(idx))) {
        const nextWrongIndex = wrongAnswers.find(idx => !retryAttempted.has(idx));
        setCurrentExerciseIndex(nextWrongIndex);
        setIsRetry(true);
        resetExerciseState();
      } else {
        setShowComplete(true);
      }
    }
  };

  const resetExerciseState = () => {
    setSelected(null);
    setChecked(false);
    setIsCorrect(false);
    setSelectedWords([]);
    if (lesson.exercises[currentExerciseIndex]?.type === 'listen') {
      setAvailableWords([...listenWords]);
    } else {
      setAvailableWords([]);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const score = Math.round((correctAnswers / totalExercises) * 100);
      await api.completeLesson(language, lesson._id, score);
      navigation.navigate('Main', { screen: 'Lessons' });
    } catch (error) {
      console.error('Error completing lesson:', error);
      navigation.navigate('Main', { screen: 'Lessons' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (showComplete) {
    return (
      <LessonCompleteScreen
        correctAnswers={correctAnswers}
        totalQuestions={totalExercises}
        onComplete={handleComplete}
      />
    );
  }

  const renderExercise = () => {
    switch (currentExercise.type) {
      case 'listen':
        return renderListenExercise();
      case 'selectImage':
        return renderSelectImageExercise();
      case 'translateToTarget':
      case 'translateToRussian':
        return renderTranslateExercise();
      default:
        return null;
    }
  };

  const renderListenExercise = () => {
    const handleWordClick = (word, fromAvailable) => {
      if (checked) return;
      if (fromAvailable) {
        setSelectedWords([...selectedWords, word]);
        setAvailableWords(availableWords.filter(w => w !== word));
      } else {
        setAvailableWords([...availableWords, word]);
        setSelectedWords(selectedWords.filter(w => w !== word));
      }
    };

    return (
      <View style={styles.exerciseContainer}>
        <Text style={styles.title}>Составьте из слов предложение</Text>
        <Text style={styles.subtitle}>Прослушайте фразу и составьте предложение</Text>
        <TouchableOpacity style={styles.audioButton}>
          <Ionicons name="volume-high" size={40} color={Colors.white} />
        </TouchableOpacity>
        <View style={[styles.selectedArea, checked && (isCorrect ? styles.correctArea : styles.incorrectArea)]}>
          {selectedWords.length === 0 ? (
            <Text style={styles.placeholder}>Выберите слова снизу...</Text>
          ) : (
            <View style={styles.wordsContainer}>
              {selectedWords.map((word, index) => (
                <WordButton 
                  key={`selected-${index}`} 
                  word={word} 
                  onPress={() => handleWordClick(word, false)} 
                  disabled={checked} 
                  variant="selected" 
                />
              ))}
            </View>
          )}
        </View>
        {checked && !isCorrect && (
          <View style={styles.correctAnswerBox}>
            <Text style={styles.correctAnswerLabel}>Правильный ответ:</Text>
            <Text style={styles.correctAnswerText}>{currentExercise.correctAnswer}</Text>
          </View>
        )}
        <View style={styles.availableArea}>
          <View style={styles.wordsContainer}>
            {availableWords.map((word, index) => (
              <WordButton 
                key={`available-${index}-${word}`} 
                word={word} 
                onPress={() => handleWordClick(word, true)} 
                disabled={checked} 
                variant="available" 
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderSelectImageExercise = () => {
    const getCardStyle = (option) => {
      if (!checked) {
        return selected?.text === option.text ? styles.selected : {};
      }
      if (option.text === currentExercise.correctAnswer) {
        return styles.correct;
      }
      if (selected?.text === option.text && !isCorrect) {
        return styles.incorrect;
      }
      return {};
    };

    return (
      <View style={styles.exerciseContainer}>
        <Text style={styles.question}>{currentExercise.word}</Text>
        <Text style={styles.subtitle}>Выберите правильный перевод</Text>
        <View style={styles.optionsContainer}>
          {shuffledOptions.map((option, index) => (
            <Card 
              key={index} 
              style={[styles.optionCard, getCardStyle(option)]} 
              onPress={() => !checked && setSelected(option)} 
              disabled={checked}
            >
              <Text style={styles.emoji}>{option.emoji}</Text>
              <Text style={styles.optionText}>{option.text}</Text>
            </Card>
          ))}
        </View>
      </View>
    );
  };

  const renderTranslateExercise = () => {
    const isToTarget = currentExercise.type === 'translateToTarget';
    const questionText = isToTarget ? currentExercise.russianText : currentExercise.targetText;

    return (
      <View style={styles.exerciseContainer}>
        <Text style={styles.title}>
          {isToTarget ? `Переведите на ${currentExercise.targetLanguage}` : 'Переведите на русский'}
        </Text>
        <View style={styles.questionBox}>
          <Text style={styles.question}>{questionText}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {shuffledOptions.map((option, index) => (
            <OptionCard 
              key={index} 
              option={option} 
              selected={selected === option} 
              onPress={() => !checked && setSelected(option)} 
              disabled={checked} 
              isCorrect={option === currentExercise.correctAnswer} 
              showResult={checked} 
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={Colors.textDark} />
        </TouchableOpacity>
        <ProgressBar current={Math.min(currentExerciseIndex + 1, totalExercises)} total={totalExercises} />
      </View>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderExercise()}
      </ScrollView>
      <View style={styles.footer}>
        <Button 
          title={checked ? 'Далее' : 'Проверить'} 
          onPress={handleCheck} 
          disabled={currentExercise.type === 'listen' ? selectedWords.length === 0 : !selected} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.bgLight 
  },
  header: { 
    backgroundColor: Colors.white, 
    paddingBottom: Sizes.padding.small, 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.border 
  },
  closeButton: { 
    padding: Sizes.padding.medium 
  },
  scrollView: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1,
    paddingBottom: Sizes.padding.xlarge 
  },
  exerciseContainer: {
    flex: 1,
    padding: Sizes.padding.large,
    justifyContent: 'center'
  },
  title: { 
    fontSize: Sizes.fontSize.large, 
    fontWeight: 'bold', 
    color: Colors.textDark, 
    marginBottom: Sizes.margin.small, 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: Sizes.fontSize.medium, 
    color: Colors.textLight, 
    marginBottom: Sizes.margin.large, 
    textAlign: 'center' 
  },
  audioButton: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: Colors.primary, 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center', 
    marginBottom: Sizes.margin.large 
  },
  selectedArea: { 
    minHeight: 80, 
    backgroundColor: Colors.white, 
    borderRadius: Sizes.borderRadius.large, 
    padding: Sizes.padding.medium, 
    marginBottom: Sizes.margin.medium, 
    borderWidth: 2, 
    borderColor: Colors.border 
  },
  correctArea: { 
    borderColor: Colors.success, 
    backgroundColor: '#F0FDF4' 
  },
  incorrectArea: { 
    borderColor: Colors.error, 
    backgroundColor: '#FEF2F2' 
  },
  placeholder: { 
    fontSize: Sizes.fontSize.medium, 
    color: Colors.textLight, 
    textAlign: 'center',
    paddingVertical: Sizes.padding.small
  },
  wordsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  correctAnswerBox: { 
    backgroundColor: '#F0FDF4', 
    borderWidth: 2, 
    borderColor: Colors.success, 
    borderRadius: Sizes.borderRadius.large, 
    padding: Sizes.padding.medium, 
    marginBottom: Sizes.margin.medium 
  },
  correctAnswerLabel: { 
    fontSize: Sizes.fontSize.small, 
    fontWeight: 'bold', 
    color: Colors.success, 
    marginBottom: Sizes.margin.small 
  },
  correctAnswerText: { 
    fontSize: Sizes.fontSize.medium, 
    color: Colors.textDark 
  },
  availableArea: { 
    backgroundColor: Colors.white, 
    borderRadius: Sizes.borderRadius.large, 
    padding: Sizes.padding.medium, 
    borderWidth: 2, 
    borderColor: Colors.border 
  },
  question: { 
    fontSize: Sizes.fontSize.xxlarge, 
    fontWeight: 'bold', 
    color: Colors.textDark, 
    textAlign: 'center', 
    marginBottom: Sizes.margin.small 
  },
  questionBox: { 
    backgroundColor: Colors.secondary, 
    borderRadius: Sizes.borderRadius.large, 
    padding: Sizes.padding.large, 
    marginBottom: Sizes.margin.large 
  },
  optionsContainer: { 
    flex: 1,
    justifyContent: 'center'
  },
  optionCard: { 
    alignItems: 'center', 
    paddingVertical: Sizes.padding.large, 
    marginBottom: Sizes.margin.small 
  },
  selected: { 
    borderWidth: 3, 
    borderColor: Colors.primary 
  },
  correct: { 
    borderWidth: 3, 
    borderColor: Colors.success, 
    backgroundColor: '#F0FDF4' 
  },
  incorrect: { 
    borderWidth: 3, 
    borderColor: Colors.error, 
    backgroundColor: '#FEF2F2' 
  },
  emoji: { 
    fontSize: 48, 
    marginBottom: Sizes.margin.small 
  },
  optionText: { 
    fontSize: Sizes.fontSize.large, 
    fontWeight: 'bold', 
    color: Colors.textDark 
  },
  footer: { 
    padding: Sizes.padding.large, 
    paddingBottom: Platform.OS === 'ios' ? Sizes.padding.xlarge : Sizes.padding.large, 
    backgroundColor: Colors.white, 
    borderTopWidth: 1, 
    borderTopColor: Colors.border 
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: Sizes.padding.large 
  },
  errorText: { 
    fontSize: Sizes.fontSize.large, 
    color: Colors.error, 
    textAlign: 'center', 
    marginBottom: Sizes.margin.large 
  },
});

export default LessonScreen;