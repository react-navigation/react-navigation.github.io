import * as React from 'react';
import { View, Button, AsyncStorage } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function A() {
  return <View />;
}

function B({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go to C" onPress={() => navigation.navigate('C')} />
    </View>
  );
}

function C({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go to D" onPress={() => navigation.navigate('D')} />
    </View>
  );
}

function D() {
  return <View />;
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="A" component={A} />
    </HomeStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="B" component={B} />
      <SettingsStack.Screen name="C" component={C} />
      <SettingsStack.Screen name="D" component={D} />
    </SettingsStack.Navigator>
  );
}

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString);

        setInitialState(state);
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationNativeContainer
      initialState={initialState}
      onStateChange={state =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{ tabBarLabel: 'Home!' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStackScreen}
          options={{ tabBarLabel: 'Settings!' }}
        />
      </Tab.Navigator>
    </NavigationNativeContainer>
  );
}
