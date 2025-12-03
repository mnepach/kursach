import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';

const Card = ({ 
  children, 
  style, 
  onPress, 
  selected = false,
  disabled = false 
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[
        styles.card,
        selected && styles.selected,
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.large,
    padding: Sizes.padding.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Card;