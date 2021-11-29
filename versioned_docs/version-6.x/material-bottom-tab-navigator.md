---
id: material-bottom-tab-navigator
title: Material Bottom Tabs Navigator
sidebar_label: Material Bottom Tabs
---

A material-design themed tab bar on the bottom of the screen that lets you switch between different routes with animation. Routes are lazily initialized - their screen components are not mounted until they are first focused.

This wraps the [`BottomNavigation`](https://callstack.github.io/react-native-paper/bottom-navigation.html) component from [`react-native-paper`](https://reactnativepaper.com). If you [configure the Babel plugin](https://callstack.github.io/react-native-paper/getting-started.html), it won't include the whole `react-native-paper` library in your bundle.

<img src="/assets/navigators/tabs/material-bottom-tabs.gif" style={{ width: '420px', maxWidth: '100%', margin: '16px 0' }} />

## Installation

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/material-bottom-tabs`](https://github.com/react-navigation/react-navigation/tree/main/packages/material-bottom-tabs):

```bash npm2yarn
npm install @react-navigation/material-bottom-tabs react-native-paper react-native-vector-icons
```

This API also requires that you install `react-native-vector-icons`! If you are using Expo managed workflow, it will work without any extra steps. Otherwise, [follow these installation instructions](https://github.com/oblador/react-native-vector-icons#installation).

To use this tab navigator, import it from `@react-navigation/material-bottom-tabs`

## API Definition

> 💡 If you encounter any bugs while using `createMaterialBottomTabNavigator`, please open issues on [`react-native-paper`](https://github.com/callstack/react-native-paper) rather than the `react-navigation` repository!

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

> For a complete usage guide please visit [Tab Navigation](tab-based-navigation.md)

## RouteConfigs

The route configs object is a mapping from route name to a route config.

### Props

The `Tab.Navigator` component accepts following props:

#### `initialRouteName`

The name of the route to render on first load of the navigator.

#### `screenOptions`

Default options to use for the screens in the navigator.

#### `backBehavior`

This controls how going back in the navigator is handled. This includes when the back button is pressed/back gesture is performed, or `goBack` is called.

It supports the following values:

- `firstRoute` - return to the first tab (default)
- `initialRoute` - return to initial tab
- `order` - return to previous tab (in the order they are shown in the tab bar)
- `history` - return to last visited tab
- `none` - do not handle back button

#### `shifting`

Whether the shifting style is used, the active tab icon shifts up to show the label and the inactive tabs won't have a label.

By default, this is `true` when you have more than 3 tabs. Pass `shifting={false}` to explicitly disable this animation, or `shifting={true}` to always use this animation.

#### `labeled`

Whether to show labels in tabs. When `false`, only icons will be displayed.

#### `activeColor`

Custom color for icon and label in the active tab.

#### `inactiveColor`

Custom color for icon and label in the inactive tab.

#### `barStyle`

Style for the bottom navigation bar. You can pass custom background color here:

<samp id="material-bottom-tab-styled" />

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

If you have a translucent navigation bar on Android, you can also set a bottom padding here:

```js
<Tab.Navigator
  initialRouteName="Home"
  activeColor="#f0edf6"
  inactiveColor="#3e2465"
  barStyle={{ paddingBottom: 48 }}
>
  {/* ... */}
</Tab.Navigator>
```

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator:

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

The navigator can [emit events](navigation-events.md) on certain actions. Supported events are:

#### `tabPress`

This event is fired when the user presses the tab button for the current screen in the tab bar. By default a tab press does several things:

- If the tab is not focused, tab press will focus that tab
- If the tab is already focused:
  - If the screen for the tab renders a scroll view, you can use [`useScrollToTop`](use-scroll-to-top.md) to scroll it to top
  - If the screen for the tab renders a stack navigator, a `popToTop` action is performed on the stack

To prevent the default behavior, you can call `event.preventDefault`:

<samp id="material-bottom-tab-prevent-default" />

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('tabPress', (e) => {
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
- `params` - _object_ - Screen params to pass to the destination route.

<samp id="material-tab-jump-to" />

```js
navigation.jumpTo('Profile', { name: 'Michaś' });
```

## Example

<samp id="material-bottom-tab-example" />

```js
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

## Using with `react-native-paper` (optional)

You can use the theming support in `react-native-paper` to customize the material bottom navigation by wrapping your app in [`Provider` from `react-native-paper`](https://callstack.github.io/react-native-paper/getting-started.html). A common use case for this can be to customize the background color for the screens when your app has a dark theme. Follow the [instructions on `react-native-paper`'s documentation](https://callstack.github.io/react-native-paper/theming.html) to learn how to customize the theme.
