---
id: version-4.x-screen-tracking
title: Screen tracking for analytics
sidebar_label: Screen tracking for analytics
original_id: screen-tracking
---

This example shows how to do screen tracking and send to Google Analytics. The approach can be adapted to any other analytics SDK.

## Listening to State Changes

```js
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

const tracker = new GoogleAnalyticsTracker(GA_TRACKING_ID);

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
      const currentScreen = getActiveRouteName(currentState);
      const prevScreen = getActiveRouteName(prevState);

      if (prevScreen !== currentScreen) {
        // the line below uses the Google Analytics tracker
        // change the tracker here to use other Mobile analytics SDK.
        tracker.trackScreenView(currentScreen);
      }
    }}
  />
);
```
