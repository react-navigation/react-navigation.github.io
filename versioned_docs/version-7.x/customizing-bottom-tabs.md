---
id: customizing-tabbar
title: Customizing bottom tab bar
sidebar_label: Customizing tab bar
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide covers customizing the tab bar in [`createBottomTabNavigator`](bottom-tab-navigator.md). Make sure to install and configure the library according to the [installation instructions](bottom-tab-navigator.md#installation) first.

## Add icons for each tab

This is similar to how you would customize a stack navigator &mdash; there are some properties that are set when you initialize the tab navigator and others that can be customized per-screen in `options`.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Tab bar icons" snack dependencies=@expo/vector-icons,@expo/vector-icons/Ionicons
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// codeblock-focus-start
// You can import Ionicons from @expo/vector-icons/Ionicons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import Ionicons from 'react-native-vector-icons/Ionicons';

// codeblock-focus-end

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

// codeblock-focus-start
const RootTabs = createBottomTabNavigator({
  screenOptions: ({ route }) => ({
    // highlight-start
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused
          ? 'ios-information-circle'
          : 'ios-information-circle-outline';
      } else if (route.name === 'Settings') {
        iconName = focused ? 'ios-list' : 'ios-list-outline';
      }

      // You can return any component that you like here!
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    // highlight-end
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
  }),
  screens: {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Tab based navigation" snack dependencies=@expo/vector-icons,@expo/vector-icons/Ionicons
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// codeblock-focus-start
// You can import Ionicons from @expo/vector-icons/Ionicons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import Ionicons from 'react-native-vector-icons/Ionicons';

// codeblock-focus-end

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

// codeblock-focus-start
function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // highlight-start
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'ios-information-circle'
              : 'ios-information-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-list' : 'ios-list-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // highlight-end
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
// codeblock-focus-end

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

Let's dissect this:

- `tabBarIcon` is a supported option in bottom tab navigator. So we know we can use it on our screen components in the `options` prop, but in this case chose to put it in the `screenOptions` prop of `Tab.Navigator` in order to centralize the icon configuration for convenience.
- `tabBarIcon` is a function that is given the `focused` state, `color`, and `size` params. If you take a peek further down in the configuration you will see `tabBarActiveTintColor` and `tabBarInactiveTintColor`. These default to the iOS platform defaults, but you can change them here. The `color` that is passed through to the `tabBarIcon` is either the active or inactive one, depending on the `focused` state (focused is active). The `size` is the size of the icon expected by the tab bar.
- Read the [full API reference](bottom-tab-navigator.md) for further information on `createBottomTabNavigator` configuration options.

## Add badges to icons

Sometimes we want to add badges to some icons. You can use the [`tabBarBadge` option](bottom-tab-navigator.md#tabbarbadge) to do it:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Tab based navigation" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

// codeblock-focus-start
const RootTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        // highlight-start
        tabBarBadge: 3,
        // highlight-end
      },
    },
    Settings: SettingsScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Tab based navigation" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

// codeblock-focus-start
function RootTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          // highlight-start
          tabBarBadge: 3,
          // highlight-end
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
// codeblock-focus-end

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

From UI perspective this component is ready to use, but you still need to find some way to pass down the badge count properly from somewhere else, like using [React Context](https://reactjs.org/docs/context.html), [Redux](https://redux.js.org/), [MobX](https://mobx.js.org/) or [event emitters](https://github.com/facebook/react-native/blob/master/Libraries/vendor/emitter/EventEmitter.js).

You can also update the badge from within the screen component by using the `setOptions` method:

```js
const navigation = useNavigation();

React.useEffect(() => {
  navigation.setOptions({
    tabBarBadge: unreadMessagesCount,
  });
}, [navigation, unreadMessagesCount]);
```

![Tabs with badges](/assets/navigators/tabs/tabs-badges.png)
