---
id: bottom-tab-navigator
title: createBottomTabNavigator
sidebar_label: createBottomTabNavigator
---

A simple tab bar on the bottom of the screen that lets you switch between different routes. Routes are lazily initialized -- their screen components are not mounted until they are first focused.

```js
createBottomTabNavigator(RouteConfigs, BottomTabNavigatorConfig);
```

## RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](stack-navigator.md#routeconfigs) from stack navigator.

## BottomTabNavigatorConfig

- `initialRouteName` - The routeName for the initial tab route when first loading.
- `order` - Array of routeNames which defines the order of the tabs.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause a tab switch to the initial tab? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.
- `tabBarComponent` - Optional, override component to use as the tab bar.
- `tabBarOptions` - An object with the following properties:
  - `activeTintColor` - Label and icon color of the active tab.
  - `activeBackgroundColor` - Background color of the active tab.
  - `inactiveTintColor` - Label and icon color of the inactive tab.
  - `inactiveBackgroundColor` - Background color of the inactive tab.
  - `showLabel` - Whether to show label for tab, default is true.
  - `showIcon` - Whether to show icon for tab, default is true.
  - `style` - Style object for the tab bar.
  - `labelStyle` - Style object for the tab label.
  - `tabStyle` - Style object for the tab.
  - `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings, default is true.
  - `adaptive` - Should the tab icons and labels alignment change based on screen size? Defaults to `true` for iOS 11. If `false`, tab icons and labels align vertically all the time. When `true`, tab icons and labels align horizontally on tablet.
  - `safeAreaInset` - Override the `forceInset` prop for `<SafeAreaView>`. Defaults to `{ bottom: 'always', top: 'never' }`. Available keys are `top | bottom | left | right` provided with the values `'always' | 'never'`.

Example:

```js
tabBarOptions: {
  activeTintColor: '#e91e63',
  labelStyle: {
    fontSize: 12,
  },
  style: {
    backgroundColor: 'blue',
  },
}
```

If you want to customize the `tabBarComponent`:

```js
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';

const TabBarComponent = (props) => <BottomTabBar {...props} />;

const TabScreens = createBottomTabNavigator({
  tabBarComponent: (props) => (
    <TabBarComponent {...props} style={{ borderTopColor: '#605F60' }} />
  ),
});
```

## `navigationOptions` for screens inside of the navigator

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarVisible`

`true` or `false` to show or hide the tab bar, if not set then defaults to `true`.

#### `tabBarIcon`

React Element or a function that given `{ focused: boolean, horizontal: boolean, tintColor: string }` returns a React.Node, to display in the tab bar. `horizontal` is `true` when the device is in landscape and `false` when portrait. The icon is re-rendered whenever the device orientation changes.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see `tabBarOptions.showLabel` in the previous section.

#### `tabBarButtonComponent`

React Component that wraps the icon and label and implements `onPress`. The default is a wrapper around `TouchableWithoutFeedback` that makes it behave the same as other touchables. `tabBarButtonComponent: TouchableOpacity` would use `TouchableOpacity` instead.

#### `tabBarAccessibilityLabel`

Accessibility label for the tab button. This is read by the screen reader when the user taps the tab. It's recommended to set this if you don't have a label for the tab.

#### `tabBarTestID`

ID to locate this tab button in tests.

#### `tabBarOnPress`

Callback to handle press events; the argument is an object containing:

- `navigation`: navigation prop for the screen
- `defaultHandler`: the default handler for tab press

Useful for adding a custom logic before the transition to the next scene (the tapped one) starts.

Define this callback without ever invoking `defaultHandler` to prevent any navigation from occurring.
