import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox, StyleSheet } from 'react-native';

LogBox.ignoreLogs(['Unable to convert string to floating point value']);

const originalCreate = StyleSheet.create;
StyleSheet.create = function(styles) {
  const fixed = {};
  
  // Карта соответствия строковых значений числовым
  const sizeMap = {
    'small': 12,
    'medium': 16,
    'large': 24,
    'xlarge': 32,
    'xxlarge': 40,
    'xxxlarge': 48
  };
  
  for (const [key, style] of Object.entries(styles)) {
    if (typeof style === 'object' && style !== null) {
      fixed[key] = {};
      for (const [prop, value] of Object.entries(style)) {
        // Если значение - строка из sizeMap, заменяем на число
        if (typeof value === 'string' && sizeMap[value]) {
          fixed[key][prop] = sizeMap[value];
        } else {
          fixed[key][prop] = value;
        }
      }
    } else {
      fixed[key] = style;
    }
  }
  
  return originalCreate(fixed);
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}