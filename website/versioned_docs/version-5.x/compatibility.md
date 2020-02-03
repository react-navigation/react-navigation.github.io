---
id: version-5.x-compatibility
title: Compatibility layer
sidebar_label: Compatibility layer
original_id: compatibility
---

> Note: Before following this guide, make sure that you've followed the [Getting Started](getting-started.html) guide to setup React Navigation 5 in your app.

React Navigation 5 has a completely new API, so our old code using React Navigation 4 will no longer work with this version. If you are not familiar with the new API, you can read about the differences in the [upgrade guide](upgrading-from-4.x.html). We understand that this can be a lot of work, so we have made a compatibility layer to make this easier.

To use the compatibility layer, we need to install [`@react-navigation/compat`](https://github.com/react-navigation/navigation-ex/tree/master/packages/compat):

```sh
npm install @react-navigation/native@next @react-navigation/compat@next
```

Then we can make minimal changes in our code to use it:

```diff
-import { createStackNavigator } from 'react-navigation-stack';
+import { createStackNavigator } from '@react-navigation/stack';
+import { createCompatNavigatorFactory } from '@react-navigation/compat';

-const RootStack = createStackNavigator(
+const RootStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    Home: { screen: HomeScreen },
    Profile: { screen: ProfileScreen },
  },
  {
    initialRouteName: 'Profile',
  }
);
```

If you were importing actions from `react-navigation`, you need to change them to import from `@react-navigation/compat`:

```diff
-import { NavigationActions } from 'react-navigation';
+import { NavigationActions } from '@react-navigation/compat';
```

The library exports the following APIs:

- Actions:
  - `NavigationActions`
  - `StackActions`
  - `DrawerActions`
  - `SwitchActions`
- HOCs
  - `withNavigation`
  - `withNavigationFocus`
- Navigators
  - `createSwitchNavigator`
- Compatibility helpers
  - `createCompatNavigatorFactory` - Takes a navigator with the v5 API and returns a `createXNavigator` with the v4 API.
  - `createCompatNavigationProp` - Takes the v5 `navigation` object along with a `route` object and returns a v4 `navigation` object.

### What does it handle?

The compatibility layer handles various API differences between React Navigation 4 and 5:

- Use static configuration API of v4 instead of the component based API.
- Change signature of methods on the navigation object to match v4.
- Add support for `screenProps` which is removed in v5.
- Export action creators such as `NavigationActions`, `StackActions`, `SwitchActions` with same signature as v4.

### What doesn't it handle?

Due to the dynamic API of React Navigation 5, some functionality possible with the static API of v4 are not possible anymore, and hence the compatibility layer doesn't handle them:

- It doesn't wrap navigator's props or options. This basically means that the options you're passing to a navigator might be different as per breaking changes in the navigators. Refer to the navigator's docs for update options API.
- Legacy deep link support by defining `path` in route configuration is not supported. See [deep linking documentation](deep-linking.html) for more details now how to handle deep links.
- Navigating to a navigator doesn't work the same, i.e. we can't navigate to a screen in a navigator that's not rendered already, and params aren't merged to all child screens. See [nesting navigators documentation](nesting-navigators.html) for more details on how to navigate to screens in a different navigator.
- Some methods such as the legacy `reset` method which take an array of actions aren't supported anymore. Unsupported methods will throw errors when using them as well as give type errors if we're using TypeScript.
- It doesn't export `createAppContainer`, so you'll need to use the v5 API for the container (`NavigationContainer`). This also means any features supported by the container need to be migrated to the new API.
- If you're using advanced APIs like Redux integration, custom routers and actions etc., they aren't supported anymore and you'll need to remove Redux integration.

While we have tried our best to make the compatibility layer handle most of the differences, there might be something missing. So make sure to test the code that you've migrated.

### Why should we use it?

Using the compatibility layer allows us to migrate our code to the new version incrementally. Unfortunately we do have to change some code to get the compatibility layer working (see "What doesn't it handle") properly, but it still allows majority of our code to remain unchanged. Some of the advantages of using the compatibility layer include:

- It allows us to write new code with the new API while integrating with the code using the legacy API, i.e. you can navigate to screens defined with the legacy API from code written with the new API and vice versa.
- Since it's built on top of v5 which has excellent TypeScript support, the legacy code can also take advantage of the improved type-checking, which will be useful when you want to refactor it into the new API later.
- You can get granular with migration, e.g. migrate only few methods in a component to the new API. You still have access to the v5 `navigation` object at `navigation.original` which you can use to gradually migrate the code.
- You have access to new APIs in legacy components, such as `navigation.setOptions` or the new hooks such as `useFocusEffect`.

We are committed to help you to make it as easy as possible to upgrade. So please open issues about use cases the compatibility layer doesn't support, so that we can figure out a good migration strategy.
