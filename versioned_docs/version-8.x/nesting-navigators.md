---
id: nesting-navigators
title: Nesting navigators
sidebar_label: Nesting navigators
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Nesting navigators means rendering a navigator inside a screen of another navigator, for example:

```js name="Nested navigators" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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
    Feed: createBottomTabScreen({
      screen: FeedScreen,
    }),
    Messages: createBottomTabScreen({
      screen: MessagesScreen,
    }),
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      // highlight-next-line
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    }),
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

In this example, a tab navigator (`HomeTabs`) is nested inside a stack navigator (`RootStack`) under the `Home` screen. The structure looks like this:

- `RootStack` (Stack navigator)
  - `HomeTabs` (Tab navigator)
    - `Feed` (screen)
    - `Messages` (screen)
  - `Profile` (screen)

Nesting navigators works much like nesting regular components. To achieve the behavior you want, it's often necessary to nest multiple navigators.

## How nesting navigators affects the behaviour

When nesting navigators, there are some things to keep in mind:

### Each navigator keeps its own navigation history

Lets say you have a stack navigator (lets call it `StackA`) nested within another navigator (lets call it `NavigatorB`). When you press the back button in a screen inside `StackA`, it will go to the previous screen of the closest ancestor navigator of the screen - i.e. `StackA`.

If the current screen is the first screen in `StackA`, then pressing back will go to the previous screen in `NavigatorB`.

### Each navigator has its own options

Specifying a `title` option in a screen nested in a child navigator won't affect the title shown in a parent navigator.

If you want to achieve this behavior, see the guide for [screen options with nested navigators](screen-options-resolution.md#setting-parent-screen-options-based-on-child-navigators-state). this could be useful if you are rendering a tab navigator inside a stack navigator and want to show the title of the active screen inside the tab navigator in the header of the stack navigator.

### Each screen in a navigator has its own params

Any `params` passed to a screen in a nested navigator are in the `route` object of that screen and aren't accessible from a screen in a parent or child navigator.

If you need to access params of the parent screen from a child screen, you can use [React Context](https://react.dev/reference/react/useContext) to expose params to children.

### Navigation actions bubble up

Actions like `navigate` and `goBack` are handled by the current navigator first. If it can't handle the action, the parent navigator tries. For example, calling `navigate('Messages')` from `Feed` is handled by the tab navigator, but `navigate('Settings')` bubbles up to the parent stack.

### Navigator-specific methods are available in child navigators

If you have a stack inside a drawer navigator, the drawer's `openDrawer`, `closeDrawer`, `toggleDrawer` methods etc. will also be available on the `navigation` object in the screens inside the stack navigator. But say you have a stack navigator as the parent of the drawer, then the screens inside the stack navigator won't have access to these methods, because they aren't nested inside the drawer.

Similarly, if you have a tab navigator inside stack navigator, the screens in the tab navigator will get the `push` and `replace` methods for stack in their `navigation` object.

### Nested navigators don't receive parent's events

Screens in a nested navigator won't receive the events emitted by the parent tab navigator such as `tabPress` when using `navigation.addListener`. We can get the parent navigation object with [`navigation.getParent`](navigation-object.md#getparent) to listen to parent events:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Events from parent" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.navigate('Messages')}>
        Go to Messages
      </Button>
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation('Messages');

  React.useEffect(() => {
    // codeblock-focus-start
    const unsubscribe = navigation
      .getParent('Home')
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

```js name="Events from parent" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.navigate('Messages')}>
        Go to Messages
      </Button>
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation('Messages');

  React.useEffect(() => {
    // codeblock-focus-start
    const unsubscribe = navigation
      .getParent('Home')
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
    <Tab.Navigator>
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

Here `'Home'` refers to the name of the parent screen that contains the tab navigator whose event you want to listen to.

### Parent navigator's UI is rendered on top of child navigator

When you nest a stack navigator inside a drawer navigator, you'll see that the drawer appears above the stack navigator's header. However, if you nest the drawer navigator inside a stack, the drawer will appear below the header of the stack. This is an important point to consider when deciding how to nest your navigators.

In your app, you'd use these patterns depending on the behavior you want:

- **Tabs inside the first screen of stack**: New screens pushed to the stack cover the tab bar
- **Drawer inside the first screen of stack**: Drawer only opens from first screen
- **Stack inside each screen of drawer**: Drawer appears over the stack's header
- **Stack inside each screen of tabs**: Tab bar is always visible, pressing tab again when a stack is focused pops stack to top

## Navigating to a screen in a nested navigator

Consider this example where you want to navigate to the `Messages` screen in `MoreTabs` from your `HomeScreen`:

```js name="Navigating to nested screen" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('More')}>Go to More</Button>
      <Button
        onPress={() => navigation.navigate('More', { screen: 'Messages' })}
      >
        Go to Messages
      </Button>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation('Messages');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
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

Here, you might want to navigate to the `More` screen (which contains `MoreTabs`) from your `HomeScreen` component:

```js
navigation.navigate('More');
```

It works, and the initial screen inside the `MoreTabs` component is shown, which is `Feed`. But sometimes you may want to control the screen that should be shown upon navigation. To achieve it, you can pass the name of the screen in params:

```js
navigation.navigate('More', { screen: 'Messages' });
```

This navigates to `More` and shows `Messages` instead of the initial screen.

### Passing params to a screen in a nested navigator

You can also pass params by specifying a `params` key:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Navigating to nested screen" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.navigate('More', {
              screen: 'Messages',
              params: { user: 'jane' },
            })
          // codeblock-focus-end
        }
      >
        Go to Messages
      </Button>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

function MessagesScreen({ route }) {
  const navigation = useNavigation('Messages');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
      <Text>User: {route.params.user}</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
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

```js name="Navigating to nested screen" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.navigate('More', {
              screen: 'Messages',
              params: { user: 'jane' },
            })
          // codeblock-focus-end
        }
      >
        Go to Messages
      </Button>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

function MessagesScreen({ route }) {
  const navigation = useNavigation('Messages');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
      <Text>User: {route.params.user}</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
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

If the navigator was already rendered, navigating to another screen will push a new screen in case of a stack navigator.

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

:::warning

The `screen`, `params`, `initial`, and `state` param names are reserved and managed by React Navigation. Accessing `route.params.screen` etc. in the parent screens may lead to unexpected behavior.

:::

### Rendering initial route defined in the navigator

By default, when you navigate to specific a screen in the nested navigator, the specified screen is used as the initial screen and the `initialRouteName` prop on the navigator is ignored.

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

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Nested navigators" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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

```js name="Nested navigators" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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

These examples use a bottom tab navigator directly nested inside another stack navigator, but the same principle applies when there are other navigators in between - for example, a stack inside a tab navigator inside another stack, or a stack inside a drawer navigator.

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

We recommend keeping navigator nesting to a minimum. Try to achieve the behavior you want with as little nesting as possible.

- It results in deeply nested view hierarchy which can cause memory and performance issues in lower end devices
- Nesting the same type of navigator (e.g. tabs inside tabs, drawer inside drawer etc.) might lead to a confusing UX
- With excessive nesting, code becomes difficult to follow when navigating to nested screens, configuring deep link etc.

Think of nesting navigators as a way to achieve the UI you want, not as a way to organize your code. If you want to create separate groups of screens for organization, use the [`Group`](group.md) component for dynamic configuration or [`groups` property](static-configuration.md#groups) for static configuration:

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
