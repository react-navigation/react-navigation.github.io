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

To get React Navigation types, you can add `@react-navigation/native` as a `devDependency` and an optional `peerDependency`:

```json
{
  "devDependencies": {
    "@react-navigation/native": "^7.0.0"
  },
  "peerDependencies": {
    "@react-navigation/native": ">= 7.0.0"
  },
  "peerDependenciesMeta": {
    "@react-navigation/native": {
      "optional": true
    }
  }
}
```

## Standard navigator implementation

The standard navigator file should export the navigator object created with `createStandardNavigator`. This file shouldn't import React Navigation or Expo Router APIs.

To create a standard navigator, use the `createStandardNavigator` function from `standard-navigation`, and pass it a component that renders the desired UI.

The basic shape looks like this:

```tsx
export type MyTabOptions = {
  // screen options type
};

export type MyTabEventMap = {
  // event map type
};

export type MyTabNavigatorProps = {
  // additional navigator props type
};

export const MyTabNavigator = createStandardNavigator<
  MyTabOptions,
  MyTabEventMap,
  MyTabNavigatorProps
>(({ state, descriptors, actions, emitter, ...props }) => {
  // render the navigator UI using the state and descriptors
  // use actions to perform navigation and emitter to emit events
});
```

The object returned by `createStandardNavigator` can then be used in the React Navigation and Expo Router entry points to create the navigators for each library.

The `createStandardNavigator` function accepts three generic arguments:

- **`MyTabOptions`**

  The type of the options available for each screen. It's a record of option names to their types.
  e.g.:

  ```ts
  type MyTabOptions = {
    title?: string;
  };
  ```

- **`MyTabEventMap`**

  The type of the events that can be emitted by the navigator. It's a mapping of event names to event data and whether the event can be prevented.
  e.g.:

  ```ts
  type MyTabEventMap = {
    tabPress: {
      data: { isAlreadyFocused: boolean };
      canPreventDefault: true;
    };
  };
  ```

- **`MyTabNavigatorProps`**

  The type of any additional props accepted by the navigator.

The callback receives `state`, `descriptors`, `actions`, and `emitter` from the navigation library integration:

- **`state`**

  The state object for the navigator. Includes:
  - `state.index`: The index of the currently focused route.
  - `state.routes`: An array of route objects, each with `key`, `name`, `params` and `href` properties.

  For stack navigators, `state.routes` array contains the history of visited screens until `state.index`, and the route objects after `state.index` represent [preloaded](navigation-actions.md#preload) routes.

- **`descriptors`**

  An object mapping route keys to their descriptors. `descriptors[route.key]` will give you the descriptor for a specific route, which includes:
  - `descriptors[route.key].options`: The options for the route.
  - `descriptors[route.key].render()`: Function that returns the react element to render for the route.

- **`actions`**

  An object with functions to perform navigation actions. Available actions are:
  - `actions.navigate(name, params)`: Navigate to a route with the given name and params.
  - `actions.back()`: Go back to the previous route in history.

- **`emitter`**

  An object with a function to emit events from the navigator. The `emitter.emit(...)` function accepts an object with the following properties:
  - `type`: The name of the event to emit, one of the keys in the event map type.
  - `target`: The key of the route that is the target of the event, i.e. the route that can listen for the event.
  - `data`: An object with any additional data to include with the event.
  - `canPreventDefault`: A boolean indicating whether listeners can call `event.preventDefault()` to prevent the default behavior associated with the event.

  Example:

  ```ts
  emitter.emit({
    type: 'tabPress',
    target: route.key,
    canPreventDefault: true,
    data: { isAlreadyFocused: isFocused },
  });
  ```

A basic implementation of a tab navigator could look like this:

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

## React Navigation entry point

The React Navigation entry point should wrap the standard navigator with `createStandardNavigationFactories` from `@react-navigation/native`.

The basic shape looks like this:

```ts
interface MyTabTypeBag extends StandardNavigationTypeBagBase {
  State: TabNavigationState<this['ParamList']>;
  ActionHelpers: TabActionHelpers<this['ParamList']>;
  ScreenOptions: MyTabOptions;
  EventMap: MyTabEventMap;
  RouterOptions: TabRouterOptions;
}

const { createNavigator, createScreen } = createStandardNavigationFactories<
  MyTabTypeBag,
  MyTabNavigatorProps
>(MyTabNavigator, TabRouter);
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

A basic implementation of the React Navigation entry point could look like this:

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
