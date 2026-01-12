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
  const navigation = useNavigation();

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
  const navigation = useNavigation();

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

In this example, a tab navigator (`HomeTabs`) is nested inside a stack navigator (`RootStack`) under the `Home` screen. The structure looks like this:

- `RootStack` (Stack navigator)
  - `HomeTabs` (Tab navigator)
    - `Feed` (screen)
    - `Messages` (screen)
  - `Profile` (screen)

Nesting navigators work like nesting regular components. To achieve the behavior you want, it's often necessary to nest multiple navigators.

## How nesting navigators affects the behaviour

When nesting navigators, there are some things to keep in mind:

### Each navigator keeps its own navigation history

For example, when you press the back button in a screen inside a stack navigator nested within another navigator, it will go to the previous screen of the closest ancestor navigator of the screen. If it's the first screen in the nested stack, pressing back goes to the previous screen in the parent navigator.

### Each navigator has its own options

For example, specifying a `title` option in a screen nested in a child navigator won't affect the title shown in a parent navigator.

If you want to set parent navigator options based on the active screen in a child navigator, see [screen options with nested navigators](screen-options-resolution.md#setting-parent-screen-options-based-on-child-navigators-state).

### Each screen in a navigator has its own params

Any `params` passed to a screen in a nested navigator are in the `route` object of that screen and aren't accessible from a screen in a parent or child navigator.

If you need to access params of the parent screen from a child screen, you can use [React Context](https://react.dev/reference/react/useContext) to expose params to children.

### Navigation actions are handled by current navigator and bubble up if couldn't be handled

Navigation actions first go to the current navigator. If it can't handle them, they bubble up to the parent. For example, calling `goBack()` in a nested screen goes back in the nested navigator first, then the parent if already on the first screen.

### Navigator specific methods are available in the navigators nested inside

If you have a stack inside a drawer navigator, the drawer's `openDrawer`, `closeDrawer`, `toggleDrawer` methods etc. are available on the `navigation` object in the screens inside the stack navigator. Similarly, if you have a tab navigator inside stack navigator, the screens in the tab navigator will get the `push` and `replace` methods for stack in their `navigation` object.

If you need to dispatch actions to the nested child navigators from a parent, you can use [`navigation.dispatch`](navigation-object.md#dispatch):

```js
navigation.dispatch(DrawerActions.toggleDrawer());
```

### Nested navigators don't receive parent's events

Screens in a nested navigator don't receive events from the parent navigator (like `tabPress`). To listen to parent's events, use [`navigation.getParent`](navigation-object.md#getparent):

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
  const navigation = useNavigation();

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
  const navigation = useNavigation();

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

Here `'MyTabs'` is the `id` of the parent navigator whose events you want to listen to.

### Parent navigator's UI is rendered on top of child navigator

The parent navigator's UI renders on top of the child. For example, a drawer nested inside a stack appears below the stack's header, while a stack nested inside a drawer appears below the drawer.

Common patterns:

- Tab navigator nested inside the initial screen of stack navigator - New screens cover the tab bar when you push them.
- Drawer navigator nested inside the initial screen of stack navigator with the initial screen's stack header hidden - The drawer can only be opened from the first screen of the stack.
- Stack navigators nested inside each screen of drawer navigator - The drawer appears over the header from the stack.
- Stack navigators nested inside each screen of tab navigator - The tab bar is always visible. Usually pressing the tab again also pops the stack to top.

## Navigating to a screen in a nested navigator

Consider the following example:

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
  const navigation = useNavigation();

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
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation();

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
  const navigation = useNavigation();

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
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Messages Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
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

To navigate to the `More` screen (which contains `MoreTabs`) from your `HomeScreen`:

```js
navigation.navigate('More');
```

This shows the initial screen inside `MoreTabs` (in this case, `Feed`). To navigate to a specific screen inside the nested navigator, pass the screen name in params:

```js
navigation.navigate('More', { screen: 'Messages' });
```

Now `Messages` will be shown instead of `Feed`.

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
  const navigation = useNavigation();

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
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

function MessagesScreen({ route }) {
  const navigation = useNavigation();

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
  const navigation = useNavigation();

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
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

function MessagesScreen({ route }) {
  const navigation = useNavigation();

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

:::warning

The `screen` and related params are reserved for internal use and are managed by React Navigation. While you can access `route.params.screen` etc. in the parent screens, relying on them may lead to unexpected behavior.

:::

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

When nesting navigators, you may see headers from both parent and child. To show only the child navigator's header, set `headerShown: false` on the parent screen:

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
  const navigation = useNavigation();

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
  const navigation = useNavigation();

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

This applies regardless of the nesting structure. If you don't want headers in any of the navigators, specify `headerShown: false` in all of them:

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

Minimize nesting as much as possible. Nesting has many downsides:

- Deeply nested view hierarchy can cause memory and performance issues on lower end devices
- Nesting the same type of navigator (e.g. tabs inside tabs, drawer inside drawer etc.) leads to a confusing UX
- With excessive nesting, code becomes difficult to follow when navigating to nested screens, configuring deep links etc.

Think of nesting as a way to achieve the UI you want, not a way to organize your code. To group screens for organization, use the [`Group`](group.md) component for dynamic configuration or [`groups` property](static-configuration.md#groups) for static configuration.

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
