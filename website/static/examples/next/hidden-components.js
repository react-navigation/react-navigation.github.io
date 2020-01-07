import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

function Demo() {
  return (
    <View
      style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator initialRouteName="Home" headerMode="none">
        <Stack.Screen name="Home">
          {() => (
            <Tab.Navigator
              initialRouteName="Analitics"
              tabBar={() => null}
            >
              <Tab.Screen name="Analitics" component={Demo} />
              <Tab.Screen name="Profile" component={Demo} />
            </Tab.Navigator>
          )}
        </Stack.Screen>

        <Stack.Screen name="Settings" component={Demo} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}
