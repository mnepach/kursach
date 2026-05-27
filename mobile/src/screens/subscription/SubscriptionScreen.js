import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { getCachedPricing } from '../../services/currency';

const SubscriptionScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pricing, setPricing] = useState(null);
  const currentPlan = user?.subscription?.planType || 'free';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansResponse, pricingData] = await Promise.all([
        api.getPlans(),
        getCachedPricing(),
      ]);

      const updatedPlans = plansResponse.plans.map(plan => {
        if (plan.id === 'basic' && pricingData.prices.basic) {
          return { ...plan, price: pricingData.prices.basic.amount, currencySymbol: pricingData.currency.symbol };
        }
        if (plan.id === 'premium' && pricingData.prices.premium) {
          return { ...plan, price: pricingData.prices.premium.amount, currencySymbol: pricingData.currency.symbol };
        }
        return plan;
      });

      setPricing(pricingData);
      setPlans(sortPlans(updatedPlans));
      setError('');
    } catch (err) {
      setError('Не удалось загрузить планы подписки');
    } finally {
      setLoading(false);
    }
  };

  const sortPlans = (plansArray) => {
    const current = plansArray.find(p => p.id === currentPlan);
    const popular = plansArray.find(p => p.id === 'premium');
    const others = plansArray.filter(p => p.id !== currentPlan && p.id !== 'premium');
    const sorted = [];
    if (popular && popular.id !== currentPlan) sorted.push(popular);
    sorted.push(...others.filter(p => p.id !== currentPlan));
    if (current) sorted.push(current);
    return sorted;
  };

  const getPlanPrice = (plan) => {
    return typeof plan.price === 'object' ? plan.price.amount : plan.price;
  };

  const getPlanSymbol = (plan) => {
    if (plan.currencySymbol) return plan.currencySymbol;
    if (pricing) return pricing.currency.symbol;
    return '₽';
  };

  const handleSelectPlan = (plan) => {
    if (plan.id === currentPlan) return;
    if (plan.id === 'free') {
      Alert.alert(
        'Отменить подписку?',
        'Вы потеряете доступ к премиум-функциям',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Подтвердить', onPress: handleCancelSubscription, style: 'destructive' },
        ]
      );
    } else {
      navigation.navigate('Payment', { plan, pricing });
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      await api.cancelSubscription();
      await updateUser({ subscription: { planType: 'free' } });
      Alert.alert('Успешно', 'Подписка отменена');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Ошибка', err.message || 'Не удалось отменить подписку');
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planId) => {
    if (planId === 'premium') return '👑';
    if (planId === 'basic') return '⭐';
    return '🆓';
  };

  if (loading) return <Loader fullScreen />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Выберите план</Text>
          {pricing && (
            <Text style={styles.headerSubtitle}>Цены в {pricing.currency.name}</Text>
          )}
        </View>
        <View style={{ width: 24 }} />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Попробовать снова" onPress={loadData} style={styles.retryButton} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {plans.map((plan, index) => {
            const isCurrentPlan = plan.id === currentPlan;
            const planPrice = getPlanPrice(plan);
            const symbol = getPlanSymbol(plan);
            const isPopular = plan.id === 'premium';

            return (
              <Card
                key={index}
                style={[
                  styles.planCard,
                  isCurrentPlan && styles.currentPlanCard,
                  isPopular && !isCurrentPlan && styles.popularPlan,
                ]}
                onPress={() => handleSelectPlan(plan)}
                disabled={isCurrentPlan}
              >
                {isPopular && !isCurrentPlan && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Популярный</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <Text style={styles.planIcon}>{getPlanIcon(plan.id)}</Text>
                  <View style={styles.planInfo}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDescription}>{plan.description}</Text>
                  </View>
                </View>
                <View style={styles.planPricing}>
                  {planPrice === 0 ? (
                    <Text style={styles.planPrice}>Бесплатно</Text>
                  ) : (
                    <>
                      <Text style={styles.planPrice}>{planPrice} {symbol}</Text>
                      <Text style={styles.planPeriod}>/месяц</Text>
                    </>
                  )}
                </View>
                <View style={styles.featuresList}>
                  {plan.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <Button
                  title={
                    isCurrentPlan
                      ? 'Текущий план'
                      : plan.id === 'free' && currentPlan !== 'free'
                      ? 'Отменить подписку'
                      : 'Выбрать план'
                  }
                  onPress={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan}
                  variant={plan.id === 'free' && currentPlan !== 'free' ? 'outline' : 'primary'}
                  style={[styles.selectButton, isCurrentPlan && styles.currentPlanButton]}
                  textStyle={isCurrentPlan && styles.currentPlanButtonText}
                />
              </Card>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgLight },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.padding.medium,
    paddingVertical: Sizes.padding.medium,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: { padding: Sizes.padding.small },
  headerTitleBlock: { alignItems: 'center' },
  headerTitle: { fontSize: Sizes.fontSize.large, fontWeight: 'bold', color: Colors.textDark },
  headerSubtitle: { fontSize: Sizes.fontSize.tiny, color: Colors.textLight, marginTop: 2 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Sizes.padding.large },
  errorText: { fontSize: Sizes.fontSize.medium, color: Colors.error, textAlign: 'center', marginBottom: Sizes.margin.large },
  retryButton: { width: '100%', maxWidth: 200 },
  scrollContent: { padding: Sizes.padding.large, paddingBottom: Sizes.padding.xlarge + 20 },
  planCard: { marginBottom: Sizes.margin.large, position: 'relative' },
  currentPlanCard: { borderWidth: 2, borderColor: Colors.primary, backgroundColor: Colors.white },
  popularPlan: { borderWidth: 3, borderColor: Colors.primary },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: Sizes.padding.large,
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.padding.medium,
    paddingVertical: Sizes.padding.small,
    borderRadius: Sizes.borderRadius.full,
  },
  popularBadgeText: { color: Colors.white, fontSize: Sizes.fontSize.tiny, fontWeight: 'bold' },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Sizes.margin.medium },
  planIcon: { fontSize: 48, marginRight: Sizes.margin.medium },
  planInfo: { flex: 1 },
  planName: { fontSize: Sizes.fontSize.xlarge, fontWeight: 'bold', color: Colors.textDark, marginBottom: Sizes.margin.small },
  planDescription: { fontSize: Sizes.fontSize.small, color: Colors.textLight },
  planPricing: { flexDirection: 'row', alignItems: 'baseline', marginBottom: Sizes.margin.large },
  planPrice: { fontSize: Sizes.fontSize.xxxlarge, fontWeight: 'bold', color: Colors.primary },
  planPeriod: { fontSize: Sizes.fontSize.medium, color: Colors.textLight, marginLeft: Sizes.margin.small },
  featuresList: { marginBottom: Sizes.margin.large },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: Sizes.margin.small },
  featureText: { fontSize: Sizes.fontSize.medium, color: Colors.textDark, marginLeft: Sizes.margin.small, flex: 1 },
  selectButton: { marginTop: Sizes.margin.small },
  currentPlanButton: { backgroundColor: Colors.border, opacity: 1 },
  currentPlanButtonText: { color: Colors.textDark, fontWeight: 'bold' },
});

export default SubscriptionScreen;