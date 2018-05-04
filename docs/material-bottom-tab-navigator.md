---
id: material-bottom-tab-navigator
title: createMaterialBottomTabNavigator
sidebar_label: createMaterialBottomTabNavigator
---

A material-design themed tab bar on the bottom of the screen that lets you switch between different routes. Routes are lazily initialized -- their screen components are not mounted until they are first focused.

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

* `shifting` - Whether the shifting style is used, the active tab appears wider and the inactive tabs won't have a label. By default, this is true when you have more than 3 tabs.
* `activeTintColor` - Label and icon color of the active tab.
* `initialRouteName` - The routeName for the initial tab route when first loading.
* `order` - Array of routeNames which defines the order of the tabs.
* `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
* `backBehavior` - Should the back button cause a tab switch to the initial tab? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

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

## `navigationOptions` for screens inside of the navigator

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarIcon`

React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar.

#### `tabBarColor`

Color for the tab bar when the tab corresponding to the screen is active.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see `tabBarOptions.showLabel` in the previous section.