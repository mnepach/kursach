import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const ProgressScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressAnims] = useState(
    Array.from({ length: 6 }, () => new Animated.Value(0))
  );

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (stats?.languages) {
      stats.languages.forEach((lang, index) => {
        Animated.timing(progressAnims[index], {
          toValue: lang.progress,
          duration: 1000,
          delay: index * 100,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [stats]);

  const loadStats = async () => {
    try {
      const response = await api.getOverallStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Ваш прогресс</Text>
          <Text style={styles.subtitle}>Отслеживайте свои достижения</Text>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{stats?.totalLanguages || 0}</Text>
              <Text style={styles.statEmoji}>📚</Text>
            </View>
            <Text style={styles.statLabel}>Языков</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{stats?.totalLessonsCompleted || 0}</Text>
              <Text style={styles.statEmoji}>✅</Text>
            </View>
            <Text style={styles.statLabel}>Уроков</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{stats?.totalVocabulary || 0}</Text>
              <Text style={styles.statEmoji}>📖</Text>
            </View>
            <Text style={styles.statLabel}>Слов</Text>
          </Card>
        </View>

        {stats?.languages && stats.languages.length > 0 ? (
          <View style={styles.languagesSection}>
            <Text style={styles.sectionTitle}>Изучаемые языки</Text>
            
            {stats.languages.map((lang, index) => (
              <Card key={index} style={styles.languageCard}>
                <View style={styles.languageHeader}>
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{lang.language}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: getLevelColor(lang.currentLevel) }]}>
                      <Text style={styles.levelBadgeText}>
                        {lang.currentLevel} • {getLevelDescription(lang.currentLevel)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.languageStats}>
                    <Text style={styles.lessonsCount}>{lang.lessonsCompleted}</Text>
                    <Text style={styles.lessonsLabel}>уроков</Text>
                  </View>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Прогресс</Text>
                    <Text style={styles.progressPercentage}>{lang.progress}%</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <Animated.View
                      style={[
                        styles.progressBar,
                        {
                          width: progressAnims[index].interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                          }),
                          backgroundColor: getLevelColor(lang.currentLevel),
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.milestones}>
                  <View style={styles.milestone}>
                    <View style={[
                      styles.milestoneIcon, 
                      { backgroundColor: getLevelColor(lang.currentLevel) }
                    ]}>
                      <Text style={styles.milestoneIconText}>🎯</Text>
                    </View>
                    <Text style={styles.milestoneText}>Текущий уровень</Text>
                  </View>
                  
                  {lang.progress < 100 && (
                    <View style={styles.milestone}>
                      <View style={[styles.milestoneIcon, { backgroundColor: Colors.border }]}>
                        <Text style={styles.milestoneIconText}>🏆</Text>
                      </View>
                      <Text style={styles.milestoneText}>
                        До следующего: {Math.ceil((100 - lang.progress) / 5)} уроков
                      </Text>
                    </View>
                  )}
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>Начните изучать язык</Text>
            <Text style={styles.emptyText}>
              Выберите язык и пройдите первый урок, чтобы увидеть здесь свой прогресс
            </Text>
          </Card>
        )}

        <Card style={styles.achievementsCard}>
          <Text style={styles.achievementsTitle}>🏅 Достижения</Text>
          <Text style={styles.achievementsText}>Скоро здесь появятся ваши достижения!</Text>
        </Card>
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
    padding: Sizes.padding.large,
    paddingBottom: Sizes.padding.xlarge + 20,
  },
  header: {
    marginBottom: Sizes.margin.xlarge,
  },
  title: {
    fontSize: Sizes.fontSize.xxxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  subtitle: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Sizes.margin.medium,
    marginBottom: Sizes.margin.xlarge,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Sizes.padding.large,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Sizes.margin.small,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: Sizes.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
  },
  languagesSection: {
    marginBottom: Sizes.margin.xlarge,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.medium,
  },
  languageCard: {
    marginBottom: Sizes.margin.large,
  },
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Sizes.margin.large,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Sizes.padding.medium,
    paddingVertical: Sizes.padding.small,
    borderRadius: Sizes.borderRadius.full,
  },
  levelBadgeText: {
    fontSize: Sizes.fontSize.tiny,
    fontWeight: 'bold',
    color: Colors.white,
  },
  languageStats: {
    alignItems: 'flex-end',
  },
  lessonsCount: {
    fontSize: Sizes.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  lessonsLabel: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
  },
  progressSection: {
    marginBottom: Sizes.margin.large,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.margin.small,
  },
  progressLabel: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
  },
  progressPercentage: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  milestones: {
    gap: Sizes.margin.small,
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.margin.medium,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneIconText: {
    fontSize: 20,
  },
  milestoneText: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textDark,
  },
  emptyCard: {
    paddingVertical: Sizes.padding.xlarge * 2,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Sizes.margin.large,
  },
  emptyTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  emptyText: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: Sizes.padding.large,
  },
  achievementsCard: {
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    paddingVertical: Sizes.padding.xlarge,
  },
  achievementsTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  achievementsText: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default ProgressScreen;