---
id: tab-navigator
title: createTabNavigator
sidebar_label: createTabNavigator
---

> Note: `createTabNavigator` is deprecated. Please use `createBottomTabNavigator` and/or `createMaterialTopTabNavigator` instead.

```js
createTabNavigator(RouteConfigs, TabNavigatorConfig);
```

## RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](stack-navigator.md#routeconfigs) from stack navigator.

## TabNavigatorConfig

* `tabBarComponent` - Component to use as the tab bar, e.g. `TabBarBottom` (this is the default on iOS), `TabBarTop` (this is the default on Android).
* `tabBarPosition` - Position of the tab bar, can be `'top'` or `'bottom'`.
* `swipeEnabled` - Whether to allow swiping between tabs.
* `animationEnabled` - Whether to animate when changing tabs.
* `lazy` - Defaults to `true`. If `false`, all tabs are rendered immediately. When `true`, tabs are rendered only when they are made active.
* `removeClippedSubviews` - Defaults to `true`. An optimization to reduce memory usage by freeing resources used by inactive tabs.
* `configureTransition` - a function that, given `currentTransitionProps` and `nextTransitionProps`, returns a configuration object that describes the animation between tabs.
* `initialLayout` - Optional object containing the initial `height` and `width`, can be passed to prevent the one frame delay in [react-native-tab-view](https://github.com/react-native-community/react-native-tab-view#avoid-one-frame-delay) rendering.
* `tabBarOptions` - Configure the tab bar, see below.

Several options get passed to the underlying router to modify navigation logic:

* `initialRouteName` - The routeName for the initial tab route when first loading.
* `order` - Array of routeNames which defines the order of the tabs.
* `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
* `backBehavior` - Should the back button cause a tab switch to the initial tab? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### `tabBarOptions` for `TabBarBottom` (default tab bar on iOS)

* `activeTintColor` - Label and icon color of the active tab.
* `activeBackgroundColor` - Background color of the active tab.
* `inactiveTintColor` - Label and icon color of the inactive tab.
* `inactiveBackgroundColor` - Background color of the inactive tab.
* `showLabel` - Whether to show label for tab, default is true.
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

### `tabBarOptions` for `TabBarTop` (default tab bar on Android)

* `activeTintColor` - Label and icon color of the active tab.
* `inactiveTintColor` - Label and icon color of the inactive tab.
* `showIcon` - Whether to show icon for tab, default is false.
* `showLabel` - Whether to show label for tab, default is true.
* `upperCaseLabel` - Whether to make label uppercase, default is true.
* `pressColor` - Color for material ripple (Android >= 5.0 only).
* `pressOpacity` - Opacity for pressed tab (iOS and Android < 5.0 only).
* `scrollEnabled` - Whether to enable scrollable tabs.
* `tabStyle` - Style object for the tab.
* `indicatorStyle` - Style object for the tab indicator (line at the bottom of the tab).
* `labelStyle` - Style object for the tab label.
* `iconStyle` - Style object for the tab icon.
* `style` - Style object for the tab bar.
* `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings, default is true.

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

#### `tabBarVisible`

True or false to show or hide the tab bar, if not set then defaults to true.

#### `swipeEnabled`

True or false to enable or disable swiping between tabs, if not set then defaults to TabNavigatorConfig option swipeEnabled.

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

## Navigator props

The navigator component created by `createTabNavigator(...)` takes the following props:

* `screenProps` - Pass down extra options to child screens and navigation options, for example:


```js
const TabNavigator = createTabNavigator({
  // config
});

<TabNavigator
  screenProps={/* this prop will get passed to the screen components as this.props.screenProps */}
/>
```
