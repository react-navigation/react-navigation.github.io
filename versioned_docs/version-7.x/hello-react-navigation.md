---
id: hello-react-navigation
title: Hello React Navigation
sidebar_label: Hello React Navigation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In a web browser, clicking a link pushes a page onto the browser's history stack, and pressing the back button pops the page from the stack, making the previous page active again. React Native doesn't have a built-in history like a web browser - this is where React Navigation comes in.

The native stack navigator keeps track of visited screens in a history stack. It also provides UI elements such as headers, native gestures, and animations to transition between screens etc. that you'd expect in a mobile app.

## Installing the native stack navigator library

Each navigator in React Navigation lives in its own library.

To use the native stack navigator, we need to install [`@react-navigation/native-stack`](https://github.com/react-navigation/react-navigation/tree/main/packages/native-stack):

```bash npm2yarn
npm install @react-navigation/native-stack
```

:::info

`@react-navigation/native-stack` depends on `react-native-screens` and the other libraries that we installed in [Getting started](getting-started.md). If you haven't installed those yet, head over to that page and follow the installation instructions.

:::

## Installing the elements library

The [`@react-navigation/elements`](elements.md) library provides components designed to work with React Navigation. In this guide, we'll use components like [`Button`](elements.md#button) from the elements library:

```bash npm2yarn
npm install @react-navigation/elements
```

## Creating a native stack navigator

We can create a native stack navigator by using the `createNativeStackNavigator` function:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Native Stack Example" snack
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

export default function App() {
  return <Navigation />;
}
```

`createNativeStackNavigator` takes a configuration object containing the screens to include, as well as various other options.

`createStaticNavigation` takes the navigator and returns a component to render in the app. It should only be called once, typically at the root of your app (e.g., in `App.tsx`):

:::warning

In a typical React Native app, the `createStaticNavigation` function should be only used once in your app at the root.

:::

</TabItem>
<TabItem value="dynamic" label="Dynamic">

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

`createNativeStackNavigator` returns an object with `Screen` and `Navigator` components. The `Navigator` should render `Screen` elements as children to define routes.

`NavigationContainer` manages the navigation tree and holds the [navigation state](navigation-state.md). It must wrap all navigators and should be rendered at the root of your app (e.g., in `App.tsx`):

:::warning

In a typical React Native app, the `NavigationContainer` should be only used once in your app at the root. You shouldn't nest multiple `NavigationContainer`s unless you have a specific use case for them.

:::

</TabItem>
</Tabs>

![Basic app using stack navigator](/assets/navigators/stack/basic_stack_nav.png)

If you run this code, you will see a screen with an empty navigation bar and a grey content area containing your `HomeScreen` component (shown above). These are the default styles for a stack navigator - we'll learn how to customize them later.

:::tip

The casing of the route name doesn't matter -- you can use lowercase `home` or capitalized `Home`, it's up to you. We prefer capitalizing our route names.

:::

## Configuring the navigator

We haven't passed any configuration to the navigator yet, so it just uses the default configuration.

Let's add a second screen and configure `Home` as the initial route:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Native Stack Example" snack
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
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

Now our stack has two _routes_: `Home` and `Details`. Routes are defined under the `screens` property - the property name is the route name, and the value is the component to render.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

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

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

// codeblock-focus-start
function RootStack() {
  return (
    // highlight-next-line
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
// codeblock-focus-end

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
```

Now our stack has two _routes_, a `Home` route and a `Details` route. A route can be specified by using the `Screen` component. The `Screen` component accepts a `name` prop which corresponds to the name of the route we will use to navigate, and a `component` prop which corresponds to the component it'll render.

:::warning

When using the dynamic API, the `component` prop accepts a component, not a render function. Don't pass an inline function (e.g. `component={() => <HomeScreen />}`), or your component will unmount and remount losing all state when the parent component re-renders. See [Passing additional props](#passing-additional-props) for alternatives.

:::

</TabItem>
</Tabs>

Here, the initial route is set to `Home`. Try changing `initialRouteName` to `Details` and reload the app (Fast Refresh won't pick up this change) to see the Details screen first.

## Specifying options

Each screen can specify options such as the header title.

We can specify the `options` property in the screen configuration to set screen-specific options:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

To specify the options, we'll change how we have specified the screen component. Instead of specifying the screen component as the value, we can also specify an object with a `screen` property:

```js
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: {
      // highlight-next-line
      screen: HomeScreen,
    },
    Details: DetailsScreen,
  },
});
```

This will let us specify additional options for the screen.

Now, we can add an `options` property:

```js name="Options for Screen" snack
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
    Home: {
      screen: HomeScreen,
      // highlight-start
      options: {
        title: 'Overview',
      },
      // highlight-end
    },
    Details: DetailsScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

To apply the same options to all screens, we can use `screenOptions` on the navigator:

```js name="Common options for Screens" snack
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
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Overview',
      },
    },
    Details: DetailsScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

Any customization options can be passed in the `options` prop for each screen component:

```js name="Options for Screen" snack
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

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    // codeblock-focus-start
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        // highlight-next-line
        options={{ title: 'Overview' }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
    // codeblock-focus-end
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

To apply the same options to all screens, we can use `screenOptions` on the navigator:

```js name="Common options for Screens" snack
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

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    // codeblock-focus-start
    <Stack.Navigator
      initialRouteName="Home"
      // highlight-start
      screenOptions={{
        headerStyle: { backgroundColor: 'tomato' },
      }}
      // highlight-end
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Overview' }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
    // codeblock-focus-end
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

</TabItem>
</Tabs>

## Passing additional props

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

Passing additional props to a screen is not supported in the static API.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

We can pass additional props to a screen with 2 approaches:

1. [React context](https://react.dev/reference/react/useContext) and wrap the navigator with a context provider to pass data to the screens (recommended).
2. Render callback for the screen instead of specifying a `component` prop:

   ```js
   <Stack.Screen name="Home">
     // highlight-next-line
     {(props) => <HomeScreen {...props} extraData={someData} />}
   </Stack.Screen>
   ```

   :::warning

   React Navigation applies optimizations to screen components to prevent unnecessary renders. Using a render callback removes those optimizations, so you'll need to use [`React.memo`](https://react.dev/reference/react/memo) or [`React.PureComponent`](https://react.dev/reference/react/PureComponent) for your screen components to avoid performance issues.

   :::

</TabItem>
</Tabs>

## What's next?

Now that we have two screens, "How do we navigate from `Home` to `Details`?". That's covered in the [next section](navigating.md).

<details>
<summary>Using with TypeScript</summary>

If you are using TypeScript, you will need to specify the types accordingly. You can check [Type checking with TypeScript](typescript.md) after going through the fundamentals for more details. For now, we won't be covering TypeScript in the examples.

</details>

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
