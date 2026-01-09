import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function Demo() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
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
                initialRouteName="Analytics"
                tabBar={() => null}
                screenOptions={{ headerShown: false }}
              >
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
