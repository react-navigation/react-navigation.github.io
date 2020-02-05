---
title: React Navigation 3.0
author: Core Team
authorURL: https://twitter.com/reactnavigation
---

The documentation is now live at https://reactnavigation.org, and v2 lives [here](/docs/en/2.x/getting-started.html).

This is the first release where React Navigation depends on a native module outside of React Native core: it now depends on react-native-gesture-handler. This library provides an excellent set of primitives for leveraging the operating systems’ native gesture APIs and has enabled us to fix a variety of issues with stack and drawer navigators. React Navigation also depends on react-native-screens, but you don’t need to install the native module if you prefer not to use it (we have a blog post coming soon that will explain what react-native-screens is and why you may want to use it, or you can watch [this talk](https://www.youtube.com/watch?v=Z0Jl1KCWiag) by the author of the library).

We didn’t get around to every feature that we wanted to land for this release, but we also didn’t want to hold it up further because we expect that you will want to start using it right away - the release includes performance improvements, bugfixes, ergonomics improvements, some handy new features, and a re-organizing of the internals to improve support for web as a target of React Navigation.

Let’s get started with react-navigation 3.0.

# Installation

First, install the library using your favorite package manager: `yarn add react-navigation@^3.0.0`

Next, install react-native-gesture-handler. If you’re using Expo you don’t need to do anything here, it’s included in the SDK. Otherwise, follow [these installation instructions](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html#installation).

Optionally, you can install react-native-screens. If you’re using Expo you don’t need to do anything here, it’s included in SDK 30 and higher. Otherwise, follow the instructions in the README on https://github.com/kmagiera/react-native-screens.

> **Warning**: if you have manually installed any navigators in your project, for example react-navigation-material-bottom-tabs, you will need to update those to a version that is compatible with 3.0.0. In the case of react-navigation-material-bottom-tabs, 1.0.0 is compatible.

# Breaking changes

When you first run your app after updating it won’t work because react-navigation@^3 requires you to add an app container to the root navigator. Once you get that in place, you may notice that your navigation options aren’t being applied as you expect - this is due to navigationOptions in navigator configuration being renamed to defaultNavigationOptions. If you use a drawer, you may notice that it feels quicker, but if you depend on inactive screens being unmounted you’ll be surprised. More details on these changes and how to update your app to work just as well (probably better) than before below.

## Explicit app container required for the root navigator

In the past, any navigator could act as the navigation container at the top-level of your app because they were all wrapped in “navigation containers”. The navigation container, now known as an app container, is a higher-order-component that maintains the navigation state of your app and handles interacting with the outside world to turn linking events into navigation actions and so on.

```js
import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
const MainNavigator = createStackNavigator({...});
const App = createAppContainer(MainNavigator);
```

This should be an easy change - import `createAppContainer` in the root of your app and use it to wrap the root navigator.

> **Warning**: if you have any custom navigators, you may have used `createNavigationContainer`, you can remove this now because it’s only used at the root of the app and provided by the user.

## Renamed navigationOptions in navigator configuration

When configuring navigators it’s often useful to pass in default navigation options for the screens inside of that navigator. For example in a stack you might want to set a background color and tint color for each screen. Previously, you would write something like this:

```js
const Home = createStackNavigator(
  {
    Feed: ExampleScreen,
    Profile: ExampleScreen,
  },
  {
    navigationOptions: {
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#000',
      },
    },
  }
);
```

As of this release, `navigationOptions` in navigator configuration like this has been renamed to `defaultNavigationOptions`.

```js
const Home = createStackNavigator(
  {
    Feed: ExampleScreen,
    Profile: ExampleScreen,
  },
  {
    defaultNavigationOptions: {
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#000',
      },
    },
  }
);
```

Sometimes you need to configure the `navigationOptions` for a navigator itself. Typically you’d do something like this:

```js
Home.navigationOptions = { tabBarLabel: 'Home!' };
```

As of this release, you can use `navigationOptions` in the navigator config for this instead.

```js
const Home = createStackNavigator(
  {
    Feed: ExampleScreen,
    Profile: ExampleScreen,
  },
  {
    defaultNavigationOptions: {
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#000',
      },
    },
    navigationOptions: {
      tabBarLabel: 'Home!',
    },
  }
);

const Tabs = createBottomTabNavigator({ Home });
```

[See this example on Snack](https://snack.expo.io/@notbrent/belligerent-pizza).

We’re sorry to make you go hunt through your code and rename a handful of strings, the hope is that this change makes the code more readable and more intuitive to new users in the future.

## Drawer now keeps inactive tabs in memory by default

Previously when using the drawer navigator screens would unmount when inactive, and when you switch back to them you’d need to re-render the entire thing. In tabs these stay in memory as you would expect, so once you switch to the screen once it’s faster to go back there again and you don’t lose your place in a scroll view or anything. Drawer now behaves the same way, but you can go back to the old behavior if you like by passing in `unmountInactiveRoutes: true` in the drawer navigation configuration.

## Default stack background color is now white

You can customize this by using `cardStyle`:

```js
createStackNavigator(routes, { cardStyle: { backgroundColor: '#ccc' } });
```

# New features

- react-navigation now exports `ScrollView`, `FlatList`, and `SectionList` that will scroll to top when tapping on the active tab as you would expect from native tab bars.
- Drawer supports two more types in addition to the default ‘front’ behavior that you expect from typical Android drawers: back and slide.
- You can now provide default params inside of route definitions:

```js
const Store = createStackNavigator({
  Playstation: { screen: ProductScreen, params: { product: 'Playstation' } },
  Xbox: { screen: ProductScreen, params: { product: 'Xbox' } },
});
```

- Basic support for hooks in `react-navigation-hooks` (although this isn't too useful yet without a stable react-native build that supports hooks, you can play with it on the web!).
- `headerBackgroundTransitionPreset: 'toggle' | 'fade' | 'translate'` lets you choose how to transition your custom `headerBackground` components between screens.
- Add options to opt in/out of the stack card overlay and shadow that are visible during transitions: `cardShadowEnabled` defaults to `true` and `cardOverlayEnabled` defaults to `false`.
- Export `StackGestureContext` and `DrawerGestureContext` from react-navigation-stack and react-navigation-drawer, so you can use the ref from the corresponding gestures with other gesture handlers (eg: https://github.com/react-navigation/react-navigation-drawer/blob/bf4bdba7f6a4fbc12192f5d5ba2285f6280431b7/example/src/GestureInteraction.js).
- Tab navigators support `tabBarOnLongPress` configuration option, which defaults to the same as the tab press event.

# Assorted fixes & improvements

- Stack transition performance improved greatly by removing the shadow from the entire card and rendering it only on the slice where it is needed. The card opacity is also no longer directly animated but instead an overlay is put on top to create a similar effect but with better performance.
- Fix long-standing issues with stack that led to quietly re-mounting screens when navigating quickly in certain patterns: https://github.com/react-navigation/react-navigation-4/issues/4155
- Support inverted gesture in modals.
- Stack card gesture uses react-native-gesture-handler and native driver so the gesture runs on the UI thread (except when the gesture ends, then it calls back to JS).
- Fix a variety of issues with drawer navigator, including issues around nesting (https://github.com/react-navigation/react-navigation-4/issues/4154) and bugs with firing open / close (eg: https://github.com/react-navigation/react-navigation-4/issues/5146).
- Fix accessibility voiceover for tabs and stack back button.

# Ecosystem and web support

React Navigation 3.0 brings some important changes to the React Navigation ecosystem: the project now lives across a number of repositories and packages, we have an exciting new transitioner on the way, and the core finally has first-class support for web apps on the client and server!

## Independent Projects

React Navigation has always been a set of loosely-coupled navigation components: Stack, Tabs, Drawer, etc. But until now they have always lived in the main navigation repo, which has been difficult to maintain. People often struggle to use different versions of these components, or they want to fork them for their own app.

In v3, all of our main packages and repos are separated. There are the following core packages in our new NPM org:

- `@react-navigation/core` - The primitives and utilities that define our patterns, plus several routers
- `@react-navigation/native` - Container and support for navigators on React Native apps. `createAppContainer` from the main `react-navigation` package actually comes from this package.
- `@react-navigation/web` - Web browser app container, and utilities for server rendering

In addition, we have published our community-maintained components as standalone repos and packages:

- `react-navigation-stack`
- `react-navigation-tabs`
- `react-navigation-drawer`
- `react-navigation-transitioner`
- `react-navigation-hooks`

To keep the experience as simple as possible the `react-navigation` package will continue to be supported, and will contain most of the above components as it did before.

## Web Support

Now that the core of React Navigation can be used outside of React Native, we can provide first-class web support to anyone using React.js on the web, including those who do not want to use `react-native-web`.

Here is an example web app which demonstrates the new `createBrowserApp` container and the built-in `Link` component:

```jsx
import { createSwitchNavigator } from "@react-navigation/core";
import { createBrowserApp, Link } from "@react-navigation/web";

class Home extends React.Component {
  static path = "";
  static navigationOptions = {
    title: "Home",
  };
  render () {
    return (
      <div>
        <h2>Home Screen</h2>
        <Link toRoute="Profile" params={{ name: "Brent", view: "photos" }}>
          Brent's photos
        </Link>
      </div>
    );
  }
}
class Profile extends React.Component {
  static path = "/profile/:name";
  ...
}

const AppNavigator = createSwitchNavigator({
  Home,
  Profile,
});

const App = createBrowserApp(AppNavigator);

export default App;
```

The above `Link` tag will render to:
`<a href="/profile/Brent?view=photos">Brent's Photos</a>`

See a simple web app with Create React App [here](https://github.com/react-navigation/example-web). Or take a look at [this razzle app](https://github.com/react-navigation/web-server-example) for a more complicated example including server rendering.

---

Thanks for reading, please post any issues you encounter to https://github.com/react-navigation/react-navigation-4/issues!
