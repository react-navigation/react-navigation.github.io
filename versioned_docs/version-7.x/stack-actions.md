---
id: stack-actions
title: StackActions reference
sidebar_label: StackActions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`StackActions` is an object containing methods for generating actions specific to stack-based navigators. Its methods expand upon the actions available in [`CommonActions`](navigation-actions.md).

For screens inside a [Stack Navigator](stack-navigator.md) or [Native Stack Navigator](native-stack-navigator.md), all stack actions are available as methods on the `navigation` object.

The following actions are supported:

## replace

The `replace` action allows to replace a route in the [navigation state](navigation-state.md). It takes the following arguments:

- `name` - _string_ - A destination name of the route that has been registered somewhere.
- `params` - _object_ - Params to pass to the destination route.

```js name="Stack actions replace" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.replace('Profile', { user: 'Wojtek' });
          // codeblock-focus-end
        }}
      >
        Replace with Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

It can also be used with `navigation.dispatch`:

```js
import { StackActions } from '@react-navigation/native';

navigation.dispatch(StackActions.replace('Profile', { user: 'Wojtek' }));
```

If you want to replace a particular route, you can add a `source` property referring to the route key and `target` property referring to the navigation state key:

```js
import { StackActions } from '@react-navigation/native';

navigation.dispatch({
  ...StackActions.replace('Profile', {
    user: 'jane',
  }),
  source: route.key,
  target: navigation.getState().key,
});
```

If the `source` property is explicitly set to `undefined`, it'll replace the focused route.

## push

The `push` action adds a route on top of the stack and navigates forward to it. This differs from `navigate` in that `navigate` will pop back to earlier in the stack if a route of the given name is already present there. `push` will always add on top, so a route can be present multiple times.

- `name` - _string_ - Name of the route to push onto the stack.
- `params` - _object_ - Screen params to pass to the destination route.

```js name="Stack actions push" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.push('Profile', { user: 'Wojtek' });
          // codeblock-focus-end
        }}
      >
        Push Profile on the stack
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

It can also be used with `navigation.dispatch`:

```js
import { StackActions } from '@react-navigation/native';

navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }));
```

## pop

The `pop` action takes you back to a previous screen in the stack. It takes one optional argument (`count`), which allows you to specify how many screens to pop back by.

```js name="Stack actions pop" snack static2dynamic
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.navigate('Profile');
        }}
      >
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.pop(1);
          // codeblock-focus-end
        }}
      >
        Pop one screen from stack
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

It can also be used with `navigation.dispatch`:

```js
import { StackActions } from '@react-navigation/native';

navigation.dispatch(StackActions.pop(1));
```

## popTo

The `popTo` action takes you back to a previous screen in the stack by the name. It also allows you to pass params to the route.

If a matching screen is not found in the stack, this will pop the current screen and add a new screen with the specified name and params - essentially behaving like a [`replace`](#replace). This ensures that the app doesn't break if a previous screen with the name did not exist - which can happen when the screen was opened from a deep link or push notification, or when used on the web etc.

The method accepts the following arguments:

- `name` - _string_ - Name of the route to navigate to.
- `params` - _object_ - Screen params to pass to the destination route.
- `options` - Options object containing the following properties:
  - `merge` - _boolean_ - Whether params should be merged with the existing route params, or replace them (when navigating to an existing screen). Defaults to `false`.

```js name="Stack actions popTo" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.navigate('Profile', { user: 'Wojtek' });
        }}
      >
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route?.params?.user || 'Guest'}'s profile</Text>
      <Button
        onPress={() => {
          navigation.navigate('Settings');
        }}
      >
        Go to Settings
      </Button>
    </View>
  );
}

function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings!</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.popTo('Profile', { user: 'jane' });
          // codeblock-focus-end
        }}
      >
        Pop to Profile with params
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
    Settings: SettingsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

It can also be used with `navigation.dispatch`:

```js
import { StackActions } from '@react-navigation/native';

navigation.dispatch(StackActions.popTo('Profile', { user: 'jane' }));
```

## popToTop

The `popToTop` action takes you back to the first screen in the stack, dismissing all the others.

```js name="Stack actions popToTop" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.navigate('Profile');
        }}
      >
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.popToTop();
          // codeblock-focus-end
        }}
      >
        Pop to top
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

It can also be used with `navigation.dispatch`:

```js
import { StackActions } from '@react-navigation/native';

navigation.dispatch(StackActions.popToTop());
```
