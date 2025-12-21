import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { getLessonDeclension, getDayDeclension, getAchievementDeclension } from '../../utils/helpers';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

const LANGUAGES = [
  { 
    id: 'english',
    name: 'Английский', 
    flag: require('../../../assets/images/flags/england.png'),
  },
  { 
    id: 'spanish',
    name: 'Испанский', 
    flag: require('../../../assets/images/flags/spain.png'),
  },
  { 
    id: 'japanese',
    name: 'Японский', 
    flag: require('../../../assets/images/flags/japan.png'),
  },
  { 
    id: 'korean',
    name: 'Корейский', 
    flag: require('../../../assets/images/flags/korea.png'),
  }
];

const HomeScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (user?.onboardingData?.selectedLanguage) {
        await api.getLanguageProgress(user.onboardingData.selectedLanguage.name);
      }
      
      const response = await api.getOverallStats();
      const languages = response.stats.languages || [];
      setProgressData(languages);
      
      if (user?.onboardingData?.selectedLanguage) {
        const activeLang = languages.find(
          l => l.language === user.onboardingData.selectedLanguage.name
        );
        setActiveLanguage(activeLang || languages[0] || null);
      } else if (languages.length > 0) {
        const firstLang = LANGUAGES.find(l => l.name === languages[0].language);
        if (firstLang) {
          await updateUser({
            onboardingData: {
              ...user.onboardingData,
              selectedLanguage: firstLang
            }
          });
          setActiveLanguage(languages[0]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleAddLanguage = async () => {
    const currentPlan = user?.subscription?.planType || 'free';
    const maxLanguages = user?.subscription?.features?.maxLanguages || 1;
    const currentLanguagesCount = progressData.length;

    if (currentLanguagesCount >= maxLanguages) {
      Alert.alert(
        'Ограничение тарифа',
        'Вы достигли максимального количества языков для вашего тарифа. Перейдите на платный тариф для изучения большего количества языков.',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Перейти на Premium', onPress: () => navigation.navigate('Subscription') }
        ]
      );
      return;
    }

    const availableLanguages = LANGUAGES.filter(
      lang => !progressData.some(p => p.language === lang.name)
    );

    if (availableLanguages.length === 0) {
      Alert.alert('Информация', 'Вы уже изучаете все доступные языки');
      return;
    }

    Alert.alert(
      'Добавить язык',
      'Выберите язык для изучения',
      availableLanguages.map(lang => ({
        text: lang.name,
        onPress: async () => {
          try {
            await updateUser({
              onboardingData: {
                ...user?.onboardingData,
                selectedLanguage: lang
              }
            });
            
            await api.getLanguageProgress(lang.name);
            
            await loadData();
            
            Alert.alert('Успешно', `Язык "${lang.name}" добавлен!`);
          } catch (error) {
            console.error('Error adding language:', error);
            Alert.alert('Ошибка', 'Не удалось добавить язык');
          }
        }
      })).concat([{ text: 'Отмена', style: 'cancel' }])
    );
  };

  const handleSwitchLanguage = async (language) => {
    const lang = LANGUAGES.find(l => l.name === language.language);
    if (lang) {
      try {
        await updateUser({
          onboardingData: {
            ...user?.onboardingData,
            selectedLanguage: lang
          }
        });
        setActiveLanguage(language);
      } catch (error) {
        console.error('Error switching language:', error);
        Alert.alert('Ошибка', 'Не удалось переключить язык');
      }
    }
  };

  const currentPlan = user?.subscription?.planType || 'free';
  const maxLanguages = user?.subscription?.features?.maxLanguages || 1;
  const canAddLanguage = progressData.length < maxLanguages;

  const streakDays = user?.statistics?.streak || 0;
  const experiencePoints = user?.statistics?.experience || 0;
  const achievementsCount = user?.statistics?.achievements || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Привет, {user?.name || 'Пользователь'}!</Text>
            <Text style={styles.subtitle}>Продолжим обучение?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image 
              source={{ uri: user?.avatar || 'https://via.placeholder.com/48' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{streakDays}</Text>
              <Text style={styles.statLabel}>{getDayDeclension(streakDays)} подряд</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statValue}>{experiencePoints}</Text>
              <Text style={styles.statLabel}>Очков опыта</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>{achievementsCount}</Text>
              <Text style={styles.statLabel}>{getAchievementDeclension(achievementsCount)}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ваши курсы</Text>
            <TouchableOpacity 
              style={[
                styles.addButton,
                !canAddLanguage && styles.addButtonDisabled
              ]}
              onPress={handleAddLanguage}
              disabled={!canAddLanguage}
            >
              <Ionicons 
                name="add-circle" 
                size={24} 
                color={canAddLanguage ? Colors.primary : Colors.textLight} 
              />
              <Text style={[
                styles.addButtonText,
                !canAddLanguage && styles.addButtonTextDisabled
              ]}>
                Добавить курс
              </Text>
            </TouchableOpacity>
          </View>

          {progressData.length > 0 ? (
            progressData.map((lang, index) => {
              const isActive = activeLanguage?.language === lang.language;
              const languageData = LANGUAGES.find(l => l.name === lang.language);
              const lessonsCompleted = lang.lessonsCompleted || 0;

              return (
                <Card 
                  key={index} 
                  style={[
                    styles.courseCard,
                    isActive && styles.activeCourseCard
                  ]}
                  onPress={() => {
                    if (!isActive) {
                      handleSwitchLanguage(lang);
                    }
                  }}
                >
                  <View style={styles.courseHeader}>
                    {languageData?.flag && (
                      <Image 
                        source={languageData.flag} 
                        style={styles.flagImage} 
                      />
                    )}
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseName}>{lang.language}</Text>
                      <Text style={[
                        styles.courseStatus,
                        isActive && styles.courseStatusActive
                      ]}>
                        {isActive ? '✓ Курс активен' : 'Нажмите для активации'}
                      </Text>
                    </View>
                    <View style={styles.courseLevelBadge}>
                      <Text style={styles.courseLevel}>{lang.currentLevel}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${lang.progress}%` }
                      ]} 
                    />
                  </View>
                  
                  <View style={styles.courseFooter}>
                    <Text style={styles.progressText}>
                      {lessonsCompleted} {getLessonDeclension(lessonsCompleted)} завершено
                    </Text>
                    <Text style={styles.progressPercentage}>
                      {lang.progress}%
                    </Text>
                  </View>

                  {isActive && (
                    <Button
                      title="Продолжить обучение"
                      onPress={() => navigation.navigate('Lessons', { language: lang.language })}
                      style={styles.continueButton}
                    />
                  )}
                </Card>
              );
            })
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📚</Text>
              <Text style={styles.emptyText}>
                Начните изучать новый язык!
              </Text>
              <Button
                title="Выбрать язык"
                onPress={handleAddLanguage}
                style={styles.emptyButton}
              />
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },
  scrollContent: {
    paddingBottom: Sizes.padding.xlarge,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizes.padding.large,
  },
  greeting: {
    fontSize: Sizes.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
  },
  statsCard: {
    marginHorizontal: Sizes.margin.large,
    marginBottom: Sizes.margin.large,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: Sizes.margin.small,
  },
  statValue: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  statLabel: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Sizes.padding.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.margin.medium,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: Sizes.fontSize.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: Colors.textLight,
  },
  courseCard: {
    marginBottom: Sizes.margin.medium,
  },
  activeCourseCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.margin.medium,
    gap: Sizes.margin.medium,
  },
  flagImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 4,
  },
  courseStatus: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
  },
  courseStatusActive: {
    color: Colors.success,
    fontWeight: '600',
  },
  courseLevelBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.padding.medium,
    paddingVertical: Sizes.padding.small,
    borderRadius: Sizes.borderRadius.full,
  },
  courseLevel: {
    fontSize: Sizes.fontSize.small,
    fontWeight: 'bold',
    color: Colors.white,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Sizes.margin.small,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.margin.medium,
  },
  progressText: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
  },
  progressPercentage: {
    fontSize: Sizes.fontSize.small,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  continueButton: {
    marginTop: Sizes.margin.small,
  },
  emptyCard: {
    paddingVertical: Sizes.padding.xlarge * 2,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Sizes.margin.large,
  },
  emptyText: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Sizes.margin.large,
  },
  emptyButton: {
    minWidth: 200,
  },
});

export default HomeScreen;