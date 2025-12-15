import { View, Text, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
    </View>
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
  scrollContent: {
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 0) + Sizes.padding.large
        : Sizes.padding.xlarge,
    paddingBottom: Sizes.padding.xlarge,
  },
  header: {
    padding: Sizes.padding.large,
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
    marginBottom: Sizes.margin.small,
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
    padding: Sizes.padding.xlarge,
  },
  courseText: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default HomeScreen;
