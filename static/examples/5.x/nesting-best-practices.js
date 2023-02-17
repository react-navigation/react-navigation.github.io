import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={() => navigation.navigate('Help')}
        title="Go to Help"
      />
      <Button
        onPress={() => navigation.navigate('Profile')}
        title="Go to Profile"
      />
    </View>
  );
}

function Help({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Help Screen</Text>
      <Button onPress={() => navigation.navigate('Home')} title="Go to Home" />
      <Button onPress={() => navigation.navigate('Invite')} title="Invite" />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  const isLoggedIn = true;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          // Screens for logged in users
          <Stack.Group>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" />
          </Stack.Group>
        ) : (
          // Auth screens
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" />
            <Stack.Screen name="SignUp" />
          </Stack.Group>
        )}
        {/* Common modal screens */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="Invite" />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
