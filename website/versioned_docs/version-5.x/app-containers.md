---
id: version-5.x-app-containers
title: App containers
sidebar_label: App containers
original_id: app-containers
---

Containers are responsible for managing your app state and linking your top-level navigator to the app environment.

The container can notify state changes and can be used to persist and restore state. On Android, the app container uses the `BackHandler` module to handle the system back button.

A quick example of `NavigationContainer`:

```js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>{/* ... */}</Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

## Props of `NavigationContainer`

### `onStateChange(newState)`

> Note: Consider the navigator's state object to be internal and subject to change in a minor release. Avoid using properties from the navigation state object except `index` and `routes`, unless you really need it. If there is some functionality you cannot achieve without relying on the structure of the state object, please open an issue.

Function that gets called every time navigation state managed by the navigator changes. It receives the new state of the navigation.

### `initialState`

Prop that accepts initial state for the navigator. This can be useful for cases such as deep linking, state persistence etc.

Example:

```js
<NavigationContainer
  onStateChange={state => console.log('New state is', state)}
  initialState={initialState}
>
  {/* ... */}
</NavigationContainer>
```

## Calling Dispatch or Navigate on App Container

In case you want to dispatch actions on an app container, you can use a React [`ref`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) to call the `dispatch` method on it:

<samp id="using-refs" />

```js
function App() {
  const ref = React.useRef(null);

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={() => ref.current?.navigate('Home')}>Go home</Button>
      <NavigationContainer ref={ref}>
        {/* ... */}
      </NavigationContainer>
    </View>
  );
}
```
