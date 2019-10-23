---
id: version-3.x-screen-tracking
title: Screen tracking for analytics
sidebar_label: Screen tracking for analytics
original_id: screen-tracking
---

This example shows how to do screen tracking and send to Google Analytics. The approach can be adapted to any other analytics SDK. 

## Listening to State Changes

```js
import { createAppContainer, createStackNavigator } from 'react-navigation';
import analytics from '@react-native-firebase/analytics';

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

const AppNavigator = createStackNavigator(AppRouteConfigs);
const AppContainer = createAppContainer(AppNavigator);

export default () => (
  <AppContainer
    onNavigationStateChange={(prevState, currentState, action) => {
      const currentRouteName = getActiveRouteName(currentState);
      const previousRouteName = getActiveRouteName(prevState);

      if (previousRouteName !== currentRouteName) {
        // The line below uses the @react-native-firebase/analytics tracker
        // change the tracker here to use other Mobile analytics SDK.
        analytics().setCurrentScreen(currentRouteName, currentRouteName);
      }
    }}
  />
);
```
