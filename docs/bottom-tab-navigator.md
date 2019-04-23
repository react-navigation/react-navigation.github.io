---
id: bottom-tab-navigator
title: createBottomTabNavigator
sidebar_label: createBottomTabNavigator
---

A simple tab bar on the bottom of the screen that lets you switch between different routes. Routes are lazily initialized -- their screen components are not mounted until they are first focused.

To use this navigator, you need to install [`react-navigation-tabs`](https://github.com/react-navigation/react-navigation-tabs) and its peer dependencies:

```sh
npm install react-navigation-tabs react-native-reanimated react-native-gesture-handler
```

To use this tab navigator, import it from `react-navigation-tabs`:

```js
import { createBottomTabNavigator } from 'react-navigation-tabs';

createBottomTabNavigator(RouteConfigs, TabNavigatorConfig);
```

> For a complete usage guide please visit [Tab Navigation](https://reactnavigation.org/docs/en/tab-based-navigation.html)

## RouteConfigs


The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](stack-navigator.html#routeconfigs) from stack navigator.

## BottomTabNavigatorConfig

* `initialRouteName` - The routeName for the initial tab route when first loading.
* `navigationOptions` - Navigation options for the navigator itself, to configure a parent navigator
* `defaultNavigationOptions` - Default navigation options to use for screens
* `resetOnBlur` - Reset the state of any nested navigators when switching away from a screen. Defaults to `false`.
* `order` - Array of routeNames which defines the order of the tabs.
* `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
* `backBehavior` - `initialRoute` to return to initial tab, `order` to return to previous tab, `history` to return to last visited tab, or `none`.
* `lazy` - Defaults to `true`. If `false`, all tabs are rendered immediately. When `true`, tabs are rendered only when they are made active for the first time. Note: tabs are **not** re-rendered upon subsequent visits.
* `tabBarComponent` - Optional, override component to use as the tab bar.
* `tabBarOptions` - An object with the following properties:
  * `activeTintColor` - Label and icon color of the active tab.
  * `activeBackgroundColor` - Background color of the active tab.
  * `inactiveTintColor` - Label and icon color of the inactive tab.
  * `inactiveBackgroundColor` - Background color of the inactive tab.
  * `showLabel` - Whether to show label for tab, default is true.
  * `showIcon` - Whether to show icon for tab, default is true.
  * `style` - Style object for the tab bar.
  * `labelStyle` - Style object for the tab label.
  * `tabStyle` - Style object for the tab.
  * `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings, default is true.
  * `adaptive` - Should the tab icons and labels alignment change based on screen size? Defaults to `true` for iOS 11. If `false`, tab icons and labels align vertically all the time. When `true`, tab icons and labels align horizontally on tablet.
  * `safeAreaInset` - Override the `forceInset` prop for `<SafeAreaView>`. Defaults to `{ bottom: 'always', top: 'never' }`. Available keys are `top | bottom | left | right` provided with the values `'always' | 'never'`.

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

const TabBarComponent = (props) => (<BottomTabBar {...props} />);

const TabScreens = createBottomTabNavigator(
  {
    tabBarComponent: props =>
      <TabBarComponent
        {...props}
        style={{ borderTopColor: '#605F60' }}
      />,
  },
);
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

* `navigation`: navigation prop for the screen
* `defaultHandler`: the default handler for tab press

Useful for adding a custom logic before the transition to the next scene (the
tapped one) starts. When setting tabBarOnPress the defaultHandler needs to be called in order to execute the default action (i.e. switch tab).

#### `tabBarOnLongPress`

Callback to handle long press events; the argument is an object containing:

- `navigation`: navigation prop for the screen
- `defaultHandler`: the default handler for tab press
