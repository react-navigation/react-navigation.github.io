---
id: upgrading-from-5.x
title: Upgrading from 5.x
sidebar_label: Upgrading from 5.x
---

React Navigation 6 keeps the same API as React Navigation 5, however there are some breaking changes to make the API more consistent, more flexible and less confusing.

This guide lists all the changes and new features that you need to keep in mind when upgrading.

### Minimum Requirements

React Navigation 6 requires newer versions of following libraries:

- `react-native-safe-area-context` >= 3.0.0
- `react-native-screens` >= 2.15.0
- `react-native-tab-view` >= 3.0.0
- `react-native` >= 0.63.0
- `expo` >= 41 (if you use [Expo](https://expo.io))
- `typescript` >= 4.1.0 (if you use [TypeScript](https://www.typescriptlang.org))

To upgrade `react-native-safe-area-context` and `react-native-screens` to the latest supported versions, do the following:

:::warning

If your react-native Version is 0.63.4 or lower, don't use `react-native-safe-area-context` in Version 4, but only till 3.4.1. [More Information see here](https://github.com/th3rdwave/react-native-safe-area-context/issues/248)

:::

For Expo managed projects:

```bash
npx expo install react-native-safe-area-context react-native-screens
```

For bare React Native projects:

```bash npm2yarn
npm install react-native-safe-area-context react-native-screens
```

Note that latest versions of `react-native-screens` are now enabled by default. So you will need to disable it manually if you can't have it enabled for some reason.

## Table of breaking changes and deprecations

The upgrade guide includes both new features as well as breaking changes across all packages. The table below is for your convenience to quickly find the list of all the breaking changes and deprecations.

### Breaking changes

The following breaking changes may break your app if you're using the related APIs. So you may need to change your code when upgrading.

- General changes: These changes affect all React Navigation users.
  - [Params are now overwritten on navigation instead of merging](#params-are-now-overwritten-on-navigation-instead-of-merging)
  - [Dropped `dangerously` from `dangerouslyGetParent` and `dangerouslyGetState`](#dropped-dangerously-from-dangerouslygetparent-and-dangerouslygetstate)
  - [No more `state` property on the `route` prop](#no-more-state-property-on-the-route-prop)
  - [Linking configuration is now stricter](#linking-configuration-is-now-stricter)
  - [Dropped useLinking hook](#dropped-uselinking-hook)
  - [The default value for `backBehavior` is now `firstRoute` for tabs and drawer](#the-default-value-for-backbehavior-is-now-firstroute-for-tabs-and-drawer)
  - [Stricter types for TypeScript](#stricter-types-for-typescript)

- Stack Navigator: These changes affect users of `@react-navigation/stack` package.
  - [Custom header now uses `'headerMode: screen'` by default](#custom-header-now-uses-headermode-screen-by-default)
  - [Header now uses flexbox](#header-now-uses-flexbox)
  - [Props passed to custom header are streamlined](#props-passed-to-custom-header-are-streamlined)
  - [The `gestureResponseDistance` option is now a number instead of an object](#the-gestureresponsedistance-option-is-now-a-number-instead-of-an-object)
  - [Some exports are now moved to the element library](#some-exports-are-now-moved-to-the-element-library)

- Bottom Tab Navigator: These changes affect users of `@react-navigation/bottom-tabs` package.
  - [A header is shown by default in tab screens](#a-header-is-shown-by-default-in-tab-screens)

- Material Top Tab Navigator: These changes affect users of `@react-navigation/material-top-tabs` package.
  - [Material Top Tabs now uses `ViewPager` instead of Reanimated and Gesture Handler](#material-top-tabs-now-uses-viewpager-instead-of-reanimated-and-gesture-handler)

- Material Bottom Tab Navigator: These changes affect users of `@react-navigation/material-bottom-tabs` package.
  - [Material Bottom Tabs now uses `react-native-safe-area-context` to apply safe area insets](#material-bottom-tabs-now-uses-react-native-safe-area-context-to-apply-safe-area-insets)

- Drawer Navigator: These changes affect users of `@react-navigation/drawer` package.
  - [A header is shown by default in drawer screens](#a-header-is-shown-by-default-in-drawer-screens)
  - [Slide animation is now default on iOS](#slide-animation-is-now-default-on-ios)
  - [Drawer status is now a string instead of a boolean](#drawer-status-is-now-a-string-instead-of-a-boolean)
  - [Drawer no longer emits `drawerOpen` and `drawerClose` events](#drawer-no-longer-emits-draweropen-and-drawerclose-events)

### Deprecations

The following changes will show deprecation warnings if you're using the related APIs, but your code will continue to work and may be updated at a later date.

- Stack Navigator: These changes affect users of `@react-navigation/stack` package.
  - [`headerMode="none"` is removed in favor of `headerShown: false`](#headermodenone-is-removed-in-favor-of-headershown-false)
  - [`headerMode` is moved to options](#headermode-is-moved-to-options)
  - [`mode="modal"` is removed in favor of `presentation: 'modal'`](#modemodal-is-removed-in-favor-of-presentation-modal)
  - [`keyboardHandlingEnabled` is moved to options](#keyboardhandlingenabled-is-moved-to-options)

- Bottom Tab Navigator: These changes affect users of `@react-navigation/bottom-tabs` package.
  - [The `tabBarOptions` prop is removed in favor of more flexible `options` for bottom tabs](#the-tabbaroptions-prop-is-removed-in-favor-of-more-flexible-options-for-bottom-tabs)
  - [The `tabBarVisible` option is no longer present](#the-tabbarvisible-option-is-no-longer-present)
  - [The `lazy` prop is moved to `lazy` option for per-screen configuration for bottom tabs](#the-lazy-prop-is-moved-to-lazy-option-for-per-screen-configuration-for-bottom-tabs)

- Material Top Tab Navigator: These changes affect users of `@react-navigation/material-top-tabs` package.
  - [The `tabBarOptions` prop is removed in favor of more flexible `options` for material top tabs](#the-tabbaroptions-prop-is-removed-in-favor-of-more-flexible-options-for-material-top-tabs)
  - [The `lazy` prop is moved to `lazy` option for per-screen configuration for material top tabs](#the-lazy-prop-is-moved-to-lazy-option-for-per-screen-configuration-for-material-top-tabs)
  - [The `lazyPlaceholder` prop is moved to `lazyPlaceholder` option for per-screen configuration for material top tabs](#the-lazyplaceholder-prop-is-moved-to-lazyplaceholder-option-for-per-screen-configuration-for-material-top-tabs)

- Drawer Navigator: These changes affect users of `@react-navigation/drawer` package.
  - [The `drawerContentOptions` prop is removed in favor of more flexible `options` for drawer](#the-drawercontentoptions-prop-is-now-more-flexible-by-moving-to-options-for-drawer)
  - [The `lazy` prop is moved to `lazy` option for per-screen configuration for drawer](#the-lazy-prop-is-moved-to-lazy-option-for-per-screen-configuration-for-bottom-tabs)

## Note on mixing React Navigation 5 and React Navigation 6 packages

To make upgrading easier, it is possible to mix packages from the `6.x.x` and `5.x.x` version ranges. However, there are a few things you need to keep in mind:

- If you're using `@react-navigation/native@5.x.x` and navigators with `6.x.x` version:
  - You need to have latest `5.x.x` version of `@react-navigation/native` package installed which includes some backported APIs.
  - You don't need to worry about any of the breaking changes under "General changes" section. They are only applicable when you upgrade `@react-navigation/native` package.

- If you're using `@react-navigation/native@6.x.x` and any navigators with `5.x.x` version:
  - Make sure to pay attention to the breaking changes under "General changes" section. Everything else should work as expected.

In both cases, if you use TypeScript, you may encounter type errors when using mixing `5.x.x` and `6.x.x` due to changes in types. We suggest ignoring those errors until you can upgrade your packages.

## General changes

These following changes are in the core library. You'll need to address this changes when upgrading the `@react-navigation/native` package.

To install the 6.x version of `@react-navigation/native`, run:

```bash npm2yarn
npm install @react-navigation/native@^6.x
```

### Params are now overwritten on navigation instead of merging

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

A common scenario where you should use `merge: true` is if you have a custom tab bar, since it's not expected that params will be overwritten when you change the tab by tapping on the tab bar.

### Dropped `dangerously` from `dangerouslyGetParent` and `dangerouslyGetState`

The `dangerouslyGetParent` and `dangerouslyGetState` methods on the `navigation` prop are useful in many scenarios, and sometimes necessary. So we dropped the `dangerously` prefix to make it clear that it's safe to use. Now you can use [`navigation.getParent`](navigation-prop.md#getparent) and [`navigation.getState()`](navigation-prop.md#getstate).

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

### `Link` and `useLinkProps` can now accept screen names

Earlier, the `Link` component could only accept a path string. Now you can pass an object which specifies the screen name to navigate to, and any params to pass:

```js
<Link
  to={{
    screen: 'Profile',
    params: { id: 'jane' },
  }}
>
  Go to Jane's profile
</Link>
```

See [`useLinkProps`](use-link-props.md) docs for more details.

### New `Group` component

The new `Group` component is useful for grouping similar screens together. You can use it to pass some common options to a bunch of screens.

For example, you can use it for a bunch of regular screen and a bunch of modal screens without having to create 2 navigators:

```js
<Stack.Navigator>
  <Stack.Group
    screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Group>
  <Stack.Group screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="Share" component={ShareScreen} />
  </Stack.Group>
</Stack.Navigator>
```

See [`Group`](group.md) docs for more details.

### New `screenListeners` prop for navigators similar to `screenOptions`

It's now possible to add listeners for all of the screens in a navigator by using the `screenListeners` prop. This can be useful to listen to things like `tabPress` for all screens, `state` change at the navigator level etc.

See docs for [Navigation Events](navigation-events.md#screenlisteners-prop-on-the-navigator) for more details.

### New hook and helper for creating container ref

The new `useNavigationContainerRef` hook and `createNavigationContainerRef` helper are useful for simplifying adding a ref to to `NavigationContainer`.

See docs for [`NavigationContainer`](navigation-container.md#ref) and [Navigating without the navigation prop](navigating-without-navigation-prop.md) for more details and examples.

### `useNavigation`, `Link`, `useLinkProps` etc. now work outside a screen

Earlier, `useNavigation`, `Link`, `useLinkProps` etc. could only be used inside screens. But now it's possible to use them in any component that's a child of [`NavigationContainer`](navigation-container.md).

### The default value for `backBehavior` is now `firstRoute` for tabs and drawer

Returning to first route after pressing back seems more common in apps. To match this behavior, the tab navigators such as bottom tabs, material top taps, material bottom tabs etc., as well as drawer navigator now use `firstRoute` for the `backBehavior` prop. To preserve old behavior, you can pass `backBehavior="history"` prop to the navigators.

If you have your own custom navigator using `TabRouter` or `DrawerRouter`, it will also be affected by this change unless you have specified a `backbehavior`.

### Stricter types for TypeScript

The type definitions are now stricter, which makes it easier to catch errors earlier by minimizing unsafe types. For example, `useNavigation` now shows a type error if you don't specify a type.

You can handle this by [annotating it](typescript.md#annotating-usenavigation), or for an easier way, [specify a type for root navigator](typescript.md#specifying-default-types-for-usenavigation-link-ref-etc) which will be used for all usage of `useNavigation`.

### Ability to specify a type for root navigator when using TypeScript

Previously, we needed to specify a type for things such as `useNavigation`, `Link` etc. in every place we use them. But it's now possible to specify the type of the root navigator in one place that'll be used everywhere by default:

```ts
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

See [the docs for TypeScript](typescript.md#specifying-default-types-for-usenavigation-link-ref-etc) for more details.

### New `CompositeScreenProps` type for TypeScript

We now have a `CompositeScreenProps` helper similar to `CompositeNavigationProps` for usage with TypeScript. See [Combining navigation props](typescript.md#combining-navigation-props) for more details.

## Stack Navigator

The following changes are in the `@react-navigation/stack` package.

To install the 6.x version of `@react-navigation/stack`, run:

```bash npm2yarn
npm install @react-navigation/stack@^6.x
```

### `keyboardHandlingEnabled` is moved to options

Previously, `keyboardHandlingEnabled` was a prop on the navigator, but now it needs to be specified in screen's `options` instead. To keep previous behavior, you can specify it in `screenOptions`:

```js
<Stack.Navigator screenOptions={{ keyboardHandlingEnabled: false }}>
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="Profile" component={Profile} />
</Stack.Navigator>
```

### `mode="modal"` is removed in favor of `presentation: 'modal'`

Now there is a new `presentation` option which allows you to customize whether a screen is a modal or not on a per screen basis.

In addition, to match the default behavior of iOS, now `presentation: 'modal'` shows the new presentation style modal introduced in iOS 13. It also adjusts things like status bar height in the header automatically that you had to do manually before. In addition, the color of the statusbar content is automatically managed when the screen animates.

Previously Android didn't have any special animation for modals. But now there's a slide from bottom animation instead of the default animation.

If you don't want to use the new animations, you can change it to your liking using the [animation related options](stack-navigator.md#animations). To use the iOS modal animation from React Navigation 5, use `TransitionPresets.ModalSlideFromBottomIOS`.

In addition, a new `presentation: 'transparentModal'` option to make it easier to build transparent modals. See [transparent modals](stack-navigator.md#transparent-modals) docs for more details.

### Better support for mixing different types of animations in a single stack

Previously, it was sometimes necessary to nest 2 different stack navigators for certain animations, for example: when we wanted to use modal presentation style and regular styles.

It is now possible to mix regular screens with modal screens in the same stack, since these options don't need to be applied to the whole screen anymore.

### `headerMode="none"` is removed in favor of `headerShown: false`

Previously, you could pass `headerMode="none"` prop to hide the header in a stack navigator. However, there is also a [`headerShown`](stack-navigator.md#headershown) option which can be used to hide or show the header, and it supports configuration per screen.

So instead of having 2 ways to do very similar things, we have removed `headerMode="none"` in favor of `headerShown: false`. To get the old behavior, specify `headerShown: false` in `screenOptions`:

```js
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="Profile" component={Profile} />
</Stack.Navigator>
```

### `headerMode` is moved to options

Previously, `headerMode` was a prop on the navigator, but now it needs to be specified in screen's `options` instead. To keep previous behavior, you can specify it in `screenOptions`:

```js
<Stack.Navigator screenOptions={{ headerMode: 'screen' }}>
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="Profile" component={Profile} />
</Stack.Navigator>
```

The `headerMode` option supports 2 values: `screen` and `float`.

### Header is now taller in modals on iOS

The header is now 56dp tall in modals to match the native iOS style. If you are using the [`useHeaderHeight`](elements.md#useheaderheight) hook to get the height of the header, then you won't need to change any code.

### The header height from hidden header is now ignored

Previously, the [`useHeaderHeight`](elements.md#useheaderheight) hook returned `0` if the header was hidden in a Stack Navigator. Now it returns the height of the closes visible header instead.

### Custom header now uses 'headerMode: screen' by default

Previously it was necessary to specify `headerMode='screen'` or a custom animation manually when using a custom header. Even though this was mentioned in the docs, it has been tripped up many people.

But now specifying a custom header automatically sets `headerMode` to `screen`, so it doesn't need anything more. This is now possible because `headerMode` is no longer a prop for the navigator, so it can be configured per screen where a custom header is specified.

### Props passed to custom header are streamlined

Previously, the stack header accepted scene and previous scene which contained things such as `descriptor`, `navigation` prop, `progress` etc. The props are now simplified to following. See [header docs](stack-navigator.md#header) for the list.

If you have a custom header, you may need to adjust it to use the new props.

### Header now uses flexbox

The header elements were rendered using absolute positioning which didn't work well in certain situations. We now use flexbox for header elements which should work better.

This probably doesn't change anything for you, but if you have code which relied on the absolute positioning, you may need to change it.

### The `gestureResponseDistance` option is now a number instead of an object

Previously, the [`gestureResponseDistance`](stack-navigator.md#gestureresponsedistance) option took an object with `horizontal` and `vertical` properties. Now it takes a number which will be used as the horizontal or vertical value based on the [`gestureDirection`](stack-navigator.md#gesturedirection) option.

### The two finger back gesture on trackpads in iPad is now supported

On iPad, it's possible to use two fingers to perform the back gesture in native apps. It's now also possible in Stack Navigator.

### Fix accessibility on Web when `react-native-screens` wasn't enabled

Previously, unfocused screens were still accessible on Web even if `react-native-screens` was disabled. This is no longer the case. Note that this only works when animations are not enabled (this is the default on Web). Otherwise, you'd need to enable `react-native-screens` to make it work if you had it disabled.

### Some exports are now moved to the element library

The following exports now live in the elements library since they are no longer specific to the stack navigator:

- `Assets`
- `HeaderTitle`
- `HeaderBackButton`
- `HeaderBackground`
- `HeaderHeightContext`
- `useHeaderHeight`

See [below](#elements-library) for more details on installing the elements library.

## Native Stack Navigator

The `@react-navigation/native-stack` package is back. We made few changes to the API so that moving between `@react-navigation/stack` and `@react-navigation/native-stack` is easier. If you were using `react-native-screens/native-stack` before, then you'd need to make some changes to your code.

To install the 6.x version of `@react-navigation/native-stack`, run:

```bash npm2yarn
npm install @react-navigation/native-stack@^6.x
```

### Breaking changes from `react-native-screens/native-stack`

If you were importing `createNativeStackNavigator` from `react-native-screens/native-stack`, you need to keep the following changes in mind when migrating to `@react-navigation/native-stack` package:

#### Options of Native Stack

- `backButtonInCustomView` option is removed, it's now automatically set when necessary
- `headerCenter` option is removed, the `headerLeft`, `headerRight` and `headerTitle` options now work like they do in [Stack Navigator](stack-navigator.md)
- `headerHideBackButton` is changed to `headerBackVisible`
- `headerHideShadow` is changed to `headerShadowVisible`
- `headerLargeTitleHideShadow` is changed to `headerLargeTitleShadowVisible`
- `headerTranslucent` is changed to `headerTransparent`
- `headerBlurEffect` is now a separate option and no longer a property in `headerStyle`
- `headerTopInsetEnabled` option is removed, it's now automatically set when necessary
- `disableBackButtonMenu` is changed to `headerBackButtonMenuEnabled`
- `backButtonImage` is renamed to `headerBackImageSource`
- `searchBar` is renamed to `headerSearchBarOptions`
- `replaceAnimation` is renamed to `animationTypeForReplace`
- `stackAnimation` is renamed to `animation`
- `stackPresentation` is renamed to `presentation` - the value `push` is now called `card`
- `direction` option is removed, it's now automatically set based on `I18nManager.isRTL`

#### Events

The `appear` and `disappear` events have been removed in favor of `transitionStart` and `transitionEnd` events with `e.data.closing` indicating whether the screen is being opened or closed.

### Native Stack now works on web

Previously, `native-stack` could only be used on Android & iOS. But we also added basic web support so that you can write cross-platform apps without having to change your code.

## Bottom Tab Navigator

The following changes are in the `@react-navigation/bottom-tabs` package.

To install the 6.x version of `@react-navigation/bottom-tabs`, run:

```bash npm2yarn
npm install @react-navigation/bottom-tabs@^6.x
```

### A header is shown by default in tab screens

Tab screens now show a header by default similar to screens in a stack navigator. This avoid the need for nesting a stack navigator in each screen just for a header. See [its options](bottom-tab-navigator.md#options) to see all header related options.

To keep the previous behavior, you can use `headerShown: false` in `screenOptions`.

### The tab bar now shows a question mark when an icon isn't passed instead of empty area

Previously the tab bar in bottom tabs showed an empty area when no icon was specified. Now it shows a question mark to make it more obvious that the icon is missing.

### The `tabBarOptions` prop is removed in favor of more flexible `options` for bottom tabs

The `tabBarOptions` prop was removed and the options from there were moved to screen's `options` instead. This makes them configurable on a per screen basis.

The list of the options and their new name are follows:

- `keyboardHidesTabBar` -> `tabBarHideOnKeyboard`
- `activeTintColor` -> `tabBarActiveTintColor`
- `inactiveTintColor` -> `tabBarInactiveTintColor`
- `activeBackgroundColor` -> `tabBarActiveBackgroundColor`
- `inactiveBackgroundColor` -> `tabBarInactiveBackgroundColor`
- `allowFontScaling` -> `tabBarAllowFontScaling`
- `showLabel` -> `tabBarShowLabel`
- `labelPosition` -> `tabBarLabelPosition`
- `labelStyle` -> `tabBarLabelStyle`
- `iconStyle` -> `tabBarIconStyle`
- `tabStyle` -> `tabBarItemStyle`
- `style` -> `tabBarStyle`

The `adaptive` option is removed since you can already disable the automatic label positioning by specifying a `tabBarLabelPosition`.

The old options will still keep working with a deprecation warning. To avoid the deprecation warning, move these to `screenOptions`.

### The `tabBarVisible` option is no longer present

Since the tab bar now supports a `tabBarStyle` option, we have removed the `tabBarVisible` option. You can achieve the same behavior by specifying `tabBarStyle: { display: 'none' }` in `options`.

### The `lazy` prop is moved to `lazy` option for per-screen configuration for bottom tabs

The `lazy` prop now can be configured per screen instead of for the whole navigator. So it's moved to `options` from props. To keep previous behavior, you can specify it in `screenOptions` to apply it to all screens.

### New `tabBarBackground` option to specify custom backgrounds

The new `tabBarBackground` option is useful to add custom backgrounds to the tab bar such as images, gradients, blur views etc. without having to wrap the `TabBar` manually.

See docs for [`tabBarBackground`](bottom-tab-navigator.md#tabbarbackground) for more details.

## Material Top Tab Navigator

The following changes are in the `@react-navigation/material-top-tabs` package.

To install the 6.x version of `@react-navigation/material-top-tabs`, run:

```bash npm2yarn
npm install @react-navigation/material-top-tabs@^6.x react-native-tab-view
```

To upgrade `react-native-pager-view` to the latest supported version, do the following:

For Expo managed projects:

```bash
npx expo install react-native-pager-view
```

For bare React Native projects:

```bash npm2yarn
npm install react-native-pager-view
```

### Material Top Tabs now uses `ViewPager` instead of Reanimated and Gesture Handler

The `react-native-tab-view` dependency is upgraded to the latest version (3.x) which now uses [`react-native-pager-view`](https://github.com/callstack/react-native-pager-view) instead of Reanimated and Gesture Handler. This will provide a native UX and also improve the performance.

See [release notes for `react-native-tab-view`](https://github.com/satya164/react-native-tab-view/releases/tag/v3.0.0) for more details.

### The `tabBarOptions` prop is removed in favor of more flexible `options` for material top tabs

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

The old options will still keep working with a deprecation warning. To avoid the deprecation warning, move these to `screenOptions`.

### The `lazy` prop is moved to `lazy` option for per-screen configuration for material top tabs

Similar to bottom tabs, the `lazy` prop is now moved to `options` for material top tabs.

### The `lazyPlaceholder` prop is moved to `lazyPlaceholder` option for per-screen configuration for material top tabs

The `lazyPlaceholder` prop is now moved to `options` for material top tabs so you can configure a placeholder in each screen's options.

## Material Bottom Tab Navigator

The following changes are in the `@react-navigation/material-bottom-tabs` package.

To install the 6.x version of `@react-navigation/material-bottom-tabs`, run:

```bash npm2yarn
npm install @react-navigation/material-bottom-tabs@^6.x
```

### Material Bottom Tabs now uses `react-native-safe-area-context` to apply safe area insets

It's now necessary to install the `react-native-safe-area-context` package when using `@react-navigation/material-bottom-tab`, if you didn't have it already.

## Drawer Navigator

The following changes are in the `@react-navigation/drawer` package.

To install the 6.x version of `@react-navigation/drawer`, run:

```bash npm2yarn
npm install @react-navigation/drawer@^6.x
```

### Drawer now uses Reanimated 2 if available

There is a new implementation based on the latest [Reanimated](https://docs.swmansion.com/react-native-reanimated/) which will be used if it's available, otherwise drawer will fallback to the old implementation.

You can pass `useLegacyImplementation={true}` to `Drawer.Navigator` to force it to always use the old implementation if you need.

### A header is shown by default in drawer screens

Tab screens now show a header by default similar to screens in a stack navigator and bottom tab navigator. See [its options](bottom-tab-navigator.md#options) to see all header related options.

To keep the previous behavior, you can use `headerShown: false` in `screenOptions`.

### Slide animation is now default on iOS

Drawer now uses a slide animation by default on iOS. To keep the previous behavior, you can specify `drawerType="front"` in `screenOptions`.

### Drawer status is now a string instead of a boolean

Previously, the status of drawer was a `boolean` (`true` | `false`) to signify the open and closed states. It's now a string with the values `open` and `closed`. This will let us implement more types of status in future.

To match this change, the following APIs have been renamed as well:

- `getIsDrawerOpenFromState` -> `getDrawerStatusFromState`
- `useIsDrawerOpen` -> `useDrawerStatus`
- `openByDefault` -> `defaultStatus`

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

The old options will still keep working with a deprecation warning. To avoid the deprecation warning, move these to `screenOptions`.

### The `drawerContent` prop no longer receives `progress` in its argument

The callback passed to `drawerContent` no longer receives the animated `progress` value in its argument. Instead, you can use the `useDrawerProgress` hook to get the current progress value.

```js
function CustomDrawerContent(props) {
  const progress = useDrawerProgress();

  // ...
}

// ...

<Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
```

The `useDrawerProgress` hook returns a Reanimated `Node` or Reanimated `SharedValue` depending on the implementation used.

### The `lazy` prop is moved to `lazy` option for per-screen configuration for drawer

Similar to bottom tabs, the `lazy` prop is now moved to `options` for drawer.

## Elements Library

We have a new package which contains various UI elements related to navigation, such as a `Header` component. This means that we can now use these components in all navigators. You can also install the library to import components such as `Header` to use in any navigator:

```bash npm2yarn
npm install @react-navigation/elements@^6.x
```

Now you can import items from there:

```js
import { useHeaderHeight } from '@react-navigation/elements';
```

See the [Elements Library page](elements.md) for more details on what's available in the library.

## Developer tools

There's a new Flipper plugin for React Navigation to help you debug your navigation and deep link config.

See docs for [`useFlipper`](devtools.md#useflipper) for more details on how to install and configure it.
