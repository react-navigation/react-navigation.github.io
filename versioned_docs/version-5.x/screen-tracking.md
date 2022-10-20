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

This example shows how the approach can be adapted to any mobile analytics SDK.

```js
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
        const tracker = {
          trackScreenView: () => {
            // Your implementation of analytics goes here!
          };
        }

        if (previousRouteName !== currentRouteName) {
          // Replace the line below to add the tracker from a mobile analytics SDK
          await tracker.trackScreenView(currentRouteName);
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
