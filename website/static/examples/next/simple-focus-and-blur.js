import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function ProfileScreen({ navigation }) {
  React.useEffect(
    () => navigation.addListener('focus', () => alert('Screen was focused')),
    []
  );

  React.useEffect(
    () => navigation.addListener('blur', () => alert('Screen was unfocused')),
    []
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
}

const SettingsStack = createStackNavigator();

export default function App() {
  return (
    <NavigationNativeContainer>
      <SettingsStack.Navigator>
        <SettingsStack.Screen name="Settings" component={SettingsScreen} />
        <SettingsStack.Screen name="Profile" component={ProfileScreen} />
      </SettingsStack.Navigator>
    </NavigationNativeContainer>
  );
}
