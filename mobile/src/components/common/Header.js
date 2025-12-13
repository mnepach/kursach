import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';

const Header = ({ 
  title, 
  onBack, 
  rightComponent, 
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {rightComponent && (
        <View style={styles.rightComponent}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizes.padding.medium,
    paddingVertical: Sizes.padding.medium,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 56,
  },
  backButton: {
    position: 'absolute',
    left: Sizes.padding.medium,
    padding: Sizes.padding.small,
  },
  title: {
    fontSize: Sizes.fontSize.large,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  rightComponent: {
    position: 'absolute',
    right: Sizes.padding.medium,
  },
});

export default Header;