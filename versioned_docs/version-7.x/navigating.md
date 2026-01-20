---
id: navigating
title: Moving between screens
sidebar_label: Moving between screens
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In the previous section, we defined a stack navigator with two routes (`Home` and `Details`), but we didn't learn how to let a user navigate from `Home` to `Details`.

If this was a web browser, we'd be able to write something like this:

```js
<a href="details.html">Go to Details</a>
```

Or programmatically in JavaScript:

```js
window.location.href = 'details.html';
```

So how do we do this in React Navigation? There are two main ways to navigate between screens in React Navigation:

## Using `Link` or `Button` components

The simplest way to navigate is using the [`Link`](link.md) component from `@react-navigation/native` or the [`Button`](elements.md#button) component from `@react-navigation/elements`:

```js name="Navigation with Link and Button" snack static2dynamic
// codeblock-focus-start
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

The `Link` and `Button` components accept a `screen` prop specifying where to navigate when pressed. [On the web](web-support.md), they render as anchor tags (`<a>`) with proper `href` attributes.

:::note

The built-in `Link` and `Button` components have their own styling. To create custom link or button components matching your app's design, see the [`useLinkProps`](use-link-props.md) hook.

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

The [`useNavigation`](use-navigation.md) hook returns the navigation object. We can call `navigate` with the route name we want to go to.

:::note

Calling `navigation.navigate` with an incorrect route name shows an error in development and does nothing in production.

:::

## Navigate to a screen multiple times

What happens if we navigate to `Details` again while already on the `Details` screen?

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

Tapping "Go to Details... again" does nothing because we're already on that route. The `navigate` function means "go to this screen" - if you're already there, it does nothing.

Let's say we actually _want_ to add another Details screen. This is common when you pass unique data to each route (more on that when we talk about `params`!). To do this, use `push` instead of `navigate`. This adds another route regardless of the existing navigation history:

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

Each `push` call adds a new route to the stack, while `navigate` only pushes if you're not already on that route.

## Going back

The native stack navigator's header automatically shows a back button when there's a screen to go back to.

You can use `navigation.goBack()` to trigger going back programmatically from your own buttons:

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

On Android, React Navigation calls `goBack()` automatically on hardware back button press or back gesture.

:::

Sometimes you need to go back multiple screens at once. For example, if you're several screens deep in a stack and want to go back to the first screen. You have two options:

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
