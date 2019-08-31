---
id: version-4.x-material-top-tab-navigator
title: createMaterialTopTabNavigator
sidebar_label: createMaterialTopTabNavigator
original_id: material-top-tab-navigator
---

A material-design themed tab bar on the top of the screen that lets you switch between different routes by tapping the route or swiping horizontally. Transitions are animated by default. Screen components for each route are mounted immediately.

To use this navigator, you need to install [`react-navigation-tabs`](https://github.com/react-navigation/tabs):

```sh
yarn add @react-navigation/core react-navigation-tabs
```

Now we need to install [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler) and [`react-native-reanimated`](https://github.com/kmagiera/react-native-reanimated).

If you are using Expo, to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-gesture-handler react-native-reanimated
```

If you are not using Expo, run the following:

```sh
yarn add react-native-reanimated react-native-gesture-handler
```

If you are using Expo, you are done. Otherwise, continue to the next steps.

Next, we need to link these libraries. The steps depends on your React Native version:

- **React Native 0.60 and higher**

  On newer versions of React Native, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

  To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

  ```sh
  cd ios
  pod install
  cd ..
  ```

- **React Native 0.59 and lower**

  If you're on an older React Native version, you need to manually link the dependencies. To do that, run:

  ```sh
  react-native link react-native-reanimated
  react-native link react-native-gesture-handler
  ```

**IMPORTANT:** There are additional steps required for `react-native-gesture-handler` on Android after linking (for all React Native versions). Check the [this guide](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html) to complete the installation.

To use this tab navigator, import it from `react-navigation-tabs`:

```js
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

createMaterialTopTabNavigator(RouteConfigs, TabNavigatorConfig);
```

## RouteConfigs

The route configs object is a mapping from route name to a route config.

## TabNavigatorConfig

- `initialRouteName` - The routeName for the initial tab route when first loading.
- `navigationOptions` - Navigation options for the navigator itself, to configure a parent navigator
- `defaultNavigationOptions` - Default navigation options to use for screens
- `order` - Array of routeNames which defines the order of the tabs.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - `initialRoute` to return to initial tab, `order` to return to previous tab, `history` to return to last visited tab, or `none`.
- `tabBarPosition` - Position of the tab bar, can be `'top'` or `'bottom'`, default is `top`.
- `swipeEnabled` - Whether to allow swiping between tabs.
- `lazy` - Defaults to `false`. If `true`, tabs are rendered only when they are made active or on peek swipe. When `false`, all tabs are rendered immediately.
- `lazyPlaceholderComponent` - React component to render for routes that haven't been rendered yet. Receives an object containing the route as the argument. The `lazy` prop also needs to be enabled.
- `initialLayout` - Optional object containing the initial `height` and `width`, can be passed to prevent the one frame delay in [react-native-tab-view](https://github.com/react-native-community/react-native-tab-view#avoid-one-frame-delay) rendering.
- `tabBarComponent` - Optional, override the component to use as the tab bar.
- `tabBarOptions` - An object with the following properties:
  - `activeTintColor` - Label and icon color of the active tab.
  - `inactiveTintColor` - Label and icon color of the inactive tab.
  - `showIcon` - Whether to show icon for tab, default is false.
  - `showLabel` - Whether to show label for tab, default is true.
  - `upperCaseLabel` - Whether to make label uppercase, default is true.
  - `pressColor` - Color for material ripple (Android >= 5.0 only).
  - `pressOpacity` - Opacity for pressed tab (iOS and Android < 5.0 only).
  - `scrollEnabled` - Whether to enable scrollable tabs.
  - `tabStyle` - Style object for the tab.
  - `indicatorStyle` - Style object for the tab indicator (line at the bottom of the tab).
  - `labelStyle` - Style object for the tab label.
  - `iconStyle` - Style object for the tab icon.
  - `style` - Style object for the tab bar.
  - `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings, default is true.
  - `renderIndicator` - Function which takes an object with the current route and returns a custom React Element to be used as a tab indicator.

Example:

```js
tabBarOptions: {
  labelStyle: {
    fontSize: 12,
  },
  tabStyle: {
    width: 100,
  },
  style: {
    backgroundColor: 'blue',
  },
}
```

## `navigationOptions` for screens inside of the navigator

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `swipeEnabled`

True or false to enable or disable swiping between tabs, if not set then defaults to TabNavigatorConfig option swipeEnabled.

#### `tabBarIcon`

React Element or a function that given `{ focused: boolean, horizontal: boolean, tintColor: string }` returns a React.Node, to display in the tab bar. `horizontal` is `true` when the device is in landscape and `false` when portrait. The icon is re-rendered whenever the device orientation changes.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see `tabBarOptions.showLabel` in the previous section.

#### `tabBarAccessibilityLabel`

Accessibility label for the tab button. This is read by the screen reader when the user taps the tab. It's recommended to set this if you don't have a label for the tab.

#### `tabBarTestID`

ID to locate this tab button in tests.

#### `tabBarOnPress`

Callback to handle press events; the argument is an object containing:

- `navigation`: navigation prop for the screen
- `defaultHandler`: the default handler for tab press

Useful for adding a custom logic before the transition to the next scene (the
tapped one) starts. When setting tabBarOnPress the defaultHandler needs to be called in order to execute the default action (i.e. switch tab).

#### `tabBarOnLongPress`

Callback to handle long press events; the argument is an object containing:

- `navigation`: navigation prop for the screen
- `defaultHandler`: the default handler for tab press
