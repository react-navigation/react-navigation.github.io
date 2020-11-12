---
id: bottom-tab-navigator
title: createBottomTabNavigator
sidebar_label: createBottomTabNavigator
---

A simple tab bar on the bottom of the screen that lets you switch between different routes. Routes are lazily initialized -- their screen components are not mounted until they are first focused.

<div style={{ display: 'flex', margin: '16px 0' }}>
  <video playsInline autoPlay muted loop>
    <source src="/assets/navigators/tabs/bottom-tabs-demo.mov" />
  </video>
</div>

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/bottom-tabs`](https://github.com/react-navigation/react-navigation/tree/main/packages/bottom-tabs):

```bash npm2yarn
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

> For a complete usage guide please visit [Tab Navigation](tab-based-navigation.md)

### Props

The `Tab.Navigator` component accepts following props:

#### `initialRouteName`

The name of the route to render on first load of the navigator.

#### `screenOptions`

Default options to use for the screens in the navigator.

#### `backBehavior`

How the going back behaves in the navigator, e.g. when `goBack` is called or device back button is pressed.

- `initialRoute` to return to initial tab
- `order` to return to previous tab (in the order they are shown in the tab bar)
- `history` to return to last visited tab
- `none` to not handle back button

#### `lazy`

Defaults to `true`. If `false`, all tabs are rendered immediately. When `true`, tabs are rendered only when they are made active for the first time. Note: tabs are **not** re-rendered upon subsequent visits.

#### `detachInactiveScreens`

