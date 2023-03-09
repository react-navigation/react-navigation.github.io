---
id: upgrading-from-3.x
title: Upgrading from 3.x
sidebar_label: Upgrading from 3.x
---

In React Navigation 4, we've extracted out the navigators to separate packages to make it easier to maintain and release updates faster. You can follow the guide below to upgrade your projects.

> Note: Before making these changes, we recommend you to commit all local changes to git so you can revert back to a good state if something goes wrong with the upgrade.

## Install the new packages

First, we need to install the `react-navigation` package along with the various navigators. If you don't use some of these navigators, you can omit them.

To install them, run:

```bash npm2yarn
npm install react-navigation react-navigation-stack@^1.7.3 react-navigation-tabs@^1.2.0 react-navigation-drawer@^1.4.0
```

This will install the versions compatible with your code if you were using `react-navigation@3.x`, so you wouldn't need any more changes beyond changing the imports.

> Note: If you have `@react-navigation/core` or `@react-navigation/native` in your `package.json`, please remove them and change the imports to import from `react-navigation` package instead.

## Changing your code

Then change any imports for stack, tabs or drawer to import from the above packages instead of `react-navigation`.

```diff
- import { createAppContainer, createStackNavigator } from 'react-navigation';
+ import { createAppContainer } from 'react-navigation';
+ import { createStackNavigator } from 'react-navigation-stack';
```

The following imports need to be changed to import from `react-navigation-stack`:

- `createStackNavigator`
- `StackGestureContext`
- `Transitioner`
- `StackView`
- `StackViewCard`
- `StackViewTransitionConfigs`
- `Header`
- `HeaderTitle`
- `HeaderBackButton`
- `HeaderStyleInterpolator`

The following imports need to be changed to import from `react-navigation-tabs`:

- `createBottomTabNavigator`
- `createMaterialTopTabNavigator`
- `BottomTabBar`
- `MaterialTopTabBar`

The following imports need to be changed to import from `react-navigation-drawer`:

- `createDrawerNavigator`
- `DrawerGestureContext`
- `DrawerRouter`
- `DrawerActions`
- `DrawerView`
- `DrawerNavigatorItems`
- `DrawerSidebar`

## Upgrading navigators (optional)

You don't need to upgrade the navigators to their latest version when upgrading to `react-navigation@4.x`. You can upgrade them separately later as per your convenience.

> Note: We recommend to do each of these changes in a separate commit so you can revert back to a good state if something goes wrong with the upgrade.

### Installing dependencies

The latest drawer and tabs depend on [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) and [`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated). If you already have these libraries installed and at the latest version, you are done here! Otherwise, read on for installation instructions for these dependencies.

#### Installing dependencies into an Expo managed project

In your project directory, run the following:

```sh
npx expo install react-native-gesture-handler react-native-reanimated
```

This will install versions of these libraries that are compatible.

#### Installing dependencies into a bare React Native project

In your project directory, run `npm install react-native-reanimated react-native-gesture-handler react-native-screens`.

Next, we need to link these libraries. The steps depends on your React Native version:

- **React Native 0.60 and higher**

  On newer versions of React Native, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

  To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

  ```sh
  cd ios
  pod install
  cd ..
  ```

- **React Native 0.59 and lower**

  If you're on an older React Native version, you need to manually link the dependencies. To do that, run:

  ```sh
  react-native link react-native-reanimated
  react-native link react-native-gesture-handler
  ```

To finalize installation of `react-native-gesture-handler` for Android, make the following modifications to `MainActivity.java`:

```diff
package com.reactnavigation.example;

import com.facebook.react.ReactActivity;
+ import com.facebook.react.ReactActivityDelegate;
+ import com.facebook.react.ReactRootView;
+ import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Example";
  }

+  @Override
+  protected ReactActivityDelegate createReactActivityDelegate() {
+    return new ReactActivityDelegate(this, getMainComponentName()) {
+      @Override
+      protected ReactRootView createRootView() {
+       return new RNGestureHandlerEnabledRootView(MainActivity.this);
+      }
+    };
+  }
}
```

### Upgrading packages

#### `react-navigation-tabs`

To upgrade `react-navigation-tabs`, run:

```bash npm2yarn
npm install react-navigation-tabs
```

This version upgrades [`react-native-tab-view`](https://github.com/react-navigation/react-navigation/tree/main/packages/react-native-tab-view) to 2.x. As a result, the animations in `createMaterialTopTabNavigator` now use the [`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated) library.

