---
id: app-containers
title: App Containers
sidebar_label: App Containers
---

Containers are responsible for managing your app state and linking your top-level navigator to the app environment. On Android, the app container uses the Linking API to handle the back button. The container can also be configured to persist your navigation state. On web, you'd use different containers than React Native.


A quick example of `NavigationContainer`:

```
import { NavigationContainer } from '@react-navigation/core';
import createStackNavigator from '@react-navigation/stack';
// you can also import NavigationContainer from @react-navigation/native

const Stact = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        { /* ... */ }
      </StackNavigator>
    </NavigationContainer>
  )
}

export default App;
```

## Props of `NavigationContainer` on React Native

```js
<NavigationContainer
  onStateChange={handleStateChange}
  initialState={initialState}
/>
```

### `onStateChange newState)`

Function that gets called every time navigation state managed by the navigator changes. It receives the new state of the navigation.

### `initialState`

Prop that accepts initial state of navigation. You rather don't need for majority of cases but for deeplinking. #TODO

## Calling Dispatch or Navigate on App Container

In case you want to dispatch actions on an app container, you can use a React [`ref`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) to call the `dispatch` method on it:

```js
  
function App() {
  const ref = useRef();
  useEffect(() => ref.current.dispatch({ type: 'REVERSE' }));
  return (
    <NavigationContainer
      ref={ref}
    />
  );
}
```
