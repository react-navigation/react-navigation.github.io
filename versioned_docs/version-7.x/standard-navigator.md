---
id: standard-navigator
title: Standard navigator
sidebar_label: Standard navigator
---

The [`standard-navigation`](https://github.com/react-navigation/standard-navigation/) package provides a standard API for writing navigators that can work with multiple navigation libraries, such as React Navigation and Expo Router.

This is primarily useful for library authors. If you don't plan to publish the library and are building a navigator for use with your existing React Navigation setup, see [Custom navigators](custom-navigators.md) instead.

## Project structure

Install `standard-navigation` as a regular dependency in your navigator library:

```bash npm2yarn
npm install standard-navigation
```

Keep the standard navigator implementation independent from any specific navigation library. Then expose separate entry points for each navigation library:

```text
my-navigator/
  package.json
  src/
    MyTabNavigator.tsx
    react-navigation.tsx
    expo-router.tsx
```

Your package exports can point to those entry points:

```json
{
  "exports": {
    ".": {
      "types": "./lib/typescript/index.d.ts",
      "default": "./lib/module/index.js"
    },
    "./react-navigation": {
      "types": "./lib/typescript/react-navigation.d.ts",
      "default": "./lib/module/react-navigation.js"
    },
    "./expo-router": {
      "types": "./lib/typescript/expo-router.d.ts",
      "default": "./lib/module/expo-router.js"
    }
  },
  "dependencies": {
    "standard-navigation": "^0.0.5"
  }
}
```

## Standard navigator implementation

The standard navigator file should export the navigator object created with `createStandardNavigator`. This file shouldn't import React Navigation or Expo Router APIs.

To create a standard navigator, use the `createStandardNavigator` function from `standard-navigation`, and pass it a component that renders the desired UI.

Example:

```tsx title="src/MyTabNavigator.tsx"
import * as React from 'react';
import {
  Text,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { createStandardNavigator } from 'standard-navigation';

export type MyTabOptions = {
  title?: string;
};

export type MyTabEventMap = {
  tabPress: {
    data: { isAlreadyFocused: boolean };
    canPreventDefault: true;
  };
};

export type MyTabNavigatorProps = {
  tabBarStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export const MyTabNavigator = createStandardNavigator<
  MyTabOptions,
  MyTabEventMap,
  MyTabNavigatorProps
>(({ state, descriptors, actions, emitter, tabBarStyle, contentStyle }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={[{ flexDirection: 'row' }, tabBarStyle]}>
        {state.routes.map((route, index) => (
          <Pressable
            key={route.key}
            onPress={() => {
              const isFocused = state.index === index;
              const event = emitter.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
                data: { isAlreadyFocused: isFocused },
              });

              if (!isFocused && !event.defaultPrevented) {
                actions.navigate(route.name, route.params);
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
    </View>
  );
});
```

The `createStandardNavigator` function accepts three generic arguments:

- `MyTabOptions` - The type of the options available for each screen.
- `MyTabEventMap` - The type of the events that can be emitted by the navigator.
- `MyTabNavigatorProps` - The type of any additional props accepted by the navigator.

The callback receives `state`, `descriptors`, `actions`, and `emitter` from the navigation library integration:

- `state.routes` contains `{ key, name, params, href }` objects.
- `descriptors[route.key].options` contains the screen options.
- `descriptors[route.key].render()` renders the screen.
- `actions.navigate(name, params)` and `actions.back()` perform navigation.
- `emitter.emit(...)` emits navigator events to screen listeners.

:::note

For stack navigators, `state.routes` array contains the history of visited screens until `state.index`, and the route objects after `state.index` represent [preloaded](navigation-actions.md#preload) routes.

:::

## React Navigation entry point

The React Navigation entry point should wrap the standard navigator with `createStandardNavigationFactories` from `@react-navigation/native`:

```tsx title="src/react-navigation.tsx"
import {
  createStandardNavigationFactories,
  type NavigationProp,
  type ParamListBase,
  type RouteProp,
  type StandardNavigationTypeBagBase,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
} from '@react-navigation/native';

import {
  MyTabNavigator,
  type MyTabEventMap,
  type MyTabNavigatorProps,
  type MyTabOptions,
} from './MyTabNavigator';

export type MyTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  TabNavigationState<ParamList>,
  MyTabOptions,
  MyTabEventMap
> &
  TabActionHelpers<ParamList>;

export type MyTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = {
  navigation: MyTabNavigationProp<ParamList, RouteName, NavigatorID>;
  route: RouteProp<ParamList, RouteName>;
};

export interface MyTabTypeBag extends StandardNavigationTypeBagBase {
  State: TabNavigationState<this['ParamList']>;
  ActionHelpers: TabActionHelpers<this['ParamList']>;
  ScreenOptions: MyTabOptions;
  EventMap: MyTabEventMap;
  RouterOptions: TabRouterOptions;
}

export const {
  createNavigator: createMyTabNavigator,
  createScreen: createMyTabScreen,
} = createStandardNavigationFactories<MyTabTypeBag, MyTabNavigatorProps>(
  MyTabNavigator,
  TabRouter
);
```

The `createStandardNavigationFactories` function accepts two generic arguments:

- The type bag for the navigator (e.g. `MyTabTypeBag`), which includes the state, action helpers, screen options, event map, and router options types.
- The type of any additional props accepted by the navigator (e.g. `MyTabNavigatorProps`).

It accepts 3 arguments:

- The standard navigator component.
- The router factory function from React Navigation (e.g. `TabRouter`, `StackRouter`, etc.).
- An optional function to map `{ navigation, state }` to custom props for the navigator component, in case you need any specific state or action helpers not available in the standard ones.

It returns an object with `createNavigator` and `createScreen` functions that can be used to create the navigator and screens for React Navigation. These should be exported from the entry point.

Additionally, you can export custom navigation prop and screen prop types (e.g. `MyTabNavigationProp` and `MyTabScreenProps`) that can be used by consumers for type annotations.

Consumers can then use the React Navigation entry point:

```tsx static2dynamic
import { createStaticNavigation } from '@react-navigation/native';
import {
  createMyTabNavigator,
  createMyTabScreen,
} from 'my-navigator/react-navigation';

const MyTabs = createMyTabNavigator({
  screens: {
    Home: createMyTabScreen({
      screen: HomeScreen,
      options: { title: 'Home' },
    }),
    Feed: createMyTabScreen({
      screen: FeedScreen,
      options: { title: 'Feed' },
    }),
  },
});

const Navigation = createStaticNavigation(MyTabs);
```

## Expo Router entry point

Work in progress.
