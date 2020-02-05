---
id: version-5.x-hello-react-navigation
title: Hello React Navigation
sidebar_label: Hello React Navigation
original_id: hello-react-navigation
---

In a web browser, you can link to different pages using an anchor (`<a>`) tag. When the user clicks on a link, the URL is pushed to the browser history stack. When the user presses the back button, the browser pops the item from the top of the history stack, so the active page is now the previously visited page. React Native doesn't have a built-in idea of a global history stack like a web browser does -- this is where React Navigation enters the story.

React Navigation's stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state - your app pushes and pops items from the navigation stack as users interact with it, and this results in the user seeing different screens. A key difference between how this works in a web browser and in React Navigation is that React Navigation's stack navigator provides the gestures and animations that you would expect on Android and iOS when navigating between routes in the stack.

## Basics

Lets start by demonstrating the most common navigator, `createStackNavigator`.

Before continuing, first install [`@react-navigation/stack`](https://github.com/react-navigation/react-navigation/tree/master/packages/stack) :

```sh
npm install @react-navigation/stack @react-native-community/masked-view
```

### Creating a stack navigator

`createStackNavigator` is a function that returns an object containing 2 properties: `Screen` and `Navigator`. Both of them are React components used for configuring the navigator. The `Navigator` should contain `Screen` elements as its children to define the configuration for routes.

`NavigationContainer` is a component which manages our navigation tree and contains the navigation state. This component must wrap all navigators structure. Usually, we'd render this component at the root of our app, which is usually the component exported from `App.js`.

<samp id="hello-react-navigation">Hello World</samp>

```js
// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

![Basic app using stack navigator](/docs/assets/navigators/stack/basic_stack_nav.png)

If you run this code, you will see a screen with an empty navigation bar and a grey content area containing your `HomeScreen` component (shown above). The styles you see for the navigation bar and the content area are the default configuration for a stack navigator, we'll learn how to configure those later.

> The casing of the route name doesn't matter -- you can use lowercase `home` or capitalized `Home`, it's up to you. We prefer capitalizing our route names.

> The only required configuration for a route is the `screen` component. You can read more about the other options available in the [StackNavigator reference](stack-navigator.html).

### Configuring the navigator

All of the route configuration is specified as props to our navigator. We haven't passed any props to our navigator, so it just uses the default configuration.

Let's add a second screen to our stack navigator and configure the screen to render first:

<samp id="hello-react-navigation-full" />

```js
function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Now our stack has two _routes_, a `Home` route and a `Details` route. A route can be specified by using the `Screen` component. The `Screen` component accepts a `name` prop which corresponds to the name of the route we will use to navigate, and a `component` prop which corresponds to the component it'll render.

Here, the `Home` route corresponds to the `HomeScreen` component, and the `Details` route corresponds to the `DetailsScreen` component. The initial route for the stack is the `Home` route.

> Note: The `component` prop accepts component, not a render function. Don't pass a inline function (e.g. `component={() => <HomeScreen />}`), or your component will unmount and remount losing all state when the parent component re-renders. See [Passing additional props](#passing-additional-props) for alternatives.

### Specifying options

Each screen in the navigator can specify some options for the navigator, such as the title to render in the header. These options can be passed in the `options` prop for each screen component:

<samp id="hello-react-navigation-with-options" />

```js
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{ title: 'Overview' }}
/>
```

Sometimes we will want to specify the same options for all of the screens in the navigator. For that, we can pass a `screenOptions` prop to the navigator.

### Passing additional props

Sometimes we might want to pass additional props to a screen. We can do that with 2 approaches:

1. Use [React context](https://reactjs.org/docs/context.html) and wrap the navigator with a context provider to pass data to the screens (recommended).
2. Use a render callback for the screen instead of specifying a `component` prop:

   ```js
   <Stack.Screen name="Home">
     {props => <HomeScreen {...props} extraData={someData} />}
   </Stack.Screen>
   ```

> Note: By default, React Navigation applies optimizations to screen components to prevent unnecessary renders. Using a render callback removes those optimizations. So if you use a render callback, you'll need to ensure that you use [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo) or [`React.PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) for your screen components to prevent avoid performance issues.

## What's next?

The natural question at this point is: "how do I go from the `Home` route to the `Details` route?". That is covered in the [next section](navigating.html).

## Summary

- React Native doesn't have a built-in API for navigation like a web browser does. React Navigation provides this for you, along with the iOS and Android gestures and animations to transition between screens.
- `Stack.Navigator` is a component that takes route configuration as it's children with additional props for configuration and renders our content.
- Each `Stack.Screen` component take a `name` prop which refers to the name of the route and `component` prop which specifies the component to render for the route. These are the 2 required props.
- To specify what the initial route in a stack is, provide an `initialRouteName` as the prop for the navigator.
- To specify screen-specific options, we can pass an `options` prop to `Stack.Screen`, and for common options, we can pass `screenOptions` to `Stack.Navigator`
