import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function Start({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Start Screen</Text>
      <Button
        onPress={() => navigation.navigate('Root', { screen: 'Settings' })}
        title="Go to Root, Settings"
      />
    </View>
  );
}

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={() => navigation.navigate('Start')}
        title="Go to Start"
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Root() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" />
      <Tab.Screen name="Settings" />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Feed" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
