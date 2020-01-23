import * as React from 'react';
import { View, Text } from 'react-native';
import {
  NavigationNativeContainer,
  useIsFocused,
} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

function ProfileScreen() {
  // This hook returns `true` if the screen is focused, `false` otherwise
  const isFocused = useIsFocused();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{isFocused ? 'focused' : 'unfocused'}</Text>
    </View>
  );
}

function HomeScreen() {
  return <View />;
}

const Tab = createMaterialTopTabNavigator();

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
