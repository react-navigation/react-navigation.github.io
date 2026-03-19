---
id: navigation-lifecycle
title: Navigation lifecycle
sidebar_label: Navigation lifecycle
---

If you're coming from a web background, you might expect that when navigating from route A to route B, A unmounts and remounts when you return. React Navigation works differently - this is driven by the more complex needs of mobile navigation.

Unlike web browsers, React Navigation doesn't unmount screens when navigating away. When you navigate from `Home` to `Profile`:

- `Profile` mounts
- `Home` stays mounted

When going back from `Profile` to `Home`:

- `Profile` unmounts
- `Home` is not remounted, existing instance is shown

Similar behavior can be observed (in combination) with other navigators as well. Consider a tab navigator with two tabs, where each tab is a stack navigator:

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

const MyTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    HomeStack: createBottomTabScreen({
      screen: HomeStack,
      options: { tabBarLabel: 'Home' },
    }),
    SettingsStack: createBottomTabScreen({
      screen: SettingsStack,
      options: { tabBarLabel: 'Settings' },
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

<div className="device-frame">
<video playsInline autoPlay muted loop>
  <source src="/assets/fundamentals/lifecycle.mp4" />
</video>
</div>

We start on the `HomeScreen` and navigate to `DetailsScreen`. Then we use the tab bar to switch to the `SettingsScreen` and navigate to `ProfileScreen`. After this sequence of operations is done, all 4 of the screens are mounted! If you use the tab bar to switch back to the `HomeStack`, you'll notice you'll be presented with the `DetailsScreen` - the navigation state of the `HomeStack` has been preserved!

## Lifecycle events

Now that we understand how React lifecycle methods work in React Navigation, let's answer an important question: "How do we find out that a user is leaving (blur) it or coming back to it (focus)?"

To detect when a screen gains or loses focus, we can listen to `focus` and `blur` events:

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

See [Navigation events](navigation-events.md) for more details.

For performing side effects, we can use the [`useFocusEffect`](use-focus-effect.md) - it's like `useEffect` but ties to the navigation lifecycle - it runs the effect when the screen comes into focus and cleans it up when the screen goes out of focus:

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

<div className="device-frame">
<video playsInline autoPlay muted loop>
  <source src="/assets/fundamentals/focus-effect.mp4" />
</video>
</div>

To render different things based on whether the screen is focused, we can use the [`useIsFocused`](use-is-focused.md) hook which returns a boolean indicating whether the screen is focused.

To know the focus state inside of an event listener, we can use the [`navigation.isFocused()`](navigation-object.md#isfocused) method. Note that using this method doesn't trigger a re-render like the `useIsFocused` hook does, so it is not suitable for rendering different things based on focus state.

## Inactive screens

Many navigators also have an `inactiveBehavior` option that lets you "pause" or "unmount" screens when they are inactive:

```js static2dynamic
const MyTabs = createBottomTabNavigator({
  screenOptions: {
    // highlight-next-line
    inactiveBehavior: 'pause',
  },
  screens: {
    Home: createBottomTabScreen({
      screen: HomeScreen,
    }),
    Profile: createBottomTabScreen({
      screen: ProfileScreen,
    }),
  },
});
```

Here, "inactive" and "unfocused" have different meanings:

- A screen becomes "unfocused" as soon as you navigate away from it
- A screen becomes "inactive" based on various factors, such as gestures, animations, and other interactions after it becomes unfocused - without guarantees on timing
- [Preloaded](navigation-actions.md#preload) screens don't become inactive until after the first time they become focused, so their effects can run to initialize the screen
- Focus and blur are part of navigation lifecycle, but "inactive" is an optimization mechanism

### Paused screens

Paused screens internally use [`<Activity mode="hidden">`](https://react.dev/reference/react/Activity). When a screen is paused, the following things happen:

- Effects are cleaned up (similar to when a component unmounts)
- Content stays rendered and the state is preserved
- Content can still re-render at a lower priority

This means event listeners, subscriptions, timers etc. get cleaned up. This reduces unnecessary re-renders and resource usage for paused screens.

Side effects from events can still run. For example, if you have a audio player that emits progress updates, audio will keep playing and progress updates will keep coming in even when the screen is paused. To avoid this, you need to use [lifecycle events](#lifecycle-events) to pause the audio when the screen becomes unfocused.

:::info

Pausing screens is not a replacement for lifecycle events. Treat it as an optimization mechanism only. If you need guarantees on when things get cleaned up, use lifecycle events such as [`blur`](navigation-events.md#blur) or [`useFocusEffect`](use-focus-effect.md).

:::

React doesn't provide a way to distinguish paused screens from unmounted screens, which presents some caveats:

- APIs such as [`getRootState`](navigation-container.md#getrootstate) won't include state of navigators nested inside paused screens
- When using [state persistence](state-persistence.md), state of navigators nested inside paused screens won't be persisted

If you don't want this behavior, you can set `inactiveBehavior` to `none` to avoid pausing them:

```js static2dynamic
const MyTabs = createBottomTabNavigator({
  screenOptions: {
    // highlight-next-line
    inactiveBehavior: 'none',
  },
  screens: {
    Home: createBottomTabScreen({
      screen: HomeScreen,
    }),
    Profile: createBottomTabScreen({
      screen: ProfileScreen,
    }),
  },
});
```

### Unmounted screens

When `inactiveBehavior` is set to `unmount`, screens will be unmounted when they become inactive. This means their content will be unmounted and their local state will be lost.

This is primarily useful for stack navigators where the list of screens can grow. Unmounting inactive screens can help free up resources.

To unmount inactive screens, you can set `inactiveBehavior` to `unmount`:

```js static2dynamic
const MyStack = createNativeStackNavigator({
  screenOptions: {
    // highlight-next-line
    inactiveBehavior: 'unmount',
  },
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
    }),
    Details: createNativeStackScreen({
      screen: DetailsScreen,
    }),
  },
});
```

Also consider reworking your navigation flow to avoid growing the stack indefinitely if possible - e.g. by using `pop: true` option in [`navigate`](navigation-actions.md#navigate) or using [`replace`](stack-actions.md#replace) when relevant.

:::info

Screens containing nested navigators won't be unmounted even when `inactiveBehavior` is set to `unmount`, and will be paused instead. This avoids losing nested navigation state.

:::

## Summary

- Screens stay mounted when navigating away from them
- The [`useFocusEffect`](use-focus-effect.md) hook is like [`useEffect`](https://react.dev/reference/react/useEffect) but tied to the navigation lifecycle instead of the component lifecycle
- The [`useIsFocused`](use-is-focused.md) hook and [`navigation.isFocused()`](navigation-object.md#isfocused) method can be used to determine if a screen is currently focused
- The [`focus`](navigation-events.md#focus) and [`blur`](navigation-events.md#blur) events can be used to know when a screen gains or loses focus
- The `inactiveBehavior` option can be used to "pause" screens when they are inactive, which cleans up effects but keeps the content rendered and state preserved
