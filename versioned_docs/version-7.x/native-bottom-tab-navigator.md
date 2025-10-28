---
id: native-bottom-tab-navigator
title: Native Bottom Tabs Navigator
sidebar_label: Native Bottom Tabs
---

:::warning

This navigator is currently experimental. The API will change in future releases.

Currently only iOS and Android are supported. Use [`createBottomTabNavigator`](bottom-tab-navigator.md) for web support.

:::

Native Bottom Tabs displays screens with a tab bar to switch between them.

The navigator uses native components on iOS and Android for better platform integration. On iOS, it uses `UITabBarController` and on Android, it uses `BottomNavigationView`.

## Installation

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/bottom-tabs`](https://github.com/react-navigation/react-navigation/tree/main/packages/bottom-tabs):

```bash npm2yarn
npm install @react-navigation/bottom-tabs
```

## Usage

To use this navigator, import it from `@react-navigation/bottom-tabs/unstable`:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Bottom Tab Navigator"
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';

const MyTabs = createNativeBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Bottom Tab Navigator"
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';

const Tab = createNativeBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

</TabItem>
</Tabs>

## API Definition

### Props

In addition to the [common props](navigator.md#configuration) shared by all navigators, the bottom tab navigator accepts the following additional props:

#### `backBehavior`

This controls what happens when `goBack` is called in the navigator. This includes pressing the device's back button or back gesture on Android.

It supports the following values:

- `firstRoute` - return to the first screen defined in the navigator (default)
- `initialRoute` - return to initial screen passed in `initialRouteName` prop, if not passed, defaults to the first screen
- `order` - return to screen defined before the focused screen
- `history` - return to last visited screen in the navigator; if the same screen is visited multiple times, the older entries are dropped from the history
- `fullHistory` - return to last visited screen in the navigator; doesn't drop duplicate entries unlike `history` - this behavior is useful to match how web pages work
- `none` - do not handle back button

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator. These can be specified under `screenOptions` prop of `Tab.Navigator` or `options` prop of `Tab.Screen`.

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarSystemItem`

Uses iOS built-in tab bar items with standard iOS styling and localized titles. Supported values:

- `bookmarks`
- `contacts`
- `downloads`
- `favorites`
- `featured`
- `history`
- `more`
- `mostRecent`
- `mostViewed`
- `recents`
- `search`
- `topRated`

If set to `search`, it's positioned next to the tab bar on iOS 26 and above.

