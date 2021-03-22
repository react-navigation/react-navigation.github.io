---
id: upgrading-from-5.x
title: Upgrading from 5.x
sidebar_label: Upgrading from 5.x
---

React Navigation 6 keeps the same API as React Navigation 5, however there are some breaking changes to make the API more consistent, more flexible and less confusing.

This guide lists all the changes that you need to keep in mind when upgrading.

## General changes

These following changes are in the core library. You'll need to address this changes when upgrading the `@react-navigation/native` package.

### Older versions of some libraries are no longer supported

React Navigation now requires newer versions of following libraries:

- `react-native-safe-area-context` >= 3.0.0
- `react-native-screens` >= 2.15.0
- `react-native-tab-view` >= 3.0.0
- `react-native` >= 0.63.0
- `expo` - 40+ (if you use Expo)

### Params are now overwritten on navigation instead if merging

This is probably one of the biggest changes. When navigating to an existing screen, we've merged the new params with the existing params since the first version of React Navigation.

For example, let's say there's an existing `Post` screen with the following params:

```js
{
  postTitle: 'An amazing post',
  postBody: 'Amazing content for amazing post'
}
```

And you navigate to it with `navigation.navigate('Post', { postTitle: 'An okay post' })`, it'll have the following params:

```js
{
  postTitle: 'An okay post',
  postBody: 'Amazing content for amazing post'
}
```

While this merging behavior might be useful in some scenarios, it can be problematic in other cases. We also have had many bug reports where users were confused with this behavior.

So we're changing the default behavior in React Navigation 6 so that the params aren't merged by default anymore, and new params overwrite all existing params.

While the default has changed, it's still possible to merge params if you need it. To get the previous behavior, you can pass an object to `navigate` with `merge: true` and it'll merge the params:

```js
navigation.navigate({
  name: 'Post',
  params: { postTitle: 'An okay post' },
  merge: true,
});
```

### Dropped `dangerously` from `dangerouslyGetParent` and `dangerouslyGetState`

The `dangerouslyGetParent` and `dangerouslyGetState` methods on the `navigation` prop are useful in many scenarios, and sometimes necessary. So we dropped the `dangerously` prefix to make it clear than it's safe to use. Now you can use [`navigation.getParent()`](navigation-prop.md#getparent) and [`navigation.getState()`](navigation-prop.md#getstate).

### No more `state` property on the `route` prop

The `route` prop passed to components often contained a `state` property which held state of the child navigator. While it wasn't meant to be public and we recommended against using it in the docs, we've seen a lot of people use this property.

It's problematic to use the property since it's not guaranteed to exist before navigation happens in the child navigator. This can cause subtle bugs in your app which you might not notice during development. So we have started warning on using this property in React Navigation 5 and removed this property entirely in React Navigation 6 prevent its usage.

