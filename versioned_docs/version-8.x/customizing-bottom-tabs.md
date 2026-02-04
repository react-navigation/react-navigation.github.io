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

Icons can be specified using the [`tabBarIcon`](bottom-tab-navigator.md#tabbaricon) option. The format of the icon varies based on the platform:

- Local image - all platforms
- SF Symbols name - iOS
- Custom drawable name - Android

```js name="Tab bar icons" static2dynamic
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
  screenOptions: {
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
  },
  screens: {
    Home: createBottomTabScreen({
      screen: HomeScreen,
      options: {
        // highlight-start
        tabBarIcon: Platform.select({
          ios: {
            type: 'sfSymbol',
            name: 'house',
          },
          android: {
            type: 'materialSymbol',
            name: 'home',
          },
          default: {
            type: 'image',
            source: require('./path/to/home-icon.png'),
          },
        }),
        // highlight-end
      },
    }),
    Settings: createBottomTabScreen({
      screen: SettingsScreen,
      options: {
        // highlight-start
        tabBarIcon: Platform.select({
          ios: {
            type: 'sfSymbol',
            name: 'gear',
          },
          android: {
            type: 'materialSymbol',
            name: 'settings',
          },
          default: {
            type: 'image',
            source: require('./path/to/settings-icon.png'),
          },
        }),
        // highlight-end
      },
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}
```

Let's dissect this:

- [`tabBarIcon`](bottom-tab-navigator.md#tabbaricon) is a supported option in bottom tab navigator. So we know we can use it on our screen components in the `options` prop.
- `tabBarIcon` is an object specifying the icon to display.
  - For iOS, you can use SF Symbols by setting `type: 'sfSymbol'` and providing the symbol `name`.
  - For Android, you can use Material Symbols by setting `type: 'materialSymbol'` and providing the symbol `name`.
  - For other platforms, use `type: 'image'` with a `source` pointing to your image file. Image files must be provided for multiple screen densities (1x, 2x, 3x), e.g.: `home-icon.png`, `home-icon@2x.png`, `home-icon@3x.png`.
- [`Platform.select`](https://reactnative.dev/docs/platform#select) can be used to provide different icons based on the platform.
- The `tabBarActiveTintColor` and `tabBarInactiveTintColor` options in `screenOptions` control the icon and label colors. These default to the iOS platform defaults, but you can change them as shown above.
- Read the [full API reference](bottom-tab-navigator.md) for further information on `createBottomTabNavigator` configuration options.

### Different icons for active and inactive states

You can also provide different icons for active and inactive states by using a function for the `tabBarIcon` option:

```js
tabBarIcon: ({ focused }) => {
  return {
    type: 'image',
    source: focused
      ? require('./path/to/home-filled-icon.png')
      : require('./path/to/home-outline-icon.png'),
  };
},
```

The `focused` parameter indicates whether the tab is active or inactive.

This not supported on Android with `native` [implementation](bottom-tab-navigator.md#implementation), the icon specified for inactive state will be used for both active and inactive states.

### Using [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

The React Native Vector Icons library provides a large set of icons. To use vector icons in your tab bar, we'd need to [get an image source](https://github.com/oblador/react-native-vector-icons?tab=readme-ov-file#usage-as-png-imagesource-object) from the icon component.

First, make sure to install the appropriate icon package (e.g. `@react-native-vector-icons/lucide`) and `@react-native-vector-icons/get-image` and rebuild the app after installation. Then, you can use the `getImageSourceSync` method to get the image source for the desired icon:

```js
import { Lucide } from '@react-native-vector-icons/lucide';

// ...

tabBarIcon: {
  type: 'image',
  source: Lucide.getImageSourceSync('heart', 22),
},
```

## Add badges to tab items

Sometimes we want to add badges to some tabs. You can use the [`tabBarBadge` option](bottom-tab-navigator.md#tabbarbadge) to do it:

```js name="Tab based navigation" static2dynamic
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
    Home: createBottomTabScreen({
      screen: HomeScreen,
      options: {
        // highlight-start
        tabBarBadge: 3,
        // highlight-end
      },
    }),
    Settings: createBottomTabScreen({
      screen: SettingsScreen,
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}
```

From UI perspective this component is ready to use, but you still need to find some way to pass down the badge count properly from somewhere else, like using [React Context](https://react.dev/reference/react/use):

```js
options: () => {
  const unreadMessagesCount = use(UnreadMessagesCountContext);

  return {
    tabBarBadge: unreadMessagesCount,
  };
};
```

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
