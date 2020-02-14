---
id: version-4.x-upgrading-from-3.x
title: Upgrading from 3.x
sidebar_label: Upgrading from 3.x
original_id: upgrading-from-3.x
---

In React Navigation 4, we've extracted out the navigators to separate packages to make it easier to maintain and release updates faster. You can follow the guide below to upgrade your projects.

## Upgrading

> **NOTE**: Before making these changes, we recommend you to commit all local changes to git so you can revert back to a good state if something goes wrong with the upgrade.

### Install the new packages

First, we need to install the `react-navigation` package along with the various navigators. If you don't use some of these navigators, you can omit them.

To install them, run:

```sh
npm install react-navigation react-navigation-stack@^1.7.3 react-navigation-tabs@^1.2.0 react-navigation-drawer@^1.4.0
```

This will install the versions compatible with your code if you were using `react-navigation@3.x`, so you wouldn't need any more changes beyond changing the imports.

> **NOTE**: If you have `@react-navigation/core` or `@react-navigation/native` in your `package.json`, please remove them and change the imports to import from `react-navigation` package instead.

### Changing your code

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

### Upgrading navigators (optional)

You don't need to upgrade the navigators to their latest version when upgrading to `react-navigation@4.x`. You can upgrade them separately later as per your convenience.

> **NOTE**: We recommend to do these changes in a separate commit so you can revert back to a good state if something goes wrong with the upgrade.

#### Installing dependencies

The latest drawer and tabs depend on [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler) and [`react-native-reanimated`](https://github.com/kmagiera/react-native-reanimated). If you already have these libraries installed and at the latest version, you are done here! Otherwise, read on for installation instructions for these dependencies.

##### Installing dependencies into an Expo managed project

In your project directory, run the following:

```sh
expo install react-native-gesture-handler react-native-reanimated
```

This will install versions of these libraries that are compatible.

##### Installing dependencies into a bare React Native project

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

#### Upgrading packages

To upgrade `react-navigation-tabs`, run:

```sh
npm install react-navigation-tabs
```

For list of breaking changes, refer to the [release notes](https://github.com/react-navigation/tabs/releases/tag/v2.0.0).

To upgrade `react-navigation-drawer`, run:

```sh
npm install react-navigation-drawer
```

For list of breaking changes, refer to the [release notes](https://github.com/react-navigation/drawer/releases/tag/v2.0.0).

#### More info

For more info and release notes, please refer to the individual packages:

- [`react-navigation-stack`](https://github.com/react-navigation/stack) ([Changelog](https://github.com/react-navigation/stack/releases))
- [`react-navigation-drawer`](https://github.com/react-navigation/drawer) ([Changelog](https://github.com/react-navigation/stack/releases))
- [`react-navigation-tabs`](https://github.com/react-navigation/tabs) ([Changelog](https://github.com/react-navigation/stack/releases))

### TypeScript

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

See the [TypeScript guide](typescript.html) for more details.

TypeScript support is still a work in progress, so please open an issue if you're facing a problem.
