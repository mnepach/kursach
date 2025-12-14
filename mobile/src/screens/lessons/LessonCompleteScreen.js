import { View, Text, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';

const LessonCompleteScreen = ({ route, navigation }) => {
  const { correctAnswers = 0, totalQuestions = 0 } = route.params || {};
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  let status = 'ОТЛИЧНО';
  let borderColor = Colors.success;
  let bgColor = '#F0FDF4';
  let textColor = '#166534';
  let percentageColor = '#22C55E';

  if (correctAnswers < 2) {
    status = 'ПЛОХО';
    borderColor = Colors.error;
    bgColor = '#FEF2F2';
    textColor = '#7F1D1D';
    percentageColor = Colors.error;
  } else if (correctAnswers < 4) {
    status = 'НЕПЛОХО';
    borderColor = Colors.warning;
    bgColor = '#FFFBEB';
    textColor = '#78350F';
    percentageColor = Colors.warning;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../../assets/images/kitty.png')}
          style={styles.mascot}
        />
        
        <Text style={styles.title}>Конец урока!</Text>
        
        <View style={[styles.resultCard, { backgroundColor: bgColor, borderColor }]}>
          <View style={styles.resultContent}>
            <Text style={styles.emoji}>🎯</Text>
            <View style={styles.resultText}>
              <Text style={[styles.status, { color: textColor }]}>
                {status}
              </Text>
              <Text style={[styles.percentage, { color: percentageColor }]}>
                {percentage}%
              </Text>
              <Text style={[styles.details, { color: textColor }]}>
                Правильно: {correctAnswers} из {totalQuestions}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Продолжить"
          onPress={() => navigation.navigate('Home')}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.padding.large,
  },
  mascot: {
    width: 200,
    height: 200,
    marginBottom: Sizes.margin.xlarge,
  },
  title: {
    fontSize: Sizes.fontSize.xxxlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.xlarge,
  },
  resultCard: {
    borderRadius: Sizes.borderRadius.xlarge,
    borderWidth: 4,
    padding: Sizes.padding.xlarge,
    width: '100%',
    maxWidth: 350,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.margin.large,
  },
  emoji: {
    fontSize: 64,
  },
  resultText: {
    flex: 1,
  },
  status: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    marginBottom: Sizes.margin.small,
  },
  percentage: {
    fontSize: 72,
    fontWeight: 'bold',
    lineHeight: 72,
  },
  details: {
    fontSize: Sizes.fontSize.small,
    marginTop: Sizes.margin.small,
  },
  footer: {
    padding: Sizes.padding.large,
    paddingBottom: Platform.OS === 'ios' ? Sizes.padding.xlarge : Sizes.padding.large,
  },
});

export default LessonCompleteScreen;