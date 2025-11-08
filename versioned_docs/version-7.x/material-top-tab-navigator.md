---
id: material-top-tab-navigator
title: Material Top Tabs Navigator
sidebar_label: Material Top Tabs
---

A material-design themed tab bar on the top of the screen that lets you switch between different routes by tapping the tabs or swiping horizontally. Transitions are animated by default. Screen components for each route are mounted immediately.

<video playsInline autoPlay muted loop>
  <source src="/assets/7.x/material-top-tabs.mp4" />
</video>

This wraps [`react-native-tab-view`](tab-view.md). If you want to use the tab view without React Navigation integration, use the library directly instead.

## Installation

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/material-top-tabs`](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs):

```bash npm2yarn
npm install @react-navigation/material-top-tabs
```

The navigator depends on [`react-native-pager-view`](https://github.com/callstack/react-native-pager-view) for rendering the pages.

<Tabs groupId='framework' queryString="framework">
<TabItem value='expo' label='Expo' default>

If you have a Expo managed project, in your project directory, run:

```bash
npx expo install react-native-pager-view
```

</TabItem>
<TabItem value='community-cli' label='Community CLI'>

If you have a bare React Native project, in your project directory, run:

```bash npm2yarn
npm install react-native-pager-view
```

</TabItem>
</Tabs>

If you're on a Mac and developing for iOS, you also need to install [pods](https://cocoapods.org/) to complete the linking.

```bash
npx pod-install ios
```

## Usage

To use this navigator, import it from `@react-navigation/material-top-tabs`:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Material Top Tab Navigator" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// codeblock-focus-end
function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

// codeblock-focus-start
const MyTabs = createMaterialTopTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Material Top Tab Navigator" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

## API Definition

### Props

In addition to the [common props](navigator.md#configuration) shared by all navigators, the material top tabs navigator component accepts the following additional props:

#### `backBehavior`

This controls what happens when `goBack` is called in the navigator. This includes pressing the device's back button or back gesture on Android.

It supports the following values:

- `firstRoute` - return to the first screen defined in the navigator (default)
- `initialRoute` - return to initial screen passed in `initialRouteName` prop, if not passed, defaults to the first screen
- `order` - return to screen defined before the focused screen
- `history` - return to last visited screen in the navigator; if the same screen is visited multiple times, the older entries are dropped from the history
- `none` - do not handle back button

#### `tabBarPosition`

Position of the tab bar in the tab view. Possible values are `'top'` and `'bottom'`. Defaults to `'top'`.

#### `keyboardDismissMode`

String indicating whether the keyboard gets dismissed in response to a drag gesture. Possible values are:

- `'auto'` (default): the keyboard is dismissed when the index changes.
- `'on-drag'`: the keyboard is dismissed when a drag begins.
- `'none'`: drags do not dismiss the keyboard.

#### `initialLayout`

Object containing the initial height and width of the screens. Passing this will improve the initial rendering performance. For most apps, this is a good default:

```js
{
  width: Dimensions.get('window').width;
}
```

#### `style`

Style to apply to the tab view container.

#### `tabBar`

Function that returns a React element to display as the tab bar.

Example:

<samp id="material-top-tab-custom-tab-bar" />

```js
import { Animated, View, TouchableOpacity, Platform } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';

