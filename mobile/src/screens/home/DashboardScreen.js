import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const response = await api.getOverallStats();
      setProgressData(response.stats.languages || []);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Привет, {user?.name}!</Text>
            <Text style={styles.subtitle}>Продолжим обучение?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle" size={48} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{user?.statistics?.streak || 0}</Text>
              <Text style={styles.statLabel}>Дней подряд</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statValue}>{user?.statistics?.experience || 0}</Text>
              <Text style={styles.statLabel}>Очков</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>{user?.statistics?.achievements || 0}</Text>
              <Text style={styles.statLabel}>Достижений</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ваши курсы</Text>
          
          {progressData.length > 0 ? (
            progressData.map((lang, index) => (
              <Card 
                key={index} 
                style={styles.courseCard}
                onPress={() => navigation.navigate('Lessons', { language: lang.language })}
              >
                <View style={styles.courseHeader}>
                  <Text style={styles.courseName}>{lang.language}</Text>
                  <Text style={styles.courseLevel}>{lang.currentLevel}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[styles.progressBar, { width: `${lang.progress}%` }]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {lang.lessonsCompleted} уроков завершено
                </Text>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Начните изучать новый язык!
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  },
  subtitle: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
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
  sectionTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.medium,
  },
  courseCard: {
    marginBottom: Sizes.margin.medium,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.margin.small,
  },
  courseName: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  courseLevel: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.primary,
    fontWeight: '600',
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
  progressText: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
  },
  emptyCard: {
    paddingVertical: Sizes.padding.xlarge,
  },
  emptyText: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default DashboardScreen;