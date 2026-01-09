---
id: state-persistence
title: State persistence
sidebar_label: State persistence
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

You might want to save the user's location in the app, so that they are immediately returned to the same location after the app is restarted.

This is especially valuable during development because it allows the developer to stay on the same screen when they refresh the app.

## Usage

To be able to persist the [navigation state](navigation-state.md), we can use the `persistor` prop of the container. The `persistor` prop accepts an object with two functions:

- `persist` - Function that receives the navigation state as an argument and should save it to storage.
- `restore` - Function that returns the previously saved state from storage, or `undefined` if there's no saved state.

These function can be both synchronous or asynchronous. If a promise is returned from the `restore` function, make sure to provide a [`fallback`](navigation-container.md#fallback).

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Persisting the navigation state" snack dependencies=@react-native-async-storage/async-storage
import * as React from 'react';
// codeblock-focus-start
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
// codeblock-focus-end
import { Button } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function A() {
  return <View />;
}

function B() {
  const navigation = useNavigation('B');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('C')}>Go to C</Button>
    </View>
  );
}

function C() {
  const navigation = useNavigation('C');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('D')}>Go to D</Button>
    </View>
  );
}

function D() {
  return <View />;
}

const HomeStackScreen = createNativeStackNavigator({
  screens: {
    A: A,
  },
});

const SettingsStackScreen = createNativeStackNavigator({
  screens: {
    B: B,
    C: C,
    D: D,
  },
});

const Tab = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeStackScreen,
      options: {
        headerShown: false,
        tabBarLabel: 'Home!',
      },
    },
    Settings: {
      screen: SettingsStackScreen,
      options: {
        headerShown: false,
        tabBarLabel: 'Settings!',
      },
    },
  },
});

const Navigation = createStaticNavigation(Tab);

// codeblock-focus-start

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export default function App() {
  return (
    <Navigation
      fallback={<Text>Loading...</Text>}
      persistor={{
        async persist(state) {
          await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
        },
        async restore() {
          const state = await AsyncStorage.getItem(PERSISTENCE_KEY);

          return state ? JSON.parse(state) : undefined;
        },
      }}
    />
  );
}
// codeblock-focus-end
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Persisting the navigation state" snack dependencies=@react-native-async-storage/async-storage
import * as React from 'react';
// codeblock-focus-start
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
// codeblock-focus-end
import { Button } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function A() {
  return <View />;
}

function B() {
  const navigation = useNavigation('B');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('C')}>Go to C</Button>
    </View>
  );
}

function C() {
  const navigation = useNavigation('C');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('D')}>Go to D</Button>
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

function RootTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
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
  );
}

// codeblock-focus-start

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export default function App() {
  return (
    <NavigationContainer
      fallback={<Text>Loading...</Text>}
      persistor={{
        async persist(state) {
          await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
        },
        async restore() {
          const state = await AsyncStorage.getItem(PERSISTENCE_KEY);

          return state ? JSON.parse(state) : undefined;
        },
      }}
    >
      <RootTabs />
    </NavigationContainer>
  );
}
// codeblock-focus-end
```

</TabItem>
</Tabs>

This feature is particularly useful in development mode. You can enable it selectively by providing the `persistor` prop only if `__DEV__` is `true`.

While it can be used for production as well, use it with caution as it can make the app unusable if the app is crashing on a particular screen - as the user will still be on the same screen after restarting. So if you are using it in production, make sure to clear the persisted state if an error occurs.

:::warning

It is recommended to use an [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) in your app and clear the persisted state if an error occurs. This will ensure that the app doesn't get stuck in an error state if a screen crashes.

:::

Alternatively, you can manually implement it using the `initialState` and `onStateChange` props. Make sure to not provide an `initialState` if there is a deep link to handle, otherwise the deep link will be ignored.

## Warning: Serializable State

Each param, route, and navigation state must be fully serializable for this feature to work. Typically, you would serialize the state as a JSON string. This means that your routes and params must contain no functions, class instances, or recursive data structures. React Navigation already [warns you during development](troubleshooting.md#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state) if it encounters non-serializable data, so watch out for the warning if you plan to persist navigation state.

You can modify the initial state object before passing it to container, but note that if your `initialState` isn't a [valid navigation state](navigation-state.md#stale-state-objects), React Navigation may not be able to handle the situation gracefully in some scenarios.
