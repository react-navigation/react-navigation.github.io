---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This section attempts to outline issues that users frequently encounter when first getting accustomed to using React Navigation. These issues may or may not be related to React Navigation itself.

Before troubleshooting an issue, make sure that you have upgraded to **the latest available versions** of the packages. You can install the latest versions by installing the packages again (e.g. `npm install package-name`).

## I'm getting an error "Unable to resolve module" after updating to the latest version

This might happen for 3 reasons:

### Stale cache of Metro bundler

If the module points to a local file (i.e. the name of the module starts with `./`), then it's probably due to stale cache. To fix this, try the following solutions.

If you're using Expo, run:

```bash
expo start -c
```

If you're not using Expo, run:

```bash
npx react-native start --reset-cache
```

If that doesn't work, you can also try the following:

```bash
rm -rf $TMPDIR/metro-bundler-cache-*
```

### Missing peer dependency

If the module points to an npm package (i.e. the name of the module doesn't start with `./`), then it's probably due to a missing dependency. To fix this, install the dependency in your project:

```bash npm2yarn
npm install name-of-the-module
```

Sometimes it might even be due to a corrupt installation. If clearing cache didn't work, try deleting your `node_modules` folder and run `npm install` again.

### Missing extensions in metro configuration

Sometimes the error may look like this:

```bash
Error: While trying to resolve module "@react-navigation/native" from file "/path/to/src/App.js", the package "/path/to/node_modules/@react-navigation/native/package.json" was successfully found. However, this package itself specifies a "main" module field that could not be resolved ("/path/to/node_modules/@react-navigation/native/src/index.tsx"
```

This can happen if you have a custom configuration for metro and haven't specified `ts` and `tsx` as valid extensions. These extensions are present in the default configuration. To check if this is the issue, look for a `metro.config.js` file in your project and check if you have specified the [`sourceExts`](https://facebook.github.io/metro/docs/en/configuration#sourceexts) option. It should at least have the following configuration:

```js
sourceExts: ['js', 'json', 'ts', 'tsx'];
```

If it's missing these extensions, add them and then clear metro cache as shown in the section above.

## I'm getting "SyntaxError in @react-navigation/xxx/xxx.tsx" or "SyntaxError: /xxx/@react-navigation/xxx/xxx.tsx: Unexpected token"

This might happen if you have an old version of the `@react-native/babel-preset` package. Try upgrading it to the latest version.

```bash npm2yarn
npm install --save-dev @react-native/babel-preset
```

If you have `@babel/core` installed, also upgrade it to latest version.

```bash npm2yarn
npm install --save-dev @babel/core
```

If upgrading the packages don't help, you can also try deleting your `node_modules` and then the lock the file and reinstall your dependencies.

If you use `npm`:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

If you use `yarn`:

```bash
rm -rf node_modules
rm yarn.lock
yarn
```

:::warning

Deleting the lockfile is generally not recommended as it may upgrade your dependencies to versions that haven't been tested with your project. So only use this as a last resort.

:::

After upgrading or reinstalling the packages, you should also clear Metro bundler's cache following the instructions earlier in the page.

## I'm getting "Module '[...]' has no exported member 'xxx' when using TypeScript

This might happen if you have an old version of TypeScript in your project. You can try upgrading it:

```bash npm2yarn
npm install --save-dev typescript
```

## I'm getting an error "null is not an object (evaluating 'RNGestureHandlerModule.default.Direction')"

This and some similar errors might occur if you have a bare React Native project and the library [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) isn't linked.

Linking is automatic from React Native 0.60, so if you have linked the library manually, first unlink it:

```bash
react-native unlink react-native-gesture-handler
```

If you're testing on iOS and use Mac, make sure you have run `pod install` in the `ios/` folder:

```bash
cd ios
pod install
cd ..
```

Now rebuild the app and test on your device or simulator.

## I'm getting an error "requireNativeComponent: "RNCSafeAreaProvider" was not found in the UIManager"

This and some similar errors might occur if you have a bare React Native project and the library [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context) isn't linked.

Linking is automatic from React Native 0.60, so if you have linked the library manually, first unlink it:

```bash
react-native unlink react-native-safe-area-context
```

If you're testing on iOS and use Mac, make sure you have run `pod install` in the `ios/` folder:

```bash
cd ios
pod install
cd ..
```

Now rebuild the app and test on your device or simulator.

## I'm getting an error "requireNativeComponent: "RNSScreen" was not found in the UIManager" or "ViewManager returned null for either RNSScreen or RCTRNSScreen"

This and some similar errors, such as errors mentioning `RNSScreen`, `RNSScreenStack`, `RNSScreenStackHeaderConfig`, `RNSScreenContentWrapper` etc. might occur if the library [`react-native-screens`](https://github.com/software-mansion/react-native-screens) isn't installed correctly or the app hasn't been rebuilt after installing it.

If you're using Expo managed workflow, install the version compatible with your Expo SDK:

```bash
npx expo install react-native-screens
```

If you're not using Expo managed workflow, install the package:

```bash npm2yarn
npm install react-native-screens
```

If you're testing on iOS and use Mac, make sure you have run `pod install` in the `ios/` folder:

```bash
cd ios
pod install
cd ..
```

Now rebuild the app and test on your device or simulator.

## I'm getting an error "Tried to register two views with the same name RNCSafeAreaProvider"

This might occur if you have multiple versions of [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context) installed.

If you're using Expo managed workflow, it's likely that you have installed an incompatible version. To install the correct version, run:

```bash
npx expo install react-native-safe-area-context
```

If it didn't fix the error or you're not using Expo managed workflow, you'll need to check which package depends on a different version of `react-native-safe-area-context`.

If you use `yarn`, run:

```bash
yarn why react-native-safe-area-context
```

If you use `npm`, run:

```bash
npm ls react-native-safe-area-context
```

This will tell you if a package you use has a dependency on `react-native-safe-area-context`. If it's a third-party package, you should open an issue on the relevant repo's issue tracker explaining the problem. Generally for libraries, dependencies containing native code should be defined in `peerDependencies` instead of `dependencies` to avoid such issues.

If it's already in `peerDependencies` and not in `dependencies`, and you use `npm`, it might be because of incompatible version range defined for the package. The author of the library will need to relax the version range in such cases to allow a wider range of versions to be installed.

If you use `yarn`, you can also temporarily override the version being installed using `resolutions`. Add the following in your `package.json`:

```json
"resolutions": {
  "react-native-safe-area-context": "<version you want to use>"
}
```

And then run:

```bash
yarn
```

If you're on iOS and not using Expo managed workflow, also run:

```bash
cd ios
pod install
cd ..
```

Now rebuild the app and test on your device or simulator.

## I'm getting an error related to Reanimated or worklets

Some navigators, such as Drawer Navigator, depend on [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) and [`react-native-worklets`](https://github.com/software-mansion/react-native-reanimated/tree/main/packages/react-native-worklets) for animations. If they aren't installed or configured correctly, you may see errors mentioning worklets, the Reanimated Babel plugin, or native modules from Reanimated.

If you're using Expo managed workflow, install the compatible versions:

```bash
npx expo install react-native-reanimated react-native-worklets
```

If you're not using Expo managed workflow, install the packages:

```bash npm2yarn
npm install react-native-reanimated react-native-worklets
```

Then follow the [Reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started) to configure the Reanimated Babel plugin.

If you're testing on iOS and use Mac, make sure you have run `pod install` in the `ios/` folder:

```bash
cd ios
pod install
cd ..
```

After changing the Babel configuration or installing native dependencies, clear Metro's cache and rebuild the app.

## Nothing is visible on the screen after adding a `View`

If you wrap the container in a `View`, make sure the `View` stretches to fill the container using `flex: 1`:

<ConfigTabs>
<TabItem value="static">

```js
import * as React from 'react';
import { View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';

/* ... */

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    // highlight-next-line
    <View style={{ flex: 1 }}>
      <Navigation />
    </View>
  );
}
```

</TabItem>
<TabItem value="dynamic">

```js
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    // highlight-next-line
    <View style={{ flex: 1 }}>
      <NavigationContainer>{/* ... */}</NavigationContainer>
    </View>
  );
}
```

</TabItem>
</ConfigTabs>

## I get the warning "Non-serializable values were found in the navigation state"

This can happen if you are passing non-serializable values such as class instances, functions etc. in params. React Navigation warns you in this case because this can break other functionality such [state persistence](state-persistence.md), [deep linking](deep-linking.md), [web support](web-support.md) etc.

Example of some use cases for passing functions in params are the following:

- To pass a callback to use in a header button. This can be achieved using `navigation.setOptions` instead. See the [guide for header buttons](header-buttons.md#header-interaction-with-its-screen-component) for examples.
- To pass a callback to the next screen which it can call to pass some data back. You can usually achieve it using `popTo` instead. See [passing params to a previous screen](params.md#passing-params-to-a-previous-screen) for examples.
- To pass complex data to another screen. Instead of passing the data `params`, you can store that complex data somewhere else (like a global store), and pass an id instead. Then the screen can get the data from the global store using the id. See [what should be in params](params.md#what-should-be-in-params).
- Pass data, callbacks etc. from a parent to child screens. You can either use React Context, or pass a children callback to pass these down instead of using params. See [passing additional data](hello-react-navigation.md#passing-additional-data).

We don't generally recommend passing functions in params. But if you don't use state persistence, deep links, or use React Navigation on Web, then you can choose to ignore it. To ignore the warning, you can use `LogBox.ignoreLogs`.

Example:

```js
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
```

## I'm getting "Invalid hook call. Hooks can only be called inside of the body of a function component"

This can happen when you pass a React component to an option that accepts a function returning a react element. For example, the [`headerTitle` option in native stack navigator](native-stack-navigator.md#headertitle) expects a function returning a react element:

<ConfigTabs>
<TabItem value="static">

```js
const Stack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        // highlight-next-line
        headerTitle: (props) => <MyTitle {...props} />,
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic">

```js
<Stack.Screen
  name="Home"
  component={Home}
  options={{
    // highlight-next-line
    headerTitle: (props) => <MyTitle {...props} />,
  }}
/>
```

</TabItem>
</ConfigTabs>

If you directly pass a function here, you'll get this error when using hooks:

<ConfigTabs>
<TabItem value="static">

```js
const Stack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        // This is not correct
        // highlight-next-line
        headerTitle: MyTitle,
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic">

```js
<Stack.Screen
  name="Home"
  component={Home}
  options={{
    // This is not correct
    // highlight-next-line
    headerTitle: MyTitle,
  }}
/>
```

</TabItem>
</ConfigTabs>

The same applies to other options like `headerLeft`, `headerRight`, `tabBarIcon` etc. as well as props such as `tabBar`, `drawerContent` etc.

## I'm getting "Couldn't find a navigation object. Is your component inside NavigationContainer?"

This can happen if you use navigation hooks such as `useNavigation` or `useRoute` in a component that isn't rendered inside a navigator.

Make sure that:

- Your app renders `NavigationContainer` when using the dynamic API, or the component returned by `createStaticNavigation` when using the static API.
- The component using navigation hooks is rendered as a screen or inside a screen.
- You don't use navigation hooks in components rendered outside the navigation tree, such as a separate root, portal, or modal rendered outside the navigator.

If you need to navigate from a component that isn't rendered inside a navigator, see [Navigation ref](navigation-ref.md).

## I'm getting "The action 'NAVIGATE' was not handled by any navigator"

This can happen if you're trying to navigate to a screen that doesn't exist in the navigator that handled the action.

Check the following:

- The route name passed to `navigation.navigate` exactly matches one of the screen names in the navigator.
- If the screen is inside a nested navigator, you're navigating to it using the nested syntax shown in [navigating to a screen in a nested navigator](nesting-navigators.md#navigating-to-a-screen-in-a-nested-navigator).
- If screens are rendered conditionally, such as in an authentication flow, the screen you're navigating to is currently available, and [you're not manually navigating after the condition changes](auth-flow.md#dont-manually-navigate-when-conditionally-rendering-screens).

This error is shown in development to help you catch an incorrect navigations. It's not shown in production, and the app won't crash.

## My header, tab bar, or drawer options are not updating

This can happen if the option is configured on the wrong navigator. Each navigator has its own options. For example, a tab screen can configure its tab bar options, but it can't directly configure the header of a parent or child stack from its own `options`.

If you have nested navigators, ensure that the options are configured on the correct navigator. Check each navigator's documentation to see which options it supports.

See [screen options with nested navigators](screen-options-resolution.md) on how options are resolved with nested navigators.

## My deep link opens the wrong screen or is ignored

Issues with deep linking are often due to one of the following reasons:

- The native URL scheme, universal link, or app link setup isn't configured correctly. See [setting up deep links](deep-linking.md#setting-up-deep-links).
- The linking config doesn't match your nested navigator structure (if you're using dynamic API). See [mapping path to route names](configuring-links.md#mapping-path-to-route-names).
- The deep link is handled manually using `useEffect` or similar instead of using the built-in deep linking support of React Navigation.

You can test whether the native app receives the link by following [testing deep links](deep-linking.md#testing-deep-links). Use [React Navigation DevTools](devtools.md) to see if React Navigation receives the link.

## `goBack` or the Android back button doesn't do anything

This can happen if the current navigator doesn't have any screen to go back to. Navigation actions are handled by the current navigator first and then bubble up to parent navigators if they couldn't be handled. If none of the navigators have a previous screen to go back to, then the action will be ignored.

You can use `navigation.canGoBack()` to check if the current navigator has a previous screen to go back to before calling `goBack` and provide a fallback action if needed:

```js
if (navigation.canGoBack()) {
  navigation.goBack();
} else {
  navigation.navigate('Home');
}
```

## TypeScript says the route name or params are `never`

This usually means that TypeScript doesn't know the route names and params for your navigator.

Ensure the following:

- You have configured global types for your navigator. See [specifying the root navigator's type](typescript.md#specifying-the-root-navigators-type).
- If you are using the dynamic API, you have provided a param list as a generic (e.g. `createStackNavigator<MyParamList>()`) and that your screen names match the keys in that param list. See [specifying param types for screens](typescript.md#specifying-param-types-for-screens).

## Screens are unmounting/remounting during navigation

Sometimes you might have noticed that your screens unmount/remount, or your local component state or the navigation state resets when you navigate. This might happen if you are creating React components during render.

The simplest example is something like following:

```js
function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={() => {
          return <SomeComponent />;
        }}
      />
    </Stack.Navigator>
  );
}
```

The `component` prop expects a React Component, but in the example, it's getting a function returning an React Element. While superficially a component and a function returning a React Element look the exact same, they don't behave the same way when used.

Here, every time the component re-renders, a new function will be created and passed to the `component` prop. React will see a new component and unmount the previous component before rendering the new one. This will cause any local state in the old component to be lost. React Navigation will detect and warn for this specific case but there can be other ways you might be creating components during render which it can't detect.

Another easy to identify example of this is when you create a component inside another component:

<ConfigTabs>
<TabItem value="static">

```js
function App() {
  const Home = () => {
    return <SomeComponent />;
  };

  const RootStack = createNativeStackNavigator({
    screens: {
      Home: Home,
    },
  });

  const Navigation = createStaticNavigation(RootStack);

  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic">

```js
function App() {
  const Home = () => {
    return <SomeComponent />;
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</ConfigTabs>

Or when you use a higher order component (such as `connect` from Redux, or `withX` functions that accept a component) inside another component:

```js
function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={withSomeData(Home)} />
    </Stack.Navigator>
  );
}
```

If you're unsure, it's always best to make sure that the components you are using as screens are defined outside of a React component. They could be defined in another file and imported, or defined at the top level scope in the same file:

<ConfigTabs>
<TabItem value="static">

```js
const Home = () => {
  // ...

  return <SomeComponent />;
};

const RootStack = createNativeStackNavigator({
  screens: {
    Home: Home,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic">

```js
const Home = () => {
  // ...

  return <SomeComponent />;
};

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</ConfigTabs>

This is not React Navigation specific, but related to React in general. You should always avoid creating components during render, whether you are using React Navigation or not.
