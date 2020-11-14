---
id: switch-navigator
title: createSwitchNavigator
sidebar_label: createSwitchNavigator
---

The purpose of SwitchNavigator is to only ever show one screen at a time. By default, it does not handle back actions and it resets routes to their default state when you switch away.
This is the exact behavior that we want from the [authentication flow](auth-flow.md).

## API Definition

```js
createSwitchNavigator(RouteConfigs, SwitchNavigatorConfig);
```

## RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](stack-navigator.md#routeconfigs) from `createStackNavigator`.

## SwitchNavigatorConfig

Several options get passed to the underlying router to modify navigation logic:

- `initialRouteName` - The routeName for the initial tab route when first loading.
- `resetOnBlur` - Reset the state of any nested navigators when switching away from a screen. Defaults to `true`.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause a tab switch to the initial route? If yes, set to `initialRoute`, otherwise `none`. Defaults to `none` behavior.

## Example

See an example of this [on Snack](https://snack.expo.io/@react-navigation/auth-flow).
