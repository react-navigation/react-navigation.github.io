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

### Creating a native stack navigator

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

`createNativeStackNavigator` is a function that takes a configuration object containing the screens and customization options. The screens are React Components that render the content displayed by the navigator.

`createStaticNavigation` is a function that takes the navigator defined earlier and returns a component that can be rendered in the app. It's only called once in the app.

```js name="Native Stack Example" snack version=7
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

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

`createNativeStackNavigator` is a function that returns an object containing 2 properties: `Screen` and `Navigator`. Both of them are React components used for configuring the navigator. The `Navigator` should contain `Screen` elements as its children to define the configuration for routes.

`NavigationContainer` is a component that manages our navigation tree and contains the [navigation state](navigation-state.md). This component must wrap all the navigators in the app. Usually, we'd render this component at the root of our app, which is usually the component exported from `App.js`.

```js name="Native Stack Example" snack version=7
// In App.js in a new project

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

</TabItem>
</Tabs>

![Basic app using stack navigator](/assets/navigators/stack/basic_stack_nav.png)

If you run this code, you will see a screen with an empty navigation bar and a grey content area containing your `HomeScreen` component (shown above). The styles you see for the navigation bar and the content area are the default configuration for a stack navigator, we'll learn how to configure those later.

:::tip

The casing of the route name doesn't matter -- you can use lowercase `home` or capitalized `Home`, it's up to you. We prefer capitalizing our route names.

:::

### Configuring the navigator

All of the route configuration is specified as props to our navigator. We haven't passed any props to our navigator, so it just uses the default configuration.

Let's add a second screen to our native stack navigator and configure the `Home` screen to render first:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Native Stack Example" snack version=7
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

Now our stack has two _routes_, a `Home` route and a `Details` route. A route can be specified by under the `screens` property. The name of the property under `screens` corresponds to the name of the route we will use to navigate, and the value corresponds to the component it'll render.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Native Stack Example" snack version=7
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

Here, the `Home` route corresponds to the `HomeScreen` component, and the `Details` route corresponds to the `DetailsScreen` component. The initial route for the stack is the `Home` route. Try changing it to `Details` and reload the app (React Native's Fast Refresh won't update changes from `initialRouteName`, as you might expect), notice that you will now see the `Details` screen. Then change it back to `Home` and reload once more.

### Specifying options

Each screen in the navigator can specify some options for the navigator, such as the title to render in the header.

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

```js name="Options for Screen" snack version=7
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

Sometimes we will want to specify the same options for all of the screens in the navigator. For that, we can add a `screenOptions` property to the configuration:

```js name="Common options for Screens" snack version=7
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

```js name="Options for Screen" snack version=7
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

Sometimes we will want to specify the same options for all of the screens in the navigator. For that, we can pass a `screenOptions` prop to the navigator:

```js name="Common options for Screens" snack version=7
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

### Passing additional props

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

Passing additional props to a screen is not supported in the static API.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

Sometimes we might want to pass additional props to a screen. We can do that with 2 approaches:

1. Use [React context](https://reactjs.org/docs/context.html) and wrap the navigator with a context provider to pass data to the screens (recommended).
2. Use a render callback for the screen instead of specifying a `component` prop:

   ```js
   <Stack.Screen name="Home">
     // highlight-next-line
     {(props) => <HomeScreen {...props} extraData={someData} />}
   </Stack.Screen>
   ```

:::warning

By default, React Navigation applies optimizations to screen components to prevent unnecessary renders. Using a render callback removes those optimizations. So if you use a render callback, you'll need to ensure that you use [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo) or [`React.PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) for your screen components to avoid performance issues.

:::

</TabItem>
</Tabs>

## What's next?

The natural question at this point is: "how do I go from the `Home` route to the `Details` route?". That is covered in the [next section](navigating.md).

<details>
<summary>Using with TypeScript</summary>

If you are using TypeScript, you will need to specify the types accordingly. You can check [Type checking with TypeScript](typescript.md) after going through the fundamentals for more details. For now, we won't be covering TypeScript in the examples.

</details>

## Summary

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

- React Native doesn't have a built-in API for navigation like a web browser does. React Navigation provides this for you, along with the iOS and Android gestures and animations to transition between screens.
- `createNativeStackNavigator` is a function that takes the screens configuration and renders our content.
- Each property under screens refers to the name of the route, and the value is the component to render for the route.
- To specify what the initial route in a stack is, provide an `initialRouteName` option for the navigator.
- To specify screen-specific options, we can specify an `options` property, and for common options, we can specify `screenOptions`.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

- React Native doesn't have a built-in API for navigation like a web browser does. React Navigation provides this for you, along with the iOS and Android gestures and animations to transition between screens.
- `Stack.Navigator` is a component that takes route configuration as its children with additional props for configuration and renders our content.
- Each `Stack.Screen` component takes a `name` prop which refers to the name of the route and `component` prop which specifies the component to render for the route. These are the 2 required props.
- To specify what the initial route in a stack is, provide an `initialRouteName` as the prop for the navigator.
- To specify screen-specific options, we can pass an `options` prop to `Stack.Screen`, and for common options, we can pass `screenOptions` to `Stack.Navigator`.

</TabItem>
</Tabs>
