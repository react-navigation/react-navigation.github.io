---
id: material-bottom-tab-navigator
title: createMaterialBottomTabNavigator
sidebar_label: createMaterialBottomTabNavigator
---

A material-design themed tab bar on the bottom of the screen that lets you switch between different routes. Routes are lazily initialized -- their screen components are not mounted until they are first focused.

<img src="/docs/assets/navigators/bottom-navigation.gif" style="width: 420px; max-width: 100%">

To use this navigator, you need to install `react-navigation-material-bottom-tabs`

```
npm install react-navigation-material-bottom-tabs
```

This API also requires that you install `react-native-vector-icons`! If you are using Expo, it will just work out of the box. Otherwise, [follow these installation instructions](https://github.com/oblador/react-native-vector-icons#installation).

```js
createMaterialBottomTabNavigator(RouteConfigs, MaterialBottomTabNavigatorConfig);
```

## RouteConfigs

The route configs object is a mapping from route name to a route config.

## MaterialBottomTabNavigatorConfig

* `shifting` - Whether the shifting style is used, the active tab appears wider and the inactive tabs won't have a label. By default, this is `true` when you have more than 3 tabs.
* `labeled` - Whether to show labels in tabs. When `false`, only icons will be displayed.
* `activeTintColor` - Custom color for icon and label in the active tab.
* `inactiveTintColor` - Custom color for icon and label in the inactive tab.
* `barStyle` - Style for the bottom navigation bar. You can set a bottom padding here if you have a translucent navigation bar on Android: `barStyle={{ paddingBottom: 48 }}`.
* `initialRouteName` - The routeName for the initial tab route when first loading.
* `order` - Array of routeNames which defines the order of the tabs.
* `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
* `backBehavior` - Should the back button cause a tab switch to the initial tab? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

Example:

```js
export default createMaterialBottomTabNavigator({
  Album: { screen: Album },
  Library: { screen: Library },
  History: { screen: History },
  Cart: { screen: Cart },
}, {
  initialRouteName: 'Album',
  activeTintColor: '#f0edf6',
  inactiveTintColor: '#3e2465',
  barStyle: { backgroundColor: '#694fad' },
});
```

## `navigationOptions` for screens inside of the navigator

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarIcon`

React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node to display in tab bar.

#### `tabBarColor`

Color for the tab bar when the tab corresponding to the screen is active. Used for the ripple effect. This is only supported when `shifting` is `true`.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar. When undefined, scene `title` is used. To hide, see `labeled` option in the previous section.

#### `tabBarAccessibilityLabel`

Accessibility label for the tab button. This is read by the screen reader when the user taps the tab. It's recommended to set this if you don't have a label for the tab.

#### `tabBarTestID`

ID to locate this tab button in tests.

#### `tabBarOnPress`

Callback to handle press events; the argument is an object containing:

* `navigation`: navigation prop for the screen
* `defaultHandler`: the default handler for tab press

Useful for adding a custom logic before the transition to the next scene (the tapped one) starts.
