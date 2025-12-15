import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/home/HomeScreen';
import LessonListScreen from '../screens/lessons/LessonListScreen';
import ProgressScreen from '../screens/profile/ProgressScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Colors from '../constants/colors';

const Tab = createBottomTabNavigator();

const IOS = Platform.OS === 'ios';

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Lessons: focused ? 'book' : 'book-outline',
            Progress: focused ? 'stats-chart' : 'stats-chart-outline',
            Profile: focused ? 'person' : 'person-outline',
          };

          return (
            <Ionicons
              name={icons[route.name]}
              size={22}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,

        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,

          minHeight: IOS ? 56 : 52,
          paddingTop: 6,
          paddingBottom: IOS ? 24 : 4,
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Главная' }}
      />
      <Tab.Screen
        name="Lessons"
        component={LessonListScreen}
        options={{ tabBarLabel: 'Уроки' }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: 'Прогресс' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Профиль' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
