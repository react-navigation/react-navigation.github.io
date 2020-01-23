import * as React from 'react';
import { View, Button, Text } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

enableScreens();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        title="Push Profile on the stack"
        onPress={() => navigation.push('Profile', { user: 'Wojtek' })}
      />
    </View>
  );
}

function ProfileScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        title="Push same screen on the stack"
        onPress={() => navigation.push('Profile', { user: 'Wojtek' })}
      />
      <Button
        title="Pop one screen from stack"
        onPress={() => navigation.pop()}
      />
      <Button title="Pop to top" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationNativeContainer>
      <MyStack />
    </NavigationNativeContainer>
  );
}
