import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const LANGUAGE_FLAGS = {
  'Английский': require('../../../assets/images/flags/england.png'),
  'Испанский': require('../../../assets/images/flags/spain.png'),
  'Японский': require('../../../assets/images/flags/japan.png'),
  'Корейский': require('../../../assets/images/flags/korea.png'),
};

const LessonListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (user?.onboardingData?.selectedLanguage) {
      setSelectedLanguage(user.onboardingData.selectedLanguage);
      loadData(user.onboardingData.selectedLanguage.name);
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadData = async (language) => {
    try {
      setLoading(true);
      const [lessonsResponse, progressResponse] = await Promise.all([
        api.getLessons(language),
        api.getLanguageProgress(language),
      ]);
      
      const sortedLessons = sortLessonsByLevel(lessonsResponse.lessons || []);
      const unlockedLessons = determineUnlockedLessons(
        sortedLessons, 
        progressResponse.progress
      );
      
      setLessons(unlockedLessons);
      setProgress(progressResponse.progress);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortLessonsByLevel = (lessons) => {
    const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
    return lessons.sort((a, b) => {
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      if (levelDiff !== 0) return levelDiff;
      return a.lessonNumber - b.lessonNumber;
    });
  };

  const determineUnlockedLessons = (lessons, progress) => {
    if (lessons.length === 0) return [];
    if (!progress) return lessons.map((l, i) => ({ ...l, isLocked: i !== 0, isCompleted: false }));

    const completedSet = new Set(progress.completedLessons.map(cl => cl.lessonId));
    
    return lessons.map((lesson, index) => {
      const isCompleted = completedSet.has(lesson._id);
      
      if (lesson.lessonNumber === 1 && lesson.level === 'A1') {
        return { ...lesson, isLocked: false, isCompleted };
      }
      
      const previousLesson = lessons.find(
        l => l.lessonNumber === lesson.lessonNumber - 1 && l.level === lesson.level
      );
      
      if (previousLesson && completedSet.has(previousLesson._id)) {
        return { ...lesson, isLocked: false, isCompleted };
      }
      
      if (lesson.lessonNumber === 1) {
        const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const currentLevelIndex = levelOrder.indexOf(lesson.level);
        
        if (currentLevelIndex > 0) {
          const previousLevel = levelOrder[currentLevelIndex - 1];
          const previousLevelLessons = progress.completedLessons.filter(l => l.level === previousLevel);
          
          const requiredLessons = {
            'A2': 6,
            'B1': 4,
            'B2': 10,
            'C1': 10,
            'C2': 10
          };
          
          const isUnlocked = previousLevelLessons.length >= (requiredLessons[lesson.level] || 0);
          return { ...lesson, isLocked: !isUnlocked, isCompleted };
        }
      }
      
      return { ...lesson, isLocked: true, isCompleted };
    });
  };

  const handleLessonPress = (lesson) => {
    if (lesson.isLocked) {
      Alert.alert(
        'Урок заблокирован',
        'Сначала завершите предыдущий урок',
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate('Lesson', {
      lesson,
      language: selectedLanguage.name
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'A1': return '#10B981';
      case 'A2': return '#3B82F6';
      case 'B1': return '#F59E0B';
      case 'B2': return '#EF4444';
      case 'C1': return '#8B5CF6';
      case 'C2': return '#EC4899';
      default: return Colors.primary;
    }
  };

  const getLevelDescription = (level) => {
    switch (level) {
      case 'A1': return 'Начальный';
      case 'A2': return 'Элементарный';
      case 'B1': return 'Средний';
      case 'B2': return 'Продвинутый';
      case 'C1': return 'Профессиональный';
      case 'C2': return 'Мастерский';
      default: return 'Начальный';
    }
  };

  const getLessonWordDeclension = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'уроков';
    }
    if (lastDigit === 1) {
      return 'урок';
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'урока';
    }
    return 'уроков';
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!selectedLanguage) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Выберите язык</Text>
          <Text style={styles.emptySubtitle}>
            Пройдите онбординг, чтобы начать изучение
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderLesson = ({ item, index }) => (
    <Card
      style={[
        styles.lessonCard,
        item.isCompleted && styles.completedCard,
        item.isLocked && styles.lockedCard,
      ]}
      onPress={() => handleLessonPress(item)}
      disabled={item.isLocked}
    >
      <View style={styles.lessonHeader}>
        <View style={[
          styles.lessonNumber, 
          { 
            backgroundColor: item.isCompleted 
              ? Colors.success 
              : item.isLocked 
                ? Colors.border 
                : Colors.primary 
          }
        ]}>
          {item.isCompleted ? (
            <Ionicons name="checkmark" size={24} color={Colors.white} />
          ) : item.isLocked ? (
            <Ionicons name="lock-closed" size={24} color={Colors.white} />
          ) : (
            <Text style={styles.lessonNumberText}>{item.lessonNumber}</Text>
          )}
        </View>
        <View style={styles.lessonInfo}>
          <Text style={[styles.lessonTitle, item.isLocked && styles.lockedText]}>
            {item.title}
          </Text>
          <Text style={styles.lessonDescription}>
            7 упражнений • {item.totalPoints} очков
          </Text>
        </View>
        <View style={styles.lessonRight}>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderSectionHeader = (level) => {
    const levelLessons = lessons.filter(l => l.level === level);
    const completedCount = levelLessons.filter(l => l.isCompleted).length;
    
    return (
      <View style={[styles.sectionHeader, { borderLeftColor: getLevelColor(level) }]}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Уровень {level}</Text>
          <Text style={styles.sectionSubtitle}>{getLevelDescription(level)}</Text>
        </View>
        <Text style={styles.sectionProgress}>
          {completedCount}/{levelLessons.length}
        </Text>
      </View>
    );
  };

  const renderListWithSections = () => {
    const sections = [];
    let currentLevel = null;

    lessons.forEach((lesson, index) => {
      if (lesson.level !== currentLevel) {
        currentLevel = lesson.level;
        sections.push({ type: 'header', level: currentLevel, key: `header-${currentLevel}` });
      }
      sections.push({ type: 'lesson', data: lesson, key: `lesson-${lesson._id}` });
    });

    return (
      <FlatList
        data={sections}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return renderSectionHeader(item.level);
          }
          return renderLesson({ item: item.data });
        }}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Уроки не найдены</Text>
            <Text style={styles.emptySubtitle}>
              Попробуйте выбрать другой язык
            </Text>
          </View>
        }
      />
    );
  };

  const languageFlag = LANGUAGE_FLAGS[selectedLanguage.name];
  const totalCompleted = progress?.totalLessonsCompleted || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.languageInfo}>
          {languageFlag && (
            <Image source={languageFlag} style={styles.flagImage} />
          )}
          <View>
            <Text style={styles.headerTitle}>{selectedLanguage.name}</Text>
            {progress && (
              <Text style={styles.headerSubtitle}>
                Пройдено: {totalCompleted} {getLessonWordDeclension(totalCompleted)} • Уровень: {progress.currentLevel}
              </Text>
            )}
          </View>
        </View>
      </View>

      {renderListWithSections()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },
  header: {
    paddingHorizontal: Sizes.padding.large,
    paddingVertical: Sizes.padding.medium,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.margin.medium,
  },
  flagImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  headerSubtitle: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
    marginTop: 2,
  },
  sectionHeader: {
    paddingVertical: Sizes.padding.medium,
    paddingHorizontal: Sizes.padding.large,
    backgroundColor: Colors.bgLight,
    borderLeftWidth: 4,
    marginBottom: Sizes.margin.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionTitleContainer: {
    flex: 1
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  sectionSubtitle: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
    marginTop: 2
  },
  sectionProgress: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: 'bold',
    color: Colors.primary
  },
  listContent: {
    padding: Sizes.padding.large,
    paddingBottom: Sizes.padding.xlarge + 20,
  },
  lessonCard: {
    marginBottom: Sizes.margin.medium,
    padding: Sizes.padding.large,
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: Colors.success,
  },
  lockedCard: {
    opacity: 0.6,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.margin.medium,
  },
  lessonNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberText: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.white,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  lockedText: {
    color: Colors.textLight,
  },
  lessonDescription: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
  },
  lessonRight: {
    alignItems: 'center',
  },
  levelBadge: {
    paddingHorizontal: Sizes.padding.small,
    paddingVertical: Sizes.padding.small / 2,
    borderRadius: Sizes.borderRadius.small,
  },
  levelText: {
    fontSize: Sizes.fontSize.tiny,
    fontWeight: 'bold',
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.padding.xlarge * 2,
  },
  emptyTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  emptySubtitle: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default LessonListScreen;