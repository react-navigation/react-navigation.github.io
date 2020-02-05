---
id: version-5.x-material-bottom-tab-navigator
title: createMaterialBottomTabNavigator
sidebar_label: createMaterialBottomTabNavigator
original_id: material-bottom-tab-navigator
---

A material-design themed tab bar on the bottom of the screen that lets you switch between different routes with animation. Routes are lazily initialized - their screen components are not mounted until they are first focused.

<img src="/docs/assets/navigators/bottom-navigation.gif" style="width: 420px; max-width: 100%">

This wraps the [`BottomNavigation`](https://callstack.github.io/react-native-paper/bottom-navigation.html) component from [`react-native-paper`](https://reactnativepaper.com). If you [configure the Babel plugin](https://callstack.github.io/react-native-paper/getting-started.html), it won't include the whole `react-native-paper` library in your bundle.

To use this navigator, ensure that you have [react-navigation and its dependencies installed](getting-started.html), then install [`@react-navigation/material-bottom-tabs`](https://github.com/react-navigation/react-navigation/tree/master/packages/material-bottom-tabs):

```sh
npm install @react-navigation/material-bottom-tabs react-native-paper
```

This API also requires that you install `react-native-vector-icons`! If you are using Expo, it will just work out of the box. Otherwise, [follow these installation instructions](https://github.com/oblador/react-native-vector-icons#installation).

To use this tab navigator, import it from `@react-navigation/material-bottom-tabs`

## API Definition

To use this tab navigator, import it from `@react-navigation/material-bottom-tabs`:

<samp id="material-tab-based-navigation-minimal" />

```js
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

> For a complete usage guide please visit [Tab Navigation](tab-based-navigation.html)

## RouteConfigs

The route configs object is a mapping from route name to a route config.

### Props

The `Tab.Navigator` component accepts following props:

#### `initialRouteName`

The name of the route to render on first load of the navigator.

#### `screenOptions`

Default options to use for the screens in the navigator.

#### `backBehavior`

Behavior of back button handling.

- `initialRoute` to return to initial tab
- `order` to return to previous tab (in the order they are shown in the tab bar)
- `history` to return to last visited tab
- `none` to not handle back button

#### `shifting`

Whether the shifting style is used, the active tab appears wider and the inactive tabs won't have a label. By default, this is `true` when you have more than 3 tabs.

#### `labeled`

Whether to show labels in tabs. When `false`, only icons will be displayed.

#### `activeColor`

Custom color for icon and label in the active tab.

#### `inactiveColor`

Custom color for icon and label in the inactive tab.

#### `barStyle`

Style for the bottom navigation bar. You can set a bottom padding here if you have a translucent navigation bar on Android: `barStyle={{ paddingBottom: 48 }}`.

Example:

<samp id="material-bottom-tab-styled">

```js
<Tab.Navigator
  initialRouteName="Home"
  activeColor="#f0edf6"
  inactiveColor="#3e2465"
  barStyle={{ backgroundColor: '#694fad' }}
>
  {/* ... */}
</Tab.Navigator>
```

### Options

The `options` prop can be used to configure individual screens inside the navigator. Supported options are:

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarIcon`

Function that given `{ focused: boolean, color: string }` returns a React.Node, to display in the tab bar.

#### `tabBarColor`

Color for the tab bar when the tab corresponding to the screen is active. Used for the ripple effect. This is only supported when `shifting` is `true`.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar. When undefined, scene `title` is used. To hide, see `labeled` option in the previous section.

#### `tabBarBadge`

Badge to show on the tab icon, can be `true` to show a dot, `string` or `number` to show text.

#### `tabBarAccessibilityLabel`

Accessibility label for the tab button. This is read by the screen reader when the user taps the tab. It's recommended to set this if you don't have a label for the tab.

#### `tabBarTestID`

ID to locate this tab button in tests.

### Events

The navigator can fire events on certain actions. Supported events are:

#### `tabPress`

This event is fired when the user presses the tab button for the current screen in the tab bar. By default a tab press does several things:

- If the tab is not focused, tab press will focus that tab
- If the tab is already focused:
  - If the screen for the tab renders a scroll view, scroll to top is performed by `useScrollToTop`
  - If the screen for the tab renders a stack navigator, a `popToTop` action is performed on the stack

To prevent the default behavior, you can call `event.preventDefault`:

<samp id="material-bottom-tab-prevent-default">

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('tabPress', e => {
    // Prevent default behavior

    e.preventDefault();
    // Do something manually
    // ...
  });

  return unsubscribe;
}, [navigation]);
```

### Helpers

The tab navigator adds the following methods to the navigation prop:

#### `jumpTo`

Navigates to an existing screen in the tab navigator. The method accepts following arguments:

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to merge into the destination route (found in the pushed screen through `route.params`).

<samp id="material-tab-jump-to">

```js
navigation.jumpTo('Profile', { name: 'Michaś' });
```

## Example

<samp id="material-bottom-tab-example">

```js
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#e91e63"
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

## Using with `react-native-paper` (optional)

You can use the theming support in `react-native-paper` to customize the material bottom navigation by wrapping your app in [`Provider` from `react-native-paper`](https://callstack.github.io/react-native-paper/getting-started.html). A common use case for this can be to customize the background color for the screens when your app has a dark theme. Follow the [instructions on `react-native-paper`'s documentation](https://callstack.github.io/react-native-paper/theming.html) to learn how to customize the theme.
