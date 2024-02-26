---
id: group
title: Group
sidebar_label: Group
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`Group` components are used to group several [screens](screen.md) inside a navigator.

A `Group` is returned from a `createXNavigator` function:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createStackNavigator({
  screens: {
    /* content */
  },
  groups: {
    /* content */
  },
}); // Stack contains Screen & Navigator properties
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js
const Stack = createStackNavigator(); // Stack contains Screen & Navigator properties
```

</TabItem>
</Tabs>

After creating the navigator, it can be used as children of the `Navigator` component:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Stack groups" snack version=7 dependencies=@react-navigation/elements
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
  screens: {},
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

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Stack groups" snack version=7 dependencies=@react-navigation/elements
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
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

</TabItem>
</Tabs>

It's also possible to nest `Group` components inside other `Group` components.

## Props

### `screenOptions`

Options to configure how the screens inside the group get presented in the navigator. It accepts either an object or a function returning an object:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {},
  groups: {
    screenOptions: {
      presentation: 'modal',
    },
    screens: {
      /* screens */
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

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
  screens: {},
  groups: {
    screenOptions: ({ route, navigation }) => ({
      title: route.params.title,
    }),
    screens: {
      /* screens */
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

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

### `navigationKey`

Optional key for a group of screens screen. If the key changes, all existing screens in this group will be removed (if used in a stack navigator) or reset (if used in a tab or drawer navigator):
<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {},
  groups: {
    navigationKey: isSignedIn ? 'user' : 'guest',
    screens: {
      /* screens */
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js
<Stack.Group navigationKey={isSignedIn ? 'user' : 'guest'}>
  {/* screens */}
</Stack.Group>
```

</TabItem>
</Tabs>

This is similar to the [`navigationKey`](screen.md#navigationkey) prop on `Screen`, but applies to a group of screens.
