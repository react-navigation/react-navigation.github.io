---
id: version-4.x-app-containers
title: App containers
sidebar_label: App containers
original_id: app-containers
---

We've been taking `createAppContainer` for granted so far, so let's explain them quickly. Containers are responsible for managing your app state and linking your top-level navigator to the app environment. On Android, the app container uses the `Linking` API to handle the back button. The container can also be configured to persist your navigation state. On web, you'd use different containers than React Native. As we've seen already, app container usage looks like this:

```js
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const RootStack = createStackNavigator({ /* your routes here */ });
const AppContainer = createAppContainer(RootStack);

// Now AppContainer is the main component for React to render
export default AppContainer;
```

## Props of `createAppContainer` on React Native

There are a couple of props worth knowing about on the app container.

```js
<AppContainer
  onNavigationStateChange={handleNavigationChange}
  uriPrefix="/app"
/>
```

### `onNavigationStateChange(prevState, newState, action)`

Function that gets called every time navigation state managed by the navigator changes. It receives the previous state, the new state of the navigation and the action that issued state change. By default it prints state changes to the console.

### `uriPrefix`

The prefix of the URIs that the app might handle. This will be used when handling a [deep link](deep-linking.html) to extract the path passed to the router.

## Calling `dispatch` or `navigate` on a container ref

In some cases you may want to perform navigation actions from the root of your app, outside of any of the screens. To do this you can use a React [`ref`](https://facebook.github.io/react/docs/refs-and-the-dom.html#the-ref-callback-attribute) to call the `dispatch` method on it:

```js
const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component {
  someEvent() {
    // call navigate for AppNavigator here:
    this.navigator &&
      this.navigator.dispatch(
        NavigationActions.navigate({ routeName: someRouteName })
      );
  }
  render() {
    return (
      <AppContainer
        ref={nav => {
          this.navigator = nav;
        }}
      />
    );
  }
}
```

## On the web

To learn about how to use React Navigation the web (still very experimental), see the [web support](web-support.html) guide.