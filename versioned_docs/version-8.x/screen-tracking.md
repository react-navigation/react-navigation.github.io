---
id: screen-tracking
title: Screen tracking for analytics
sidebar_label: Screen tracking
---

To track the currently active screen, we need to:

1. Add a callback to get notified of state changes
2. Get the root navigator state and find the active route name

To get notified of state changes, we can use the `onStateChange` prop on `NavigationContainer`. To get the root navigator state, we can use the `getRootState` method on the container's ref. Please note that `onStateChange` is not called on initial render so you have to set your initial screen separately.

## Example

This example shows how the approach can be adapted to any mobile analytics SDK.

```js name="Screen tracking for analytics" snack static2dynamic
import * as React from 'react';
import { View } from 'react-native';
// codeblock-focus-start
import {
  createStaticNavigation,
  useNavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
// codeblock-focus-end
import { Button } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function Home() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function Settings() {
  const navigation = useNavigation('Settings');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: Home,
    Settings: Settings,
  },
});

const Navigation = createStaticNavigation(RootStack);

// codeblock-focus-start

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();

  return (
    <Navigation
      ref={navigationRef}
      onReady={async () => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;

        // Replace the line below to add the tracker from a mobile analytics SDK
        await trackScreenView(routeNameRef.current);
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          // Replace the line below to add the tracker from a mobile analytics SDK
          await trackScreenView(currentRouteName);
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}
    />
  );
}
// codeblock-focus-end
```

:::note

If you are building a library that wants to provide screen tracking integration with React Navigation, you can accept a [`ref`](navigation-container.md#ref) to the navigation container and use the [`ready`](navigation-container.md#ready) and [`state`](navigation-container.md#state) events instead of `onReady` and `onStateChange` props to keep your logic self-contained.

:::
