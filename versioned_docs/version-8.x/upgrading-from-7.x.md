---
id: upgrading-from-7.x
title: Upgrading from 7.x
sidebar_label: Upgrading from 7.x
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::warning

React Navigation 8 is still in pre-release stage. The API may still change before the stable release. The upgrade guide will be updated accordingly when we release the stable version.

:::

This guides lists all the breaking changes and new features in React Navigation 8 that you need to be aware of when upgrading from React Navigation 7.

## Dependency changes

The minimum required version of React Native, Expo, and TypeScript have been bumped:

- `react-native` >= 0.81
- `expo` >= 54 (if you use [Expo Go](https://expo.dev/go))
- `typescript` >= 5.9.2 (if you use TypeScript)

The minimum required version of various peer dependencies have also been bumped:

- `react-native-screens` >= 3.22.0
- `react-native-safe-area-context` >= 5.5.0
- `react-native-reanimated` >= 4.0.0
- `react-native-web` >= 0.21.0

Previously, many navigators worked without `react-native-screens`, but now it's required for all navigators.

Additionally, React Navigation now uses [`@callstack/liquid-glass`](https://github.com/callstack/liquid-glass) to implement liquid glass effect on iOS 26.

## Breaking changes

### Dropping support for old architecture

React Navigation 8 no longer supports the old architecture of React Native. The old architecture has been frozen since React Native 0.80 and will be removed in React Native 0.82.

So if you're still on the old architecture, you'll need to upgrade to the new architecture in order to use React Navigation 8.

### Changes to TypeScript setup

We introduced a static API in React Navigation 7. However, some of the TypeScript types were not inferred and required manual annotations. In React Navigation 8, we reworked the TypeScript types to solve many of these issues.

#### The root type now uses navigator type instead of param list

Previously the types for the root navigator were specified using `declare global` and `RootParamList`. Now, they can be specified with module augmentation of `@react-navigation/core` and use the navigator's type instead a param list:

```diff lang=ts
- type RootStackParamList = StaticParamList<typeof RootStack>;
-
- declare global {
-   namespace ReactNavigation {
-     interface RootParamList extends RootStackParamList {}
-   }
- }
+ type RootStackType = typeof RootStack;
+
+ declare module '@react-navigation/core' {
+   interface RootNavigator extends RootStackType {}
+ }
```

Using module augmentation is shorter, and avoids namespace usage - which ESLint may complain about in some configurations.

Using the navigator's type instead of a param list allows to infer the type of navigators - primarily in case of static configuration.

#### Common hooks no longer accept generics

Previously hooks such as `useNavigation`, `useRoute` and `useNavigationState` accepted a generic to override the default types. This is not type-safe as we cannot verify that the provided type matches the actual navigators, and we recommended minimizing such usage.

In React Navigation 8, we reworked the types to automatically determine the correct type [based on the name of the screen](#common-hooks-now-accept-name-of-the-screen) when using static config:

```diff lang=ts
- const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Profile'>>();
+ const navigation = useNavigation('Profile');
```

If you're using dynamic configuration, unfortunately we cannot currently infer the types automatically. So it still requires manual annotation. However, now you need to use `as` instead of generics to make it clearer that this is unsafe:

```diff lang=ts
- const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Profile'>>();
+ const navigation = useNavigation() as StackNavigationProp<RootStackParamList, 'Profile'>;
```

The `useRoute` type has been updated in the same way:

```diff lang=ts
- const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();
+ const route = useRoute('Profile');
```

And if you're using dynamic configuration:

```diff lang=ts
- const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();
+ const route = useRoute() as RouteProp<RootStackParamList, 'Profile'>;
```

Similarly, the `useNavigationState` type has been updated to accept the name of the screen in addition to the selector:

```diff lang=ts
- const focusedRouteName = useNavigationState<RootStackParamList>((state) => state.routes[state.index].name);
+ const focusedRouteName = useNavigationState('Settings', (state) => state.routes[state.index].name);
```

If you're using dynamic configuration, you can use `as`:

```diff lang=ts
- const focusedRouteName = useNavigationState<RootStackParamList>((state) => state.routes[state.index].name);
+ const focusedRouteName = useNavigationState((state) => state.routes[state.index].name as keyof RootStackParamList);
```

#### New `createXScreen` API for creating screen config

One of the limitations of the static config API is that the type of `route` object can't be inferred in screen callback, listeners callback etc. This made it difficult to use route params in these callbacks.

To address this, we added a new `createXScreen` API for each navigator to create screen config with proper types:

```diff lang=js
const Stack = createStackNavigator({
  screens: {
-     Profile: {
-       screen: ProfileScreen,
-       options: ({ route }) => {
-         const userId = route.params.userId; // Don't know the type of route params
-
-         return { title: `User ${userId}` };
-       },
-     },
+     Profile: createStackScreen({
+       screen: ProfileScreen,
+       options: ({ route }) => {
+         const userId = route.params.userId; // Now correctly inferred
+
+         return { title: `User ${userId}` };
+       },
+     });
  }
});
```

When using the `createXScreen` API, the type of params are automatically inferred based on the type annotation for the component specified in `screen` (e.g. `(props: StaticScreenProps<ProfileParams>)`) and the path pattern specified in the linking config (e.g. `linking: 'profile/:userId'`).

Each navigator exports its own helper function, e.g. `createNativeStackScreen` for Native Stack Navigator, `createBottomTabScreen` for Bottom Tab Navigator, `createDrawerScreen` for Drawer Navigator etc.

See [Static configuration docs](static-configuration.md#createxscreen) for more details.

#### Custom navigators now require overloads for types

To work with the reworked TypeScript types, custom navigators now need to provide overloads for static and dynamic configuration APIs, and an additional API to create screen config.

```diff lang=ts
- export function createMyNavigator<
-   const ParamList extends ParamListBase,
-   const NavigatorID extends string | undefined = string | undefined,
-   const TypeBag extends NavigatorTypeBagBase = {
-     ParamList: ParamList;
-     NavigatorID: NavigatorID;
-     State: TabNavigationState<ParamList>;
-     ScreenOptions: MyNavigationOptions;
-     EventMap: MyNavigationEventMap;
-     NavigationList: {
-       [RouteName in keyof ParamList]: MyNavigationProp<
-         ParamList,
-         RouteName,
-         NavigatorID
-       >;
-     };
-     Navigator: typeof MyNavigator;
-   },
-   const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>,
- >(config?: Config): TypedNavigator<TypeBag, Config> {
-   return createNavigatorFactory(MyNavigator)(config);
- }
+ type MyTypeBag<ParamList extends {}> = {
+   ParamList: ParamList;
+   State: TabNavigationState<ParamList>;
+   ScreenOptions: MyNavigationOptions;
+   EventMap: MyNavigationEventMap;
+   NavigationList: {
+     [RouteName in keyof ParamList]: MyNavigationProp<
+       ParamList,
+       RouteName
+     >;
+   };
+   Navigator: typeof MyNavigator;
+ };
+
+ export function createMyNavigator<
+   const ParamList extends ParamListBase,
+ >(): TypedNavigator<MyTypeBag<ParamList>, undefined>;
+ export function createMyNavigator<
+   const Config extends StaticConfig<MyTypeBag<ParamListBase>>,
+ >(
+   config: Config
+ ): TypedNavigator<
+   MyTypeBag<StaticParamList<{ config: Config }>>,
+   Config
+ >;
+ export function createMyNavigator(config?: unknown) {
+   return createNavigatorFactory(MyNavigator)(config);
+ }

+ export function createMyScreen<
+  const Linking extends StaticScreenConfigLinking,
+  const Screen extends StaticScreenConfigScreen,
+ >(
+   config: StaticScreenConfig<
+     Linking,
+     Screen,
+     TabNavigationState<ParamListBase>,
+     MyNavigationOptions,
+     MyNavigationEventMap,
+     MyNavigationProp<ParamListBase>
+   >
+ ) {
+   return config;
+ }
```

See [Custom navigators](custom-navigators.md) for more details.

### Changes to navigators

#### Native Bottom Tabs are now default

Previously, the Bottom Tab Navigator used a JavaScript-based implementation and a native implementation was available under `@react-navigation/bottom-tabs/unstable`. Native bottom tabs are not used by default on iOS and Android. This allows us to match the new native design such as liquid glass effect on iOS 26.

The `@react-navigation/bottom-tabs/unstable` entry point has been removed.

To keep the previous behavior with JavaScript-based tabs, you can pass `implementation: 'custom'` to the navigator:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```diff lang=js
createBottomTabNavigator({
+   implementation: 'custom',
  // ...
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```diff lang=js
<Tab.Navigator
+   implementation="custom"
  // ...
>
```

</TabItem>
</Tabs>

As part of this change, some of the options have changed to work with native tabs:

- `tabBarShowLabel` is replaced with `tabBarLabelVisibilityMode` which accepts:
  - `"auto"` (default)
  - `"selected"`
  - `"labeled"` - same as `tabBarShowLabel: true`
  - `"unlabeled"` - same as `tabBarShowLabel: false`
- `tabBarLabel` now only accepts a `string`
- `tabBarIcon` now accepts an function that returns an icon object

The following props have been removed:

- `safeAreaInsets` from the navigator props
- `insets` from the bottom tab bar props
- `layout` from the bottom tab bar props

See the [Bottom Tab Navigator docs](bottom-tab-navigator.md) for all the available options.

#### Navigators no longer accept an `id` prop

Previously, navigators accepted an `id` prop to identify them - which was used with `navigation.getParent(id)` to get a parent navigator by id. However, there were a couple of issues with this approach:

- It wasn't well integrated with TypeScript types, and required manual annotations.
- The navigation object is specific to a screen, so using the navigator's id was inconsistent.
- It was used for a very specific use case, so it added unnecessary complexity.

In React Navigation 8, we removed the `id` prop from navigators. Instead, you can use the screen's name to get a parent navigator:

```diff lang=js
- const parent = navigation.getParent('some-id');
+ const parent = navigation.getParent('SomeScreenName');
```

In this case, 'SomeScreenName' refers to the name of a parent screen that's used in the navigator.

See [navigation object docs](navigation-object.md#getparent) for more details.

#### `setParams` no longer pushes to history in tab and drawer navigators when `backBehavior` is set to `fullHistory`

Previously, when using `setParams` in tab and drawer navigators with `backBehavior` set to `fullHistory`, it would push a new entry to the history stack.

In React Navigation 8, we [added a new `pushParams` action](#new-entry-can-be-added-to-history-stack-with-pushparams-action) that achieves this behavior. So `setParams` now only updates the params without affecting the history stack.

```diff lang=js
- navigation.setParams({ filter: 'new' });
+ navigation.pushParams({ filter: 'new' });
```

This way you have more control over how params are updated in tab and drawer navigators.

See [`setParams` action docs](navigation-actions.md#setparams) for more details.

#### Navigators no longer use `InteractionManager`

Previously, various navigators used `InteractionManager` to mark when animations and gestures were in progress. This was primarily used to defer code that should run after transitions, such as loading data or rendering heavy components.

However, `InteractionManager` has been deprecated in latest React Native versions, so we are removing support for this API in React Navigation 8. As an alternative, consumers can listen to events such as `transitionStart`, `transitionEnd` etc. when applicable:

```diff lang=js
- InteractionManager.runAfterInteractions(() => {
-   // code to run after transition
- });
+ navigation.addListener('transitionEnd', () => {
+   // code to run after transition
+ });
```

Keep in mind that unlike `InteractionManager` which is global, the transition events are specific to a navigator.

If you have a use case that cannot be solved with transition events, please open a [discussion on GitHub](https://github.com/react-navigation/react-navigation/discussions).

#### The color arguments in various navigators now accept `ColorValue`

Previously, color options in various navigators only accepted string values. In React Navigation 8, these options now accept `ColorValue` to match the [changes to theming](#themes-now-support-colorvalue-and-css-custom-properties).

Unless you are using a custom theme with `PlatformColor` or `DynamicColorIOS` etc, this change only breaks TypeScript types:

```diff lang=js
- const tabBarIcon = ({ color, size }: { color: string, size: number }) => {
+ const tabBarIcon = ({ color, size }: { color: ColorValue, size: number }) => {
  // ...
};
```

See [Themes](themes.md#using-platform-colors) for more information about dynamic colors.

#### The `onChangeText` callback has been renamed to `onChange` for `headerSearchBarOptions`

The `onChangeText` option in `headerSearchBarOptions` was confusingly named after text input's
`onChangeText`, but TextInput's `onChangeText` receives the new text as the first argument, whereas `headerSearchBarOptions.onChangeText` received an event object - similar to TextInput's `onChange`.

To avoid confusion due to this inconsistency, the option has been renamed to `onChange`. To upgrade, simply rename the option:

```diff lang=js
createNativeStackNavigator({
  screens: {
    Search: {
      screen: SearchScreen,
      options: {
        headerSearchBarOptions: {
-           onChangeText: (event) => {
+           onChange: (event) => {
            const text = event.nativeEvent.text;
            // ...
          },
        },
      },
    },
  },
});
```

This applies to all navigators that support `headerSearchBarOptions`, such as Native Stack Navigator with native header, and other navigators using `Header` from `@react-navigation/elements`.

If you're using `Header` from `@react-navigation/elements` directly, the same change applies.

#### APIs for customizing Navigation bar and status bar colors are removed from Native Stack Navigator

Previously, Native Stack Navigator provided options to customize the appearance of the navigation bar and status bar on Android:

- `navigationBarColor`
- `navigationBarTranslucent`
- `statusBarBackgroundColor`
- `statusBarTranslucent`

In Android 15 and onwards, edge-to-edge is now the default behavior, and will likely be enforced in future versions. Therefore, these options have been removed in React Navigation 8.

You can use [`react-native-edge-to-edge`](https://github.com/zoontek/react-native-edge-to-edge) instead to configure status bar and navigation bar related settings.

See [Native Stack Navigator](native-stack-navigator.md) for all available options.

#### Drawer Navigator now accepts `overlayStyle` instead of `overlayColor`

Previously, the Drawer Navigator accepted an `overlayColor` prop to customize the color of the overlay that appears when the drawer is open. It now accepts `overlayStyle` prop instead to provide more flexibility for styling the overlay:

```diff lang=js
- overlayColor="rgba(0, 0, 0, 0.5)"
+ overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
```

See [Drawer Navigator](drawer-navigator.md) for more details.

### Miscellaneous

#### Various deprecated APIs have been removed

The following API that were marked as deprecated in React Navigation 7 have been removed:

- `navigateDeprecated` from the navigation object has been removed. Use `navigate` instead. To preserve the previous behavior, you can pass `pop: true` as the third argument to `navigate`:

  ```diff lang=js
  - navigation.navigateDeprecated('Profile', { userId: 123 });
  + navigation.navigate('Profile', { userId: 123 }, { pop: true });
  ```

- `getId` from the navigation object has been removed since the [`id` prop has been removed](#navigators-no-longer-accept-an-id-prop).

- `navigationInChildEnabled` prop from `NavigationContainer` has been removed. This behavior is no longer supported.

#### The linking config no longer requires a `prefixes` option

Previously, the linking configuration required a `prefixes` option to specify the URL prefixes that the app should handle. This historical reason for this is to support Expo Go which uses a custom URL scheme.

Since then, the recommended way to develop with Expo has been to use [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/), which use the app's own URL scheme. So the `prefixes` option is not needed for most use cases.

You can now omit the `prefixes` option in the linking configuration unless you're using Expo Go:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```diff lang=js
<Navigation
  linking={{
-     prefixes: ['myapp://', 'https://myapp.com'],
    enabled: 'auto',
  }}
>
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```diff lang=js
<NavigationContainer
  linking={{
-     prefixes: ['myapp://', 'https://myapp.com'],
    config: { /* ... */ }
  }}
>
```

</TabItem>
</Tabs>

The `prefixes` default to `['*']`, which will match any host starting with `http`, `https`, and custom schemes such as `myapp://`.

See [Configuring links](configuring-links.md) for more details.

#### Some exports are removed from `@react-navigation/elements`

The `@react-navigation/elements` package has exported some components that were primarily intended for internal usage. These components have been removed from the public API:

- `Background`

  Background color can instead be applied by using it from `useTheme`.

  ```diff lang=js
  - import { Background } from '@react-navigation/elements';
  + import { useTheme } from '@react-navigation/native';
  // ...
  - <Background>{children}</Background>
  + const { colors } = useTheme();
  +
  + <View style={{ backgroundColor: colors.background }}>{children}</View>
  ```

- `Screen`

  You can render the `Header` component directly instead.

- `SafeAreaProviderCompat`

  You can use `SafeAreaProvider` from [`react-native-safe-area-context`](https://github.com/AppAndFlow/react-native-safe-area-context) directly instead.

- `MissingIcon`

  You can copy the implementation from the [source code](https://github.com/react-navigation/react-navigation/blob/main/packages/elements/src/MissingIcon.tsx) if you need a placeholder icon.

Some of these components are still available and exported at `@react-navigation/elements/internal`, so you can continue using them if you really need. However, since they are not part of the public API, they don't follow semver and may change without warning in future releases.

#### The `getDefaultHeaderHeight` utility now accepts an object instead of positional arguments

The `getDefaultHeaderHeight` utility from `@react-navigation/elements` now accepts an object with named properties instead of positional arguments to improve readability"

```diff lang=js
- getDefaultHeaderHeight(layout, false, statusBarHeight);
+ getDefaultHeaderHeight({
+   landscape: false,
+   modalPresentation: false,
+   topInset: statusBarHeight
+ });
```

See [Elements docs](elements.md#getdefaultheaderheight) for more details.

## New features

### Common hooks now accept name of the screen

The `useNavigation`, `useRoute`, and `useNavigationState` hooks can now optionally accept the name of the screen:

```js
const route = useRoute('Profile');
```

The name of the screen can be for the current screen or any of its parent screens. This makes it possible to get params and navigation state for a parent screen without needing to setup context to pass them down.

If the provided screen name does not exist in any of the parent screens, it will throw an error, so any mistakes are caught early.

When using static configuration, the types are automatically inferred based on the name of the screen.

It's still possible to use these hooks without passing the screen name, same as before, and it will return the navigation or route for the current screen.

See [`useNavigation`](use-navigation.md), [`useRoute`](use-route.md), and [`useNavigationState`](use-navigation-state.md) for more details.

### New entry can be added to history stack with `pushParams` action

The `pushParams` action updates the params and pushes a new entry to the history stack:

```js
navigation.pushParams({ filter: 'new' });
```

Unlike `setParams`, this does not merge the new params with the existing ones. Instead, it uses the new params object as-is.

The action works in all navigators, such as stack, tab, and drawer. This allows to add a new entry to the history stack without needing to push a new screen instance.

This can be useful in various scenario:

- A product listing page with filters, where changing filters should create a new history entry so that users can go back to previous filter states.
- A screen with a custom modal component, where the modal is not a separate screen in the navigator, but its state should be reflected in the URL and history.

See [`pushParams` docs](navigation-actions.md#pushparams) for more details.

### Themes now support `ColorValue` and CSS custom properties

Previously, theme colors only supported string values. In React Navigation 8, theme colors now support `PlatformColor`, `DynamicColorIOS` on native, and CSS custom properties on Web for more flexibility.

Example theme using `PlatformColor`:

```js
const MyTheme = {
  ...DefaultTheme,
  colors: Platform.select({
    ios: () => ({
      primary: PlatformColor('systemRed'),
      background: PlatformColor('systemGroupedBackground'),
      card: PlatformColor('tertiarySystemBackground'),
      text: PlatformColor('label'),
      border: PlatformColor('separator'),
      notification: PlatformColor('systemRed'),
    }),
    android: () => ({
      primary: PlatformColor('@android:color/system_primary_light'),
      background: PlatformColor(
        '@android:color/system_surface_container_light'
      ),
      card: PlatformColor('@android:color/system_background_light'),
      text: PlatformColor('@android:color/system_on_surface_light'),
      border: PlatformColor('@android:color/system_outline_variant_light'),
      notification: PlatformColor('@android:color/holo_red_light'),
    }),
    default: () => DefaultTheme.colors,
  })(),
};
```

See [Themes](themes.md#using-platform-colors) for more details.

### Groups now support `linking` option in static configuration

The `linking` option can now be specified for groups in static configuration to define nested paths:

```js
const Stack = createStackNavigator({
  groups: {
    Settings: {
      linking: { path: 'settings' },
      screens: {
        UserSettings: 'user',
        AppSettings: 'app',
      },
    },
  },
});
```

This lets you prefix the paths of the screens in the group with a common prefix, e.g. `settings/` for `settings/user` and `settings/app`.

See [Group](group.md) for more details.

### Navigators now accept a `router` prop

A router defines how the navigator updates its state based on navigation actions. Previously, custom routers could only be used by [creating a custom navigator](custom-navigators.md#extending-navigators).

We later added an experimental `UNSTABLE_router` prop to various navigators to customize the router without needing to create a custom navigator. In React Navigation 8, we have dropped the `UNSTABLE_` prefix and made it a stable API.

```js static2dynamic
const MyStack = createNativeStackNavigator({
  // highlight-start
  router: (original) => ({
    getStateForAction(state, action) {
      if (action.type === 'NAVIGATE') {
        // Custom logic for NAVIGATE action
      }

      // Fallback to original behavior
      return original.getStateForAction(state, action);
    },
  }),
  // highlight-end
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

See [`Navigator` docs](navigator.md#router) for more details.

### `Header` from `@react-navigation/elements` has been reworked

The `Header` component from `@react-navigation/elements` has been reworked with various improvements:

- It uses the new liquid glass effect on iOS 26
- It supports `ColorValue` and CSS custom properties for colors
- It supports `headerBlurEffect` on Web (previously only supported on iOS in Native Stack Navigator)
- It no longer needs the layout of the screen to render correctly

To match the iOS 26 design, the back button title is no longer shown by default on iOS 26.

See [Elements](elements.md) for more details.

### `react-native-tab-view` now supports a `renderAdapter` prop for custom adapters

By default, `react-native-tab-view` uses [`react-native-pager-view`](https://github.com/callstack/react-native-pager-view) for rendering pages on Android and iOS. However, it may not be suitable for all use cases.

So it now supports a `renderAdapter` prop to provide a custom adapter for rendering pages. For example, you can use `ScrollViewAdapter` to use a `ScrollView` for rendering pages:

```js
import React from 'react';
import { TabView, ScrollViewAdapter } from 'react-native-tab-view';

export default function TabViewExample() {
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderAdapter={ScrollViewAdapter}
    />
  );
}
```

You can also create your own custom adapter by implementing the required interface. See the [`react-native-tab-view` docs](tab-view.md) for more information.
