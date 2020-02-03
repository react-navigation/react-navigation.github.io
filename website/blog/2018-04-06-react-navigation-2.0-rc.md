---
title: 2.0 release candidate
author: Core Team
authorURL: https://twitter.com/reactnavigation
---

Exactly two months after the release of React Navigation 1.0, we are close to another major version release. We’d like to invite developers that use the library to give the release candidate a try in your app and let us know if you encounter any issues.

```
yarn add react-navigation@^2.0.0-rc.1
```

The documentation for 2.0 is available at https://reactnavigation.org/

We’re bumping the major version because some of the changes in this release are backwards incompatible. That said, this should be a fairly easy upgrade. We are improving React Navigation incrementally because we don't want to leave developers feeling stranded in an old version. If you use React Navigation in a conventional way and don't have any custom navigators, I can't imagine this update would take you more than an hour.

This blog post is not a comprehensive changelog - that will come with the 2.0 proper release; the following is a list of the breaking changes, suggestions for how you can update your app to accommodate them, notice of deprecations, and some of my favourite new features.

## Breaking changes

### `navigate(routeName)` in StackNavigator is “less pushy”

In 1.x, `navigate(routeName)` and `push(routeName)` were very similar: every time you called `navigate(routeName)` it would push a new route to the stack, regardless. Now `navigate(routeName)` will first try to find an existing instance of the route and jump to that if it exists, otherwise it will push the route to the stack.

To update your app for this change you may need to change `navigate` to `push` in places where you would like to push a new route every time. Alternatively, you could consider using a `key`: `navigate({routeName: ‘MyRoute’, key: data.uniqueId, params: data})`. [Read more about navigation with keys](/docs/en/navigation-key.html).

Read more about this in [RFC 4](https://github.com/react-navigation/rfcs/blob/master/text/0004-less-pushy-navigate.md).

### `push` now propagates between routers like `navigate`

Previously, `push` only applied to the deepest active stack router. This meant that if you had Stack A > Stack B and Stack B fired `push(‘MyRoute’)`, even if Stack B does not have a route with the name `’MyRoute’` and Stack A does, the screen would not be pushed. We made this change to accommodate for the “less pushy” navigate behavior.

When updating your app, you may want to double check where you use `push`to ensure that this doesn’t impact the expected behavior of your app.

### Shallow navigation options

A common source of confusion for developers working with React Navigation has been around `navigationOptions` resolution. For example, if you have a stack navigator with a header, and a drawer inside of that stack, then in some circumstances the title of the stack would change every time you change screens in the drawer. This is because the stack navigator would crawl into child navigators and pull `navigationOptions` off of the deepest active screen. As of 2.0, this no longer happens: navigators will only look at their direct children for `navigationOptions`. Read more about this in [RFC 5](https://github.com/react-navigation/rfcs/blob/master/text/0005-shallow-navigation-options.md).

### New API for creating navigators

This does not impact most users, but if you have any custom navigators in your app, read on. Read more about the changes in [RFC 2](https://github.com/react-navigation/rfcs/blob/master/text/0002-navigator-view-api.md). Also read the [custom navigators documentation](https://reactnavigation.org/docs/en/custom-navigators.html).

### Drawer routes have been replaced with actions

Rather than opening a drawer with `navigation.navigate(‘DrawerOpen’)`, you can now call `navigation.openDrawer()`. Other methods are `closeDrawer()` and `toggleDrawer()`.

### Navigation actions API overhaul

In 1.x, functions on the `navigation` were not contextual - they would be the same regardless of whether your screen was inside of a drawer, a stack, a tab navigator, etc. In 2.0 the functions that are available to you on the `navigation` prop depend on the navigators that it corresponds to. If your screen is inside of both a stack and a drawer navigator, you will have helpers for both -- `push` and `openDrawer`, for example.

Given that we only exposed generic helpers (`navigate`, `goBack`) and helpers specific to the stack in 1.x, this would only impact you if you attempted to use the stack helpers from outside of a stack. For example, if you had a tab navigator with a stack in tab A and just a plain screen in tab B, then tried to `push` a route from the screen in tab B, `push` would not be available. Keep this in mind when you update your app if it follows this type of structure.

One of the big improvements you get from this is that you can now add your own helpers to the `navigation` prop!  Read more in [RFC 6](https://github.com/react-navigation/rfcs/blob/master/text/0006-action-creators.md).

## Deprecations

The following APIs are deprecated and will be removed in 3.0.

### XNavigator is now named createXNavigator

```
import { createStackNavigator } from ‘react-navigation’;
createStackNavigator({routeName: Screen});
```

This change was made to improve the ease of learning and understanding the library. The navigator constructors are functions that return components (HOCs), and that was not previously very well communicated by the name.

### `TabNavigator` has been split up into more focused navigators

`TabNavigator` (now `createTabNavigator` as per above) was a frequent source of confusion for users because it would use a bottom tab bar on iOS and a top tab bar on Android by default. Additionally, some of the configuration properties applied to the bottom tab bar, and others to the top tab bar. The equivalent components are now: `createBottomTabNavigator` and `createMaterialTopTabNavigator`. We’ve also introduced a new type of tab navigator, `createMaterialBottomTabNavigator` - a material design styled bottom tab bar based navigator from [react-native-paper](https://github.com/callstack/react-native-paper). Thank you [satya164](http://github.com/satya164) for your great work on this!

## New feature highlights

- State persistence - automatically save state and reload it when the app restarts. See https://reactnavigation.org/docs/en/state-persistence.html
- Transitions between screens in stack with headers and without headers now animates as expected on iOS. https://github.com/react-navigation/react-navigation-4/pull/3821. Thanks [skevy](https://github.com/skevy)!
- As mentioned above, `createMaterialBottomNavigator` is a new navigator type that provides the material design bottom tab bar pattern.
