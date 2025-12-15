  import { useState, useEffect } from 'react';
  import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Animated, Dimensions, Linking, ActivityIndicator } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';
  import Colors from '../../constants/colors';
  import Sizes from '../../constants/sizes';
  import Button from '../common/Button';
  import Input from '../common/Input';

  const { height } = Dimensions.get('window');

  const PaymentMethodModal = ({ visible, onClose, paymentMethod, planPrice, onPaymentComplete, loading }) => {
    const [slideAnim] = useState(new Animated.Value(height));
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [cardName, setCardName] = useState('');
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      if (visible) {
        Animated.spring(slideAnim, { toValue: 0, damping: 20, stiffness: 90, useNativeDriver: true }).start();
      } else {
        Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true }).start();
      }
    }, [visible]);

    const handleClose = () => {
      Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true }).start(() => {
        onClose();
        resetForm();
      });
    };

    const resetForm = () => {
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      setCardName('');
      setRedirecting(false);
    };

    const formatCardNumber = (value) => {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = matches && matches[0] || '';
      const parts = [];
      for (let i = 0; i < match.length; i += 4) parts.push(match.substring(i, i + 4));
      return parts.length ? parts.join(' ') : value;
    };

    const formatExpiry = (value) => {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4);
      return v;
    };

    const handleCardNumberChange = (value) => {
      const formatted = formatCardNumber(value);
      if (formatted.replace(/\s/g, '').length <= 16) setCardNumber(formatted);
    };

    const handleExpiryChange = (value) => {
      const formatted = formatExpiry(value);
      if (formatted.length <= 5) setCardExpiry(formatted);
    };

    const handlePayment = async () => {
      if (paymentMethod === 'card') {
        if (!cardNumber || !cardExpiry || !cardCvc || !cardName) return;
        await onPaymentComplete({ method: 'card', cardNumber, cardExpiry, cardCvc, cardName });
      } else {
        setRedirecting(true);
        setTimeout(async () => {
          const url = paymentMethod === 'apple_pay' ? 'https://www.apple.com/apple-pay/' : 'https://pay.google.com/about/';
          try { await Linking.openURL(url); handleClose(); } catch (error) { console.error(error); }
          finally { setRedirecting(false); }
        }, 4000);
      }
    };

    const isCardFormValid = () => {
      if (paymentMethod !== 'card') return true;
      return cardNumber.replace(/\s/g, '').length === 16 && cardExpiry.length === 5 && cardCvc.length === 3 && cardName.trim().length > 0;
    };

    const getPaymentMethodIcon = () => paymentMethod === 'apple_pay' ? 'logo-apple' : paymentMethod === 'google_pay' ? 'logo-google' : 'card';
    const getPaymentMethodName = () => paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'google_pay' ? 'Google Pay' : 'Банковская карта';

    if (!visible) return null;

    return (
      <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Данные для оплаты</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <Ionicons name="close" size={24} color={Colors.textDark} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {paymentMethod === 'card' ? (
                  <View style={styles.cardForm}>
                    <Input label="Номер карты" value={cardNumber} onChangeText={handleCardNumberChange} placeholder="1234 5678 9012 3456" keyboardType="number-pad" style={{ fontSize: Sizes.fontSize.small }} />
                    <View style={styles.row}>
                      <Input label="Срок действия" value={cardExpiry} onChangeText={handleExpiryChange} placeholder="MM/YY" keyboardType="number-pad" style={[styles.halfInput, { fontSize: Sizes.fontSize.small }]} />
                      <Input label="CVC" value={cardCvc} onChangeText={(v) => { const val = v.replace(/[^0-9]/gi, ''); if (val.length <= 3) setCardCvc(val); }} placeholder="123" keyboardType="number-pad" style={[styles.halfInput, { fontSize: Sizes.fontSize.small }]} />
                    </View>
                    <Input label="Имя на карте" value={cardName} onChangeText={setCardName} placeholder="IVAN IVANOV" autoCapitalize="characters" style={{ fontSize: Sizes.fontSize.small }} />
                  </View>
                ) : (
                  <View style={styles.alternativePayment}>
                    {redirecting ? (
                      <>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.redirectingText}>Перенаправление...</Text>
                      </>
                    ) : (
                      <View style={styles.alternativeBlock}>
                        <Ionicons name={getPaymentMethodIcon()} size={90} color={Colors.primary} />
                        <View style={{ height: Sizes.margin.medium }} />
                        <Text style={styles.alternativeText}>Вы будете перенаправлены на страницу оплаты {getPaymentMethodName()}</Text>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
              {paymentMethod === 'card' && (
                <View style={styles.footer}>
                  <Button title={`Оплатить ${planPrice} ₽`} onPress={handlePayment} loading={loading || redirecting} disabled={!isCardFormValid() || loading || redirecting} />
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    backdrop: { flex: 1 },
    modalContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopLeftRadius: Sizes.borderRadius.xlarge, borderTopRightRadius: Sizes.borderRadius.xlarge, maxHeight: height * 0.9 },
    modalContent: { flex: 1 },
    header: { alignItems: 'center', paddingVertical: Sizes.padding.medium, borderBottomWidth: 1, borderBottomColor: Colors.border, flexDirection: 'row', justifyContent: 'center' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.textDark, textAlign: 'center', flex: 1 },
    closeButton: { position: 'absolute', right: Sizes.padding.medium, top: Sizes.padding.medium, padding: Sizes.padding.small },
    scrollContent: { padding: Sizes.padding.large, paddingBottom: Sizes.padding.xlarge },
    cardForm: { marginTop: Sizes.margin.medium },
    row: { flexDirection: 'row', gap: Sizes.margin.medium },
    halfInput: { flex: 1 },
    alternativePayment: { minHeight: 300, justifyContent: 'flex-start' },
    alternativeBlock: { height: 250, alignItems: 'center', justifyContent: 'flex-start', marginBottom: Sizes.margin.xxlarge, paddingTop: Sizes.padding.large },
    alternativeText: { fontSize: Sizes.fontSize.large, color: Colors.textLight, textAlign: 'center', paddingHorizontal: Sizes.padding.medium, lineHeight: 28 },
    redirectingText: { fontSize: Sizes.fontSize.large, color: Colors.primary, marginTop: Sizes.margin.large, fontWeight: '600', textAlign: 'center' },
    footer: { padding: Sizes.padding.large, paddingBottom: Sizes.padding.xlarge, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  });

  export default PaymentMethodModal;
