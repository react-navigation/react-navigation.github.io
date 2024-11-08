---
title: Introducing Static API
authors: satya
tags: [announcement]
---

Two of the major pain points of using React Navigation have been TypeScript and deep linking configuration. Due to the dynamic nature of the navigators, it is necessary to manually maintain the TypeScript and deep linking configuration to match the navigation structure. This can be error-prone and time-consuming.

To solve this, we’re adding a new static API to React Navigation 7. It’s not the same API as React Navigation 4, but it’s similar. Many apps don’t need the features that the dynamic API provides, and they can use the simpler static API instead to simplify their codebase.

<!--truncate-->

:::note

The static API it’s an additional optional API. The dynamic API isn’t going away and will remain a first-class API of React Navigation. In fact, the static API is written entirely on top of the dynamic API.

:::

## Overview

With the dynamic API, first, we import a function such as `createStackNavigator`, and then we use it to define screens - each screen has a `name` and a `component`:

```js
const Stack = createStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
```

The static API follows the same principles. Here we are specifying screens in a property called `screens`, the name of the screen is a key in the configuration object and the value contains the component to render:

```js
const RootStack = createStackNavigator({
  screens: {
    Home: {
      screen: Home,
    },
    Profile: {
      screen: Profile,
    },
    Settings: {
      screen: Settings,
    },
  },
});
```

Then after writing our navigation config, we call `createStaticNavigation` and render the returned component:

```js
const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}
```

This component is similar to `NavigationContainer` and accepts most of the props accepted by `NavigationContainer`. So this is the place where you can do things like track for screen changes, persist navigation state etc.

See [Static API reference](/docs/static-configuration?config=static) for more details.

## TypeScript

The typescript types can be inferred from the root navigator with the `StaticParamList` type and then they will be available anywhere you use `useNavigation`.

The only additional code we need to add is the code for the `RootParamList` interface:

```js
declare global {
  namespace ReactNavigation {
    // highlight-next-line
    interface RootParamList extends StaticParamList<typeof RootStack> {}
  }
}
```

See [Type checking with TypeScript](/docs/typescript?config=static) for more details.

## Deep Linking

There are 2 improvements to deep linking API:

1. The linking configuration is now a part of the navigation configuration and can be specified next to the screen. This makes it easier to keep the linking configuration in sync with the navigation structure:

   ```js
   const RootStack = createStackNavigator({
     screens: {
       Profile: {
         screen: ProfileScreen,
         // highlight-start
         linking: {
           path: 'user/:id',
         },
         // highlight-end
       },
       Settings: {
         screen: SettingsScreen,
         // highlight-start
         linking: {
           path: 'settings',
         },
         // highlight-end
       },
     },
   });
   ```

2. Paths can be generated automatically from the screen names by specifying `enabled: 'auto'`. This avoids the need to specify a path for every screen manually:

   ```js
   const RootStack = createStackNavigator({
     screens: {
       // Generated path: ''
       Home: {
         screen: HomeScreen,
       },
       // Generated path: 'profile'
       Profile: {
         screen: ProfileScreen,
       },
       // Generated path: 'news-feed'
       NewsFeed: {
         screen: NewsFeedScreen,
       },
     },
   });

   const Navigation = createStaticNavigation(RootStack);

   function App() {
     return (
       <Navigation
         linking={{
           prefixes: ['https://mychat.com', 'mychat://'],
           // highlight-next-line
           enabled: 'auto',
         }}
       >
         <Navigation />
       </Navigation>
     );
   }
   ```

See [Configuring links](/docs/configuring-links?config=static) for more details.

## Authentication Flow

One of the nice things about the dynamic APIs is the declarative authentication flow. You declaratively define which screens are available for logged-in and guest users, and React Navigation would handle showing the appropriate screens automatically. To keep a similar experience, we added some dynamism to the new static API with the if property:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      if: useIsSignedIn,
      screen: HomeScreen,
    },
    SignIn: {
      if: useIsSignedOut,
      screen: SignInScreen,
    },
  },
});
```

The if property takes a hook that returns a boolean. When the hook returns true, the screen will be included in the navigation tree, and when it returns false, it won’t be included.

See [Authentication flows](/docs/auth-flow?config=static) for more details.

## Interoperability

Since we have 2 different APIs in the same library, it's important that they both work together. This way you could start an app with the static API, but if you need flexibility for a specific navigator, you could use the dynamic API for that part. Or you may want to migrate to the static API to reduce the complexity, and with the interoperability, you can do that incrementally.

See [Combining static and dynamic APIs](/docs/combine-static-with-dynamic) for more details.

## Help us test

The Static API is currently available in React Navigation 7 alpha. You can try it out by installing the `next` tag of the React Navigation packages:

```sh
yarn add @react-navigation/native@next @react-navigation/native-stack@next
```

In addition to the static API, React Navigation 7 also includes a lot of other improvements and new features. Make sure to go through the [upgrade guide](/docs/upgrading-from-6.x) to see all the changes.

We would love to get feedback from the community on how it works for you and catch any issues before the stable release. If you have any feedback or suggestions, please let us know on our [GitHub Discussions forum](https://github.com/react-navigation/react-navigation/discussions). If you find any issues, please report them on our [GitHub issues](https://github.com/react-navigation/react-navigation/issues).
