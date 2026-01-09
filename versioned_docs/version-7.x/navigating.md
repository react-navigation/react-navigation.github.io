---
id: navigating
title: Moving between screens
sidebar_label: Moving between screens
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In the previous section, we defined a stack navigator with two routes (`Home` and `Details`), but we didn't learn how to let a user navigate from `Home` to `Details` (although we did learn how to change the _initial_ route in our code, but forcing our users to clone our repository and change the route in our code in order to see another screen is arguably among the worst user experiences one could imagine).

If this was a web browser, we'd be able to write something like this:

```js
<a href="details.html">Go to Details</a>
```

It's also possible to programmatically change the URL using JavaScript:

```js
window.location.href = 'details.html';
```

So how do we do this in React Navigation? There are two main ways to navigate between screens in React Navigation:

## Using `Link` or `Button` components

The simplest way to navigate is by using the [`Link`](link.md) component from `@react-navigation/native` or the [`Button`](elements.md#button) component from `@react-navigation/elements`:

```js name="Navigation with Link and Button" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// highlight-start
import { Link } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
// highlight-end

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      // highlight-start
      <Link screen="Details">Go to Details</Link>
      <Button screen="Details">Go to Details</Button>
      // highlight-end
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

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

Let's break this down:

- The `Link` and `Button` components accept a `screen` prop that specifies the name of the screen to navigate to when pressed.
- When the user taps on the `Link` or `Button`, React Navigation automatically navigates to the specified screen.

[When using on the web](web-support.md), they also render as anchor tags (`<a>`) with `href` attribute, which is essential to preserve native browser behaviors like "Right click → Open link in new tab".

:::note

The built-in `Link` and `Button` components come with their own styling. But it's likely that you'll want to create your own custom link or button component to match your app's design. See [`useLinkProps`](use-link-props.md) hook on how to create custom link components.

:::

## Using the `navigation` object

Another way to navigate is by using the `navigation` object. This method gives you more control over when and how navigation happens.

The `navigation` object is available in your screen components through the [`useNavigation`](use-navigation.md) hook:

```js name="Navigating to a new screen" snack static2dynamic
// codeblock-focus-start
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  // highlight-next-line
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  // highlight-next-line
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      // highlight-start
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
      // highlight-end
    </View>
  );
}

// ... other code from the previous section
// codeblock-focus-end

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

export default function App() {
  return <Navigation />;
}
```

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/stack/simple-details.mp4" />
</video>

Let's break this down:

- The `navigation` object is returned from the [`useNavigation`](use-navigation.md) hook (more about this later in ["The navigation object in depth"](navigation-object.md)).
- We call the `navigate` function (on the `navigation` object &mdash; naming is hard!) with the name of the route that we'd like to move the user to.

:::note

If you call `navigation.navigate` with a route name that you haven't defined in your navigator, you'll see an error in development builds and nothing will happen in production builds. You can only navigate to routes that have been defined in your navigator.

:::

## Navigate to a screen multiple times

So we now have a stack with two routes: the `Home` route and the `Details` route. What would happen if we navigated to the `Details` route again from the `Details` screen?

```js name="Navigate to a screen multiple times" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
    </View>
  );
}

// codeblock-focus-start
function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      // highlight-start
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details... again
      </Button>
      // highlight-end
    </View>
  );
}
// codeblock-focus-end

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

If you run this code, you'll notice that when you tap "Go to Details... again", it doesn't do anything! This is because we are already on the Details route. The `navigate` function roughly means "go to this screen", and if you are already on that screen then it makes sense that it would do nothing.

Let's suppose that we actually _want_ to add another details screen. This is pretty common in cases where you pass in some unique data to each route (more on that later when we talk about `params`!). To do this, we can change `navigate` to `push`. This allows us to express the intent to add another route regardless of the existing navigation history.

```js name="Navigate to a screen multiple times" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      // codeblock-focus-start
      <Button onPress={() => navigation.push('Details')}>
        Go to Details... again
      </Button>
      // codeblock-focus-end
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

export default function App() {
  return <Navigation />;
}
```

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/stack/stack-push.mp4" />
</video>

Each time you call `push` we add a new route to the navigation stack. When you call `navigate` it only pushes a new route if you're not already on that route.

## Going back

The header provided by the native stack navigator will automatically include a back button when it is possible to go back from the active screen (if there is only one screen in the navigation stack, there is nothing that you can go back to, and so there is no back button).

Sometimes you'll want to be able to programmatically trigger this behavior, and for that, you can use `navigation.goBack()`.

```js name="Going back" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
    </View>
  );
}

// codeblock-focus-start
function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button onPress={() => navigation.push('Details')}>
        Go to Details... again
      </Button>
      // highlight-start
      <Button onPress={() => navigation.goBack()}>Go back</Button>
      // highlight-end
    </View>
  );
}
// codeblock-focus-end

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/stack/back-home.mp4" />
</video>

:::note

On Android, React Navigation hooks into the hardware back button and automatically calls `goBack()` when the user presses it, so it behaves as expected.

:::

Sometimes you need to go back _multiple_ screens at once. For example, if you're several screens deep in a stack and want to go back to the first screen. You have two options:

- `navigation.popTo('Home')` - Go back to a specific screen (in this case, Home)
- `navigation.popToTop()` - Go back to the first screen in the stack

```js name="Going back to specific screen" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
    </View>
  );
}

// codeblock-focus-start
function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button onPress={() => navigation.push('Details')}>
        Go to Details... again
      </Button>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
      // highlight-start
      <Button onPress={() => navigation.popTo('Home')}>Go to Home</Button>
      <Button onPress={() => navigation.popToTop()}>
        Go back to first screen in stack
      </Button>
      // highlight-end
    </View>
  );
}
// codeblock-focus-end

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/stack/pop-to-top.mp4" />
</video>

## Summary

- [`Link`](link.md) and [`Button`](elements.md#button) components can be used to navigate between screens declaratively.
- We can use [`useLinkProps`](use-link-props.md) to create our own link components.
- [`navigation.navigate('RouteName')`](navigation-object.md#navigate) pushes a new route to the native stack navigator if you're not already on that route.
- We can call [`navigation.push('RouteName')`](stack-actions.md#push) as many times as we like and it will continue pushing routes.
- The header bar will automatically show a back button, but you can programmatically go back by calling [`navigation.goBack()`](navigation-object.md#goback). On Android, the hardware back button just works as expected.
- You can go back to an existing screen in the stack with [`navigation.popTo('RouteName')`](stack-actions.md#popto), and you can go back to the first screen in the stack with [`navigation.popToTop()`](stack-actions.md#poptotop).
- The [`navigation`](navigation-object.md) object is available to all screen components with the [`useNavigation`](use-navigation.md) hook.
