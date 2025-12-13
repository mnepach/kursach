import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';

const SubscriptionScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Подписка</Text>
        <Text style={styles.subtitle}>Этот экран в разработке</Text>
        
        <Button
          title="Назад"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.padding.large,
  },
  title: {
    fontSize: Sizes.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.medium,
  },
  subtitle: {
    fontSize: Sizes.fontSize.large,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  button: {
    width: '100%',
  },
});

export default SubscriptionScreen;