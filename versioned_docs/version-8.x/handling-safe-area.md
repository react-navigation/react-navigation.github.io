---
id: handling-safe-area
title: Supporting safe areas
sidebar_label: Supporting safe areas
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

On modern devices, there are often areas of the screen that are partially or fully obscured by:

- Physical notches
- Status bar overlay
- Home activity indicator on iOS
- Navigation bar on Android

The area not overlapped by such items is referred to as "safe area".

React Navigation automatically applies proper insets to the built-in UI elements of the navigators, such as headers, tab bars, and drawers, to avoid being overlapped by such items. But your own content may still need to handle safe areas to ensure that it isn't obscured by these items.

It's tempting to solve it by wrapping your entire app in a container in a `SafeAreaView`. But in doing so, we waste a bunch of space on the screen, as pictured in the image on the left below. What we ideally want is the image pictured on the right.

![Notch on the iPhone X](/assets/safe-area/intro.png)

When handling safe areas, the goal is to:

a. Maximize usage of the screen
b. Avoid hiding content or making it difficult to interact with by having it obscured

The guide covers different scenarios and best practices for handling safe areas keeping these goals in mind.

## The `SafeAreaView` component

While React Native exports a [`SafeAreaView`](https://reactnative.dev/docs/safeareaview) component, it is not adequate:

- It only supports iOS with no support for Android
- It can't be used to apply insets to scrollable content, which is a common use case
- If a screen containing safe area is animating, it causes jumpy behavior

So we recommend to use the `useSafeAreaInsets` hook from the [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) library to handle safe areas consistently. On iOS, you can also use [`contentInsetAdjustmentBehavior="automatic"`](https://reactnative.dev/docs/scrollview#contentinsetadjustmentbehavior-ios) on scroll views to handle safe areas automatically.

:::warning

The `SafeAreaView` component from `react-native-safe-area-context` works on Android, but still has the other issues mentioned above.

:::

## The `useSafeAreaInsets` hook

![Default React Navigation Behavior](/assets/safe-area/iphonex-default.png)

If you're using custom header, tab bar etc. or hiding the default ones, it's important to ensure your UI is within the safe area.

For example, if the header and the tab bar are hidden, the content gets covered by the status bar and the bottom bar:

```js name="Hidden components" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function Demo() {
  return (
    <View
      style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}

// codeblock-focus-start
const MyTabs = createBottomTabNavigator({
  initialRouteName: 'Analytics',
  // highlight-next-line
  tabBar: () => null,
  screenOptions: {
    // highlight-next-line
    headerShown: false,
  },
  screens: {
    Analytics: Demo,
    Profile: Demo,
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    // highlight-next-line
    headerShown: false,
  },
  screens: {
    Home: MyTabs,
    Settings: Demo,
  },
});

// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

![Text hidden by iPhoneX UI elements](/assets/safe-area/iphonex-content-hidden.png)

To fix this issue you can apply safe area insets on your content. This can be achieved using the `useSafeAreaInsets` hook from the `react-native-safe-area-context` library and applying the insets as padding to your content:

```js name="Safe area example" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// codeblock-focus-start
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Demo() {
  // highlight-next-line
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        // highlight-start
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        // highlight-end
      }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}
// codeblock-focus-end

const MyTabs = createBottomTabNavigator({
  initialRouteName: 'Analytics',
  tabBar: () => null,
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Analytics: Demo,
    Profile: Demo,
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: MyTabs,
    Settings: Demo,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

![Content spaced correctly with safe area insets](/assets/safe-area/iphonex-content-fixed.png)

The `useSafeAreaInsets` hook returns the insets for all sides of the screen, so you can choose to apply only specific insets if you want. For example, if your content doesn't extend to the bottom of the screen, you can choose to only apply the top inset.

:::warning

Using both `SafeAreaView` component and `useSafeAreaInsets` hook together can cause flickering as they may update at different times. So we recommend always using the `useSafeAreaInsets` hook instead for consistent behavior.

:::

## Landscape Mode

Even if you're using the default navigation bar and tab bar - if your application works in landscape mode it's important to ensure your content isn't hidden behind the sensor cluster.

![App in landscape mode with text hidden](/assets/safe-area/iphonex-landscape-hidden.png)

To fix this you can, once again, apply safe area insets to your content. This will not conflict with the navigation bar nor the tab bar's default behavior in portrait mode.

![App in landscape mode with text visible](/assets/safe-area/iphonex-landscape-fixed.png)

## Scrollable content

When the content of a screen is scrollable, on iOS, you can use `contentInsetAdjustmentBehavior="automatic"` on `ScrollView`, `FlatList`, `SectionList` to automatically apply the insets to when needed. This applies space so the content isn't hidden behind the status bar or the home indicator, but can scroll under them:

```js
import * as React from 'react';
import { ScrollView, Text } from 'react-native';

export default function Screen() {
  return (
    <ScrollView
      // highlight-next-line
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Your scrollable content goes here */}
    </ScrollView>
  );
}
```

On Android, `contentInsetAdjustmentBehavior` is not supported. So you need to apply the insets manually with `useSafeAreaInsets`:

```js
import * as React from 'react';
import { ScrollView, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      // highlight-start
      style={
        Platform.OS === 'android'
          ? {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }
          : null
      }
      // highlight-end
    >
      {/* Your scrollable content goes here */}
    </ScrollView>
  );
}
```

## Summary

- Use [`useSafeAreaInsets`](https://appandflow.github.io/react-native-safe-area-context/api/use-safe-area-insets) hook from `react-native-safe-area-context` instead of [`SafeAreaView`](https://reactnative.dev/docs/safeareaview) component
- For `ScrollView`, `FlatList`, `SectionList`, etc. on iOS, prefer `contentInsetAdjustmentBehavior="automatic"`
- Don't wrap your whole app in `SafeAreaView`, instead apply the styles to content inside your screens
- Apply only specific insets using the `useSafeAreaInsets` hook for more control
