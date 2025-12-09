import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LanguageSelectionScreen from '../screens/onboarding/LanguageSelectionScreen';
import WelcomeCharacterScreen from '../screens/onboarding/WelcomeCharacterScreen';
import HowDidYouHearScreen from '../screens/onboarding/HowDidYouHearScreen';
import LearningGoalScreen from '../screens/onboarding/LearningGoalScreen';
import LanguageLevelScreen from '../screens/onboarding/LanguageLevelScreen';
import DailyGoalScreen from '../screens/onboarding/DailyGoalScreen';
import LearningMethodScreen from '../screens/onboarding/LearningMethodScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F8FAFC' }
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="WelcomeCharacter" component={WelcomeCharacterScreen} />
      <Stack.Screen name="HowDidYouHear" component={HowDidYouHearScreen} />
      <Stack.Screen name="LearningGoal" component={LearningGoalScreen} />
      <Stack.Screen name="LanguageLevel" component={LanguageLevelScreen} />
      <Stack.Screen name="DailyGoal" component={DailyGoalScreen} />
      <Stack.Screen name="LearningMethod" component={LearningMethodScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;