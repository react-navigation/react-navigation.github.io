---
id: custom-navigators
title: Custom navigators
sidebar_label: Custom navigators
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In essence, a navigator is a React component that takes a set of screens and options, and renders them based on its [navigation state](navigation-state.md), generally with additional UI such as headers, tab bars, or drawers.

React Navigation provides a few built-in navigators, but they might not always fit your needs if you want a very custom behavior or UI. In such cases, you can build your own custom navigators using React Navigation's APIs.

A custom navigator behaves just like a built-in navigator, and can be used in the same way. This means you can define screens the same way, use [route](route-object.md) and [navigation](navigation-object.md) objects in your screens, and navigate between screens with familiar API. The navigator will also be able to handle deep linking, state persistence, and other features that built-in navigators support.

## Overview

Under the hood, navigators are plain React components that use the [`useNavigationBuilder`](#usenavigationbuilder) hook.

The navigator component then uses this state to layout the screens appropriately with any additional UI based on the use case. This component is then wrapped in [`createNavigatorFactory`](#createnavigatorfactory) to create the API for the navigator.

A very basic example looks like this:

```js
import {
  useNavigationBuilder,
  createNavigatorFactory,
  StackRouter,
} from '@react-navigation/native';

function MyNavigator(props) {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    props
  );

  const focusedRoute = state.routes[state.index];
  const descriptor = descriptors[focusedRoute.key];

  return <NavigationContent>{descriptor.render()}</NavigationContent>;
}

export const createMyNavigator = createNavigatorFactory(MyNavigator);
```

Now, we have an already working navigator, even though it doesn't do anything special yet.

Let's break this down:

- We define a `MyNavigator` component that contains our navigator logic. This is the component that's rendered when you render the navigator in your app with the `createMyNavigator` factory function.
- We use the `useNavigationBuilder` hook and pass it [`StackRouter`](custom-routers.md#built-in-routers), which would make our navigator behave like a stack navigator. Any other router such as `TabRouter`, `DrawerRouter`, or a custom router can be used here as well.
- The hook returns the [navigation state](navigation-state.md) in the `state` property. This is the current state of the navigator. There's also a `descriptors` object which contains the data and helpers for each screen in the navigator.
- We get the focused route from the state with `state.routes[state.index]` - as `state.index` is the index of the currently focused route in the `state.routes` array.
- Then we get the corresponding descriptor for the focused route with `descriptors[focusedRoute.key]` and call the `render()` method on it to get the React element for the screen.
- The content of the navigator is wrapped in `NavigationContent` to provide appropriate context and wrappers.

With this, we have a basic stack navigator that renders only the focused screen. Unlike the built-in stack navigator, this doesn't keep unfocused screens rendered. But you can loop through `state.routes` and render all of the screens if you want to keep them mounted. You can also read `descriptor.options` to get the [options](screen-options.md) to handle the screen's title, header, and other options.

This also doesn't have any additional UI apart from the screen content. There are no gestures or animations. So you're free to add any additional UI, gestures, animations etc. as needed. You can also layout the screens in any way you want, such as rendering them side-by-side or in a grid, instead of stacking them on top of each other like the built-in stack navigator does.

You can see a more complete example of a custom navigator later in this document.

## API Definition

### `useNavigationBuilder`

This hook contains the core logic of a navigator, and is responsible for storing and managing the [navigation state](navigation-state.md). It takes a [router](custom-routers.md) as an argument to know how to handle various navigation actions. It then returns the state and helper methods for the navigator component to use.

It accepts the following arguments:

- `createRouter` - A factory method which returns a router object (e.g. `StackRouter`, `TabRouter`).
- `options` - Options for the hook and the router. The navigator should forward its props here so that user can provide props to configure the navigator. By default, the following options are accepted:
  - `children` (required) - The `children` prop should contain route configurations as `Screen` components.
  - `screenOptions` - The `screenOptions` prop should contain default options for all of the screens.
  - `initialRouteName` - The `initialRouteName` prop determines the screen to focus on initial render. This prop is forwarded to the router.

  If any other options are passed here, they'll be forwarded to the router.

The hook returns an object with following properties:

- `state` - The [navigation state](navigation-state.md) for the navigator. The component can take this state and decide how to render it.
- `navigation` - The navigation object containing various helper methods for the navigator to manipulate the [navigation state](navigation-state.md). This isn't the same as the navigation object for the screen and includes some helpers such as `emit` to emit events to the screens.
- `descriptors` - This is an object containing descriptors for each route with the route keys as its properties. The descriptor for a route can be accessed by `descriptors[route.key]`. Each descriptor contains the following properties:
  - `navigation` - The navigation object for the screen. You don't need to pass this to the screen manually. But it's useful if we're rendering components outside the screen that need to receive `navigation` prop as well, such as a header component.
  - `options` - A getter which returns the options such as `title` for the screen if they are specified.
  - `render` - A function which can be used to render the actual screen. Calling `descriptors[route.key].render()` will return a React element containing the screen content. It's important to use this method to render a screen, otherwise any child navigators won't be connected to the navigation tree properly.

Example:

```js
import * as React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import {
  useNavigationBuilder,
  TabRouter,
  TabActions,
} from '@react-navigation/native';

function TabNavigator({ tabBarStyle, contentStyle, ...rest }) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder(TabRouter, rest);

  return (
    <NavigationContent>
      <View style={[{ flexDirection: 'row' }, tabBarStyle]}>
        {state.routes.map((route, index) => (
          <Pressable
            key={route.key}
            onPress={() => {
              const isFocused = state.index === index;
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.dispatch({
                  ...TabActions.jumpTo(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            style={{ flex: 1 }}
          >
            <Text>{descriptors[route.key].options.title ?? route.name}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[{ flex: 1 }, contentStyle]}>
        {state.routes.map((route, i) => {
          return (
            <View
              key={route.key}
              style={[
                StyleSheet.absoluteFill,
                { display: i === state.index ? 'flex' : 'none' },
              ]}
            >
              {descriptors[route.key].render()}
            </View>
          );
        })}
      </View>
    </NavigationContent>
  );
}
```

The `navigation` object for navigators also has an `emit` method to emit custom events to the child screens. The usage looks like this:

```js
navigation.emit({
  type: 'transitionStart',
  data: { blurring: false },
  target: route.key,
});
```

The `data` is available under the `data` property in the `event` object, i.e. `event.data`.

The `target` property determines the screen that will receive the event. If the `target` property is omitted, the event is dispatched to all screens in the navigator.

### `createNavigatorFactory`

This `createNavigatorFactory` function is used to create a function that will `Navigator` and `Screen` pair. Custom navigators need to wrap the navigator component in `createNavigatorFactory` before exporting.

Example:

```js
import {
  useNavigationBuilder,
  createNavigatorFactory,
} from '@react-navigation/native';

// ...

export function createMyNavigator(config) {
  return createNavigatorFactory(TabNavigator)(config);
}
```

:::note

We can also do `export const createMyNavigator = createNavigatorFactory(MyNavigator)` directly instead of wrapping in another function. However, the wrapper function is necessary to have proper [TypeScript support](#type-checking-navigators) for the navigator.

:::

Then it can be used like this:

```js static2dynamic
import { createStaticNavigation } from '@react-navigation/native';
import { createMyNavigator } from './myNavigator';

const MyTabs = createMyNavigator({
  screens: {
    Home: HomeScreen,
    Feed: FeedScreen,
  },
});

const Navigation = createStaticNavigation(MyTabs);

function App() {
  return <Navigation />;
}
```

## Type-checking navigators

To type-check navigators, we need to provide few types:

- Type of the props accepted by the view
- Type of supported screen options
- A map of event types emitted by the navigator
- The type of the navigation object for each screen

We also need to export functions to create the navigator and screen configurations with proper types.

For example, to type-check our custom tab navigator, we can do something like this:

```tsx
import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  type StyleProp,
  type ViewStyle,
  StyleSheet,
} from 'react-native';
import {
  createNavigatorFactory,
  CommonActions,
  type DefaultNavigatorOptions,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type StaticConfig,
  type StaticParamList,
  type StaticScreenConfig,
  type StaticScreenConfigLinking,
  type StaticScreenConfigScreen,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  type TypedNavigator,
  useNavigationBuilder,
  type NavigationProp,
} from '@react-navigation/native';

// Additional props accepted by the view
type MyNavigationConfig = {
  tabBarStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<ViewStyle>;
};

// Supported screen options
type MyNavigationOptions = {
  title?: string;
};

// Map of event name and the type of data (in event.data)
// canPreventDefault: true adds the defaultPrevented property to the
// emitted events.
type MyNavigationEventMap = {
  tabPress: {
    data: { isAlreadyFocused: boolean };
    canPreventDefault: true;
  };
};

// The type of the navigation object for each screen
type MyNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  TabNavigationState<ParamList>,
  MyNavigationOptions,
  MyNavigationEventMap
> &
  TabActionHelpers<ParamList>;

// The props accepted by the component is a combination of 3 things
type Props = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  TabNavigationState<ParamListBase>,
  MyNavigationOptions,
  MyNavigationEventMap,
  MyNavigationProp<ParamListBase>
> &
  TabRouterOptions &
  MyNavigationConfig;

function TabNavigator({ tabBarStyle, contentStyle, ...rest }: Props) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      MyNavigationOptions,
      MyNavigationEventMap
    >(TabRouter, rest);

  return (
    <NavigationContent>
      <View style={[{ flexDirection: 'row' }, tabBarStyle]}>
        {state.routes.map((route, index) => (
          <Pressable
            key={route.key}
            onPress={() => {
              const isFocused = state.index === index;
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
                data: {
                  isAlreadyFocused: isFocused,
                },
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.dispatch({
                  ...CommonActions.navigate(route),
                  target: state.key,
                });
              }
            }}
            style={{ flex: 1 }}
          >
            <Text>{descriptors[route.key].options.title || route.name}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[{ flex: 1 }, contentStyle]}>
        {state.routes.map((route, i) => {
          return (
            <View
              key={route.key}
              style={[
                StyleSheet.absoluteFill,
                { display: i === state.index ? 'flex' : 'none' },
              ]}
            >
              {descriptors[route.key].render()}
            </View>
          );
        })}
      </View>
    </NavigationContent>
  );
}

// Types required for type-checking the navigator
type MyTabTypeBag<ParamList extends {}> = {
  ParamList: ParamList;
  State: TabNavigationState<ParamList>;
  ScreenOptions: MyNavigationOptions;
  EventMap: MyNavigationEventMap;
  NavigationList: {
    [RouteName in keyof ParamList]: MyNavigationProp<ParamList, RouteName>;
  };
  Navigator: typeof TabNavigator;
};

// The factory function with overloads for static and dynamic configuration
export function createMyNavigator<
  const ParamList extends ParamListBase,
>(): TypedNavigator<MyTabTypeBag<ParamList>, undefined>;
export function createMyNavigator<
  const Config extends StaticConfig<MyTabTypeBag<ParamListBase>>,
>(
  config: Config
): TypedNavigator<MyTabTypeBag<StaticParamList<{ config: Config }>>, Config>;
export function createMyNavigator(config?: unknown) {
  return createNavigatorFactory(TabNavigator)(config);
}

// Helper function for creating screen config with proper types for static configuration
export function createMyScreen<
  const Linking extends StaticScreenConfigLinking,
  const Screen extends StaticScreenConfigScreen,
>(
  config: StaticScreenConfig<
    Linking,
    Screen,
    TabNavigationState<ParamListBase>,
    MyNavigationOptions,
    MyNavigationEventMap,
    MyNavigationProp<ParamListBase>
  >
) {
  return config;
}
```

## Extending Navigators

All of the built-in navigators export their views, which we can reuse and build additional functionality on top of them. For example, if we want to re-build the bottom tab navigator, we need the following code:

```js
import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  TabRouter,
} from '@react-navigation/native';
import { BottomTabView } from '@react-navigation/bottom-tabs';

function BottomTabNavigator({
  initialRouteName,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  backBehavior,
  ...rest
}) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder(TabRouter, {
      initialRouteName,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      backBehavior,
    });

  return (
    <NavigationContent>
      <BottomTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

export function createMyNavigator(config) {
  return createNavigatorFactory(BottomTabNavigator)(config);
}
```

Now, we can customize it to add additional functionality or change the behavior. For example, use a [custom router](custom-routers.md) instead of the default `TabRouter`:

```js
import MyRouter from './MyRouter';

// ...

const { state, descriptors, navigation, NavigationContent } =
  useNavigationBuilder(MyRouter, {
    id,
    initialRouteName,
    children,
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
    backBehavior,
  });

// ...
```

:::note

Customizing built-in navigators like this is an advanced use case and generally not necessary. Consider alternatives such as:

- [`layout`](navigator.md#layout) prop on navigators to add a wrapper around the navigator
- [`router`](navigator.md#router) prop on navigators to customize the router behavior

Also refer to the navigator's documentation to see if any existing API meets your needs.

:::
