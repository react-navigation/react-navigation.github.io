---
id: version-4.x-hello-react-navigation
title: Hello React Navigation
sidebar_label: Hello React Navigation
original_id: hello-react-navigation
---

In a web browser, you can link to different pages using an anchor (`<a>`) tag. When the user clicks on a link, the URL is pushed to the browser history stack. When the user presses the back button, the browser pops the item from the top of the history stack, so the active page is now the previously visited page. React Native doesn't have a built-in idea of a global history stack like a web browser does -- this is where React Navigation enters the story.

React Navigation's stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state - your app pushes and pops items from the navigation stack as users interact with it, and this results in the user seeing different screens. A key difference between how this works in a web browser and in React Navigation is that React Navigation's stack navigator provides the gestures and animations that you would expect on Android and iOS when navigating between routes in the stack.

Lets start by demonstrating the most common navigator, `createStackNavigator`.

Before continuing, first install [`react-navigation-stack`](https://github.com/react-navigation/stack) following the guide on [Stack Navigator's page](stack-navigator.html).

## Creating a stack navigator

`createStackNavigator` is a function that returns a React component. It takes _a route configuration object_ and, optionally, _an options object_ (we omit this below, for now). `createAppContainer` is a function that retuns a React component to take as a parameter the React component created by the `createStackNavigator`, and can be directly exported from `App.js` to be used as our App's root component.

```js
// In App.js in a new project

import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
});

export default createAppContainer(AppNavigator);
```

<a href="https://snack.expo.io/@react-navigation/hello-world-v3" target="blank" class="run-code-button">&rarr; Run this code</a>

If you run this code, you will see a screen with an empty navigation bar and a grey content area containing your `HomeScreen` component. The styles you see for the navigation bar and the content area are the default configuration for a stack navigator, we'll learn how to configure those later.

> The casing of the route name doesn't matter -- you can use lowercase `home` or capitalized `Home`, it's up to you. We prefer capitalizing our route names.

> The only required configuration for a route is the `screen` component. You can read more about the other options available in the [StackNavigator reference](stack-navigator.html).

In React Native, the component exported from `App.js` is the entry point (or root component) for your app -- it is the component from which every other component descends. It's often useful to have more control over the component at the root of your app than you would get from exporting the result of `createAppContainer`, so let's export a component that just renders our `AppNavigator` stack navigator.

```js
const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
```

## Route configuration shorthand

Given that the only route configuration we have for `Home` is the screen component, we don't need to use the `{ screen: HomeScreen }` configuration format, we can use the screen component directly.

```js
const AppNavigator = createStackNavigator({
  Home: HomeScreen,
});
```

## Adding a second route

The `<AppContainer />` component doesn't accept any props -- all configuration is specified in the `options` parameter to the `AppNavigator` `createStackNavigator` function. We left the `options` blank, so it just uses the default configuration. To see an example of using the `options` object, we will add a second screen to the stack navigator.

```js
// Other code for HomeScreen here...

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

// Other code for App component here...
```

Now our stack has two _routes_, a `Home` route and a `Details` route. The `Home` route corresponds to the `HomeScreen` component, and the `Details` route corresponds to the `DetailsScreen` component. The initial route for the stack is the `Home` route. The natural question at this point is: "how do I go from the Home route to the Details route?". That is covered in the next section.

## Summary

- React Native doesn't have a built-in API for navigation like a web browser does. React Navigation provides this for you, along with the iOS and Android gestures and animations to transition between screens.
- `createStackNavigator` is a function that takes a route configuration object and an options object and returns a React component.
- The keys in the route configuration object are the route names and the values are the configuration for that route. The only required property on the configuration is the `screen` (the component to use for the route).
- To specify what the initial route in a stack is, provide an `initialRouteName` on the stack options object.
- [Full source of what we have built so far](https://snack.expo.io/@react-navigation/hello-react-navigation-v3).
