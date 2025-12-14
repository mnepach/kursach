import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
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
        [{ text: 'OK', onPress: () => navigation.navigate('Profile') }]
      );
    } catch (error) {
      Alert.alert('Ошибка', error.message || 'Не удалось оформить подписку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Оплата</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price} ₽/мес</Text>
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
              <Ionicons name={method.icon} size={24} color={Colors.primary} />
              <Text style={styles.methodName}>{method.name}</Text>
            </Card>
          ))}
        </View>

        {paymentMethod === 'card' && (
          <View style={styles.cardForm}>
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
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Оплатить ${plan.price} ₽`}
          onPress={handlePayment}
          loading={loading}
        />
      </View>
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
    marginBottom: Sizes.margin.large,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  planPrice: {
    fontSize: Sizes.fontSize.xxlarge,
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
    marginBottom: Sizes.margin.large,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.margin.medium,
    marginBottom: Sizes.margin.small,
  },
  selectedMethod: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  methodName: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: '600',
    color: Colors.textDark,
  },
  cardForm: {
    marginTop: Sizes.margin.medium,
  },
  row: {
    flexDirection: 'row',
    gap: Sizes.margin.medium,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    padding: Sizes.padding.large,
    paddingBottom: Platform.OS === 'ios' ? Sizes.padding.xlarge : Sizes.padding.large,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

export default PaymentScreen;