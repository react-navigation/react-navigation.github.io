---
id: version-5.x-bottom-tab-navigator
title: createBottomTabNavigator
sidebar_label: createBottomTabNavigator
original_id: bottom-tab-navigator
---

A simple tab bar on the bottom of the screen that lets you switch between different routes. Routes are lazily initialized -- their screen components are not mounted until they are first focused.

To use this navigator, ensure that you have [react-navigation and its dependencies installed](getting-started.html), then install [`@react-navigation/bottom-tabs`](https://github.com/react-navigation/react-navigation/tree/master/packages/bottom-tabs):

```sh
npm install @react-navigation/bottom-tabs
```

## API Definition

To use this tab navigator, import it from `@react-navigation/bottom-tabs`:

<samp id="tab-based-navigation-minimal" />

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

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

#### `lazy`

Defaults to `true`. If `false`, all tabs are rendered immediately. When `true`, tabs are rendered only when they are made active for the first time. Note: tabs are **not** re-rendered upon subsequent visits.

#### `tabBar`

Function that returns a React element to display as the tab bar.

Example:

<samp id="custom-tab-bar" />

```js
import { View, Text, TouchableOpacity } from 'react-native';

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ...

<Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
  {...}
</Tab.Navigator>
```

This example will render a basic tab bar with labels.

#### `tabBarOptions`

An object containing the props for the tab bar component. It can contain the following properties:

- `activeTintColor` - Label and icon color of the active tab.
- `activeBackgroundColor` - Background color of the active tab.
- `inactiveTintColor` - Label and icon color of the inactive tab.
- `inactiveBackgroundColor` - Background color of the inactive tab.
- `showLabel` - Whether to show label for tab, default is true.
- `showIcon` - Whether to show icon for tab, default is true.
- `style` - Style object for the tab bar.
- `labelStyle` - Style object for the tab label.
- `labelPosition` - Where to show the tab label in relation to the tab icon. Available values are `beside-icon` and `below-icon`. Defaults to `beside-icon`.
- `tabStyle` - Style object for the tab.
- `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings, default is true.
- `adaptive` - Should the tab icons and labels alignment change based on screen size? Defaults to `true` for iOS 11. If `false`, tab icons and labels align vertically all the time. When `true`, tab icons and labels align horizontally on tablet.
- `safeAreaInset` - Override the `forceInset` prop for `<SafeAreaView>`. Defaults to `{ bottom: 'always', top: 'never' }`. Available keys are `top | bottom | left | right` provided with the values `'always' | 'never'`.
- `keyboardHidesTabBar` - Defaults to `false`. If `true` hide the tab bar when keyboard opens.

### Options

The `options` prop can be used to configure individual screens inside the navigator. Supported options are:

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarVisible`

`true` or `false` to show or hide the tab bar, if not set then defaults to `true`.

#### `tabBarIcon`

Function that given `{ focused: boolean, color: string, size: number }` returns a React.Node, to display in the tab bar.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or a function that given `{ focused: boolean, color: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see `tabBarOptions.showLabel` in the previous section.

#### `tabBarButton`

Function which returns a React element to render as the tab bar button. It wraps the icon and label and implements `onPress`. Renders `TouchableWithoutFeedback` by default. `tabBarButton: props => <TouchableOpacity {...props} />` would use `TouchableOpacity` instead.

#### `tabBarAccessibilityLabel`

Accessibility label for the tab button. This is read by the screen reader when the user taps the tab. It's recommended to set this if you don't have a label for the tab.

#### `tabBarTestID`

ID to locate this tab button in tests.

#### `unmountOnBlur`

Whether this screen should be unmounted when navigating away from it. Unmounting a screen resets any local state in the screen as well as state of nested navigators in the screen. Defaults to `false`.

### Events

The navigator can fire events on certain actions. Supported events are:

#### `tabPress`

This event is fired when the user presses the tab button for the current screen in the tab bar. By default a tab press does several things:

- If the tab is not focused, tab press will focus that tab
- If the tab is already focused:
  - If the screen for the tab renders a scroll view, scroll to top is performed by `useScrollToTop`
  - If the screen for the tab renders a stack navigator, a `popToTop` action is performed on the stack

To prevent the default behavior, you can call `event.preventDefault`:

<samp id="bottom-tab-prevent-default">

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

If you have a custom tab bar, make sure to emit this event.

#### `tabLongPress`

This event is fired when the user presses the tab button for the current screen in the tab bar for an extended period. If you have a custom tab bar, make sure to emit this event.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('tabLongPress', e => {
    // Do something
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

<samp id="tab-jump-to">

```js
navigation.jumpTo('Profile', { owner: 'Michaś' });
```

## Example

<samp id="bottom-tab-example">

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{
        activeTintColor: '#e91e63',
      }}
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
