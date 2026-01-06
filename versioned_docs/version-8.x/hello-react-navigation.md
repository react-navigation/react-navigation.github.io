---
id: hello-react-navigation
title: Hello React Navigation
sidebar_label: Hello React Navigation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In a web browser, you can link to different pages using an anchor (`<a>`) tag. When the user clicks on a link, the URL is pushed to the browser history stack. When the user presses the back button, the browser pops the item from the top of the history stack, so the active page is now the previously visited page. React Native doesn't have a built-in idea of a global history stack like a web browser does -- this is where React Navigation enters the story.

React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state - your app pushes and pops items from the navigation stack as users interact with it, and this results in the user seeing different screens. A key difference between how this works in a web browser and in React Navigation is that React Navigation's native stack navigator provides the gestures and animations that you would expect on Android and iOS when navigating between routes in the stack.

Let's start by demonstrating the most common navigator, `createNativeStackNavigator`.

## Installing the native stack navigator library

The libraries we've installed so far are the building blocks and shared foundations for navigators, and each navigator in React Navigation lives in its own library. To use the native stack navigator, we need to install [`@react-navigation/native-stack`](https://github.com/react-navigation/react-navigation/tree/main/packages/native-stack) :

```bash npm2yarn
npm install @react-navigation/native-stack@next
```

:::info

`@react-navigation/native-stack` depends on `react-native-screens` and the other libraries that we installed in [Getting started](getting-started.md). If you haven't installed those yet, head over to that page and follow the installation instructions.

:::

## Installing the elements library

The [`@react-navigation/elements`](elements.md) library provides a set of components that are designed to work well with React Navigation. We'll use a few of these components such as `Button` in this guide. So let's install it first:

```bash npm2yarn
npm install @react-navigation/elements
```

## Creating a native stack navigator

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

`createNativeStackNavigator` is a function that takes a configuration object for the navigator including the list of screens to include.

`createNativeStackScreen` is a function that takes a configuration object for a screen, where the `screen` property is the component to render for that screen. A screen is a React Component that renders the content displayed by the navigator, or a nested navigator which we'll learn about later.

`createStaticNavigation` is a function that takes the navigator defined earlier and returns a component that can be rendered in the app. It's only called once in the app. Usually, we'd render the returned component at the root of our app, which is usually the component exported from `App.js`, `App.tsx` etc., or used with `AppRegistry.registerComponent`, `Expo.registerRootComponent` etc.

To create a basic native stack navigator with a single screen, we can add the following code in the entry file of our app (e.g., `App.tsx`, `index.tsx` etc.):

