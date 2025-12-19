---
id: screen-options-resolution
title: Screen options with nested navigators
sidebar_label: Options with nested navigators
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In this document we'll explain how [screen options](screen-options.md) work when there are multiple navigators. It's important to understand this so that you put your `options` in the correct place and can properly configure your navigators. If you put them in the wrong place, at best nothing will happen and at worst something confusing and unexpected will happen.

**You can only modify navigation options for a navigator from one of its screen components. This applies equally to navigators that are nested as screens.**

Let's take for example a tab navigator that contains a native stack in each tab. What happens if we set the `options` on a screen inside of the stack?

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Tabs with native stack" snack
import * as React from 'react';
import { View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function A() {
  return <View />;
}

function B() {
  return <View />;
}

// codeblock-focus-start
const HomeStackScreen = createNativeStackNavigator({
  screens: {
    A: {
      screen: A,
      options: {
        tabBarLabel: 'Home',
      },
    },
  },
});

const SettingsStackScreen = createNativeStackNavigator({
  screens: {
    B: {
      screen: B,
      options: {
        tabBarLabel: 'Settings!',
      },
    },
  },
});

const Tab = createBottomTabNavigator({
  screens: {
    Home: HomeStackScreen,
    Settings: SettingsStackScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(Tab);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Tabs with native stack" snack
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function A() {
  return <View />;
}

function B() {
  return <View />;
}
// codeblock-focus-start
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="A"
        component={A}
        options={{ tabBarLabel: 'Home!' }}
      />
    </HomeStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="B"
        component={B}
        options={{ tabBarLabel: 'Settings!' }}
      />
    </SettingsStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
// codeblock-focus-end
```

</TabItem>
</Tabs>

As we mentioned earlier, you can only modify navigation options for a navigator from one of its screen components. `A` and `B` above are screen components in `HomeStack` and `SettingsStack` respectively, not in the tab navigator. So the result will be that the `tabBarLabel` property is not applied to the tab navigator. We can fix this though!

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Tabs with native stack" snack
import * as React from 'react';
import { View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function A() {
  return <View />;
}

function B() {
  return <View />;
}

const HomeStackScreen = createNativeStackNavigator({
  screens: {
    A: A,
  },
});

const SettingsStackScreen = createNativeStackNavigator({
  screens: {
    B: B,
  },
});

// codeblock-focus-start
const Tab = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeStackScreen,
      options: {
        tabBarLabel: 'Home!',
      },
    },
    Settings: {
      screen: SettingsStackScreen,
      options: {
        tabBarLabel: 'Settings!',
      },
    },
  },
});
// codeblock-focus-start

const Navigation = createStaticNavigation(Tab);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Tabs with native stack" snack
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function A() {
  return <View />;
}

function B() {
  return <View />;
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="A" component={A} />
    </HomeStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="B" component={B} />
    </SettingsStack.Navigator>
  );
}

// codeblock-focus-start
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{ tabBarLabel: 'Home!' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStackScreen}
          options={{ tabBarLabel: 'Settings!' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
// codeblock-focus-end
```

</TabItem>
</Tabs>

When we set the `options` directly on `Screen` components containing the `HomeStack` and `SettingsStack` component, it allows us to control the options for its parent navigator when its used as a screen component. In this case, the options on our stack components configure the label in the tab navigator that renders the stacks.

## Setting parent screen options based on child navigator's state

Imagine the following configuration:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Parent options from a child" snack
import * as React from 'react';
import { View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return <View />;
}

function AccountScreen() {
  return <View />;
}

function SettingsScreen() {
  return <View />;
}

// codeblock-focus-start
const HomeTabs = createBottomTabNavigator({
  screens: {
    Feed: FeedScreen,
    Profile: ProfileScreen,
    Account: AccountScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeTabs,
    Settings: SettingsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
// codeblock-focus-end
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Parent options from a child" snack
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return <View />;
}

function AccountScreen() {
  return <View />;
}

function SettingsScreen() {
  return <View />;
}

// codeblock-focus-start
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// codeblock-focus-end
```

</TabItem>
</Tabs>

If we were to set the `headerTitle` with `options` for the `FeedScreen`, this would not work. This is because `App` stack will only look at its immediate children for configuration: `HomeTabs` and `SettingsScreen`.

But we can determine the `headerTitle` option based on the [navigation state](navigation-state.md) of our tab navigator using the `getFocusedRouteNameFromRoute` helper. Let's create a function to get the title first:

```js
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case 'Feed':
      return 'News feed';
    case 'Profile':
      return 'My profile';
    case 'Account':
      return 'My account';
  }
}
```

Then we can use this function with the `options` prop on `Screen`:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Parent options from a child" snack
import * as React from 'react';
import { View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case 'Feed':
      return 'News feed';
    case 'Profile':
      return 'My profile';
    case 'Account':
      return 'My account';
  }
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return <View />;
}

function AccountScreen() {
  return <View />;
}

function SettingsScreen() {
  return <View />;
}
const HomeTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Feed: FeedScreen,
    Profile: ProfileScreen,
    Account: AccountScreen,
  },
});

// codeblock-focus-start
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeTabs,
      options: ({ route }) => ({
        headerTitle: getHeaderTitle(route),
      }),
    },
    Settings: SettingsScreen,
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

```js name="Parent options from a child" snack
import * as React from 'react';
import { View } from 'react-native';
import {
  NavigationContainer,
  useNavigation,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case 'Feed':
      return 'News feed';
    case 'Profile':
      return 'My profile';
    case 'Account':
      return 'My account';
  }
}

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return <View />;
}

function AccountScreen() {
  return <View />;
}

function SettingsScreen() {
  return <View />;
}

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        // codeblock-focus-start
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
          })}
        />
        // codeblock-focus-end
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

