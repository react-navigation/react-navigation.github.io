---
id: version-2.17.0-state-persistence
title: State persistence
sidebar_label: State persistence
original_id: state-persistence
---

You may want to save the user's location in the app, so that they are immediately returned to the same location after the app is restarted.

This is especially valuable during development because it allows the developer to stay on the same screen when they refresh the app.

> Note: This feature is currently considered experimental, because of the warnings listed at the end of this page. Use with caution!

## Usage

You can enable persistence for your top-level navigator by rendering it with a `persistenceKey`:

```js
const AppNavigator = createStackNavigator({...});

const App = () => <AppNavigator persistenceKey={"NavigationState"} />;
```

This provided key will be used as the react native `AsyncStorage` key to save the JSON navigation state.

### Development Mode

This feature is particularly useful in development mode. You can enable it selectively using the following approach:

```js
const AppNavigator = createStackNavigator({...});
const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV" : null;
const App = () => <AppNavigator persistenceKey={navigationPersistenceKey} />;
```

### Loading View

Because the state is persisted asyncronously, the app must render an empty/loading view for a moment while the `AsyncStorage` request completes. To customize the loading view that is rendered during this time, you can use the `renderLoadingExperimental` prop:

```js
<AppNavigator
  persistenceKey={...}
  renderLoadingExperimental={() => <ActivityIndicator />}
/>
```

> Note: This API may change in the future, which is why it is labeled experimental

## Warning: Serializable State

Each param, route, and navigation state must be fully JSON-serializable for this feature to work. This means that your routes and params must contain no functions, class instances, or recursive data structures.

## Warning: Route/Router definition changes

When your application code changes to support new routes or different routers for a given route in your navigation state, the app may break when presented with the old navigation state.

This may happen regularly during development as you re-configure your routes and navigator heirarchy. But it also may happen in production when you release a new version of your app!

The conservative behavior is to wipe the navigation state when the app has been updated. The easiest way to do this is to refer to a different persistence key for each version that you release to users.

React Navigation uses React's `componentDidCatch` functionality to attempt to mitigate crashes caused by route definition changes, but this is considered experimental and may not catch all errors.
