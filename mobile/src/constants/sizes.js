import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  width,
  height,
  
  padding: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32
  },
  
  margin: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32
  },
  
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
    full: 9999
  },
  
  fontSize: {
    tiny: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
    xxlarge: 32,
    xxxlarge: 48
  },
  
  iconSize: {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 48
  }
};