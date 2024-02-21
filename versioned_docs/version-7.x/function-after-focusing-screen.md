---
id: function-after-focusing-screen
title: Call a function when focused screen changes
sidebar_label: Call a function when focused screen changes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In this guide we will call a function or render something on screen focusing. This is useful for making additional API calls when a user revisits a particular screen in a Tab Navigator, or to track user events as they tap around our app.

There are multiple approaches available to us:

1. Listening to the `'focus'` event with an event listener.
2. Using the `useFocusEffect` hook provided by react-navigation.
3. Using the `useIsFocused` hook provided by react-navigation.

## Triggering an action with a `'focus'` event listener

We can also listen to the `'focus'` event with an event listener. After setting up an event listener, we must also stop listening to the event when the screen is unmounted.

With this approach, we will only be able to call an action when the screen focuses. This is useful for performing an action such as logging the screen view for analytics.

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Focus event listener" snack version=7
// codeblock-focus-start
import * as React from 'react';
import { View } from 'react-native';

// codeblock-focus-end
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// codeblock-focus-start
function ProfileScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      alert('Screen is focused');
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return <View />;
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Focus event listener" snack version=7
// codeblock-focus-start
import * as React from 'react';
import { View } from 'react-native';

// codeblock-focus-end
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// codeblock-focus-start
function ProfileScreen({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      alert('Screen is focused');
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return <View />;
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

See the [navigation events guide](navigation-events.md) for more details on the event listener API.

In most cases, it's recommended to use the `useFocusEffect` hook instead of adding the listener manually. See below for details.

## Triggering an action with the `useFocusEffect` hook

React Navigation provides a [hook](https://reactjs.org/docs/hooks-intro.html) that runs an effect when the screen comes into focus and cleans it up when it goes out of focus. This is useful for cases such as adding event listeners, for fetching data with an API call when a screen becomes focused, or any other action that needs to happen once the screen comes into view.

This is particularly handy when we are trying to stop something when the page is unfocused, like stopping a video or audio file from playing, or stopping the tracking of a user's location.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="useFocusEffect hook" snack version=7
import * as React from 'react';
import { View } from 'react-native';
import {
  useFocusEffect,
  createStaticNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// codeblock-focus-start
function ProfileScreen() {
  useFocusEffect(
    React.useCallback(() => {
      alert('Screen was focused');
      // Do something when the screen is focused
      return () => {
        alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return <View />;
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="useFocusEffect hook" snack version=7
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// codeblock-focus-start
function ProfileScreen() {
  useFocusEffect(
    React.useCallback(() => {
      alert('Screen was focused');
      // Do something when the screen is focused
      return () => {
        alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return <View />;
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

See the [`useFocusEffect`](https://reactnavigation.org/docs/use-focus-effect/) documentation for more details.

## Re-rendering screen with the `useIsFocused` hook

React Navigation provides a [hook](https://reactjs.org/docs/hooks-intro.html) that returns a boolean indicating whether the screen is focused or not.

The hook will return `true` when the screen is focused and `false` when our component is no longer focused. This enables us to render something conditionally based on whether the user is on the screen or not.

The `useIsFocused` hook will cause our component to re-render when we focus and unfocus a screen. Using this hook component may introduce unnecessary component re-renders as a screen comes in and out of focus. This could cause issues depending on the type of action we're calling on focusing. Hence we recommend to use this hook only if you need to trigger a re-render. For side-effects such as subscribing to events or fetching data, use the methods described above.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="useIsFocused hook" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { useIsFocused, createStaticNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// codeblock-focus-start
function ProfileScreen() {
  // codeblock-focus-end
  // This hook returns `true` if the screen is focused, `false` otherwise
  // codeblock-focus-start
  const isFocused = useIsFocused();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{isFocused ? 'focused' : 'unfocused'}</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const MyTabs = createMaterialTopTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value='dynamic' label='Dynamic' default>

```js name="useIsFocused hook" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// codeblock-focus-start
function ProfileScreen() {
  // codeblock-focus-end
  // This hook returns `true` if the screen is focused, `false` otherwise
  // codeblock-focus-start
  const isFocused = useIsFocused();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{isFocused ? 'focused' : 'unfocused'}</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

This example is also documented in the [`useIsFocused` API documentation](use-is-focused.md).
