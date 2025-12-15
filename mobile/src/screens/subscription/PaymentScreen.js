import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import api from '../../services/api';
import PaymentMethodModal from '../../components/payment/PaymentMethodModal';

const PaymentScreen = ({ route, navigation }) => {
  const { plan } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Банковская карта', icon: 'card' },
    { id: 'apple_pay', name: 'Apple Pay', icon: 'logo-apple' },
    { id: 'google_pay', name: 'Google Pay', icon: 'logo-google' },
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setPaymentMethod(methodId);
  };

  const handlePaymentComplete = async (paymentData) => {
    setLoading(true);
    try {
      await api.upgradeSubscription(plan.id, paymentMethod);
      setModalVisible(false);
      Alert.alert(
        'Успешно!',
        'Подписка успешно оформлена',
        [{ text: 'OK', onPress: () => navigation.navigate('Main', { screen: 'Profile' }) }]
      );
    } catch (error) {
      Alert.alert('Ошибка', error.message || 'Не удалось оформить подписку');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    setModalVisible(true);
  };

  const planPrice = typeof plan.price === 'object' ? plan.price.amount : plan.price;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Оформление подписки</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.planCard}>
          <View style={styles.planRow}>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planSubtext}>Ежемесячная подписка</Text>
            </View>
            <Text style={styles.planPrice}>{planPrice} ₽</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Способ оплаты</Text>
        
        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              style={[
                styles.methodCard,
                paymentMethod === method.id && styles.selectedMethod
              ]}
              onPress={() => handlePaymentMethodSelect(method.id)}
            >
              <View style={styles.methodContent}>
                <View style={styles.methodLeft}>
                  <Ionicons name={method.icon} size={24} color={Colors.primary} />
                  <Text style={styles.methodName}>{method.name}</Text>
                </View>
                {paymentMethod === method.id && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                )}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Перейти к оплате"
          onPress={handleProceedToPayment}
        />
        <Text style={styles.footerNote}>
          Нажимая "Перейти к оплате", вы соглашаетесь с условиями использования
        </Text>
      </View>

      <PaymentMethodModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        paymentMethod={paymentMethod}
        planPrice={planPrice}
        onPaymentComplete={handlePaymentComplete}
        loading={loading}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizes.padding.medium,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Sizes.padding.small,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  scrollContent: {
    padding: Sizes.padding.large,
  },
  planCard: {
    marginBottom: Sizes.margin.xlarge,
    backgroundColor: Colors.secondary,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
  },
  planSubtext: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
  },
  planPrice: {
    fontSize: Sizes.fontSize.xxxlarge,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.medium,
  },
  methodsContainer: {
    marginBottom: Sizes.margin.xlarge,
  },
  methodCard: {
    marginBottom: Sizes.margin.small,
  },
  selectedMethod: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  methodContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.margin.medium,
  },
  methodName: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: '600',
    color: Colors.textDark,
  },
  footer: {
    padding: Sizes.padding.large,
    paddingBottom: Platform.OS === 'ios' ? Sizes.padding.xlarge : Sizes.padding.large,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerNote: {
    fontSize: Sizes.fontSize.tiny,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Sizes.margin.small,
  },
});

export default PaymentScreen;