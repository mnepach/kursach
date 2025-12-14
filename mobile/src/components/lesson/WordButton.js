import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';

const WordButton = ({ 
  word, 
  onPress, 
  disabled,
  variant = 'primary'
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'selected':
        return styles.selected;
      case 'available':
        return styles.available;
      default:
        return styles.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text,
        variant === 'available' && styles.availableText
      ]}>
        {word}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Sizes.padding.small,
    paddingHorizontal: Sizes.padding.medium,
    borderRadius: Sizes.borderRadius.medium,
    marginRight: Sizes.margin.small,
    marginBottom: Sizes.margin.small,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  available: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  text: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: '600',
    color: Colors.white,
  },
  availableText: {
    color: Colors.textDark,
  },
});

export default WordButton;