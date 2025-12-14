import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSubscription = () => {
    navigation.navigate('Subscription');
  };

  const getPlanName = (planType) => {
    switch (planType) {
      case 'premium': return 'Премиум';
      case 'basic': return 'Базовый';
      default: return 'Бесплатный';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleEditProfile}
          >
            <Image 
              source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
              style={styles.avatar}
            />
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <TouchableOpacity onPress={handleEditProfile}>
            <Text style={styles.editButton}>Редактировать профиль</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{user?.statistics?.streak || 0}</Text>
            <Text style={styles.statLabel}>Дней подряд</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{user?.statistics?.experience || 0}</Text>
            <Text style={styles.statLabel}>Очков опыта</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>{user?.statistics?.achievements || 0}</Text>
            <Text style={styles.statLabel}>Достижений</Text>
          </Card>
        </View>

        <Card style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <View>
              <Text style={styles.subscriptionTitle}>
                {getPlanName(user?.subscription?.planType)}
              </Text>
              <Text style={styles.subscriptionSubtitle}>
                {user?.subscription?.planType === 'free' 
                  ? 'Базовые возможности' 
                  : 'Безлимитный доступ'}
              </Text>
            </View>
            {user?.subscription?.planType === 'free' && (
              <Ionicons name="lock-closed" size={24} color={Colors.textLight} />
            )}
          </View>
          
          <Button
            title={user?.subscription?.planType === 'free' 
              ? 'Перейти на Премиум' 
              : 'Управление подпиской'}
            onPress={handleSubscription}
            variant={user?.subscription?.planType === 'free' ? 'primary' : 'outline'}
            style={styles.subscriptionButton}
          />
        </Card>

        {progressData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Прогресс обучения</Text>
            {progressData.map((lang, index) => (
              <Card key={index} style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Text style={styles.languageName}>{lang.language}</Text>
                  <Text style={styles.progressPercent}>{lang.progress}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${lang.progress}%` }
                    ]} 
                  />
                </View>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Button
            title="Выйти из аккаунта"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
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
  header: {
    alignItems: 'center',
    paddingTop: Sizes.padding.xlarge,
    paddingBottom: Sizes.padding.large,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Sizes.margin.medium,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.secondary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  name: {
    fontSize: Sizes.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  email: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    marginBottom: Sizes.margin.small,
  },
  editButton: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Sizes.padding.large,
    gap: Sizes.margin.medium,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Sizes.padding.large,
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
  subscriptionCard: {
    marginHorizontal: Sizes.margin.large,
    marginBottom: Sizes.margin.large,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.margin.medium,
  },
  subscriptionTitle: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  subscriptionSubtitle: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
  },
  subscriptionButton: {
    marginTop: Sizes.margin.medium,
  },
  section: {
    paddingHorizontal: Sizes.padding.large,
    marginBottom: Sizes.margin.large,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.medium,
  },
  progressCard: {
    marginBottom: Sizes.margin.medium,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.margin.small,
  },
  languageName: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  progressPercent: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
});

export default ProfileScreen;