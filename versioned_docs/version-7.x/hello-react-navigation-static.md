---
id: hello-react-navigation-static
title: Static configuration
sidebar_label: Static configuration
---

In a web browser, there are multiple **pages** and you can **link to** the pages using an anchor (`<a>`) tag. Similarly, in React Native, you have multiple **screens** and you can **navigate** between them.

React Navigation provides different types of navigators, such as the stack navigator, tab navigator, drawer navigator, etc. Each navigator provides a different way of transitioning between screens. They have a similar API for configuring them.

The stack navigator is the most commonly used navigator. It resembles how you would expect multiple pages to work in a web browser. In this guide, let's start by demonstrating how to configure the native stack navigator.

## Installing the native stack navigator library

The libraries we've installed so far are the building blocks and shared foundations for navigators, and each navigator in React Navigation lives in its own library. To use the native stack navigator, we need to install [`@react-navigation/native-stack`](https://github.com/react-navigation/react-navigation/tree/main/packages/native-stack) :

```bash npm2yarn
npm install @react-navigation/native-stack@next
```

> 💡 `@react-navigation/native-stack` depends on `react-native-screens` and the other libraries that we installed in [Getting started](getting-started.md). If you haven't installed those yet, head over to that page and follow the installation instructions.

## Creating a native stack navigator

`createNativeStackNavigator` is a function that takes a configuration object containing the screens and customization options. The screens are React Components that render the content displayed by the navigator.

```js
// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}

export default App;
```

If you run this code, you will see a screen with an empty navigation bar and a grey content area containing your `HomeScreen` component (shown above). The styles you see for the navigation bar and the content area are the default configuration for a stack navigator, we'll learn how to configure those later.

> The casing of the route name doesn't matter -- you can use lowercase `home` or capitalized `Home`, it's up to you. We prefer capitalizing our route names.

### Configuring the navigator

All of the route configuration is specified as props to our navigator. We haven't passed any props to our navigator, so it just uses the default configuration.

Let's add a second screen to our native stack navigator and configure the `Home` screen to render first:

```js
function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}
```

Now our stack has two _routes_, a `Home` route and a `Details` route. A route can be specified by using the `Screen` component. The `Screen` component accepts a `name` prop which corresponds to the name of the route we will use to navigate, and a `component` prop which corresponds to the component it'll render.

Here, the `Home` route corresponds to the `HomeScreen` component, and the `Details` route corresponds to the `DetailsScreen` component. The initial route for the stack is the `Home` route. Try changing it to `Details` and reload the app (React Native's Fast Refresh won't update changes from `initialRouteName`, as you might expect), notice that you will now see the `Details` screen. Then change it back to `Home` and reload once more.

### Specifying options

Each screen in the navigator can specify some options for the navigator, such as the title to render in the header. To specify the options, we'll change how we have specified the screen component:

```js
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Details: DetailsScreen,
  },
});
```

Now, we can add an `options` property:

```js
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Overview',
      }
    },
    Details: DetailsScreen,
  },
});
```

Sometimes we will want to specify the same options for all of the screens in the navigator. For that, we can pass add a `screenOptions` property to the configuration.

```js
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerStyle: { backgroundColor: 'tomato' },
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Overview',
      }
    },
    Details: DetailsScreen,
  },
});
```

Here we have specified a `headerStyle` property. This will customize the styles of the header in all of the screens of the navigator.

## What's next?

The natural question at this point is: "how do I go from the `Home` route to the `Details` route?". That is covered in the [navigating section](navigating.md) under fundamentals.

## Summary

- React Native doesn't have a built-in API for navigation like a web browser does. React Navigation provides this for you, along with the iOS and Android gestures and animations to transition between screens.
- `createNativeStackNavigator` is a function that takes the screens configuration and renders our content.
- Each property under screens refers to the name of the route, and the value is the component to render for the route.
- To specify what the initial route in a stack is, provide an `initialRouteName` option for the navigator.
- To specify screen-specific options, we can specify an `options` property, and for common options, we can specify `screenOptions`.
