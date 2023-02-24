import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, useSafeArea } from 'react-native-safe-area-context';

function Demo() {
  const insets = useSafeArea();
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,

        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
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
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home">
            {() => (
              <Tab.Navigator
                initialRouteName="Analitics"
                tabBar={() => null}
                screenOptions={{ headerShown: false }}
              >
                <Tab.Screen name="Analitics" component={Demo} />
                <Tab.Screen name="Profile" component={Demo} />
              </Tab.Navigator>
            )}
          </Stack.Screen>

          <Stack.Screen name="Settings" component={Demo} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
