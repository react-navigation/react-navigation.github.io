---
id: app-containers
title: App containers
sidebar_label: App containers
---

Containers are responsible for managing your app state and linking your top-level navigator to the app environment. On Android, the app container uses the Linking API to handle the back button. The container can also be configured to persist your navigation state. On web, you'd use different containers than React Native.

> Note: In v2 and earlier, the containers in React Navigation are automatically provided by the `create*Navigator` functions. As of v3, you are required to use the container directly. In v3 we also renamed `createNavigationContainer` to `createAppContainer`.

A quick example of `createAppContainer`:

```
import { createAppContainer, createStackNavigator } from 'react-navigation';
// you can also import from @react-navigation/native

const AppNavigator = createStackNavigator(...);

const AppContainer = createAppContainer(AppNavigator);

// Now AppContainer is the main component for React to render

export default AppContainer;
```

## Props of `createAppContainer` on React Native

```js
<AppContainer
  onNavigationStateChange={handleNavigationChange}
  uriPrefix="/app"
/>
```

### `onNavigationStateChange(prevState, newState, action)`

Function that gets called every time navigation state managed by the navigator changes. It receives the previous state, the new state of the navigation and the action that issued state change. By default it prints state changes to the console.

### `uriPrefix`

The prefix of the URIs that the app might handle. This will be used when handling a [deep link](deep-linking.md) to extract the path passed to the router.

## Calling Dispatch or Navigate on App Container

In case you want to dispatch actions on an app container, you can use a React [`ref`](https://facebook.github.io/react/docs/refs-and-the-dom.html#the-ref-callback-attribute) to call the `dispatch` method on it:

```js
const AppContainer = createAppContainer(AppNavigator);

const App = () => {
  const navigator = React.useRef(null)

  function someEvent() {
    // call navigate for AppNavigator here:
    navigator.current &&
      navigator.current.dispatch(
        NavigationActions.navigate({ routeName: someRouteName })
      );
  }
  
  return (
    <AppContainer
      ref={nav => {
        navigator.current = nav;
      }}
    />
  );
}
```

## App Containers on the web

On the web, you can use `createBrowserApp` and `handleServerRequest` to maintain the state for your top-level navigator.
