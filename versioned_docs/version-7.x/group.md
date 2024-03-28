---
id: group
title: Group
sidebar_label: Group
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A group contains several [screens](screen.md) inside a navigator.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

Groups can be defined using the `groups` property in the navigator configuration:

```js name="Stack groups" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Search')}>
        Go to Search
      </Button>
    </View>
  );
}

function EmptyScreen() {
  return <View />;
}

// codeblock-focus-start
const Stack = createNativeStackNavigator({
  groups: {
    App: {
      screenOptions: {
        headerStyle: {
          backgroundColor: '#FFB6C1',
        },
      },
      screens: {
        Home: HomeScreen,
        Profile: EmptyScreen,
      },
    },
    Modal: {
      screenOptions: {
        presentation: 'modal',
      },
      screens: {
        Search: EmptyScreen,
        Share: EmptyScreen,
      },
    },
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(Stack);

export default function App() {
  return <Navigation />;
}
```

The keys of the `groups` object (e.g. `Guest`, `User`) are used as the [`navigationKey`](#navigation-key) for the group. You can use any string as the key.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

A `Group` component is returned from a `createXNavigator` function. After creating the navigator, it can be used as children of the `Navigator` component:

```js name="Stack groups" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Search')}>
        Go to Search
      </Button>
    </View>
  );
}

function EmptyScreen() {
  return <View />;
}

export default function App() {
  return (
    <NavigationContainer>
      // codeblock-focus-start
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={EmptyScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Search" component={EmptyScreen} />
          <Stack.Screen name="Share" component={EmptyScreen} />
        </Stack.Group>
      </Stack.Navigator>
      // codeblock-focus-end
    </NavigationContainer>
  );
}
```

It's also possible to nest `Group` components inside other `Group` components.

</TabItem>
</Tabs>

## Configuration

### Screen options

Options to configure how the screens inside the group get presented in the navigator. It accepts either an object or a function returning an object:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  groups: {
    Modal: {
      screenOptions: {
        presentation: 'modal',
      },
      screens: {
        /* screens */
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Group
  screenOptions={{
    presentation: 'modal',
  }}
>
  {/* screens */}
</Stack.Group>
```

</TabItem>
</Tabs>

When you pass a function, it'll receive the [`route`](route-object.md) and [`navigation`](navigation-object.md):

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  groups: {
    Modal: {
      screenOptions: ({ route, navigation }) => ({
        title: route.params.title,
      }),
      screens: {
        /* screens */
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Group
  screenOptions={({ route, navigation }) => ({
    title: route.params.title,
  })}
>
  {/* screens */}
</Stack.Group>
```

</TabItem>
</Tabs>

These options are merged with the `options` specified in the individual screens, and the screen's options will take precedence over the group's options.

See [Options for screens](screen-options.md) for more details and examples.

### Navigation key

Optional key for a group of screens. If the key changes, all existing screens in this group will be removed (if used in a stack navigator) or reset (if used in a tab or drawer navigator):

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

The name of the group is used as the `navigationKey`:

```js
const Stack = createNativeStackNavigator({
  groups: {
    User: {
      screens: {
        /* screens */
      },
    },
    Guest: {
      screens: {
        /* screens */
      },
    },
  },
});
```

This means if a screen is defined in 2 groups and the groups use the [`if`](static-configuration.md#if) property, the screen will remount if the condition changes resulting in one group being removed and the other group being used.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Group navigationKey={isSignedIn ? 'user' : 'guest'}>
  {/* screens */}
</Stack.Group>
```

</TabItem>
</Tabs>

This is similar to the [`navigationKey`](screen.md#navigation-key) prop for screens, but applies to a group of screens.
