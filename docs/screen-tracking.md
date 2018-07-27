---
id: screen-tracking
title: Screen tracking
sidebar_label: Screen tracking
---

This example shows how to do screen tracking and send to Google Analytics. The approach can be adapted to any other analytics SDK. 

## Listening to State Changes

Most users can use `onNavigationStateChange` to track the screen. If you manually control the top-level navigator (if you have integrated redux), this will not work for you.

```js
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

export default () => (
  <AppNavigator
    onNavigationStateChange={(prevState, currentState) => {
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

## Screen tracking with Redux

When using Redux, we can write a Redux middleware to track the screen. For this purpose,
we will reuse `getActiveRouteName` from the previous section.

```js
import { NavigationActions } from 'react-navigation';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

const tracker = new GoogleAnalyticsTracker(GA_TRACKING_ID);

const screenTracking = ({ getState }) => next => (action) => {
  if (
    action.type !== NavigationActions.NAVIGATE
    && action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }

  const currentScreen = getActiveRouteName(getState().navigation);
  const result = next(action);
  const nextScreen = getActiveRouteName(getState().navigation);
  if (nextScreen !== currentScreen) {
    // the line below uses the Google Analytics tracker
    // change the tracker here to use other Mobile analytics SDK.
    tracker.trackScreenView(nextScreen);
  }
  return result;
};

export default screenTracking;
```

### Create Redux store and apply the above middleware

The `screenTracking` middleware can be applied to the store during its creation. See [Redux Integration](redux-integration.html) for details.

```js
const store = createStore(
  combineReducers({
    navigation: navigationReducer,
    ...
  }),
  applyMiddleware(
    screenTracking,
    ...
    ),
);
```
## Screen tracking for expo based application
```js
import { Analytics, ScreenHit } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXX-Y');

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

export default () => (
  <AppNavigator
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getActiveRouteName(currentState);
      const prevScreen = getActiveRouteName(prevState);

      if (prevScreen !== currentScreen) {
      // the line below uses the Google Analytics
        analytics.hit(new ScreenHit(currentScreen))
                  .then(() => console.log("success"))
                  .catch(e => console.log(e.message));
      }
    }}
  />
);
```
