import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
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
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isRetryPhase, setIsRetryPhase] = useState(false);
  const [retryExercises, setRetryExercises] = useState([]);
  const [currentRetryIndex, setCurrentRetryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);

  const currentExercise = isRetryPhase 
    ? retryExercises[currentRetryIndex] 
    : lesson.exercises[currentExerciseIndex];
  const totalExercises = isRetryPhase 
    ? retryExercises.length 
    : lesson.exercises.length;
  const currentProgress = isRetryPhase ? currentRetryIndex + 1 : currentExerciseIndex + 1;

  const shuffledOptions = useMemo(() => {
    if (!currentExercise) return [];
    if (currentExercise.type === 'selectImage' || 
        currentExercise.type === 'translateToTarget' || 
        currentExercise.type === 'translateToRussian') {
      return [...currentExercise.options].sort(() => Math.random() - 0.5);
    }
    return [];
  }, [currentExerciseIndex, currentRetryIndex, isRetryPhase]);

  const listenWords = useMemo(() => {
    if (!currentExercise || currentExercise.type !== 'listen') return [];
    const words = [...currentExercise.words];
    const extraWords = ['the', 'a', 'is', 'and', 'to', 'of'];
    const numExtras = Math.min(2, extraWords.length);
    for (let i = 0; i < numExtras; i++) {
      const extraWord = extraWords[Math.floor(Math.random() * extraWords.length)];
      if (!words.includes(extraWord)) {
        words.push(extraWord);
      }
    }
    return words.sort(() => Math.random() - 0.5);
  }, [currentExerciseIndex, currentRetryIndex, isRetryPhase]);

  useEffect(() => {
    if (currentExercise?.type === 'listen') {
      setAvailableWords([...listenWords]);
    }
  }, [currentExerciseIndex, currentRetryIndex, isRetryPhase, listenWords]);

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
      
      if (!correct && !isRetryPhase) {
        setWrongAnswers([...wrongAnswers, currentExerciseIndex]);
      }
    }
  };

  const handleNext = () => {
    if (isRetryPhase) {
      if (currentRetryIndex < retryExercises.length - 1) {
        setCurrentRetryIndex(currentRetryIndex + 1);
        resetExerciseState();
      } else {
        setShowComplete(true);
      }
    } else {
      if (currentExerciseIndex < lesson.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        resetExerciseState();
      } else {
        if (wrongAnswers.length > 0) {
          const wrongExercises = wrongAnswers.map(idx => lesson.exercises[idx]);
          setRetryExercises(wrongExercises);
          setIsRetryPhase(true);
          setCurrentRetryIndex(0);
          resetExerciseState();
        } else {
          setShowComplete(true);
        }
      }
    }
  };

  const resetExerciseState = () => {
    setSelected(null);
    setChecked(false);
    setIsCorrect(false);
    setSelectedWords([]);
    const nextExercise = isRetryPhase 
      ? retryExercises[currentRetryIndex + 1]
      : lesson.exercises[currentExerciseIndex + 1];
    if (nextExercise?.type === 'listen') {
      setAvailableWords([...listenWords]);
    } else {
      setAvailableWords([]);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const correctAnswers = lesson.exercises.length - wrongAnswers.length;
      const score = Math.round((correctAnswers / lesson.exercises.length) * 100);
      
      await api.completeLesson(
        language, 
        lesson._id, 
        score,
        lesson.lessonNumber,
        lesson.level
      );
      
      navigation.reset({
        index: 0,
        routes: [
          { 
            name: 'Main',
            state: {
              routes: [
                { name: 'Home' },
                { name: 'Lessons' },
                { name: 'Progress' },
                { name: 'Profile' }
              ],
              index: 1
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error completing lesson:', error);
      navigation.reset({
        index: 0,
        routes: [
          { 
            name: 'Main',
            state: {
              routes: [
                { name: 'Home' },
                { name: 'Lessons' },
                { name: 'Progress' },
                { name: 'Profile' }
              ],
              index: 1
            }
          }
        ]
      });
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
        correctAnswers={lesson.exercises.length - wrongAnswers.length}
        totalQuestions={lesson.exercises.length}
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
        setAvailableWords(availableWords.filter((w, i) => {
          if (w === word) {
            return i !== availableWords.indexOf(word);
          }
          return true;
        }));
      } else {
        const wordIndex = selectedWords.lastIndexOf(word);
        if (wordIndex !== -1) {
          setAvailableWords([...availableWords, word]);
          setSelectedWords(selectedWords.filter((w, i) => i !== wordIndex));
        }
      }
    };

    return (
      <View style={styles.exerciseContainer}>
        {isRetryPhase && (
          <View style={styles.retryBanner}>
            <Text style={styles.retryBannerText}>Повторение ошибок</Text>
          </View>
        )}
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
                  key={`selected-${index}-${word}`} 
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
        {isRetryPhase && (
          <View style={styles.retryBanner}>
            <Text style={styles.retryBannerText}>Повторение ошибок</Text>
          </View>
        )}
        <Text style={styles.question}>{currentExercise.word}</Text>
        <Text style={styles.subtitle}>Выберите правильный перевод</Text>
        <View style={styles.optionsContainerImage}>
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
        {isRetryPhase && (
          <View style={styles.retryBanner}>
            <Text style={styles.retryBannerText}>Повторение ошибок</Text>
          </View>
        )}
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
        <ProgressBar current={currentProgress} total={totalExercises} />
      </View>
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {renderExercise()}
      </KeyboardAvoidingView>

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
  content: {
    flex: 1
  },
  exerciseContainer: {
    flex: 1,
    padding: Sizes.padding.large,
    justifyContent: 'center'
  },
  retryBanner: {
    backgroundColor: Colors.warning,
    paddingVertical: Sizes.padding.small,
    paddingHorizontal: Sizes.padding.medium,
    borderRadius: Sizes.borderRadius.medium,
    marginBottom: Sizes.margin.large,
    alignSelf: 'center'
  },
  retryBannerText: {
    color: Colors.white,
    fontSize: Sizes.fontSize.medium,
    fontWeight: 'bold'
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
  optionsContainerImage: {
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
    fontSize: 32, 
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