The [`tabBarIcon`](#tabbaricon) and [`tabBarLabel`](#tabbarlabel) options will override the icon and label from the system item. If you want to keep the system behavior on iOS, but need to provide icon and label for other platforms, use `Platform.OS` or `Platform.select` to conditionally set `undefined` for `tabBarIcon` and `tabBarLabel` on iOS.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar.

Overrides the label provided by [`tabBarSystemItem`](#tabbarsystemitem) on iOS.

If not provided, or set to `undefined`:

- The system values are used if [`tabBarSystemItem`](#tabbarsystemitem) is set on iOS.
- Otherwise, it falls back to the [`title`](#title) or route name.

#### `tabBarLabelVisibilityMode`

The label visibility mode for the tab bar items. Supported values:

- `auto` - the system decides when to show or hide labels
- `selected` - labels are shown only for the selected tab
- `labeled` - labels are always shown
- `unlabeled` - labels are never shown

Only supported on Android.

#### `tabBarLabelStyle`

Style object for the tab label. Supported properties:

- `fontFamily`
- `fontSize`
- `fontWeight`
- `fontStyle`

Example:

```js
tabBarLabelStyle: {
  fontSize: 16,
  fontFamily: 'Georgia',
  fontWeight: 300,
},
```

#### `tabBarIcon`

Icon to display for the tab. It overrides the icon provided by [`tabBarSystemItem`](#tabbarsystemitem) on iOS.

It can be an icon object or a function that given `{ focused: boolean, color: string, size: number }` returns an icon object.

The icon can be of following types:

- Local image - Supported on iOS and Android

  ```js
  tabBarIcon: {
    type: 'image',
    source: require('./path/to/icon.png'),
  }
  ```

  On iOS, you can additionally pass a `tinted` property to control whether the icon should be tinted with the active/inactive color:

  ```js
  tabBarIcon: {
    type: 'image',
    source: require('./path/to/icon.png'),
    tinted: false,
  }
  ```

  The image is tinted by default.

- [SF Symbols](https://developer.apple.com/sf-symbols/) name - Supported on iOS

  ```js
  tabBarIcon: {
    type: 'sfSymbol',
    name: 'heart',
  }
  ```

- Drawable resource name - Supported on Android

  ```js
  tabBarIcon: {
    type: 'drawable',
    name: 'sunny',
  }
  ```

To render different icons for active and inactive states, you can use a function:

```js
tabBarIcon: ({ focused }) => {
  return {
    type: 'sfSymbol',
    name: focused ? 'heart' : 'heart-outline',
  };
},
```

This is only supported on iOS. On Android, the icon specified for inactive state will be used for both active and inactive states.

To provide different icons for different platforms, you can use [`Platform.select`](https://reactnative.dev/docs/platform-specific-code):

```js
tabBarIcon: Platform.select({
  ios: {
    type: 'sfSymbol',
    name: 'heart',
  },
  android: {
    type: 'drawable',
    name: 'heart_icon',
  },
});
```

#### `tabBarBadge`

Text to show in a badge on the tab icon. Accepts a `string` or a `number`.

#### `tabBarBadgeStyle`

Style for the badge on the tab icon. Supported properties:

- `backgroundColor`
- `color`

Example:

```js
tabBarBadgeStyle: {
  backgroundColor: 'yellow',
  color: 'black',
},
```

#### `tabBarActiveTintColor`

Color for the icon and label in the active tab.

#### `tabBarInactiveTintColor`

Color for the icon and label in the inactive tabs.

Only supported on Android.

#### `tabBarActiveIndicatorColor`

Background color of the active indicator.

Only supported on Android.

#### `tabBarActiveIndicatorEnabled`

Whether the active indicator should be used. Defaults to `true`.

Only supported on Android.

#### `tabBarRippleColor`

Color of the ripple effect when pressing a tab.

Only supported on Android.

#### `tabBarStyle`

Style object for the tab bar. Supported properties:

- `backgroundColor` - Only supported on Android and iOS 18 and below.
- `shadowColor` - Only supported on iOS 18 and below.

#### `tabBarBlurEffect`

Blur effect applied to the tab bar on iOS 18 and lower when tab screen is selected.

Supported values:

- `none` - no blur effect
- `systemDefault` - default blur effect applied by the system
- `extraLight`
- `light`
- `dark`
- `regular`
- `prominent`
- `systemUltraThinMaterial`
- `systemThinMaterial`
- `systemMaterial`
- `systemThickMaterial`
- `systemChromeMaterial`
- `systemUltraThinMaterialLight`
- `systemThinMaterialLight`
- `systemMaterialLight`
- `systemThickMaterialLight`
- `systemChromeMaterialLight`
- `systemUltraThinMaterialDark`
- `systemThinMaterialDark`
- `systemMaterialDark`
- `systemThickMaterialDark`
- `systemChromeMaterialDark`

Defaults to `systemDefault`.

Only supported on iOS 18 and below.

#### `tabBarControllerMode`

The display mode for the tab bar. Supported values:

- `auto` - the system sets the display mode based on the tab’s content
- `tabBar` - the system displays the content only as a tab bar
- `tabSidebar` - the tab bar is displayed as a sidebar

Only supported on iOS 18 and above. Not supported on tvOS.

#### `tabBarMinimizeBehavior`

The minimize behavior for the tab bar. Supported values:

- `auto` - resolves to the system default minimize behavior
- `never` - the tab bar does not minimize
- `onScrollDown` - the tab bar minimizes when scrolling down and
  expands when scrolling back up
- `onScrollUp` - the tab bar minimizes when scrolling up and expands
  when scrolling back down

Only supported on iOS 26 and above.

#### `lazy`

Whether this screen should render only after the first time it's accessed. Defaults to `true`. Set it to `false` if you want to render the screen on the initial render of the navigator.

#### `popToTopOnBlur`

Boolean indicating whether any nested stack should be popped to the top of the stack when navigating away from this tab. Defaults to `false`.

It only works when there is a stack navigator (e.g. [stack navigator](stack-navigator.md) or [native stack navigator](native-stack-navigator.md)) nested under the tab navigator.

### Header related options

The navigator renders a native stack header. It supports most of the [header related options supported in `@react-navigation/native-stack`](native-stack-navigator.md#header-related-options) apart from the options related to the back button (prefixed with `headerBack`).

### Events

The navigator can [emit events](navigation-events.md) on certain actions. Supported events are:

#### `tabPress`

This event is fired when the user presses the tab button for the current screen in the tab bar. By default a tab press does several things:

- If the tab is not focused, tab press will focus that tab
- If the tab is already focused:
  - If the screen for the tab renders a scroll view, you can use [`useScrollToTop`](use-scroll-to-top.md) to scroll it to top
  - If the screen for the tab renders a stack navigator, a `popToTop` action is performed on the stack

To prevent the default behavior, you can call `event.preventDefault`:

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

#### `transitionStart`

This event is fired when the transition animation starts for the current screen.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('transitionStart', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

#### `transitionEnd`

This event is fired when the transition animation ends for the current screen.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('transitionEnd', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

### Helpers

The tab navigator adds the following methods to the navigation object:

#### `jumpTo`

Navigates to an existing screen in the tab navigator. The method accepts following arguments:

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to use for the destination route.

```js
navigation.jumpTo('Profile', { owner: 'Michaś' });
```
