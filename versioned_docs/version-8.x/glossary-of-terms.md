---
id: glossary-of-terms
title: Glossary of terms
sidebar_label: Glossary of terms
---

:::note

This is a new section of the documentation and it's missing a lot of terms! Please [submit a pull request or an issue](https://github.com/react-navigation/react-navigation.github.io) with a term that you think should be explained here.

:::

## Navigator

A `Navigator` is React component that decides how to render the screens you have defined. It contains `Screen` elements as its children to define the configuration for screens.

`NavigationContainer` is a component which manages our navigation tree and contains the [navigation state](navigation-state.md). This component must wrap all navigators structure. Usually, we'd render this component at the root of our app, which is usually the component exported from `App.js`.

```js
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator> // <---- This is a Navigator
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Router

A router is a collection of functions that decide how to handle actions and state changes in the navigator (similar to reducers in Redux apps). Normally you'd never need to interact with a router directly, unless you're writing a [custom navigator](custom-navigators.md).

## Screen component

A screen component is a component that we use in our route configuration.

```js
const Stack = createNativeStackNavigator();

const StackNavigator = (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen} // <----
    />
    <Stack.Screen
      name="Details"
      component={DetailsScreen} // <----
    />
  </Stack.Navigator>
);
```

The suffix `Screen` in the component name is entirely optional, but a frequently used convention; we could call it `Michael` and this would work just the same.

## Navigation object

The navigation object contains methods used for navigation. It contains methods such as:

- `dispatch` will send an action up to the router
- `navigate`, `goBack`, etc are available to dispatch actions in a convenient way

This object can be accessed with the [`useNavigation`](use-navigation.md) hook. It's also passed as a prop to screens defined with the dynamic API.

For more details, see the ["Navigation object docs"](navigation-object.md).

The ["Route object reference"](route-object.md) section goes into more detail on this, describes workarounds, and provides more information on other properties available on `route` object.

## Route object

This prop will be passed to all screens. Contains information about the current route i.e. `params`, `key` and `name`. It can also contain arbitrary params:

```js
{
  key: 'B',
  name: 'Profile',
  params: { id: '123' }
}
```

For more details, see the ["Route object reference"](route-object.md).

## Navigation State

The state of a navigator generally looks something like this:

```js
{
  key: 'StackRouterRoot',
  index: 1,
  routes: [
    { key: 'A', name: 'Home' },
    { key: 'B', name: 'Profile' },
  ]
}
```

For this navigation state, there are two routes (which may be tabs, or cards in a stack). The index indicates the active route, which is "B".

You can read more about the navigation state [here](navigation-state.md).

## Header

Also known as navigation header, navigation bar, app bar, and probably many other things. This is the rectangle at the top of your screen that contains the back button and the title for your screen. The entire rectangle is often referred to as the header in React Navigation.
