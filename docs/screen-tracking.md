---
id: screen-tracking
title: Screen tracking for analytics
sidebar_label: Screen tracking for analytics
---

To track the currently active screen, we need to:

1. Add a callback to get notified of state changes
2. Get the root navigator state and find the active route name

To get notified of state changes, we can use the `onStateChange` prop on `NavigationNativeContainer`. To get the root navigator state, we can use the `getRootState` method on the container's ref.

## Example

This example shows how to do screen tracking and send to Google Analytics. The approach can be adapted to any other analytics SDK.

```js
import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import { NavigationNativeContainer } from '@react-navigation/native';

// Gets the current screen from navigation state
const getActiveRouteName = state => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

export default function App() {
  const navigationRef = React.useRef();
  const routeNameRef = React.useRef();

  return (
    <NavigationNativeContainer
      ref={navigationRef}
      onStateChange={() => {
        const navigation = navigationRef.current;

        if (navigation) {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = getActiveRouteName(
            // Get the root navigator state to find the active route
            navigation.getRootState()
          );

          if (previousRouteName !== currentRouteName) {
            // The line below uses the @react-native-firebase/analytics tracker
            // Change this line to use another Mobile analytics SDK
            analytics().setCurrentScreen(currentRouteName, currentRouteName);
          }

          // Save the current route name for later comparision
          routeNameRef.current = currentRouteName;
        }
      }}
    >
      {/* ... */}
    </NavigationNativeContainer>
  );
}
```
