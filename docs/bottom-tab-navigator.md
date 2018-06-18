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

The route configs object is a mapping from route name to a route config.

## BottomTabNavigatorConfig

* `initialRouteName` - The routeName for the initial tab route when first loading.
* `order` - Array of routeNames which defines the order of the tabs.
* `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
* `backBehavior` - Should the back button cause a tab switch to the initial tab? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.
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

True or false to show or hide the tab bar, if not set then defaults to true.

#### `tabBarIcon`

React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see `tabBarOptions.showLabel` in the previous section.

#### `tabBarOnPress`

Callback to handle tap events; the argument is an object containing:

* the `previousScene: { route, index }` which is the scene we are leaving
* the `scene: { route, index }` that was tapped
* the `jumpToIndex` method that can perform the navigation for you

Useful for adding a custom logic before the transition to the next scene (the tapped one) starts.