So what's happening here? With the `getFocusedRouteNameFromRoute` helper, we can get the currently active route name from this child navigator (in this case it's the tab navigator since that's what we're rendering) and setting an appropriate title for the header.

This approach can be used anytime you want to set options for a parent navigator based on a child navigator's state. Common use cases are:

1. Show tab title in stack header: a stack contains a tab navigator and you want to set the title on the stack header (above example)
2. Show screens without tab bar: a tab navigator contains a stack and you want to hide the tab bar on specific screens (not recommended, see [Hiding tab bar in specific screens](hiding-tabbar-in-screens.md) instead)
3. Lock drawer on certain screens: a drawer has a stack inside of it and you want to lock the drawer on certain screens

In many cases, similar behavior can be achieved by reorganizing our navigators. We usually recommend this option if it fits your use case.

For example, for the above use case, instead of adding a tab navigator inside a stack navigator, we can add a stack navigator inside each of the tabs.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Reorganized navigators" snack
import * as React from 'react';
import { View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return <View />;
}

function SettingsScreen() {
  return <View />;
}

// codeblock-focus-start
const FeedStackScreen = createNativeStackNavigator({
  screens: {
    Feed: FeedScreen,
    /* other screens */
  },
});

const ProfileStackScreen = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
    /* other screens */
  },
});

const HomeTabs = createBottomTabNavigator({
  screens: {
    Feed: FeedStackScreen,
    Profile: ProfileStackScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeTabs,
    Settings: SettingsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
// codeblock-focus-end
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Reorganized navigators" snack
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function FeedScreen() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return <View />;
}

function SettingsScreen() {
  return <View />;
}

const FeedStack = createNativeStackNavigator();

// codeblock-focus-start
function FeedStackScreen() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen name="Feed" component={FeedScreen} />
      {/* other screens */}
    </FeedStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      {/* other screens */}
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeTabs} />
        <RootStack.Screen name="Settings" component={SettingsScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
// codeblock-focus-end
```

</TabItem>
</Tabs>

Additionally, this lets you push new screens to the feed and profile stacks without hiding the tab bar by adding more routes to those stacks.

If you want to push screens on top of the tab bar (i.e. that don't show the tab bar), then you can add them to the `App` stack instead of adding them into the screens inside the tab navigator.
