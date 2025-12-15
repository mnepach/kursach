import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import api from '../../services/api';

const PaymentScreen = ({ route, navigation }) => {
  const { plan } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const paymentMethods = [
    { id: 'card', name: 'Банковская карта', icon: 'card' },
    { id: 'apple_pay', name: 'Apple Pay', icon: 'logo-apple' },
    { id: 'google_pay', name: 'Google Pay', icon: 'logo-google' },
  ];

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (value) => {
    const formatted = formatExpiry(value);
    if (formatted.length <= 5) {
      setCardExpiry(formatted);
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        Alert.alert('Ошибка', 'Заполните все поля карты');
        return;
      }

      if (cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Ошибка', 'Неверный номер карты');
        return;
      }

      if (cardCvc.length !== 3) {
        Alert.alert('Ошибка', 'Неверный CVC код');
        return;
      }
    }

    setLoading(true);
    try {
      await api.upgradeSubscription(plan.id, paymentMethod);
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
              onPress={() => setPaymentMethod(method.id)}
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

        {paymentMethod === 'card' ? (
          <View style={styles.cardForm}>
            <Text style={styles.formTitle}>Данные для оплаты</Text>
            
            <Input
              label="Номер карты"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
            />

            <View style={styles.row}>
              <Input
                label="Срок действия"
                value={cardExpiry}
                onChangeText={handleExpiryChange}
                placeholder="MM/YY"
                keyboardType="number-pad"
                style={styles.halfInput}
              />

              <Input
                label="CVC"
                value={cardCvc}
                onChangeText={(value) => {
                  const v = value.replace(/[^0-9]/gi, '');
                  if (v.length <= 3) setCardCvc(v);
                }}
                placeholder="123"
                keyboardType="number-pad"
                style={styles.halfInput}
              />
            </View>

            <Input
              label="Имя на карте"
              value={cardName}
              onChangeText={setCardName}
              placeholder="IVAN IVANOV"
              autoCapitalize="characters"
            />

            <Text style={styles.securityNote}>
              🔒 Ваши данные надежно защищены
            </Text>
          </View>
        ) : (
          <View style={styles.alternativePayment}>
            <View style={styles.paymentIcon}>
              <Ionicons 
                name={paymentMethods.find(m => m.id === paymentMethod)?.icon} 
                size={64} 
                color={Colors.primary} 
              />
            </View>
            <Text style={styles.alternativeText}>
              Вы будете перенаправлены на страницу оплаты {paymentMethods.find(m => m.id === paymentMethod)?.name}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Оплатить ${planPrice} ₽`}
          onPress={handlePayment}
          loading={loading}
        />
        <Text style={styles.footerNote}>
          Нажимая "Оплатить", вы соглашаетесь с условиями использования
        </Text>
      </View>
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
  cardForm: {
    marginTop: Sizes.margin.medium,
  },
  formTitle: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.large,
  },
  row: {
    flexDirection: 'row',
    gap: Sizes.margin.medium,
  },
  halfInput: {
    flex: 1,
  },
  securityNote: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Sizes.margin.medium,
  },
  alternativePayment: {
    alignItems: 'center',
    paddingVertical: Sizes.padding.xlarge,
  },
  paymentIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.margin.large,
  },
  alternativeText: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: Sizes.padding.large,
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