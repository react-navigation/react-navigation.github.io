import * as React from 'react';
import { View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function A() {
  return <View />;
}

function B() {
  return <View />;
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="A" component={A} />
    </HomeStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="B" component={B} />
    </SettingsStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationNativeContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{ tabBarLabel: 'Home!' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStackScreen}
          options={{ tabBarLabel: 'Settings!' }}
        />
      </Tab.Navigator>
    </NavigationNativeContainer>
  );
}
