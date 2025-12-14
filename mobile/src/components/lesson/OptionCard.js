import { Text, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Card from '../common/Card';

const OptionCard = ({ 
  option, 
  selected, 
  onPress, 
  disabled,
  isCorrect,
  showResult 
}) => {
  const getCardStyle = () => {
    if (showResult) {
      if (isCorrect) {
        return styles.correct;
      }
      if (selected) {
        return styles.incorrect;
      }
    }
    if (selected) {
      return styles.selected;
    }
    return {};
  };

  return (
    <Card
      style={[styles.container, getCardStyle()]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{option}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.padding.large,
    marginBottom: Sizes.margin.medium,
  },
  text: {
    fontSize: Sizes.fontSize.large,
    color: Colors.textDark,
    fontWeight: '600',
    textAlign: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  correct: {
    borderWidth: 3,
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  incorrect: {
    borderWidth: 3,
    borderColor: Colors.error,
    backgroundColor: '#FEF2F2',
  },
});

export default OptionCard;