# Screen tracking for analytics

Version: 3.x

Sitemap: [llms-3.x.txt](https://reactnavigation.org/llms-3.x.txt)

This example shows how to do screen tracking and send to Google Analytics. The approach can be adapted to any other analytics SDK.

## Listening to State Changes

```js

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
