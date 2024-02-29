---
id: stack-actions
title: StackActions reference
sidebar_label: StackActions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`StackActions` is an object containing methods for generating actions specific to stack-based navigators. Its methods expand upon the actions available in [`CommonActions`](navigation-actions.md).

The following actions are supported:

### replace

The `replace` action allows to replace a route in the [navigation state](navigation-state.md). It takes the following arguments:

- `name` - _string_ - A destination name of the route that has been registered somewhere.
- `params` - _object_ - Params to pass to the destination route.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Stack actions replace" snack version=7 dependencies=@react-navigation/elements
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Push Profile on the stack
      </Button>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.dispatch(
              StackActions.replace('Profile', { user: 'Wojtek' })
            )
          // codeblock-focus-end
        }
      >
        Replace with Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button onPress={() => navigation.dispatch(StackActions.pop(1))}>
        Push same screen on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Pop one screen from stack
      </Button>
      <Button onPress={() => navigation.dispatch(StackActions.popToTop())}>
        Pop to top
      </Button>
    </View>
  );
}

const Stack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Stack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Stack actions replace" snack version=7 dependencies=@react-navigation/elements
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Push Profile on the stack
      </Button>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.dispatch(
              StackActions.replace('Profile', { user: 'Wojtek' })
            )
          // codeblock-focus-end
        }
      >
        Replace with Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button onPress={() => navigation.dispatch(StackActions.pop(1))}>
        Push same screen on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Pop one screen from stack
      </Button>
      <Button onPress={() => navigation.dispatch(StackActions.popToTop())}>
        Pop to top
      </Button>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

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

### push

The `push` action adds a route on top of the stack and navigates forward to it. This differs from `navigate` in that `navigate` will pop back to earlier in the stack if a route of the given name is already present there. `push` will always add on top, so a route can be present multiple times.

- `name` - _string_ - Name of the route to push onto the stack.
- `params` - _object_ - Screen params to pass to the destination route.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Stack actions push" snack version=7 dependencies=@react-navigation/elements
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.dispatch(
              StackActions.push('Profile', { user: 'Wojtek' })
            )
          // codeblock-focus-end
        }
      >
        Push Profile on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(
            StackActions.replace('Profile', { user: 'Wojtek' })
          )
        }
      >
        Replace with Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button onPress={() => navigation.dispatch(StackActions.pop(1))}>
        Push same screen on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Pop one screen from stack
      </Button>
      <Button onPress={() => navigation.dispatch(StackActions.popToTop())}>
        Pop to top
      </Button>
    </View>
  );
}

const Stack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Stack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Stack actions push" snack version=7 dependencies=@react-navigation/elements
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.dispatch(
              StackActions.push('Profile', { user: 'Wojtek' })
            )
          // codeblock-focus-end
        }
      >
        Push Profile on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(
            StackActions.replace('Profile', { user: 'Wojtek' })
          )
        }
      >
        Replace with Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button onPress={() => navigation.dispatch(StackActions.pop(1))}>
        Push same screen on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Pop one screen from stack
      </Button>
      <Button onPress={() => navigation.dispatch(StackActions.popToTop())}>
        Pop to top
      </Button>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

### pop

The `pop` action takes you back to a previous screen in the stack. It takes one optional argument (`count`), which allows you to specify how many screens to pop back by.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Stack actions pop" snack version=7 dependencies=@react-navigation/elements
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Push Profile on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(
            StackActions.replace('Profile', { user: 'Wojtek' })
          )
        }
      >
        Replace with Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.dispatch(StackActions.pop(1))
          // codeblock-focus-end
        }
      >
        Push same screen on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Pop one screen from stack
      </Button>
      <Button onPress={() => navigation.dispatch(StackActions.popToTop())}>
        Pop to top
      </Button>
    </View>
  );
}

const Stack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Stack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Stack actions pop" snack version=7 dependencies=@react-navigation/elements
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Push Profile on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(
            StackActions.replace('Profile', { user: 'Wojtek' })
          )
        }
      >
        Replace with Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.dispatch(StackActions.pop(1))
          // codeblock-focus-end
        }
      >
        Push same screen on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Pop one screen from stack
      </Button>
      <Button onPress={() => navigation.dispatch(StackActions.popToTop())}>
        Pop to top
      </Button>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

### popTo

The `popTo` action takes you back to a previous screen in the stack by the name. It also allows you to pass params to the route.

If a matching screen is not found in the stack, this will pop the current screen and add a new screen with the specified name and params. This behavior is useful when the screen was opened from a deep link etc. and a previous screen with the name may or may not already be in the stack.

The method accepts the following arguments:

- `name` - _string_ - Name of the route to navigate to.
- `params` - _object_ - Screen params to pass to the destination route.

If a matching screen is not found in the stack, this will pop the current screen and add a new screen with the specified name and params. This behavior is useful when the screen was opened from a deep link and a previous screen with the name may or may not already be in the stack.

```js
import { StackActions } from '@react-navigation/native';

const popToAction = StackActions.popTo('Profile', { user: 'jane' });

navigation.dispatch(popToAction);
```

### popToTop

The `popToTop` action takes you back to the first screen in the stack, dismissing all the others. It's functionally identical to `StackActions.pop({n: currentIndex})`.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Stack actions popToTop" snack version=7 dependencies=@react-navigation/elements
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Push Profile on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(
            StackActions.replace('Profile', { user: 'Wojtek' })
          )
        }
      >
        Replace with Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button onPress={() => navigation.dispatch(StackActions.pop(1))}>
        Push same screen on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Pop one screen from stack
      </Button>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.dispatch(StackActions.popToTop())
          // codeblock-focus-end
        }
      >
        Pop to top
      </Button>
    </View>
  );
}

const Stack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Stack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Stack actions pop" snack version=7 dependencies=@react-navigation/elements
import * as React from 'react';
import { Button } from '@react-navigation/elements';
import { View, Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Push Profile on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(
            StackActions.replace('Profile', { user: 'Wojtek' })
          )
        }
      >
        Replace with Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button onPress={() => navigation.dispatch(StackActions.pop(1))}>
        Push same screen on the stack
      </Button>
      <Button
        onPress={() =>
          navigation.dispatch(StackActions.push('Profile', { user: 'Wojtek' }))
        }
      >
        Pop one screen from stack
      </Button>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.dispatch(StackActions.popToTop())
          // codeblock-focus-end
        }
      >
        Pop to top
      </Button>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>
