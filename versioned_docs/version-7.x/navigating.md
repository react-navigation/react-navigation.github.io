---
id: navigating
title: Moving between screens
sidebar_label: Moving between screens
---

In the previous section, we defined a stack navigator with two routes (`Home` and `Details`), but we didn't learn how to let a user navigate from `Home` to `Details` (although we did learn how to change the _initial_ route in our code, but forcing our users to clone our repository and change the route in our code in order to see another screen is arguably among the worst user experiences one could imagine).

If this was a web browser, we'd be able to write something like this:

```js
<a href="details.html">Go to Details</a>
```

Another way to write this would be:

```js
<a
  onClick={() => {
    window.location.href = 'details.html';
  }}
>
  Go to Details
</a>
```

We'll do something similar to the latter, but rather than using a `window.location` global, we'll use the `navigation` object that's accessible in our screen components.

## Navigating to a new screen

```js name="Navigating to a new screen" snack version=7
// codeblock-focus-start
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
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

Let's break this down:

- `navigation` - the `navigation` object is returned from the [`useNavigation`](use-navigation.md) hook (more about this later in ["The navigation object in depth"](navigation-object.md)).
- `navigate('Details')` - we call the `navigate` function (on the `navigation` object &mdash; naming is hard!) with the name of the route that we'd like to move the user to.

:::note

If we call `navigation.navigate` with a route name that we haven't defined in a navigator, it'll print an error in development builds and nothing will happen in production builds. Said another way, we can only navigate to routes that have been defined on our navigator &mdash; we cannot navigate to an arbitrary component.

:::

So we now have a stack with two routes: 1) the `Home` route 2) the `Details` route. What would happen if we navigated to the `Details` route again, from the `Details` screen?

## Navigate to a screen multiple times

```js name="Navigate to a screen multiple times" snack version=7
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

// codeblock-focus-start
function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.navigate('Details')}
      />
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

```js name="Navigate to a screen multiple times" snack version=7
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      // codeblock-focus-start
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
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

<div style={{ display: 'flex', margin: '16px 0' }}>
  <video playsInline autoPlay muted loop>
    <source src="/assets/navigators/stack/stack-push.mov" />
  </video>
</div>

Each time you call `push` we add a new route to the navigation stack. When you call `navigate` it first tries to find an existing route with that name, and only pushes a new route if there isn't yet one on the stack.

## Going back

The header provided by the native stack navigator will automatically include a back button when it is possible to go back from the active screen (if there is only one screen in the navigation stack, there is nothing that you can go back to, and so there is no back button).

Sometimes you'll want to be able to programmatically trigger this behavior, and for that, you can use `navigation.goBack()`.

```js name="Going back" snack version=7
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

// codeblock-focus-start
function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      // highlight-start
      <Button title="Go back" onPress={() => navigation.goBack()} />
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

:::note

On Android, React Navigation hooks in to the hardware back button and fires the `goBack()` function for you when the user presses it, so it behaves as the user would expect.

:::

Another common requirement is to be able to go back _multiple_ screens -- for example, if you are several screens deep in a stack and want to dismiss all of them to go back to the first screen. In this case, we know that we want to go back to `Home` so we can use `popTo('Home')`. Another alternative would be `navigation.popToTop()`, which goes back to the first screen in the stack.

```js name="Going back to specific screen" snack version=7
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

// codeblock-focus-start
function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      // highlight-start
      <Button title="Go to Home" onPress={() => navigation.popTo('Home')} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
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

## Summary

- `navigation.navigate('RouteName')` pushes a new route to the native stack navigator if it's not already in the stack, otherwise it jumps to that screen.
- We can call `navigation.push('RouteName')` as many times as we like and it will continue pushing routes.
- The header bar will automatically show a back button, but you can programmatically go back by calling `navigation.goBack()`. On Android, the hardware back button just works as expected.
- You can go back to an existing screen in the stack with `navigation.popTo('RouteName')`, and you can go back to the first screen in the stack with `navigation.popToTop()`.
- The `navigation` object is available to all screen components with the [`useNavigation`](use-navigation.md) hook.
