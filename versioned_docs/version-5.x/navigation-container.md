---
id: navigation-container
title: NavigationContainer
sidebar_label: NavigationContainer
---

The `NavigationContainer` is responsible for managing your app state and linking your top-level navigator to the app environment.

The container takes care of platform specific integration and provides various useful functionality:

1. Deep link integration with the [`linking`](#linking) prop.
2. Notify state changes for [screen tracking](screen-tracking.md), [state persistence](state-persistence.md) etc.
3. Handle system back button on Android by using the [`BackHandler`](https://reactnative.dev/docs/backhandler) API from React Native.

Usage:

```js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>{/* ... */}</Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Ref

It's also possible to attach a [`ref`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) to the container to get access to various helper methods, for example, dispatch navigation actions.

Example:

<samp id="using-refs" />

```js
function App() {
  const ref = React.useRef(null);

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={() => ref.current?.navigate('Home')}>Go home</Button>
      <NavigationContainer ref={ref}>{/* ... */}</NavigationContainer>
    </View>
  );
}
```

## Props

### `initialState`

Prop that accepts initial state for the navigator. This can be useful for cases such as deep linking, state persistence etc.

Example:

```js
<NavigationContainer
  onStateChange={(state) => console.log('New state is', state)}
  initialState={initialState}
>
  {/* ... */}
</NavigationContainer>
```

Providing a custom initial state object will override the initial state object obtained via deep linking or from browser's URL. If you're providing an initial state object, make sure that you don't pass it on web and that there's no deep link by using `Linking.getInitialURL()`:

```js
const initialUrl = await Linking.getInitialURL();

if (Platform.OS !== 'web' && initialUrl == null) {
  // Only restore state if there's no deep link and we're not on web
}
```

See [state persistence guide](state-persistence.md) for more details on how to persist and restore state.

### `onStateChange`

> Note: Consider the navigator's state object to be internal and subject to change in a minor release. Avoid using properties from the navigation state object except `index` and `routes`, unless you really need it. If there is some functionality you cannot achieve without relying on the structure of the state object, please open an issue.

Function that gets called every time navigation state changes. It receives the new navigation state as the argument.

You can use it to track the focused screen, persist the navigation state etc.

### `linking`

Configuration for linking integration used for deep linking and URL support in browsers. Accepts the same options as [`useLinking`](use-linking.md#options).

Example:

```js
import { NavigationContainer } from '@react-navigation/native';

function App() {
  const linking = {
    prefixes: ['https://mychat.com', 'mychat://'],
    config: {
      Home: 'feed/:sort',
    },
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      {/* content */}
    </NavigationContainer>
  );
}
```

See [configuring links guide](configuring-links.md) for more details on how to configure deep links and URL integration.

### `fallback`

React Element to use as a fallback while we resolve the deep link. Defaults to `null`.

### `theme`

Custom theme to use for the navigation components such as the header, tab bar etc. See [theming guide](themes.md) for more details and usage guide.