Boolean used to indicate whether inactive screens should be detached from the view hierarchy to save memory. Make sure to call `enableScreens` from [react-native-screens](https://github.com/software-mansion/react-native-screens) to make it work. Defaults to `true`.

#### `sceneContainerStyle`

Style object for the component wrapping the screen content.

#### `tabBar`

Function that returns a React element to display as the tab bar.

Example:

<samp id="custom-tab-bar" />

```js
import { View, Text, TouchableOpacity } from 'react-native';

function MyTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

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
            canPreventDefault: true,
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
            accessibilityState={isFocused ? { selected: true } : {}}
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

Note that you **cannot** use the `useNavigation` hook inside the `tabBar` since `useNavigation` is only available inside screens. You get a `navigation` prop for your `tabBar` which you can use instead:

```js
function MyTabBar({ navigation }) {
  return (
    <Button
      title="Go somewhere"
      onPress={() => {
        // Navigate using the `navigation` prop that you received
        navigation.navigate('SomeScreen');
      }}
    />
  );
}
```

#### `tabBarOptions`

An object containing the props for the default tab bar component. If you're using a custom tab bar, these will be passed as props to the tab bar and you can handle them.

It can contain the following properties:

##### `activeTintColor`

Label and icon color of the active tab item.

##### `inactiveTintColor`

Label and icon color of the inactive tab item.

##### `activeBackgroundColor`

Background color of the active tab item.

##### `inactiveBackgroundColor`

Background color of the inactive tab item.

##### `tabStyle`

Style object for the tab item.

##### `showLabel`

Whether to show label for tab, default is `true`.

##### `labelStyle`

Style object for the tab label text.

##### `labelPosition`

Whether the label is rendered below the icon or beside the icon. Possible values are:

- `below-icon`
- `beside-icon`

By default, in `vertical` orientation (portrait mode), label is rendered below the icon and in `horizontal` orientation (landscape mode)., it's rendered beside the icon.

##### `adaptive`

Should the tab icons and labels alignment change based on screen size? Defaults to `true`. If `false`, tab icons and labels align vertically all the time (`labelPosition: 'below-icon'`). When `true`, tab icons and labels align horizontally on tablets (`labelPosition: 'beside-icon'`).

##### `allowFontScaling`

Whether label font should scale to respect Text Size accessibility settings, default is true.

##### `keyboardHidesTabBar`

Whether the tab bar is hidden when the keyboard opens. Defaults to `false`.

##### `safeAreaInsets`

Safe area insets for the screen. This is used to avoid elements like notch and system navigation bar. By default, the device's safe area insets are automatically detected. You can override the behavior with this option.

Takes an object containing following optional properties:

- `top` - _number_ - The value of the top inset, e.g. area containing the status bar and notch.
- `right` - _number_ - The value of the left inset.
- `bottom` - _number_ - The value of the bottom inset, e.g. area navigation bar on bottom.
- `left`. - _number_ - The value of the right inset.

##### `style`

Style object for the tab bar. You can configure styles such as background color here.

To show your screen under the tab bar, you can set the `position` style to absolute:

```js
style: { position: 'absolute' }
```

You also might need to add a bottom margin to your content if you have a absolutely positioned tab bar. React Navigation won't do it automatically.

To get the height of the bottom tab bar, you can use `BottomTabBarHeightContext` with [React's Context API](https://reactjs.org/docs/context.html#contextconsumer) or `useBottomTabBarHeight`:

```js
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';

// ...

<BottomTabBarHeightContext.Consumer>
  {tabBarHeight => (
    /* render something */
  )}
</BottomTabBarHeightContext.Consumer>
```

or

```js
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

// ...

const tabBarHeight = useBottomTabBarHeight();
```

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator:

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarVisible`

`true` or `false` to show or hide the tab bar, if not set then defaults to `true`.

> Note: Hiding tab bar can cause glitches and jumpy behavior. We recommend [the tab navigator inside of a stack navigator instead](hiding-tabbar-in-screens.md).

#### `tabBarIcon`

Function that given `{ focused: boolean, color: string, size: number }` returns a React.Node, to display in the tab bar.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or a function that given `{ focused: boolean, color: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see `tabBarOptions.showLabel` in the previous section.

#### `tabBarBadge`

Text to show in a badge on the tab icon. Accepts a `string` or a `number`.

#### `tabBarBadgeStyle`

Style for the badge on the tab icon. You can specify a background color or text color here.

#### `tabBarButton`

Function which returns a React element to render as the tab bar button. It wraps the icon and label and implements `onPress`. Renders `TouchableWithoutFeedback` by default. `tabBarButton: props => <TouchableOpacity {...props} />` would use `TouchableOpacity` instead.

#### `tabBarAccessibilityLabel`

Accessibility label for the tab button. This is read by the screen reader when the user taps the tab. It's recommended to set this if you don't have a label for the tab.

#### `tabBarTestID`

ID to locate this tab button in tests.

#### `unmountOnBlur`

Whether this screen should be unmounted when navigating away from it. Unmounting a screen resets any local state in the screen as well as state of nested navigators in the screen. Defaults to `false`.

Normally, we don't recommend enabling this prop as users don't expect their navigation history to be lost when switching tabs. If you enable this prop, please consider if this will actually provide a better experience for the user.

### Events

The navigator can [emit events](navigation-events.md) on certain actions. Supported events are:

#### `tabPress`

This event is fired when the user presses the tab button for the current screen in the tab bar. By default a tab press does several things:

- If the tab is not focused, tab press will focus that tab
- If the tab is already focused:
  - If the screen for the tab renders a scroll view, you can use [`useScrollToTop`](use-scroll-to-top.md) to scroll it to top
  - If the screen for the tab renders a stack navigator, a `popToTop` action is performed on the stack

To prevent the default behavior, you can call `event.preventDefault`:

<samp id="bottom-tab-prevent-default" />

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

If you have a custom tab bar, make sure to emit this event.

#### `tabLongPress`

This event is fired when the user presses the tab button for the current screen in the tab bar for an extended period. If you have a custom tab bar, make sure to emit this event.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('tabLongPress', (e) => {
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

<samp id="tab-jump-to" />

```js
navigation.jumpTo('Profile', { owner: 'Michaś' });
```

## Example

<samp id="bottom-tab-example" />

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
          tabBarBadge: 3,
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