If you need to have some configuration based on which screen is focused in child navigator, you can still do it using the [getFocusedRouteNameFromRoute](screen-options-resolution.md#setting-parent-screen-options-based-on-child-navigators-state) utility.

### New `path` property on the `route` prop

The `route` prop will now contain a `path` property when opened from a deep link. You can use this property to further customize the content of the screen, e.g. load the page in a `WebView`. See [Handling unmatched routes or 404](configuring-links.md#handling-unmatched-routes-or-404) for more details.

### Linking configuration is now stricter

Older versions of React Navigation 5 had a slightly different configuration format for linking. The old config allowed a key value pair in the object regardless of nesting of navigators:

```js
const config = {
  Home: 'home',
  Feed: 'feed',
  Profile: 'profile',
  Settings: 'settings',
};
```

Let's say, your `Feed` and `Profile` screens are nested inside `Home`. Even if you don't have such a nesting with the above configuration, as long as the URL was `/home/profile`, it would work. Furthermore, it would also treat path segments and route names the same, which means that you could deep link to a screen that's not specified in the configuration. For example, if you have a `Albums` screen inside `Home`, the deep link `/home/Albums` would navigate to that screen. While that may be desirable in some cases, there's no way to prevent access to specific screens. This approach also makes it impossible to have something like a 404 screen since any route name is a valid path.

Newer versions of React Navigation 5 supported a different config format which is stricter in this regard:

- The shape of the config must match the shape of the nesting in the navigation structure
- Only screens defined in the config will be eligible for deep linking

So, you'd refactor the above config to the following format:

```js
const config = {
  screens: {
    Home: {
      path: 'home',
      screens: {
        Feed: 'feed',
        Profile: 'profile',
      },
    },
    Settings: 'settings',
  },
};
```

Here, there's a new `screens` property to the configuration object, and the `Feed` and `Profile` configs are now nested under `Home` to match the navigation structure.

While the old format still worked in React Navigation 5, React Navigation 6 drops support for the old format entirely in favor of the new stricter format.

### Dropped `useLinking` hook

The `useLinking` hook was the initial implementation of deep linking in React Navigation 5. Later, we moved to the `linking` prop to make it easier to handle deep links. The hook was still exported not to break existing apps using it.

In 6.x, we finally removed the hook in favor of the `linking` prop. If you're still using the `useLinking` hook, it should be pretty straightforward to migrate as you just need to pass the config to `linking` prop instead.

See [configuring links](configuring-links.md) for more details on configuring deep links.

## Stack Navigator

Thee following changes are in the `@react-navigation/stack` package.

### New default animations for modal screens

To match the default behavior of iOS, now `mode="modal"` shows the new presentation style modal introduced in iOS 13. It also adjusts things like status bar height in the header automatically that you had to do manually before.

Previously Android didn't have any special animation for modals. But now there's a slide from bottom animation instead of the default animation.

If you don't want to use the new animations, you can change it to your liking using the [animation related options](stack-navigator.md#animations)

### `headerMode="none"` is removed in favor of `headerShown: false`

Previously, you could pass `headerMode="none"` prop to hide the header in a stack navigator. However, there is also a [`headerShown`](stack-navigator.md#headershown) option which can be used to hide or show the header, and it supports configuration per screen.

So instead of having 2 ways to do very similar things, we have removed `headerMode="none"` in favor of `headerShown: false`. To get the old behavior, specify `headerShown: false` in `screenOptions`:

```js
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="Profile" component={Profile} />
</Stack.Navigator>
```

### `headerMode is moved to options

Previously, `headerMode` was a prop on the navigator, but now it needs to be specified in screen's `options` instead. To keep previous behavior, you can specify it in `screenOptions`:

```js
<Stack.Navigator screenOptions={{ headerMode: 'screen' }}>
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="Profile" component={Profile} />
</Stack.Navigator>
```

The `headerMode` option supports 2 values: `screen` and `float`.

### Custom header now uses 'headerMode: screen' by default

Previously it was necessary to specify `headerMode='screen'` or a custom animation manually when using a custom header. Even though this was mentioned in the docs, it has been tripped up many people.

But now specifying a custom header automatically sets `headerMode` to `screen`, so it doesn't need anything more. This is now possible because `headerMode` is no longer a prop for the navigator, so it can be configured per screen where a custom header is specified.

### Props passed to custom header are streamlined

Previously, the stack header accepted scene and previous scene which contained things such as `descriptor`, `navigation` prop, `progress` etc. The props are now simplified to following. See [header docs](stack-navigator.md#header) for the list.

If you have a custom header, you may need to adjust it to use the new props.

### Header now uses flexbox

The header elements were rendered using absolute positioning which didn't work well in certain situations. We now use flexbox for header elements which should work better. If you have code which relied on the absolute positioning, you'll need to change it.

### The `gestureResponseDistance` option is now a number instead of an object

Previously, the [`gestureResponseDistance`](stack-navigator.md#gestureresponsedistance) option took an object with `horizontal` and `vertical` properties. Now it takes a number which will be used as the horizontal or vertical value based on the [`gestureDirection`](stack-navigator.md#gesturedirection) option.

### Some exports are now moved to the element library

The following exports now live in the elements library since they are no longer specific to the stack navigator:

- `Assets`
- `HeaderTitle`
- `HeaderBackButton`
- `HeaderBackground`
- `HeaderHeightContext`
- `useHeaderHeight`

See [below](#elements-library) for more details on installing the elements library.

## Bottom Tab Navigator

The following changes are in the `@react-navigation/bottom-tabs` package.

### A header is shown by default in tab screens

Tab screens now show a header by default similar to screens in a stack navigator. This avoid the need for nesting a stack navigator in each screen just for a header. See [its options](bottom-tab-navigator.md#options) to see all header related options.

To keep the previous behavior, you can use `headerShown: false` in `screenOptions`.

### The tab bar now shows a question mark when an icon isn't passed instead of empty area

Previously the tab bar in bottom tabs showed an empty area when no icon was specified. Now it shows a question mark to make it more obvious that the icon is missing.

### The `tabBarOptions` prop is now more flexible by moving to `options` for bottom tabs

The `tabBarOptions` prop was removed and the options from there were moved to screen's `options` instead. This makes them configurable on a per screen basis.

The list of the options and their new name are follows:

- `keyboardHidesTabBar` -> `tabBarHideOnKeyboard`
- `activeTintColor` -> `tabBarActiveTintColor`
- `inactiveTintColor` -> `tabBarInactiveTintColor`
- `activeBackgroundColor` -> `tabBarActiveBackgroundColor`
- `inactiveBackgroundColor` -> `tabBarInactiveBackgroundColor`
- `allowFontScaling` -> `tabBarAllowFontScaling`
- `adaptive` -> `tabBarAdaptive`
- `showLabel` -> `tabBarShowLabel`
- `labelPosition` -> `tabBarLabelPosition`
- `labelStyle` -> `tabBarLabelStyle`
- `iconStyle` -> `tabBarIconStyle`
- `tabStyle` -> `tabBarItemStyle`
- `style` -> `tabBarStyle`

To keep the same behavior as before, you can specify these in `screenOptions`.

### The `tabBarVisible` option is no longer present

Since the the tab bar now supports a `tabBarStyle` option, we have removed the `tabBarVisible` option. You can achieve the same behavior by specifying `tabBarStyle: { display: 'none' }` in `options`.

### The `lazy` prop is moved to `lazy` option for per-screen configuration for bottom tabs

The `lazy` prop now can be configured per screen instead of for the whole navigator. So it's moved to `options` from props. To keep previous behavior, you can specify it in `screenOptions` to apply it to all screens.

### The default value for `backBehavior` is now `firstRoute` for bottom tabs

Returning to first route after pressing back seems more common in apps. To match this behavior, drawer now uses `firstRoute` for the `backBehavior` prop. To preserve old behavior, you can pass `backBehavior="history"` prop to the bottom tab navigator.

## Material Top Tab Navigator

The following changes are in the `@react-navigation/material-top-tabs` package.

### It now uses `ViewPager` instead of Reanimated and Gesture Handler

The `react-native-tab-view` dependency is upgraded to the latest version (3.x) which now uses [`ViewPager`](https://github.com/callstack/react-native-pager-view) instead of Reanimated and Gesture Handler. This will provide a native UX and also improve the performance.

See [release notes for `react-native-tab-view`](https://github.com/satya164/react-native-tab-view/releases/tag/v3.0.0) for more details.

### The `tabBarOptions` prop is now more flexible by moving to `options` for material top tabs

Similar to bottom tabs, the `tabBarOptions` prop was removed and the options from there were moved to screen's `options` instead.

The list of the options and their new name are follows:

- `activeTintColor` -> `tabBarActiveTintColor`
- `inactiveTintColor` -> `tabBarInactiveTintColor`
- `pressColor` -> `tabBarPressColor`
- `pressOpacity` -> `tabBarPressOpacity`
- `showLabel` -> `tabBarShowLabel`
- `showIcon` -> `tabBarShowIcon`
- `allowFontScaling` -> `tabBarAllowFontScaling`
- `bounces` -> `tabBarBounces`
- `scrollEnabled` ->`tabBarScrollEnabled`
- `iconStyle` -> `tabBarIconStyle`
- `labelStyle` -> `tabBarLabelStyle`
- `tabStyle` -> `tabBarItemStyle`
- `indicatorStyle` -> `tabBarIndicatorStyle`
- `indicatorContainerStyle` -> `tabBarIndicatorContainerStyle`
- `contentContainerStyle` -> `tabBarContentContainerStyle`
- `style` -> `tabBarStyle`

To keep the same behavior as before, you can specify these in `screenOptions`.

### The `lazy` prop is moved to `lazy` option for per-screen configuration for material top tabs

Similar to bottom tabs, the `lazy` prop is now moved to `options` for material top tabs.

### The default value for `backBehavior` is now `firstRoute` for material top tabs tabs

Similar to bottom tabs, material top tabs now uses `firstRoute` for the `backBehavior` prop as well.

## Material Bottom Tab Navigator

The following changes are in the `@react-navigation/material-bottom-tabs` package.

### The default value for `backBehavior` is now `firstRoute` for material bottom tabs

Similar to bottom tabs, material bottom tabs now uses `firstRoute` for the `backBehavior` prop as well.

## Drawer Navigator

The following changes are in the `@react-navigation/drawer` package.

### A header is shown by default in drawer screens

Tab screens now show a header by default similar to screens in a stack navigator and bottom tab navigator. See [its options](bottom-tab-navigator.md#options) to see all header related options.

To keep the previous behavior, you can use `headerShown: false` in `screenOptions`.

### Slide animation is now default on iOS

Drawer now uses a slide animation by default on iOS. To keep the previous behavior, you can specify `drawerType="front"` in `screenOptions`.

### Drawer status is now a string instead of a boolean

Previously, the status of drawer was a `boolean` (`true` | `false`) to signify the open and closed states. It's now a string with the values `open` and `closed`. This will let us implement more types of status in future.

To match this change, the following exports have been renamed as well:

- `getIsDrawerOpenFromState` -> `getDrawerStatusFromState`
- `useIsDrawerOpen` -> `useDrawerStatus`

### Drawer no longer emits `drawerOpen` and `drawerClose` events

The `drawerOpen` and `drawerClose` events are now removed because same information can be achieved from the following helpers:

- `useDrawerStatus` hook
- `getDrawerStatusFromState` helper (e.g. - `getDrawerStatusFromState(navigation.getState())`)

### The `drawerContentOptions` prop is now more flexible by moving to `options` for drawer

The `drawerContentOptions` prop was removed and the options from there were moved to screen's `options` instead. This makes them configurable on a per screen basis.

The following options have been moved without renaming:

- `drawerPosition`
- `drawerType`
- `keyboardDismissMode`
- `overlayColor`
- `gestureHandlerProps`

The following options have been moved and renamed:

- `hideStatusBar` -> `drawerHideStatusBarOnOpen`
- `statusBarAnimation` -> `drawerStatusBarAnimation`
- `edgeWidth` -> `swipeEdgeWidth`
- `minSwipeDistance` -> `swipeMinDistance`

To keep the same behavior as before, you can specify these in `screenOptions`.

### The `lazy` prop is moved to `lazy` option for per-screen configuration for drawer

Similar to bottom tabs, the `lazy` prop is now moved to `options` for drawer.

### The default value for `backBehavior` is now `firstRoute` for drawer

Similar to bottom tabs, drawer now uses `firstRoute` for the `backBehavior` prop as well.

## Elements Library

We have a new package which contains various UI elements related to navigation, such as a `Header` component. This means that we can now use these components in all navigators. You can also install the library to import components such as `Header` to use in any navigator:

```sh
npm install @react-navigation/elements@next
```

Now you can import items from there:

```js
import { useHeaderHeight } from '@react-navigation/elements';
```

See the [Elements Library page](elements.md) for more details on what's available in the library.
