---
id: navigation-lifecycle
title: Navigation lifecycle
sidebar_label: Navigation lifecycle
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In a previous section, we worked with a stack navigator that has two screens (`Home` and `Profile`) and learned how to use `navigation.navigate('RouteName')` to navigate between the screens.

An important question in this context is: what happens with `Home` when we navigate away from it, or when we come back to it? How does a screen find out that a user is leaving it or coming back to it?

If you are coming to react-navigation from a web background, you may assume that when the user navigates from route `A` to route `B`, `A` will unmount (its `componentWillUnmount` is called) and `A` will mount again when the user comes back to it. While these React lifecycle methods are still valid and are used in React Navigation, their usage differs from the web. This is driven by the more complex needs of mobile navigation.

## Example scenario

Consider a stack navigator with 2 screens: `Home` and `Profile`. When we first render the navigator, the `Home` screen is mounted, i.e. its `useEffect` or `componentDidMount` is called. When we navigate to `Profile`, now `Profile` is mounted and its `useEffect` or `componentDidMount` is called. But nothing happens to `Home` - it remains mounted in the stack. The cleanup function returned by `useEffect` or `componentWillUnmount` is not called.

When we go back from `Profile` to `Home`, `Profile` is unmounted and its `useEffect` cleanup or `componentWillUnmount` is called. But `Home` is not mounted again - it remained mounted the whole time - and its `useEffect` or `componentDidMount` is not called.

Similar results can be observed (in combination) with other navigators as well. Consider a tab navigator with two tabs, where each tab is a stack navigator:

```js name="Navigation lifecycle" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function SettingsScreen() {
  const navigation = useNavigation('Settings');

  React.useEffect(() => {
    console.log('SettingsScreen mounted');

    return () => console.log('SettingsScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation('Profile');

  React.useEffect(() => {
    console.log('ProfileScreen mounted');

    return () => console.log('ProfileScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation('Home');

  React.useEffect(() => {
    console.log('HomeScreen mounted');

    return () => console.log('HomeScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation('Details');

  React.useEffect(() => {
    console.log('DetailsScreen mounted');

    return () => console.log('DetailsScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button onPress={() => navigation.push('Details')}>
        Go to Details... again
      </Button>
    </View>
  );
}

// codeblock-focus-start
const SettingsStack = createNativeStackNavigator({
  screens: {
    Settings: createNativeStackScreen({
      screen: SettingsScreen,
    }),
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
    }),
  },
});

const HomeStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
    }),
    Details: createNativeStackScreen({
      screen: DetailsScreen,
    }),
  },
});

const MyTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    First: createBottomTabScreen({
      screen: SettingsStack,
    }),
    Second: createBottomTabScreen({
      screen: HomeStack,
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/lifecycle.mp4" />
</video>

We start on the `HomeScreen` and navigate to `DetailsScreen`. Then we use the tab bar to switch to the `SettingsScreen` and navigate to `ProfileScreen`. After this sequence of operations is done, all 4 of the screens are mounted! If you use the tab bar to switch back to the `HomeStack`, you'll notice you'll be presented with the `DetailsScreen` - the navigation state of the `HomeStack` has been preserved!

## React Navigation lifecycle events

Now that we understand how React lifecycle methods work in React Navigation, let's answer the question we asked at the beginning: "How do we find out that a user is leaving (blur) it or coming back to it (focus)?"

React Navigation emits events to screen components that subscribe to them. We can listen to `focus` and `blur` events to know when a screen comes into focus or goes out of focus respectively.

Example:

```js name="Focus and blur" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

// codeblock-focus-start
function ProfileScreen() {
  const navigation = useNavigation('Profile');

  React.useEffect(() => {
    // highlight-start
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('ProfileScreen focused');
    });
    // highlight-end

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    // highlight-start
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('ProfileScreen blurred');
    });
    // highlight-end

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation('Home');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('HomeScreen focused');
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('HomeScreen blurred');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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

See [Navigation events](navigation-events.md) for more details on the available events and the API usage.

For performing side effects, we can use the [`useFocusEffect`](use-focus-effect.md) hook instead of subscribing to events. It's like React's `useEffect` hook, but it ties into the navigation lifecycle.

Example:

```js name="Focus effect" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { useFocusEffect } from '@react-navigation/native';

function ProfileScreen() {
  // highlight-start
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log('ProfileScreen focus effect');

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        console.log('ProfileScreen focus effect cleanup');
      };
    }, [])
  );
  // highlight-end

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/lifecycle-focus.mp4" />
</video>

If you want to render different things based on if the screen is focused or not, you can use the [`useIsFocused`](use-is-focused.md) hook which returns a boolean indicating whether the screen is focused.

If you want to know if the screen is focused or not inside of an event listener, you can use the [`navigation.isFocused()`](navigation-object.md#isfocused) method. Note that using this method doesn't trigger a re-render like the `useIsFocused` hook does, so it is not suitable for rendering different things based on focus state.

## Summary

- React Navigation does not unmount screens when navigating away from them
- The [`useFocusEffect`](use-focus-effect.md) hook is analogous to React's [`useEffect`](https://react.dev/reference/react/useEffect) but is tied to the navigation lifecycle instead of the component lifecycle.
- The [`useIsFocused`](use-is-focused.md) hook and [`navigation.isFocused()`](navigation-object.md#isfocused) method can be used to determine if a screen is currently focused.
- React Navigation emits [`focus`](navigation-events.md#focus) and [`blur`](navigation-events.md#blur) events that can be listened to when a screen comes into focus or goes out of focus.
