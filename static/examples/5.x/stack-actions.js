import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Button, Text, View } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        title="Push Profile on the stack"
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      />
      <Button
        title="Replace with Profile"
        onPress={() =>
          navigation.dispatch(
            StackActions.replace('Profile', { user: 'Wojtek' })
          )
        }
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
        title="Pop one screen from stack"
        onPress={() => navigation.dispatch(StackActions.pop(1))}
      />
      <Button
        title="Push same screen on the stack"
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
