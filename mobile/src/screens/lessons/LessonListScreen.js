import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const LessonListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    if (user?.onboardingData?.selectedLanguage) {
      setSelectedLanguage(user.onboardingData.selectedLanguage);
      loadLessons(user.onboardingData.selectedLanguage.name);
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadLessons = async (language) => {
    try {
      setLoading(true);
      const response = await api.getLessons(language);
      setLessons(response.lessons || []);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonPress = (lesson) => {
    if (lesson.locked) {
      navigation.navigate('Subscription');
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
      style={styles.lessonCard}
      onPress={() => handleLessonPress(item)}
    >
      <View style={styles.lessonHeader}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>{item.lessonNumber}</Text>
        </View>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.lessonDescription}>
            {item.exercises.length} упражнений • {item.totalPoints} очков
          </Text>
        </View>
        <View style={styles.lessonRight}>
          {item.locked ? (
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={16} color={Colors.white} />
            </View>
          ) : (
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
              <Text style={styles.levelText}>{item.level}</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.languageInfo}>
          {selectedLanguage.flag && (
            <Image source={selectedLanguage.flag} style={styles.flagImage} />
          )}
          <Text style={styles.headerTitle}>{selectedLanguage.name}</Text>
        </View>
      </View>

      <FlatList
        data={lessons}
        renderItem={renderLesson}
        keyExtractor={(item, index) => `${item._id || index}`}
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
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  listContent: {
    padding: Sizes.padding.large,
    paddingBottom: Sizes.padding.xlarge + 20,
  },
  lessonCard: {
    marginBottom: Sizes.margin.medium,
    padding: Sizes.padding.large,
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
    backgroundColor: Colors.primary,
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
  lockBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
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