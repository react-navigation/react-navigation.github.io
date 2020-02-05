---
title: React Navigation 2.0
author: Core Team
authorURL: https://twitter.com/reactnavigation
---

The documentation is now live at https://reactnavigation.org, and v1 lives [here](/docs/en/1.x/getting-started.html).

## Significant breaking changes

The following changes are considered “significant” because they can’t be fixed by search and replace or something that is similarly mechanical.

### `navigate(routeName)` in StackNavigator is “less pushy”

In 1.x, `navigate(routeName)` and `push(routeName)` were very similar: every time you called `navigate(routeName)` it would push a new route to the stack. Now `navigate(routeName)` will first try to find an existing instance of the route and jump to that if it exists, otherwise it will push the route to the stack.

To update your app for this change you may need to change `navigate` to `push` in places where you would like to push a new route every time. Alternatively, you could consider using a `key`: `navigate({routeName: ‘MyRoute’, key: data.uniqueId, params: data})`. [Read more about navigation with keys](/docs/en/navigation-key.html).

Read more about this in [RFC 4](https://github.com/react-navigation/rfcs/blob/master/text/0004-less-pushy-navigate.md) and [commit 7a978b1](https://github.com/react-navigation/react-navigation-4/commit/7a978b1087ff3acc7dd71267bd900d15c932d7cc).

### `push` now propagates between routers like `navigate`

Previously, `push` only applied to the deepest active stack router. This meant that if you had Stack A > Stack B and Stack B fired `push(‘MyRoute’)`, even if Stack B does not have a route with the name `’MyRoute’` and Stack A does, the screen would not be pushed. We made this change to accommodate for the “less pushy” navigate behavior.

When updating your app, you may want to double check where you use `push` to ensure that this doesn’t impact the expected behavior of your app.

Read about this in [RFC 4](https://github.com/react-navigation/rfcs/blob/master/text/0004-less-pushy-navigate.md#drawbacks) and [pull 3617](https://github.com/react-navigation/react-navigation-4/pull/3617).

### Shallow navigation options

A common source of confusion for developers working with React Navigation has been around `navigationOptions` resolution. For example, if you have a stack navigator with a header, and a drawer inside of that stack, then in some circumstances the title of the stack would change every time you change screens in the drawer. This is because the stack navigator would crawl into child navigators and pull `navigationOptions` off of the deepest active screen. As of 2.0, this no longer happens: navigators will only look at their direct children for `navigationOptions`.

Read more about the justification for this in [RFC 5](https://github.com/react-navigation/rfcs/blob/master/text/0005-shallow-navigation-options.md). Also see the new documentation page [Navigation options resolution](https://reactnavigation.org/docs/en/navigation-options-resolution.html) to learn more.

### New API for creating navigators

It is now easier to create and maintain custom navigators. The new `createNavigator` API fully decouples the navigation view from the router. Information about each screen is available on a single "descriptor", including the pre-computed child navigation prop, allowing you to focus on custom navigation views.

Custom navigators can now provide actions helpers for their screens. For example, the new drawer navigator now allows `props.navigation.openDrawer()` within its screen components.

This does not impact most users - you won't need to make any changes for this unless you use custom navigators in your app. Read more about the changes in [RFC 2](https://github.com/react-navigation/rfcs/blob/master/text/0002-navigator-view-api.md). Also read the [custom navigators documentation](/docs/en/custom-navigators.html). You can also watch the ["Creating a navigator" section in this talk](https://youtu.be/wJJZ9Od8MjM?t=1215) to learn more.

## Trivial breaking changes

The following changes are considered “trivial” because you will only need make straightforward and mechanical changes to update your app for them.

### Drawer routes have been replaced with actions

Rather than opening a drawer with `navigation.navigate(‘DrawerOpen’)`, you can now call `navigation.openDrawer()`. Other methods are `closeDrawer()` and `toggleDrawer()`.  See [pull 3618](https://github.com/react-navigation/react-navigation-4/pull/3618).

### Navigation actions API overhaul

In practice, this change is unlikely to impact your app at all except for one case that is mentioned below.

In 1.x, functions on the `navigation` were not contextual - they would be the same regardless of whether your screen was inside of a drawer, a stack, a tab navigator, etc. In 2.0 the functions that are available to you on the `navigation` prop depend on the navigators that it corresponds to. If your screen is inside of both a stack and a drawer navigator, you will have helpers for both -- `push` and `openDrawer`, for example.

Given that we only exposed generic helpers (`navigate`, `goBack`) and helpers specific to the stack in 1.x, this would only impact you if you attempted to use the stack helpers from outside of a stack. For example, if you had a tab navigator with a stack in tab A and just a plain screen in tab B, then tried to `push` a route from the screen in tab B, `push` would not be available. Keep this in mind when you update your app if it follows this type of structure.

One of the big improvements you get from this is that you can now add your own helpers to the `navigation` prop!  Read more in [RFC 6](https://github.com/react-navigation/rfcs/blob/master/text/0006-action-creators.md) and in [pull 3392](https://github.com/react-navigation/react-navigation-4/pull/3392).

 ### NavigationActions no longer have `toString()` implementations ([related](https://github.com/react-navigation/react-navigation-4/issues/4072))

This change was intended to simplify the implementation of actions. We may go back on this, however, and apologize in advance if this thrasing causes you trouble.

### NavigationActions split up according to router

If you are using `NavigationActions.push` or other stack-specific actions, you’ll need to import `StackActions` and use `StackActions.push` instead.

## Deprecations

###  XNavigator(...) is now createXNavigator(...)

`StackNavigator`, `TabNavigator` and `DrawerNavigator` are now deprecated in favour of `createStackNavigator`, `createTabNavigator`, and `createDrawerNavigator`, which are functionally identical but more clearly communicate that they are functions and that they return a component. The `XNavigator` style will removed in 3.0.

### Tab navigator split into separate components

Previously, `TabNavigator` would render a navigation bar on the top of the screen on Android and the bottom on iOS. We’ve now pulled these navigators apart, so you can use `createBottomTabNavigator`and `createMaterialTopTabNavigator` explicitly depending on what you need. You can use `createTabNavigator` to have the same behavior as before, but it will be removed in 3.0.

It is worth noting additionally that `createBottomTabNavigator` is different from the bottom tab navigator that is available through `TabNavigator` in that it does not support `animationEnabled` or `swipeEnabled` properties.

## Enhancements

* dangerouslyGetParent and dismiss helpers on navigation prop ([3669](https://github.com/react-navigation/react-navigation-4/pull/3669))
* State persistence - automatically save state and reload it when the app restarts ([3716](https://github.com/react-navigation/react-navigation-4/pull/3716))
* Smoothly transition header visibility in Stack ([3821](https://github.com/react-navigation/react-navigation-4/pull/3821))
* Add initialRouteKey for StackRouter ([3540](https://github.com/react-navigation/react-navigation-4/pull/3540))
* Make StackNavigator keyboard aware -- it hides automatically when you start to swipe back, and refocuses if you cancel the swipe back gesture ([3951](https://github.com/react-navigation/react-navigation-4/pull/3951))
* Allow modification of SafeAreaView props in header ([3496](https://github.com/react-navigation/react-navigation-4/pull/3496))
* Add `createMaterialBottomTabNavigator` for a material design style tab bar. (see [react-navigation-tabs](https://github.com/react-navigation/react-navigation-tabs)).
* Use findIndex instead of map/indexOf in StateUtils ([commit](https://github.com/react-navigation/react-navigation-4/commit/47fe858d4ec339d2b1f4b96f3a5444aed8f6f900)
* Warn when users have multiple stateful navigation containers ([commit](https://github.com/react-navigation/react-navigation-4/commit/68a2a106f370003dc1d46385fd8b5992be189ee2))
* Remove almost all uses of React 16 deprecated lifecycle methods ([commit](https://github.com/react-navigation/react-navigation-4/commit/3f837c895e823de4d528b55fd70ee7ba167480d8))
* Add `activeLabelStyle` and `inactiveLabelStyle` for `DrawerItem` ([commit](https://github.com/react-navigation/react-navigation-4/commit/7c488c8d4974028f85a4c5171d27209fa099170f))

## Bugfixes

* Avoid unnecessary navigation completion dispatches ([3902](https://github.com/react-navigation/react-navigation-4/pull/3902))
* Use Header.HEIGHT instead of measuring to avoid flicker ([3940](https://github.com/react-navigation/react-navigation-4/pull/3940))
* Implement paths on `SwitchRouter` ([commit](https://github.com/react-navigation/react-navigation-4/commit/5e4512f3ebef587bf90e4ec4d660708b72a0a865)).
* `SwitchRouter` now returns `null` on idempotent navigation ([commit](https://github.com/react-navigation/react-navigation-4/commit/577d99c1658ef85c061c82d55bf349c38e161e97)).

## Final notes

The breaking changes and deprecations in this release resolve a lot of issues that users have encountered that have been perceived as bugs but were technically expected behavior. We think that we’ve drastically improved library ergonomics for new users and experienced users alike, let us know [on Twitter](https://twitter.com/reactnavigation) what you think.

We’ve [started to plan for 3.0](https://github.com/react-navigation/react-navigation-4/issues/3686). Please get involved by [posting your feature requests to Canny](https://react-navigation.canny.io/feature-requests), [opening a RFC](https://github.com/react-navigation/rfcs/issues), or letting us know about bugs with a well-formulated [issue](https://github.com/react-navigation/react-navigation-4/issues/new)!
