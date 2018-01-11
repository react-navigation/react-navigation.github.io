---
id: hello-react-navigation
title: Hello React Navigation
sidebar_label: Hello React Navigation
---

In a web browser, you can link to different pages using an anchor (`<a>`) tag. When the user clicks on a link, the URL is pushed to the browser history stack. When the user presses the back button, the browser pops the item from the top of the history stack, so the active page is now the previously visited page. React Native doesn't have a built-in idea of a global history stack like a web browser does -- this is where React Naviation enters the story.

React Navigation's `StackNavigator` provides a way for your app to transition between screens and manage navigation history. If your app uses only one `StackNavigator` then it is conceptually similar to how a  web browser handles navigation state - your app pushes and pops items from the navigation stack as users interact with the it, and this results in the user seeing different screens. A key difference between how this works in a web browser and in React Navigation is that React Navigation's `StackNavigator` provides the gestures and animations that you would expect on Android and iOS when navigating between routes in the stack.

All we need to get started using React Navigation is a `StackNavigator`.

## Creating a StackNavigator

`StackNavigator` is a function that returns a React component. It takes _a route configuration object_ and, optionally, _an options object_ (we omit this below, for now). Because the `StackNavigator` function returns a React component, we can export it directly from `App.js` to be used as our App's root component.

```javascript
// In App.js in a new project

import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
});
```
<a href="https://snack.expo.io/@react-navigation/hello-world" target="blank" class="run-code-button">&rarr; Run this code</a>

If you run this code, you will see a screen with an empty navigation bar and a grey content area containing your `HomeScreen` component. The styles you see for the navigation bar and the content area are the default configuration for a `StackNavigator`, we'll learn how to configure those later.

> The casing of the route name doesn't matter -- you can use lowercase `home` or capitalized `Home`, it's up to you. We prefer capitalizing our route names.

> The only required configuration for a route is the `screen` component. You can read more about the other options available in the [StackNavigator reference](__TODO__).

In React Native, the component exported from `App.js` is the entry point (or root component) for your app -- it is the component from which every other component descends. It's often useful to have more control over the component at the root of your app than you would get from exporting a `StackNavigator`, so let's export a component that just renders our `StackNavigator`.

```js
const RootStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
});

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
```

## Adding a second route

The `<RootStack />` component doesn't accept any props -- all configuration is specified in the `options` parameter to the `StackNavigator` function. We left the `options` blank, so it just uses the default configuration. To see an example of using the `options` object, we will add a second screen to the `StackNavigator`.

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

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

// Other code for App component here...
```

Now our stack has two *routes*, a `Home` route and a `Details` route. The `Home` route corresponds to the `HomeScreen` component, and the `Details` route corresponds to the `DetailsScreen` component. The initial route for the stack is the `Home` route. The natural question at this point is: "how do I move from the Home route to the Details route?". That is covered in the next section.

## Summary

- React Native doesn't have a built-in API for navigation like a web browser does. React Navigation provides this for you, along with the iOS and Android gestures and animations to transition between screens.
- `StackNavigator` is a function that takes a route configuration object and an options object and returns a React component.
- The keys in the route configuration object are the route names and the values are the configuration for that route. The only required property on the configuration is the `screen` (the component to use for the route).
- To specify what the initial route in a stack is, provide an `initialRouteName` on the stack options object.
- [Full source of what we have built so far](https://snack.expo.io/@react-navigation/hello-react-navigation).