function MyTabBar({ state, descriptors, navigation, position }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

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
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            href={buildHref(route.name, route.params)}
            accessibilityRole={Platform.OS === 'web' ? 'link' : 'button'}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Animated.Text style={{ opacity, color: colors.text }}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ...

<Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
  {/* ... */}
</Tab.Navigator>;
```

This example will render a basic tab bar with labels.

Note that you **cannot** use the `useNavigation` hook inside the `tabBar` since `useNavigation` is only available inside screens. You get a `navigation` prop for your `tabBar` which you can use instead:

```js
function MyTabBar({ navigation }) {
  return (
    <Button
      onPress={() => {
        // Navigate using the `navigation` prop that you received
        // highlight-next-line
        navigation.navigate('SomeScreen');
      }}
    >
      Go somewhere
    </Button>
  );
}
```

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator:

Example:

<samp id="material-top-tab-options" />

```js
<Tab.Navigator
  screenOptions={{
    tabBarLabelStyle: { fontSize: 12 },
    tabBarItemStyle: { width: 100 },
    tabBarStyle: { backgroundColor: 'powderblue' },
  }}
>
  {/* ... */}
</Tab.Navigator>
```

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or a function that given `{ focused: boolean, color: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see [`tabBarShowLabel`](#tabbarshowlabel) option.

#### `tabBarAccessibilityLabel`

Accessibility label for the tab button. This is read by the screen reader when the user taps the tab. It's recommended to set this if you don't have a label for the tab.

#### `tabBarAllowFontScaling`

Whether label font should scale to respect Text Size accessibility settings.

#### `tabBarShowLabel`

Whether the tab label should be visible. Defaults to `true`.

#### `tabBarIcon`

Function that given `{ focused: boolean, color: string }` returns a React.Node, to display in the tab bar.

#### `tabBarShowIcon`

Whether the tab icon should be visible. Defaults to `false`.

#### `tabBarBadge`

Function that returns a React element to use as a badge for the tab.

#### `tabBarIndicator`

Function that returns a React element as the tab bar indicator.

#### `tabBarIndicatorStyle`

Style object for the tab bar indicator.

#### `tabBarIndicatorContainerStyle`

Style object for the view containing the tab bar indicator.

#### `tabBarButtonTestID`

ID to locate this tab button in tests.

#### `tabBarActiveTintColor`

Color for the icon and label in the active tab.

#### `tabBarInactiveTintColor`

Color for the icon and label in the inactive tabs.

#### `tabBarPressColor`

Color for material ripple (Android >= 5.0 only).

#### `tabBarPressOpacity`

Opacity for pressed tab (iOS and Android < 5.0 only).

#### `tabBarBounces`

Boolean indicating whether the tab bar bounces when overscrolling.

#### `tabBarScrollEnabled`

Boolean indicating whether to make the tab bar scrollable.

If you set this to `true`, you should also specify a width in `tabBarItemStyle` to improve the performance of initial render.

#### `tabBarLabelStyle`

Style object for the tab label.

#### `tabBarItemStyle`

Style object for the individual tab items.

#### `tabBarContentContainerStyle`

Style object for the view containing the tab items.

#### `tabBarStyle`

Style object for the tab bar.

#### `swipeEnabled`

Boolean indicating whether to enable swipe gestures. Swipe gestures are enabled by default. Passing `false` will disable swipe gestures, but the user can still switch tabs by pressing the tab bar.

#### `lazy`

Whether this screen should be lazily rendered. When this is set to `true`, the screen will be rendered as it comes into the viewport. By default all screens are rendered to provide a smoother swipe experience. But you might want to defer the rendering of screens out of the viewport until the user sees them. To enable lazy rendering for this screen, set `lazy` to `true`.

When you enable `lazy`, the lazy loaded screens will usually take some time to render when they come into the viewport. You can use the `lazyPlaceholder` prop to customize what the user sees during this short period.

#### `lazyPreloadDistance`

When `lazy` is enabled, you can specify how many adjacent screens should be preloaded in advance with this prop. This value defaults to `0` which means lazy pages are loaded as they come into the viewport.

#### `lazyPlaceholder`

Function that returns a React element to render if this screen hasn't been rendered yet. The `lazy` option also needs to be enabled for this to work.

This view is usually only shown for a split second. Keep it lightweight.

By default, this renders `null`.

#### `sceneStyle`

Style to apply to the view wrapping each screen. You can pass this to override some default styles such as overflow clipping.

### Events

The navigator can [emit events](navigation-events.md) on certain actions. Supported events are:

#### `tabPress`

This event is fired when the user presses the tab button for the current screen in the tab bar. By default a tab press does several things:

- If the tab is not focused, tab press will focus that tab
- If the tab is already focused:
  - If the screen for the tab renders a scroll view, you can use [`useScrollToTop`](use-scroll-to-top.md) to scroll it to top
  - If the screen for the tab renders a stack navigator, a `popToTop` action is performed on the stack

To prevent the default behavior, you can call `event.preventDefault`:

<samp id="material-top-tab-prevent-default" />

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

#### `tabLongPress`

This event is fired when the user presses the tab button for the current screen in the tab bar for an extended period.

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

The tab navigator adds the following methods to the navigation object:

#### `jumpTo`

Navigates to an existing screen in the tab navigator. The method accepts following arguments:

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to pass to the destination route.

<samp id="material-top-tab-jump-to" />

```js
navigation.jumpTo('Profile', { name: 'Michaś' });
```

### Hooks

The material top tab navigator exports the following hooks:

#### `useTabAnimation`

This hook returns an object containing an animated value that represents the current position of the tabs. This can be used to animate elements based on the swipe position of the tabs, such as the tab indicator:

```js
import { Animated } from 'react-native';
import { useTabAnimation } from '@react-navigation/material-top-tabs';

function MyView() {
  const { position } = useTabAnimation();

  return (
    <Animated.View
      style={{
        width: '50%',
        height: 2,
        backgroundColor: 'tomato',
        transform: [{ translateX: position }],
      }}
    />
  );
}
```
