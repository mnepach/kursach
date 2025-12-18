import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Platform, StatusBar, Animated } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';

const LessonCompleteScreen = ({ correctAnswers = 0, totalQuestions = 0, onComplete }) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  let status = 'ОТЛИЧНО';
  let borderColor = Colors.success;
  let bgColor = '#F0FDF4';
  let textColor = '#166534';
  let percentageColor = '#22C55E';
  let emoji = '🎉';

  if (correctAnswers < 2) {
    status = 'ПОПРОБУЙТЕ ЕЩЁ';
    borderColor = Colors.error;
    bgColor = '#FEF2F2';
    textColor = '#7F1D1D';
    percentageColor = Colors.error;
    emoji = '💪';
  } else if (correctAnswers < 4) {
    status = 'ХОРОШО';
    borderColor = Colors.warning;
    bgColor = '#FFFBEB';
    textColor = '#78350F';
    percentageColor = Colors.warning;
    emoji = '👍';
  }

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.Image 
          source={require('../../../assets/images/kitty.png')}
          style={[
            styles.mascot,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }
          ]}
        />
        
        <Animated.Text 
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          Урок завершён!
        </Animated.Text>
        
        <Animated.View 
          style={[
            styles.resultCard, 
            { 
              backgroundColor: bgColor, 
              borderColor,
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          <View style={styles.resultContent}>
            <Text style={styles.emoji}>{emoji}</Text>
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
        </Animated.View>

        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>+{correctAnswers * 10}</Text>
            <Text style={styles.statLabel}>Очков</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>+1</Text>
            <Text style={styles.statLabel}>День серии</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View 
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <Button
          title="Продолжить"
          onPress={onComplete}
        />
      </Animated.View>
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
    width: 160,
    height: 160,
    marginBottom: Sizes.margin.large,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.xlarge,
    textAlign: 'center',
  },
  resultCard: {
    borderRadius: Sizes.borderRadius.xlarge,
    borderWidth: 4,
    padding: Sizes.padding.xlarge,
    width: '100%',
    maxWidth: 350,
    marginBottom: Sizes.margin.xlarge,
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
    fontSize: Sizes.fontSize.medium,
    fontWeight: 'bold',
    marginBottom: Sizes.margin.small,
  },
  percentage: {
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 64,
  },
  details: {
    fontSize: Sizes.fontSize.small,
    marginTop: Sizes.margin.small,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Sizes.margin.xlarge,
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 40,
    marginBottom: Sizes.margin.small,
  },
  statValue: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Sizes.margin.small,
  },
  statLabel: {
    fontSize: Sizes.fontSize.small,
    color: Colors.textLight,
  },
  footer: {
    padding: Sizes.padding.large,
    paddingBottom: Platform.OS === 'ios' ? Sizes.padding.xlarge : Sizes.padding.large,
  },
});

export default LessonCompleteScreen;