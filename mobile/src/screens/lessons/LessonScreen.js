import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ProgressBar from '../../components/lesson/ProgressBar';
import ListenAndArrangeScreen from './ListenAndArrangeScreen';
import SelectWordByImageScreen from './SelectWordByImageScreen';
import TranslateToTargetScreen from './TranslateToTargetScreen';
import TranslateToRussianScreen from './TranslateToRussianScreen';
import LessonCompleteScreen from './LessonCompleteScreen';
import api from '../../services/api';

const LessonScreen = ({ navigation, route }) => {
  const params = route?.params || {};
  const { lesson, language } = params;
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

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
  const totalExercises = lesson.exercises.length;

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentExerciseIndex < totalExercises - 1) {
      setTimeout(() => {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setShowComplete(true);
      }, 500);
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

  const handleClose = () => {
    navigation.goBack();
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
    const exerciseProps = {
      lesson: currentExercise,
      onAnswer: handleAnswer,
      currentIndex: currentExerciseIndex,
      totalLessons: totalExercises,
    };

    switch (currentExercise.type) {
      case 'listen':
        return <ListenAndArrangeScreen {...exerciseProps} />;
      case 'selectImage':
        return <SelectWordByImageScreen {...exerciseProps} />;
      case 'translateToTarget':
        return <TranslateToTargetScreen {...exerciseProps} />;
      case 'translateToRussian':
        return <TranslateToRussianScreen {...exerciseProps} />;
      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Неизвестный тип упражнения</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color={Colors.textDark} />
        </TouchableOpacity>
        <ProgressBar current={currentExerciseIndex + 1} total={totalExercises} />
      </View>
      {renderExercise()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.padding.large,
  },
  errorText: {
    fontSize: Sizes.fontSize.large,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Sizes.margin.large,
  },
});

export default LessonScreen;