---
id: state-persistence
title: State persistence
sidebar_label: State persistence
---

#TODO

You may want to save the user's location in the app, so that they are immediately returned to the same location after the app is restarted.

This is especially valuable during development because it allows the developer to stay on the same screen when they refresh the app.

> Note: This feature is currently considered experimental, because of the warnings listed at the end of this page. Use with caution!

## Usage

You can enable persistence for your top-level navigator by rendering it with `persistNavigationState` and `loadNavigationState` props:

- `persistNavigationState` is an async function that receives single argument - the navigation state object. The function should persist it.
- `loadNavigationState` is an async function that does the inverse - it should load the persisted navigation state and return a Promise that resolves with the navigation state object. If the function rejects, React Navigation will start as if no state was provided.

```js
const AppNavigator = createStackNavigator({...});
const persistenceKey = "persistenceKey"
const persistNavigationState = async (navState) => {
  try {
    await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState))
  } catch(err) {
    // handle the error according to your needs
  }
}
const loadNavigationState = async () => {
  const jsonString = await AsyncStorage.getItem(persistenceKey)
  return JSON.parse(jsonString)
}

const App = () => <AppNavigator persistNavigationState={persistNavigationState} loadNavigationState={loadNavigationState} />;
```

### Development Mode

This feature is particularly useful in development mode. You can enable it selectively using the following approach:

```js
const AppNavigator = createStackNavigator({...});
function getPersistenceFunctions() {
  return __DEV__ ? {
    persistNavigationState: ...,
    loadNavigationState: ...,
  } : undefined;
}
const App = () => <AppNavigator {...getPersistenceFunctions()} />;
```

### Loading View

Because the state is loaded asynchronously, the app must render an empty/loading view for a moment before the `loadNavigationState` function returns. To customize the loading view that is rendered during this time, you can use the `renderLoadingExperimental` prop:

```js
<AppNavigator
  persistNavigationState={...}
  loadNavigationState={...}
  renderLoadingExperimental={() => <ActivityIndicator />}
/>
```

> Note: This API may change in the future, which is why it is labeled experimental

## Warning: Serializable State

Each param, route, and navigation state must be fully serializable for this feature to work. Typically, you would serialize the state as a JSON string. This means that your routes and params must contain no functions, class instances, or recursive data structures.

If you need to modify the nav state object, you may do so in the `loadNavigationState` / `persistNavigationState` functions, but note that if your `loadNavigationState` provides an invalid object (an object from which the navigation state cannot be recovered), React Navigation may not be able to handle the situation gracefully.

## Warning: Route/Router definition changes

When your application code changes to support new routes or different routers for a given route in your navigation state, the app may break when presented with the old navigation state.

This may happen regularly during development as you re-configure your routes and navigator heirarchy. But it also may happen in production when you release a new version of your app!

The conservative behavior is to wipe the navigation state when the app has been updated. The easiest way to do this is to refer to a different persistence key for each version that you release to users.

React Navigation uses React's `componentDidCatch` functionality to attempt to mitigate crashes caused by route definition changes, but this is considered experimental and may not catch all errors.
