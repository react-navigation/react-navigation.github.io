---
id: use-navigation-state
title: useNavigationState
sidebar_label: useNavigationState
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`useNavigationState` is a hook which gives access to the [navigation state](navigation-state.md) of the navigator which contains the screen. It's useful in rare cases where you want to render something based on the navigation state.

:::warning

Consider the navigator's state object to be internal and subject to change in a minor release. Avoid using properties from the [navigation state](navigation-state.md) state object except `index` and `routes`, unless you really need it. If there is some functionality you cannot achieve without relying on the structure of the state object, please open an issue.

:::

It takes a selector function as an argument. The selector will receive the full [navigation state](navigation-state.md) and can return a specific value from the state:

```js
const index = useNavigationState((state) => state.index);
```

The selector function helps to reduce unnecessary re-renders, so your screen will re-render only when that's something you care about. If you actually need the whole state object, you can do this explicitly:

```js
const state = useNavigationState((state) => state);
```

:::warning

This hook is useful for advanced cases and it's easy to introduce performance issues if you're not careful. For most of the cases, you don't need the navigator's state.

:::

## How is `useNavigationState` different from `navigation.getState()`?

The `navigation.getState()` function also returns the current [navigation state](navigation-state.md). The main difference is that the `useNavigationState` hook will trigger a re-render when values change, while `navigation.getState()` won't. For example, the following code will be incorrect:

```js
function Profile() {
  const routesLength = navigation.getState().routes.length; // Don't do this

  return <Text>Number of routes: {routesLength}</Text>;
}
```

In this example, even if you push a new screen, this text won't update. If you use the hook, it'll work as expected:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="useNavigation hook" snack version=7
import * as React from 'react';
import Button from '@react-navigation/elements';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// codeblock-focus-start
import { useNavigationState } from '@react-navigation/native';

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
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();
  const isFirstRoute = useIsFirstRouteInParent();
  const previousRouteName = usePreviousRouteName();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>It is {isFirstRoute ? '' : 'not '}first route in navigator</Text>
      <Text>Previous route name: {previousRouteName}</Text>

      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();
  const isFirstRoute = useIsFirstRouteInParent();
  const previousRouteName = usePreviousRouteName();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>It is {isFirstRoute ? '' : 'not '}first route in navigator</Text>
      <Text>Previous route name: {previousRouteName}</Text>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

function SettingsScreen() {
  const navigation = useNavigation();
  const isFirstRoute = useIsFirstRouteInParent();
  const previousRouteName = usePreviousRouteName();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>It is {isFirstRoute ? '' : 'not '}first route in navigator</Text>
      <Text>Previous route name: {previousRouteName}</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

const Stack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
    Settings: SettingsScreen,
  },
});

const Navigation = createStaticNavigation(Stack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="useNavigationState hook" snack version=7
import * as React from 'react';
import Button from '@react-navigation/elements';
import { View, Text } from 'react-native';
import {
  NavigationContainer,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// codeblock-focus-start
import { useNavigationState } from '@react-navigation/native';

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
// codeblock-focus-end

function HomeScreen({ navigation }) {
  const isFirstRoute = useIsFirstRouteInParent();
  const previousRouteName = usePreviousRouteName();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>It is {isFirstRoute ? '' : 'not '}first route in navigator</Text>
      <Text>Previous route name: {previousRouteName}</Text>

      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
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
      <Button onPress={() => navigation.goBack()}>Go back</Button>
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
```

</TabItem>
</Tabs>

So when do you use `navigation.getState()`? It's mostly useful within event listeners where you don't care about what's rendered. In most cases, using the hook should be preferred.

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class Profile extends React.Component {
  render() {
    // Get it from props
    const { routesLength } = this.props;
  }
}

// Wrap and export
export default function (props) {
  const routesLength = useNavigationState((state) => state.routes.length);

  return <Profile {...props} routesLength={routesLength} />;
}
```
