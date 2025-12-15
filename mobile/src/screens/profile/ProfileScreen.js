import { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform, StatusBar,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const response = await api.getOverallStats();
      setProgressData(response.stats.languages || []);
    } catch {}
  };

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', onPress: logout, style: 'destructive' },
    ]);
  };

  const getPlanName = (planType) => {
    if (planType === 'premium') return 'Премиум';
    if (planType === 'basic') return 'Базовый';
    return 'Бесплатный';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
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
              <Ionicons name="lock-closed" size={22} color={Colors.textLight} />
            )}
          </View>

          <Button
            title={
              user?.subscription?.planType === 'free'
                ? 'Перейти на Премиум'
                : 'Управление подпиской'
            }
            onPress={() => navigation.navigate('Subscription')}
          />
        </Card>

        <View style={styles.section}>
          <Button
            title="Выйти из аккаунта"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 8,
    paddingBottom: Sizes.padding.xlarge,
  },
  header: {
    alignItems: 'center',
    paddingTop: Sizes.padding.large,
    paddingBottom: Sizes.padding.medium,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    marginBottom: Sizes.margin.small,
  },
  avatarWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.secondary,
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  name: {
    fontSize: Sizes.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 2,
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
    marginBottom: 4,
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
  },
  subscriptionSubtitle: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
  },
  section: {
    paddingHorizontal: Sizes.padding.large,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
});

export default ProfileScreen;
