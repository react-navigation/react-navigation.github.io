import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  NavigationContainer,
  useRoute,
  useNavigationState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function useIsFirstRouteInParent() {
  const route = useRoute();
  const isFirstRouteInParent = useNavigationState(
    (state) => state.routes[0].key === route.key
  );

  return isFirstRouteInParent;
}

function usePreviousRouteName() {
  return useNavigationState((state) =>
    state.routes[state.index - 1]?.name
      ? state.routes[state.index - 1].name
      : 'None'
  );
}

function HomeScreen({ navigation }) {
  const isFirstRoute = useIsFirstRouteInParent();
  const previousRouteName = usePreviousRouteName();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>It is {isFirstRoute ? '' : 'not '}first route in navigator</Text>
      <Text>Previous route name: {previousRouteName}</Text>

      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function ProfileScreen({ navigation }) {
  const isFirstRoute = useIsFirstRouteInParent();
  const previousRouteName = usePreviousRouteName();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>It is {isFirstRoute ? '' : 'not '}first route in navigator</Text>
      <Text>Previous route name: {previousRouteName}</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  const isFirstRoute = useIsFirstRouteInParent();
  const previousRouteName = usePreviousRouteName();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>It is {isFirstRoute ? '' : 'not '}first route in navigator</Text>
      <Text>Previous route name: {previousRouteName}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