##### Breaking changes

- If you have a custom tab bar in `createMaterialTopTabNavigator` which uses the `position` prop, you'll need to update it to use `Animated` from `react-native-reanimated` instead of `react-native`.
- The `activeTintColor` and `inactiveTintColor` options for the tab bar of `createMaterialTopTabNavigator` now controls the opacity of the label and icons as well.
- The `animationsEnabled` and `optimizationsEnabled` options have been removed from `createMaterialTopTabNavigator`.
- Support for React < 16.3 has been dropped, which means the minimum supported React Native version is now 0.56.

##### New features

- A new `lazyPlaceholderComponent` option is added which lets you show a placeholder for lazy loaded tabs.

#### `react-navigation-drawer`

To upgrade `react-navigation-drawer`, run:

```bash npm2yarn
npm install react-navigation-drawer
```

This version upgrades now uses the [`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated) library for animations. This means, if you're using the `drawerProgress` value, you'll need to migrate your code to use `Animated` from `react-native-reanimated`.

#### `react-navigation-stack`

To upgrade `react-navigation-stack`, run:

```bash npm2yarn
npm install react-navigation-stack
```

In this release, we have moved several options into `navigationOptions` so that you can configure options per screen instead of per navigator. This lets you do things like customize animations for a particular screen, set options based on `screenProps` etc. Usage of built-in components such as `Header` and `HeaderBackButton` has also been simplified. Other changes are made to improve consistency within the API.

From this version, all state changes have an animation, including `replace` and `reset` which didn't do an animation previously. If you don't want animations, you can specify `animationEnabled: false` in `navigationOptions` for a specific screen, or in `defaultNavigationOptions` for the whole navigator.

> Note: The alpha versions for 2.0 used Reanimated for the animations. We've replaced Reanimated with React Native's Animated API in the stable release. If you did any custom animations with the alpha, please migrate your code to the Animated API.

##### New peer dependencies

The new version requires 2 new peer dependencies. To install them in your project, run:

```bash npm2yarn
npm install react-native-safe-area-context @react-native-community/masked-view
```

##### Stack Navigator config

The following configuration options have been removed or moved:

- `cardShadowEnabled` - moved to `navigationOptions`
- `cardOverlayEnabled` - moved to `navigationOptions`
- `cardStyle` - moved to `navigationOptions`
- `transparentCard` - removed in favor of `cardStyle: { backgroundColor: 'transparent' }` in `navigationOptions`
- `headerBackTitleVisible` - moved to `navigationOptions`
- `headerLayoutPreset` - moved to `navigationOptions` as `headerTitleAlign`
- `onTransitionStart` - moved to `navigationOptions`
- `onTransitionEnd` - moved to `navigationOptions`
- `headerTransitionPreset` - removed in favor of [new APIs for animations](stack-navigator.md#animations) in `navigationOptions`
- `transitionConfig` - removed in favor of [new APIs for animations](stack-navigator.md#animations) in `navigationOptions`

##### `navigationOptions`

The following `navigationOptions` have been removed or changed:

- `headerForceInset` - use `safeAreaInsets` instead to control the safe areas, or use `headerStatusBarHeight` to control the padding for the status bar.
- `gesturesEnabled` - renamed to `gestureEnabled` for consistency.
- `header` - now accepts a function returning react element instead, use `headerShown: false` instead of `header: null` to hide the header.
- `headerTitle` - now accepts a function returning a React element or a string.
- `headerLeft` - now accepts a function returning a React element.
- `headerRight` - now accepts a function returning a React element.
- `headerBackImage` - now accepts a function returning a React element.
- `headerBackTitle` - now specifies the back title visible in current screen instead of next, specifying `null` no longer hides back title, use `backTitleVisible` instead, for a screen to change next screen's back title, it can pass params.
- `headerBackground` - now accepts a function returning a React element.

The following `navigationOptions` have been added:

- `gestureEnabled`
- `animationEnabled`
- `headerTitleAlign`
- `cardShadowEnabled`
- `cardOverlayEnabled`
- `cardStyle`
- `headerBackgroundStyle`
- `headerBackTitleVisible`
- `swipeVelocityImpact`
- `onTransitionStart`
- `onTransitionEnd`

You can find more details about these options in the [documentation](stack-navigator.md#navigationoptions-for-screens-inside-of-the-navigator).

##### Library exports

The library now exports the following items:

- `createStackNavigator`
- `StackView`
- `Header`
- `HeaderTitle`
- `HeaderBackButton`
- `HeaderBackground`
- `CardStyleInterpolators`
- `HeaderStyleInterpolators`
- `TransitionSpecs`
- `TransitionPresets`
- `CardAnimationContext`
- `GestureHandlerRefContext`
- `HeaderHeightContext`
- `useCardAnimation`
- `useHeaderHeight`
- `useGestureHandlerRef`

The following components now receive different set of props, so if you use them, or use your own custom component, you will need to update them:

###### `Header` (`header` option)

- `mode`
- `layout`
- `scene`
- `previous`
- `navigation`
- `styleInterpolator`

###### `HeaderBackButton` (`headerLeft` option)

- `disabled`
- `onPress`
- `pressColorAndroid`
- `backImage`
- `tintColor`
- `label`
- `truncatedLabel`
- `labelVisible`
- `labelStyle`
- `allowFontScaling`
- `onLabelLayout`
- `screenLayout`
- `titleLayout`
- `canGoBack`

##### Removal of `Transitioner`

The old `Transitioner` component has been removed as a result of rewrite of the animation logic. We're not going to expose the new animation logic since it's internal implementation detail and we want to be able to change it without breaking your code. If you need `Transitioner` in your project for some reason, you can copy the old files into your project <https://github.com/react-navigation/stack/blob/1.0/src/views/Transitioner.tsx>

## TypeScript

If you're using TypeScript, you'll also need to upgrade the navigators to the latest version following the previous section. Since the navigators have been extracted out, navigator specific types have been removed from the main package. You'll need to update the types accordingly:

- Replace `NavigationScreenProp` with:
  - `NavigationSwitchProp` for `createSwitchNavigator` from `react-navigation`
  - `NavigationStackProp` for `createStackNavigator` from `react-navigation-stack`
  - `NavigationTabProp` for `createBottomTabNavigator` and `createMaterialTopTabNavigator` from `react-navigation-tabs`
  - `NavigationDrawerProp` for `createDrawerNavigator` from `react-navigation-drawer`
- Replace `NavigationScreenProps` with:
  - `NavigationSwitchScreenProps` for `createSwitchNavigator` from `react-navigation`
  - `NavigationStackScreenProps` for `createStackNavigator` from `react-navigation-stack`
  - `NavigationTabScreenProps` for `createBottomTabNavigator` and `createMaterialTopTabNavigator` from `react-navigation-tabs`
  - `NavigationDrawerScreenProps` for `createDrawerNavigator` from `react-navigation-drawer`
- Replace `NavigationScreenOptions` with:
  - `NavigationStackOptions` for `createStackNavigator` from `react-navigation-stack`
  - `NavigationBottomTabOptions` for `createBottomTabNavigator` from `react-navigation-tabs`
  - `NavigationMaterialTabOptions` for `createMaterialTopTabNavigator` from `react-navigation-tabs`
  - `NavigationDrawerOptions` for `createDrawerNavigator` from `react-navigation-drawer`
- Replace `NavigationScreenComponent` with:
  - `NavigationSwitchScreenComponent` for `createSwitchNavigator` from `react-navigation`
  - `NavigationStackScreenComponent` for `createStackNavigator` from `react-navigation-stack`
  - `NavigationBottomTabScreenComponent` for `createBottomTabNavigator` from `react-navigation-tabs`
  - `NavigationMaterialTabScreenComponent` for `createMaterialTopTabNavigator` from `react-navigation-tabs`
  - `NavigationDrawerScreenComponent` for `createDrawerNavigator` from `react-navigation-drawer`

See the [TypeScript guide](typescript.md) for more details.

TypeScript support is still a work in progress, so please open an issue if you're facing a problem.
