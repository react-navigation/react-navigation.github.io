---
id: bottom-tab-navigator
title: createBottomTabNavigator
sidebar_label: createBottomTabNavigator
---

A simple tab bar on the bottom of the screen that lets you switch between different routes. Routes are lazily initialized -- their screen components are not mounted until they are first focused.

To use this navigator, you need to install [`@react-navigation/bottom-tabs`](https://github.com/react-navigation/navigation-ex/tree/master/packages/bottom-tabs):

```sh
yarn add @react-navigation/core@next @react-navigation/bottom-tabs@next
```

Now we need to install [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context).

If you are using Expo, to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-safe-area-context
```

If you are not using Expo, run the following:

```sh
yarn add react-native-safe-area-context
```

If you are using Expo, you are done. Otherwise, continue to the next steps.

To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

```sh
cd ios
pod install
cd ..
```

Finally, run `react-native run-android` or `react-native run-ios` to launch the app on your device/simulator.

## API Definition

To use this tab navigator, import it from `@react-navigation/bottom-tabs`:

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Article" component={Article} />
    </Tab.Navigator>
  );
}
```

> For a complete usage guide please visit [Tab Navigation](https://reactnavigation.org/docs/tab-based-navigation.html)

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

#### `resetOnBlur`

Reset the state of any nested navigators when switching away from a screen. Defaults to `false`.

#### `lazy`

Defaults to `true`. If `false`, all tabs are rendered immediately. When `true`, tabs are rendered only when they are made active for the first time. Note: tabs are **not** re-rendered upon subsequent visits.

#### `tabBarComponent`

Override component to use as the tab bar.

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
- `keyboardHidesTabBar` - Defaults to `true`. If `true` hide the tab bar when keyboard opens.

### Options for `Tab.Screen`

The `options` prop can be used to configure individual screens inside the navigator. Supported options are:

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarVisible`

`true` or `false` to show or hide the tab bar, if not set then defaults to `true`.

#### `tabBarIcon`

Function that given `{ focused: boolean, horizontal: boolean, tintColor: string }` returns a React.Node, to display in the tab bar. `horizontal` is `true` when the device is in landscape and `false` when portrait. The icon is re-rendered whenever the device orientation changes.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see `tabBarOptions.showLabel` in the previous section.

#### `tabBarButtonComponent`

React Component that wraps the icon and label and implements `onPress`. The default is a wrapper around `TouchableWithoutFeedback` that makes it behave the same as other touchables. `tabBarButtonComponent: TouchableOpacity` would use `TouchableOpacity` instead.

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

To prevent the default behavior, you can call `eventPreventDefault`:

```js
navigation.addListener('tabPress', e => {
  // Prevent default behavior
  e.preventDefault();

  // Do something manually
  // ...
});
```

#### `tabLongPress`

This event is fired when the user presses the tab button for the current screen in the tab bar for an extended period.

## Example

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeTintColor="#e91e63"
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="home" color={tintColor} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="bell" color={tintColor} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="account"
              color={tintColor}
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```
