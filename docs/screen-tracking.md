---
id: screen-tracking
title: Screen tracking
sidebar_label: Screen tracking
---

This example shows how to do screen tracking and send to Google Analytics. The approach can be adapted to any other analytics SDK. 

## Listening to State Changes

Most users can use `onNavigationStateChange` to track the screen. If you manually control the top-level navigator (if you have integrated redux), this will not work for you.

For react-native, you may run into navigation performance issues on Android if the
tracking library is calling into native modules. This is caused by contention on
the native modules thread between the navigation animation and the calls into the
native tracking module. As a workaround for this, you can delay the invocation of
the tracking until after the navigation animation is complete by wrapping the
call to tracking in a `setTimeout`.

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

    // If navigation is considerably slower after adding screen tracking,
    // change the above line to something like:
    // setTimeout(() => tracker.trackScreenView(nextScreen), 1000);
    // This will delay the tracking invocation until after the animation is complete
    // and remove possible contention in the native modules thread
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
