---
id: static-configuration
title: Getting started with static API
sidebar_label: Getting started
---

React Navigation primarily uses a dynamic component based API. This provides a lot of flexibility, however there are a few drawbacks:

- The TypeScript types need to be configured manually, which can get verbose and overwhelming.
- Deep linking needs to be configured separately to match the structure of navigation tree, which can be error prone.
- The component API can be a bit more verbose than necessary.

To address these drawbacks, there's also a static API to configure the navigation tree that trades flexibility for convenience. This API is built into React Navigation, so you don't need to install any additional packages.

## Basic usage

The same principles apply to the static API as the dynamic API. We have navigators that can contain multiple screens.

```js
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}

export default App;
```

Let's look at the code above in detail. You can also check the equivalent dynamic API to get a better understanding.

1. To define a navigator, we use the `createXNavigator` function (in this case `createNativeStackNavigator`) and pass it an object with a property called `screens`, which is an object containing configuration for screens - the name of the screen is the key and the value is the component to render:

   ```js
   const RootStack = createNativeStackNavigator({
     screens: {
       Home: HomeScreen,
     },
   });
   ```

  <details>
  <summary>Equivalent dynamic API</summary>

   ```js
   const Stack = createNativeStackNavigator();

   function RootStack() {
     return (
       <Stack.Navigator>
         <Stack.Screen name="Home" component={HomeScreen} />
       </Stack.Navigator>
     );
   }
   ```

  </details>

1. After defining the navigator, we use it with the `createStaticNavigation` function to create a component to render:

   ```js
   const Navigation = createStaticNavigation(RootStack);

   function App() {
     return <Navigation />;
   }
   ```

  <details>
  <summary>Equivalent dynamic API</summary>

   ```js
   function App() {
     return (
       <NavigationContainer>
         <RootStack />
       </NavigationContainer>
     );
   }
   ```

  </details>

   The component returned by `createStaticNavigation` is similar to the `NavigationContainer` and accepts the [same props](navigation-container.md#props). See [Static API Reference](static-api-reference.md#createstaticnavigation) for more details.

2. If you're using TypeScript, there's one last step to do to for automatic type-checking when using `useNavigation`:

   ```js
   type RootStackParamList = StaticParamList<typeof RootStack>;

   declare global {
     namespace ReactNavigation {
       interface RootParamList extends RootStackParamList {}
     }
   }
   ```

   See [Configuring TypeScript](static-typescript.md) for more details.

For more details on the static API, see [Static API Reference](static-api-reference.md).

## Nested navigators

To nest a navigator, a navigator defined using the static API can be passed as the value for a screen:

```js
const HomeTabs = createBottomTabNavigator({
  screens: {
    Groups: GroupsScreen,
    Chats: ChatsScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeTabs,
  },
});
```

<details>
<summary>Equivalent dynamic API</summary>

```js
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeTabs} />
    </Stack.Navigator>
  );
}
```

</details>

There are a couple of things to keep in mind when nesting navigators with the static API:

1. With the dynamic API, the navigator component is a regular component and there's no restriction on how it's structured. As long as it has a navigator rendered somewhere in the tree, it will work for the nested navigation. With the static configuration, you must pass the object returned by another static navigator.
2. You can use a component defined using the dynamic API as the value for a screen in the static API. However, automatic linking configuration and automatic TypeScript types won't work for the screen.

Mixing the static and dynamic APIs is possible, however, in those cases you'll lose the benefits of the static API. See [Combining static and dynamic APIs](static-combine-with-dynamic.md) for more details on some cases where you could mix the two APIs.

## Limitations

The static API is a convenience wrapper around the dynamic API, not a full-replacement. It's not suitable for all use cases. It's important to keep the limitations in mind when using the static API:

- The navigation tree is static with the static API, i.e. the configuration can't be changed dynamically (e.g. updating list of screens or options based on external data).
- The static configuration doesn't have access to context or props, so you can't use them in options, listeners etc. specified in the static configuration.

The dynamic API is still the primary API and isn't going away. So we recommend to avoid rewriting your app to use the static API if you have type-checking and deep linking setup already. Instead, consider using the static API in new projects where you know you won't need to change the configuration dynamically.
