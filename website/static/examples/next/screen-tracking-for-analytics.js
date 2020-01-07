import * as React from 'react';
import { View, Button } from 'react-native';
// import analytics from '@react-native-firebase/analytics';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Gets the current screen from navigation state
const getActiveRouteName = state => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
}

function Settings({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

export default function App() {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  const Stack = createStackNavigator();

  return (
    <NavigationNativeContainer
      ref={navigationRef}
      onStateChange={state => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = getActiveRouteName(state);

        if (previousRouteName !== currentRouteName) {
          // The line below uses the @react-native-firebase/analytics tracker
          // Change this line to use another Mobile analytics SDK
          // analytics().setCurrentScreen(currentRouteName, currentRouteName);
          alert(`The route changed to ${currentRouteName}`);
        }

        // Save the current route name for later comparision
        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}