```js name="Native Stack Example" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
    }),
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

:::warning

In a typical React Native app, the `createStaticNavigation` function should be only used once in your app at the root.

:::

</TabItem>
<TabItem value="dynamic" label="Dynamic">

`createNativeStackNavigator` is a function that returns an object containing 2 properties: `Screen` and `Navigator`. Both of them are React components used for configuring the navigator. The `Navigator` should contain `Screen` elements as its children to define the configuration for routes.

`NavigationContainer` is a component that manages our navigation tree and contains the [navigation state](navigation-state.md). This component must wrap all the navigators in the app. Usually, we'd render this component at the root of our app, which is usually the component exported from `App.js`, `App.tsx` etc., or used with `AppRegistry.registerComponent`, `Expo.registerRootComponent` etc.

To create a basic native stack navigator with a single screen, we can add the following code in the entry file of our app (e.g., `App.tsx`, `index.tsx` etc.):

```js name="Native Stack Example" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
```

:::warning

In a typical React Native app, the `NavigationContainer` should be only used once in your app at the root. You shouldn't nest multiple `NavigationContainer`s unless you have a specific use case for them.

:::

</TabItem>
</Tabs>

![Basic app using stack navigator](/assets/navigators/stack/basic_stack_nav.png)

If you run this code, you will see a screen with an empty navigation bar and a grey content area containing your `HomeScreen` component (shown above). The styles you see for the navigation bar and the content area are the default configuration for a stack navigator, we'll learn how to configure those later.

:::tip

The casing of the route name doesn't matter -- you can use lowercase `home` or capitalized `Home`, it's up to you. We prefer capitalizing our route names.

:::

## Configuring the navigator

All of the route configuration is specified as props to our navigator. We haven't passed any props to our navigator, so it just uses the default configuration.

Let's add a second screen to our native stack navigator and configure the `Home` screen to render first:

```js name="Native Stack Example" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const RootStack = createNativeStackNavigator({
  // highlight-next-line
  initialRouteName: 'Home',
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
    }),
    Details: createNativeStackScreen({
      screen: DetailsScreen,
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

Now our stack has two _routes_, a `Home` route and a `Details` route. A route can be specified by under the `screens` property. The name of the property under `screens` corresponds to the name of the route we will use to navigate, and the value corresponds to the component it'll render.

Here, the `Home` route corresponds to the `HomeScreen` component, and the `Details` route corresponds to the `DetailsScreen` component. The initial route for the stack is the `Home` route. Try changing it to `Details` and reload the app (React Native's Fast Refresh won't update changes from `initialRouteName`, as you might expect), notice that you will now see the `Details` screen. Then change it back to `Home` and reload once more.

## Specifying options

Each screen in the navigator can specify some options for the navigator, such as the title to render in the header.

To specify the options, we'll add an `options` property to the screen configuration:

```js name="Options for Screen" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
      // highlight-start
      options: {
        title: 'Overview',
      },
      // highlight-end
    }),
    Details: createNativeStackScreen({
      screen: DetailsScreen,
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

Sometimes we will want to specify the same options for all of the screens in the navigator. For that, we can add a `screenOptions` property to the configuration:

```js name="Common options for Screens" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  // highlight-start
  screenOptions: {
    headerStyle: { backgroundColor: 'tomato' },
  },
  // highlight-end
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
      options: {
        title: 'Overview',
      },
    }),
    Details: createNativeStackScreen({
      screen: DetailsScreen,
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

## Passing additional props

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

Passing additional props to a screen is not supported in the static API.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

Sometimes we might want to pass additional props to a screen. We can do that with 2 approaches:

1. Use [React context](https://react.dev/reference/react/useContext) and wrap the navigator with a context provider to pass data to the screens (recommended).
2. Use a render callback for the screen instead of specifying a `component` prop:

   ```js
   <Stack.Screen name="Home">
     // highlight-next-line
     {(props) => <HomeScreen {...props} extraData={someData} />}
   </Stack.Screen>
   ```

:::warning

By default, React Navigation applies optimizations to screen components to prevent unnecessary renders. Using a render callback removes those optimizations. So if you use a render callback, you'll need to ensure that you use [`React.memo`](https://react.dev/reference/react/memo) or [`React.PureComponent`](https://react.dev/reference/react/PureComponent) for your screen components to avoid performance issues.

:::

</TabItem>
</Tabs>

## Setting up TypeScript

If you're using TypeScript, you'll need to tell React Navigation about your root navigator - i.e., the navigator that contains all other navigators and is used at the root of your app.

To do this, you can declare a module augmentation for `@react-navigation/core` and extend the `RootNavigator` interface with the type of your root navigator:

```ts
type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
```

In this example, `RootStack` is the root navigator we created earlier using `createNativeStackNavigator`. You can place this code just below the code where you created your root navigator.

Check out the [Type checking with TypeScript](typescript.md) guide for more details.

## What's next?

The natural question at this point is: "how do I go from the `Home` route to the `Details` route?". That is covered in the [next section](navigating.md).

## Summary

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

- React Native doesn't have a built-in API for navigation like a web browser does. React Navigation provides this for you, along with the iOS and Android gestures and animations to transition between screens.
- [`createNativeStackNavigator`](native-stack-navigator.md) is a function that takes the screens configuration and renders our content.
- Each property under screens refers to the name of the route, and the value is the component to render for the route.
- To specify what the initial route in a stack is, provide an [`initialRouteName`](navigator.md#initial-route-name) option for the navigator.
- To specify screen-specific options, we can specify an [`options`](screen-options.md#options-prop-on-screen) property, and for common options, we can specify [`screenOptions`](screen-options.md#screenoptions-prop-on-the-navigator).

</TabItem>
<TabItem value="dynamic" label="Dynamic">

- React Native doesn't have a built-in API for navigation like a web browser does. React Navigation provides this for you, along with the iOS and Android gestures and animations to transition between screens.
- [`Stack.Navigator`](native-stack-navigator.md) is a component that takes route configuration as its children with additional props for configuration and renders our content.
- Each [`Stack.Screen`](screen.md) component takes a [`name`](screen.md#name) prop which refers to the name of the route and [`component`](screen.md#component) prop which specifies the component to render for the route. These are the 2 required props.
- To specify what the initial route in a stack is, provide an [`initialRouteName`](navigator.md#initial-route-name) as the prop for the navigator.
- To specify screen-specific options, we can pass an [`options`](screen-options.md#options-prop-on-screen) prop to `Stack.Screen`, and for common options, we can pass [`screenOptions`](screen-options.md#screenoptions-prop-on-the-navigator) to `Stack.Navigator`.

</TabItem>
</Tabs>
