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

It can be used in two ways.

## Getting the navigation state by screen name

The hook accepts the name of the current screen or any of its parent screens as the first argument to get the navigation state for the navigator containing that screen. The second argument is a selector function that receives the full [navigation state](navigation-state.md) and can return a specific value from the state:

```js name="useNavigationState hook" snack static2dynamic
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// codeblock-focus-start
import { useNavigationState } from '@react-navigation/native';

function CurrentRouteDisplay() {
  // highlight-start
  const focusedRouteName = useNavigationState(
    'Home',
    (state) => state.routes[state.index]
  );
  // highlight-end

  return <Text>Current route: {focusedRouteName}</Text>;
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <CurrentRouteDisplay />
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation('Profile');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <CurrentRouteDisplay />
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

The selector function helps to reduce unnecessary re-renders, so your screen will re-render only when that's something you care about. If you actually need the whole state object, you can do this explicitly:

```js
const state = useNavigationState('Home', (state) => state);
```

## Getting the current navigation state

You can also use `useNavigationState` without a screen name to get the navigation state for the current screen's navigator. In this case, it takes a selector function as the only argument:

```js
const focusedRouteName = useNavigationState(
  (state) => state.routes[state.index].name
);
```

This is often useful for re-usable components that are used across multiple screens.

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

```js name="useNavigation hook" snack static2dynamic
import * as React from 'react';
import { Button } from '@react-navigation/elements';
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
  const navigation = useNavigation('Home');
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
  const navigation = useNavigation('Profile');
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
  const navigation = useNavigation('Settings');
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

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
    Settings: SettingsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

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
