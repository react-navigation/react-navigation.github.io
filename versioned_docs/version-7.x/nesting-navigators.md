---
id: nesting-navigators
title: Nesting navigators
sidebar_label: Nesting navigators
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Nesting navigators means rendering a navigator inside a screen of another navigator, for example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Nested navigators" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function MessagesScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const HomeTabs = createBottomTabNavigator({
  screens: {
    Feed: FeedScreen,
    Messages: MessagesScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      // highlight-next-line
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
    Profile: ProfileScreen,
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

```js name="Nested navigators" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function MessagesScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// codeblock-focus-start
function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        // highlight-next-line
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
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

</TabItem>
</Tabs>

In the above example, `HomeTabs` contains a tab navigator. It is also used for the `Home` screen in your stack navigator in `RootStack`. So here, a tab navigator is nested inside a stack navigator:

- `RootStack` (Stack navigator)
  - `HomeTabs` (Tab navigator)
    - `Feed` (screen)
    - `Messages` (screen)
  - `Profile` (screen)

Nesting navigators work very much like nesting regular components. To achieve the behavior you want, it's often necessary to nest multiple navigators.

## How nesting navigators affects the behaviour

When nesting navigators, there are some things to keep in mind:

### Each navigator keeps its own navigation history

For example, when you press the back button when inside a screen in a nested stack navigator, it'll go back to the previous screen inside the nested stack even if there's another navigator as the parent.

### Each navigator has its own options

For example, specifying a `title` option in a screen nested in a child navigator won't affect the title shown in a parent navigator.

If you want to achieve this behavior, see the guide for [screen options with nested navigators](screen-options-resolution.md#setting-parent-screen-options-based-on-child-navigators-state). this could be useful if you are rendering a tab navigator inside a stack navigator and want to show the title of the active screen inside the tab navigator in the header of the stack navigator.

### Each screen in a navigator has its own params

For example, any `params` passed to a screen in a nested navigator are in the `route` object of that screen and aren't accessible from a screen in a parent or child navigator.

If you need to access params of the parent screen from a child screen, you can use [React Context](https://reactjs.org/docs/context.html) to expose params to children.

### Navigation actions are handled by current navigator and bubble up if couldn't be handled

For example, if you're calling `navigation.goBack()` in a nested screen, it'll only go back in the parent navigator if you're already on the first screen of the navigator. Other actions such as `navigate` work similarly, i.e. navigation will happen in the nested navigator and if the nested navigator couldn't handle it, then the parent navigator will try to handle it. In the above example, when calling `navigate('Messages')`, inside `Feed` screen, the nested tab navigator will handle it, but if you call `navigate('Settings')`, the parent stack navigator will handle it.

### Navigator specific methods are available in the navigators nested inside

For example, if you have a stack inside a drawer navigator, the drawer's `openDrawer`, `closeDrawer`, `toggleDrawer` methods etc. will also be available on the `navigation` object in the screens inside the stack navigator. But say you have a stack navigator as the parent of the drawer, then the screens inside the stack navigator won't have access to these methods, because they aren't nested inside the drawer.

Similarly, if you have a tab navigator inside stack navigator, the screens in the tab navigator will get the `push` and `replace` methods for stack in their `navigation` object.

If you need to dispatch actions to the nested child navigators from a parent, you can use [`navigation.dispatch`](navigation-object.md#dispatch):

```js
navigation.dispatch(DrawerActions.toggleDrawer());
```

### Nested navigators don't receive parent's events

For example, if you have a stack navigator nested inside a tab navigator, the screens in the stack navigator won't receive the events emitted by the parent tab navigator such as (`tabPress`) when using `navigation.addListener`.

To receive events from the parent navigator, you can explicitly listen to parent's events with [`navigation.getParent`](navigation-object.md#getparent):

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Events from parent" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button
        title="Go to Messages"
        onPress={() => navigation.navigate('Messages')}
      />
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    // codeblock-focus-start
    const unsubscribe = navigation
      .getParent('MyTabs')
      .addListener('tabPress', (e) => {
        // Do something
        alert('Tab pressed!');
      });
    // codeblock-focus-end

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
    </View>
  );
}

const HomeStack = createNativeStackNavigator({
  screens: {
    Feed: FeedScreen,
    Messages: MessagesScreen,
  },
});

const RootTabs = createBottomTabNavigator({
  id: 'MyTabs',
  screens: {
    Home: {
      screen: HomeStack,
      options: {
        headerShown: false,
      },
    },
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Events from parent" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button
        title="Go to Messages"
        onPress={() => navigation.navigate('Messages')}
      />
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    // codeblock-focus-start
    const unsubscribe = navigation
      .getParent('MyTabs')
      .addListener('tabPress', (e) => {
        // Do something
        alert('Tab pressed!');
      });
    // codeblock-focus-end

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
    </Stack.Navigator>
  );
}

function RootTabs() {
  return (
    <Tab.Navigator id="MyTabs">
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootTabs />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

Here `'MyTabs'` refers to the value you pass in the `id` of the parent tab navigator whose event you want to listen to.

### Parent navigator's UI is rendered on top of child navigator

For example, when you nest a stack navigator inside a drawer navigator, you'll see that the drawer appears above the stack navigator's header. However, if you nest the drawer navigator inside a stack, the drawer will appear below the header of the stack. This is an important point to consider when deciding how to nest your navigators.

In your app, you will probably use these patterns depending on the behavior you want:

- Tab navigator nested inside the initial screen of stack navigator - New screens cover the tab bar when you push them.
- Drawer navigator nested inside the initial screen of stack navigator with the initial screen's stack header hidden - The drawer can only be opened from the first screen of the stack.
- Stack navigators nested inside each screen of drawer navigator - The drawer appears over the header from the stack.
- Stack navigators nested inside each screen of tab navigator - The tab bar is always visible. Usually pressing the tab again also pops the stack to top.

## Navigating to a screen in a nested navigator

Consider the following example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Navigating to nested screen" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to More" onPress={() => navigation.navigate('More')} />
      <Button
        title="Go to Messages"
        onPress={() => navigation.navigate('More', { screen: 'Messages' })}
      />
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

// codeblock-focus-start
const MoreTabs = createBottomTabNavigator({
  screens: {
    Feed: FeedScreen,
    Messages: MessagesScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    More: {
      screen: MoreTabs,
      options: {
        headerShown: false,
      },
    },
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

```js name="Navigating to nested screen" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to More" onPress={() => navigation.navigate('More')} />
      <Button
        title="Go to Messages"
        onPress={() => navigation.navigate('More', { screen: 'Messages' })}
      />
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// codeblock-focus-start
function MoreTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="More"
        component={MoreTabs}
        options={{ headerShown: false }}
      />
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

</TabItem>
</Tabs>

Here, you might want to navigate to the `More` screen (which contains `MoreTabs`) from your `HomeScreen` component:

```js
navigation.navigate('More');
```

It works, and the initial screen inside the `MoreTabs` component is shown, which is `Feed`. But sometimes you may want to control the screen that should be shown upon navigation. To achieve it, you can pass the name of the screen in params:

```js
navigation.navigate('More', { screen: 'Messages' });
```

Now, the `Messages` screen will be rendered instead of `Feed` upon navigation.

### Passing params to a screen in a nested navigator

You can also pass params by specifying a `params` key:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Navigating to nested screen" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Messages"
        onPress={
          () =>
            // codeblock-focus-start
            navigation.navigate('More', {
              screen: 'Messages',
              params: { user: 'jane' },
            })
          // codeblock-focus-end
        }
      />
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function MessagesScreen({ route }) {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
      <Text>User: {route.params.user}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const MoreTabs = createBottomTabNavigator({
  screens: {
    Feed: FeedScreen,
    Messages: MessagesScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    More: {
      screen: MoreTabs,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Navigating to nested screen" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Messages"
        onPress={
          () =>
            // codeblock-focus-start
            navigation.navigate('More', {
              screen: 'Messages',
              params: { user: 'jane' },
            })
          // codeblock-focus-end
        }
      />
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function MessagesScreen({ route }) {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
      <Text>User: {route.params.user}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MoreTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="More"
        component={MoreTabs}
        options={{ headerShown: false }}
      />
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

If the navigator was already rendered, navigating to another screen will push a new screen in case of stack navigator.

You can follow a similar approach for deeply nested screens. Note that the second argument to `navigate` here is just `params`, so you can do something like:

```js
navigation.navigate('Home', {
  screen: 'Settings',
  params: {
    screen: 'Sound',
    params: {
      screen: 'Media',
    },
  },
});
```

In the above case, you're navigating to the `Media` screen, which is in a navigator nested inside the `Sound` screen, which is in a navigator nested inside the `Settings` screen.

### Rendering initial route defined in the navigator

By default, when you navigate a screen in the nested navigator, the specified screen is used as the initial screen and the `initialRouteName` prop on the navigator is ignored.

If you need to render the initial route specified in the navigator, you can disable the behaviour of using the specified screen as the initial screen by setting `initial: false`:

```js
navigation.navigate('Root', {
  screen: 'Settings',
  initial: false,
});
```

This affects what happens when pressing the back button. When there's an initial screen, the back button will take the user there.

## Avoiding multiple headers when nesting

When nesting multiple stack, drawer or bottom tab navigators, headers from both child and parent navigators would be shown. However, usually it's more desirable to show the header in the child navigator and hide the header in the screen of the parent navigator.

To achieve this, you can hide the header in the screen containing the navigator using the `headerShown: false` option.

For example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Nested navigators" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function MessagesScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const HomeTabs = createBottomTabNavigator({
  screens: {
    Feed: FeedScreen,
    Messages: MessagesScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeTabs,
      options: {
        // highlight-next-line
        headerShown: false,
      },
    },
    Profile: ProfileScreen,
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

```js name="Nested navigators" snack version=7
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function MessagesScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// codeblock-focus-start
function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeTabs}
        options={{
          // highlight-next-line
          headerShown: false,
        }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
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

</TabItem>
</Tabs>

In these examples, we have used a bottom tab navigator directly nested inside another stack navigator, but the same principle applies when there are other navigators in the middle, for example: stack navigator inside a tab navigator which is inside another stack navigator, stack navigator inside drawer navigator etc.

If you don't want headers in any of the navigators, you can specify `headerShown: false` in all of the navigators:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const HomeTabs = createBottomTabNavigator({
  // highlight-start
  screenOptions: {
    headerShown: false,
  },
  // highlight-end
  screens: {
    Feed: FeedScreen,
    Messages: MessagesScreen,
  },
});

const RootStack = createStackNavigator({
  // highlight-start
  screenOptions: {
    headerShown: false,
  },
  // highlight-end
  screens: {
    Home: HomeTabs,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
function HomeTabs() {
  return (
    <Tab.Navigator
      // highlight-start
      screenOptions={{
        headerShown: false,
      }}
      // highlight-end
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator
      // highlight-start
      screenOptions={{
        headerShown: false,
      }}
      // highlight-end
    >
      <Stack.Screen name="Home" component={HomeTabs} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

## Best practices when nesting

We recommend to reduce nesting navigators to minimal. Try to achieve the behavior you want with as little nesting as possible. Nesting has many downsides:

- It results in deeply nested view hierarchy which can cause memory and performance issues in lower end devices
- Nesting same type of navigators (e.g. tabs inside tabs, drawer inside drawer etc.) might lead to a confusing UX
- With excessive nesting, code becomes difficult to follow when navigating to nested screens, configuring deep link etc.

Think of nesting navigators as a way to achieve the UI you want rather than a way to organize your code. If you want to create separate group of screens for organization, instead of using separate navigators, you can use the [`Group`](group.md) component for dynamic configuration or [`groups` property](static-configuration.md#groups) for static configuration.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createStackNavigator({
  screens: {
    // Common screens
  },
  groups: {
    // Common modal screens
    Modal: {
      screenOptions: {
        presentation: 'modal',
      },
      screens: {
        Help,
        Invite,
      },
    },
    // Screens for logged in users
    User: {
      if: useIsLoggedIn,
      screens: {
        Home,
        Profile,
      },
    },
    // Auth screens
    Guest: {
      if: useIsGuest,
      screens: {
        SignIn,
        SignUp,
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Navigator>
  {isLoggedIn ? (
    // Screens for logged in users
    <Stack.Group>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Group>
  ) : (
    // Auth screens
    <Stack.Group screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Group>
  )}
  {/* Common modal screens */}
  <Stack.Group screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen name="Help" component={Help} />
    <Stack.Screen name="Invite" component={Invite} />
  </Stack.Group>
</Stack.Navigator>
```

</TabItem>
</Tabs>
