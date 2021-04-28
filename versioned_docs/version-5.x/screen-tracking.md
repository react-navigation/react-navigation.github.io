---
id: screen-tracking
title: Screen tracking for analytics
sidebar_label: Screen tracking for analytics
---

To track the currently active screen, we need to:

1. Add a callback to get notified of state changes
2. Get the root navigator state and find the active route name

To get notified of state changes, we can use the `onStateChange` prop on `NavigationContainer`. To get the root navigator state, we can use the `getRootState` method on the container's ref. Please note that `onStateChange` is not called on initial render so you have to set your initial screen separately.

## Example

This example shows how to do screen tracking and send to Firebase Analytics using [expo-firebase-analytics](https://docs.expo.io/versions/latest/sdk/firebase-analytics/). The approach can be adapted to any other analytics SDK.

 <samp id="screen-tracking-for-analytics" />

```js
import * as Analytics from 'expo-firebase-analytics';
import { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';

export default () => {
  const navigationRef = useRef();
  const routeNameRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          // The line below uses the expo-firebase-analytics tracker
          // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
          // Change this line to use another Mobile analytics SDK
          Analytics.setCurrentScreen(currentRouteName);
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}
    >
      {/* ... */}
    </NavigationContainer>
  );
};

```
