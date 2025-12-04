import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Привет, {user?.name || 'Пользователь'}!</Text>
          <Text style={styles.subtitle}>Продолжим обучение?</Text>
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
              <Text style={styles.statLabel}>Очков опыта</Text>
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
          <Card style={styles.courseCard}>
            <Text style={styles.courseText}>Здесь будут отображаться ваши курсы</Text>
          </Card>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Sizes.padding.large,
    paddingTop: Sizes.padding.xlarge,
  },
  greeting: {
    fontSize: Sizes.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  subtitle: {
    fontSize: Sizes.fontSize.large,
    color: Colors.textLight,
  },
  statsCard: {
    margin: Sizes.margin.large,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 40,
    marginBottom: Sizes.margin.small,
  },
  statValue: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  statLabel: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
  },
  section: {
    padding: Sizes.padding.large,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.medium,
  },
  courseCard: {
    padding: Sizes.padding.xlarge,
  },
  courseText: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default HomeScreen;