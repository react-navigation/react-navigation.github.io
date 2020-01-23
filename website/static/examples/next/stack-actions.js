import * as React from 'react';
import { View, Button, Text } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/routers';

function HomeScreen({ navigation }) {
  const pushAction = StackActions.push('Profile', { user: 'Wojtek' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        title="Push Profile on the stack"
        onPress={() => navigation.dispatch(pushAction)}
      />
    </View>
  );
}

function ProfileScreen({ navigation, route }) {
  const popAction = StackActions.pop(1);
  const pushAction = StackActions.push('Profile', { user: 'Wojtek' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        title="Push same screen on the stack"
        onPress={() => navigation.dispatch(pushAction)}
      />
      <Button
        title="Pop one screen from stack"
        onPress={() => navigation.dispatch(popAction)}
      />
      <Button
        title="Pop to top"
        onPress={() => navigation.dispatch(StackActions.popToTop())}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}
