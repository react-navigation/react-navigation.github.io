import * as React from 'react';
import { View } from 'react-native';
import {
  NavigationNativeContainer,
  useFocusEffect,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ProfileScreen() {
  useFocusEffect(
    React.useCallback(() => {
      alert('Screen was focused');
      // Do something when the screen is focused
      return () => {
        alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return <View />;
}

function HomeScreen() {
  return <View />;
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationNativeContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationNativeContainer>
  );
}
