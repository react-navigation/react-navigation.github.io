import * as React from 'react';
import { View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ProfileScreen({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      alert('Screen is focused');
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

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
