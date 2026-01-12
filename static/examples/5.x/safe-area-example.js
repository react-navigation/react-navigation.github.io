import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function Demo() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" headerMode="none">
          <Stack.Screen name="Home">
            {() => (
              <Tab.Navigator initialRouteName="Analytics" tabBar={() => null}>
                <Tab.Screen name="Analytics" component={Demo} />
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
