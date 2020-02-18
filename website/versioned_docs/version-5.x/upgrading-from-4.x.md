---
id: upgrading-from-4.x
title: Upgrading from 4.x
sidebar_label: Upgrading from 4.x
---

> This guide is a work in progress! As more people upgrade their apps we can continue to improve it. Please send pull requests to add any suggestions that you have from your upgrade experience.

React Navigation 5 has a completely new component based API. While the main concepts are the same, the API is different. In this guide, we aim to document all the differences so that it's easier to upgrade your app.

If you have not installed React Navigation 5 yet, you can do so following the [Getting Started guide](getting-started.html).

To reuse code using the old API with minimal changes, you can use the [compatibility layer](compatibility.html).

## Package names

For React Navigation 5, we went with scoped packages (e.g. `@react-navigation/stack`). It distinguishes them from previous versions and makes it harder to accidentally mix v4 and v5 packages. The following are the new equivalent package names:

- `react-navigation` -> `@react-navigation/native`
- `react-navigation-stack` -> `@react-navigation/stack`
- `react-navigation-tabs` -> `@react-navigation/bottom-tabs`, `@react-navigation/material-top-tabs`
- `react-navigation-material-bottom-tabs` -> `@react-navigation/material-bottom-tabs`
- `react-navigation-drawer` -> `@react-navigation/drawer`

## Navigation Container

In React Navigation 5.x there's no `createAppContainer` which provided screens with navigation context. You'll need to wrap your app with [NavigationContainer](app-containers.html) provider.

```js
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return <NavigationContainer>{/*...*/}</NavigationContainer>
}
```

The `onNavigationStateChange` prop on the AppContainer is now available as `onStateChange` on NavigationContainer.

## Configuring the navigator

In React Navigation 4.x, we used to statically configure our navigator to `createXNavigator` functions. The first parameter was an object containing route configuration, and the second parameter was configuration for the navigator.

```js
const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: { title: 'My app' },
    },
    Profile: {
      screen: ProfileScreen,
      params: { user: 'me' },
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      gestureEnabled: false,
    },
  }
);
```

With 5.x, we now configure the navigator inside a component. First, we create `Navigator` and `Screen` pair using `createXNavigator` and then use them to render our navigator.

The main concepts are the same. There are navigators and screens, nesting works the same, we have configuration for the navigator and options for the screen. To summarize the differences:

- All of the configuration is passed as props to the navigator
- The route configuration is done using `Screen` elements and passed as children
- `params` becomes `initialParams` prop on `Screen`
- `navigationOptions` becomes `options` prop on `Screen`
- `defaultNavigationOptions` becomes `screenOptions` prop on `Navigator`

```js
const Stack = createStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ gestureEnabled: false }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My app' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user: 'me' }}
      />
    </Stack.Navigator>
  );
}
```

## The `navigation` prop

### Separate `route` prop

In React Navigation 4.x, the `navigation` prop contained various helper methods as well as the current screen's state. In React Navigation 5.x, we have split the `navigation` prop into 2 props: `navigation` prop contains helper methods such as `navigate`, `goBack` etc., `route` prop contains the current screen's data (previously accessed via `navigation.state`).

This means, now we can access screen's params through `route.params` instead of `navigation.state.params`:

```js
function ProfileScreen({ route }) {
  const userId = route.params.me;

  // ...
}
```

### No more `getParam`

Previously we could also use `navigation.getParam('someParam', 'defaultValue')` to get a param value. It addressed 2 things:

- Guard against `params` being `undefined` in some cases
- Provide a default value if the `params.someParam` was `undefined` or `null`

Now, the same thing can be achieved using the upcoming [optional chaining](https://github.com/tc39/proposal-optional-chaining) and [nullish coalescing](https://github.com/tc39/proposal-nullish-coalescing) operators:

```js
navigation.getParam('someParam', 'defaultValue');
```

is equivalent to:

```js
route.params?.someParam ?? 'defaultValue';
```

### No more `isFirstRouteInParent`

The `isFirstRouteInParent` method did a very specific job: tell you if the route is the first one in parent's state. The main purpose was to decide whether you can show a back button in a screen depending on if it's the first one.

However, it had many of shortcomings:

1. It checked the `routes` array in state to determine if it's the first, which means that it won't work for other navigators such as tab navigator which keep history in a separate `routeKeyHistory` array.
2. Since this was a method on the navigation object, if a screen's index changed to/from the first one, it would always trigger re-render for that screen whether you use the method or not.

Now we have added a [`useNavigationState`](use-navigation-state.html) which addresses many more use cases and doesn't have these shortcomings. We can implement `isFirstRouteInParent` with this hook:

```js
function useIsFirstRouteInParent() {
  const route = useRoute();
  const isFirstRouteInParent = useNavigationState(
    state => state.routes[0].key === route.key
  );

  return isFirstRouteInParent;
}
```

## Specifying `navigationOptions` for a screen

In React Navigation 4.x, we could do the following to specify `navigationOption`:

```js
class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  render() {
    // ...
  }
}
```

With React Navigation 5.x, we need to pass the configuration when defining the screen:

```js
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={{ headerShown: false }}
/>
```

For dynamic options, the `options` prop also accepts a function which receives the `navigation` and `route` props:

```js
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={({ route }) => ({ title: route.params.user })}
/>
```

In addition to this, React Navigation 5.x has another way to configure screen dynamically based on a screen's props or state by calling `navigation.setOptions`:

```js
function SelectionScreen({ navigation }) {
  const [selectionCount, setSelectionCount] = React.useState(0);

  navigation.setOptions({
    title:
      selectionCount === 0
        ? 'Select items'
        : `${selectionCount} items selected`,
  });

  // ...
}
```

But what if we want to define options statically on the component? It's less flexible to do it, but we could do it if we wanted:

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    // ...
  };
}

// ...

<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={HomeScreen.navigationOptions}
/>;
```

You might be curious, why don't we support it by default anymore if it's so easy?

- Static properties need extra code to work if you have a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html)
- You lose the ability to use props and context here, making them less flexible
- They cannot be type-checked automatically, you need to manually annotate this property
- They don't play well with Fast Refresh, as changing them doesn't trigger a re-render
- We've seen people get confused on how to use static properties when transitioning from class components to function components

Due to the numerous disadvantages with this pattern, we decided to drop it in favor of the current API.

## Navigation events

In React Navigation 4.x, there were 4 navigation events to notify focus state of the screen:

- `willFocus`: emitted when screen comes into focus
- `didFocus`: emitted when the transition animation for focus finishes
- `willBlur`: emitted when the screen goes out of focus
- `didBlur`: emitted when the transition animation for blur finishes

It was confusing to decide which events to use and what each event meant. Some navigators also didn't emit events for transition animations which made the events inconsistent.

We have simplified the events in React Navigation 5.x, so now we have only `focus` and `blur` events which are equivalent to `willFocus` and `willBlur` events. To run tasks after an animation finishes, we can use the [`InteractionManager`](https://facebook.github.io/react-native/docs/interactionmanager) API provided by React Native. See the docs for [Navigation lifecycle](navigation-lifecycle.html) for more details.

## Navigating to nested screens

Previously, you could navigate to a screen deeply nested somewhere in a navigator. This was possible because the configuration was static, and all of the navigators were available on the initial startup.

With a dynamic configuration, it becomes impossible, because new navigators and screens could be added, or existing navigators and screens could be removed any time in future. In addition, navigators are initialized as needed in 5.x instead of initializing all navigators at startup, which means that a navigator may not be available to handle an action.

Because of these reasons, you now need to be more explicit when navigating to a deeply nested screen. See [nesting navigators docs](https://reactnavigation.org/docs/en/nesting-navigators.html#navigating-to-a-screen-in-a-nested-navigator) for more details.

## Deep-linking

In React Navigation 4.x, you could specify a `path` property in your screen configuration which was used for handling incoming links. This was possible because we could statically get the configuration for all of the defined `path`s.

Due to dynamic configuration in 5.x, links need to be handled before we can know what to render for our navigators. So it's necessary to specify the deep link configuration separately. See the [deep linking](deep-linking.html) docs for more information.

## Switch Navigator

The purpose of Switch Navigator was to dynamically switch between screens/navigators, mostly useful for implementing onboarding/auth flows. For example:

```js
const AppNavigator = createStackNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen,
});

const RootNavigator = createSwitchNavigator({
  Login: LoginScreen,
  App: AppNavigator,
});
```

And then after login:

```js
navigation.navigate('App');
```

With React Navigation 5.x, we can dynamically define and alter the screen definitions of a navigator, which makes Switch Navigator unnecessary. The above pattern can be now defined declaratively:

```js
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

The new approach is more maintainable and removes the need for something like Switch Navigator. So it has been removed.

See [Authentication flows](auth-flow.html) for more info on implementing authentication flows.

## Global props with `screenProps`

In React Navigation 4.x, we could pass a prop called `screenProps` which you could access in all the child navigators:

```js
<App screenProps={{ /* some data here */ }}>
```

This was handy for passing global configuration such as translations, themes etc. to all screens.

However, using `screenProps` had some disadvantages:

- Changing the values in `screenProps` re-renders all of the screens in the app, regardless of whether they use it or not. This can be very bad for performance, and easy mistake to make.
- When using a type-checker like TypeScript, it was necessary to annotate `screenProps` every time we want to use it, which wasn't type-safe or convenient.
- You could only access `screenProps` in screens. To access them in child components, you needed to pass them down as props manually. It's very inconvenient for things like translation where we often use it in a lot of components.

Due to the component based API of React Navigation 5.x, we have a much better alternative to `screenProps` which doesn't have these disadvantages: [React Context](https://reactjs.org/docs/context.html). Using React Context, it's possible to pass data to any child component in a performant and type-safe way, and we don't need to learn a new API!

## Themes

React Navigation 4.x had basic theming support where you could specify whether to use a light or dark theme:

```js
<App theme="dark">
```

It wasn't easy to customize the colors used by the built-in components such as header, tab bar etc. without extra code or repetition.

In React navigation 5.x, we have revamped the theme system for easier customization. Now you can provide a theme object with your desired colors for background, accent color etc. and it will automatically change the colors of all navigators without any extra code. See the [Themes](themes.html) documentation for more details on how to customize the theme.

## Action creators

The `navigation` object has a `dispatch` method used to dispatch navigation actions. Normally we don't recommend dispatching action objects, but use the existing methods such as `navigation.push`, `naigation.navigate` etc. But if you were importing action creators from the library, then you'll need to update your code:

- `NavigationActions` is now `CommonActions`, can be imported from `@react-navigation/native`
- `StackActions`, `DrawerActions` etc. can be imported from `@react-navigation/native`
- `SwitchActions` is now `TabActions`. can be imported from `@react-navigation/native`

Signature of many actions have changed. Refer to their docs for details:

- [`StackActions`](stack-actions.html)
- [`TabActions`](tab-actions.html)
- [`DrawerActions`](drawer-actions.html)

It's highly recommended to use the methods on the navigation object instead of using action creators and `dispatch`. It should only be used for advanced use cases.

In addition, there have been some changes to the way the navigation actions work. These changes probably won't affect you if you didn't do any advanced tasks with these methods.

One major difference is that a lot of methods used to take some parameters for controlling which screen and navigator it should be applied to and didn't follow a specific pattern.

In this version, we have standardized this and made it possible to use with any action without the action needing to support it. The new `target` and `source` properties provides control over which navigator should handle an action. See [docs for dispatch](https://reactnavigation.org/docs/navigation-prop.html#dispatch---send-an-action-to-the-router) for more details.

You can import the action creators from the [compatibility layer](compatibility.html) to preserve old behavior for the actions.

More differences in the signatures are listed below:

### `navigate`

Previously, it was possible to pass an object `{ routeName, key, params }`. Now, `routeName` is called just `name`, so it'll be `{ name, key, params }`.

The `navigate` action also supported child actions in the `action` property in the object. We found that very few people actually used it and most found it confusing. It also complicated the code quite a bit, so we have removed this functionality.

See [`navigate` action docs](https://reactnavigation.org/docs/navigation-actions.html#navigate) for more details.

### `goBack`

Previously, the `goBack` method took one parameter: `from`. You could pass nothing to go back from anywhere, pass `null` to go back from the current screen, or a route key to go back from a specific route. It was a common source of confusion.

The new behavior of `goBack` is more intuitive as it takes you back from the screen that dispatched the action. More advanced behavior can be achieved by `target` and `source` properties to replicate old behavior.

See [`goBack` action docs](https://reactnavigation.org/docs/navigation-actions.html#goback) for more details.

### `setParams`

Previously, the `setParams` method also took an optional `key` to specify which screen was setting its params. Now the `source` property can be used to achieve the same functionality.

See [`setParams` action docs](https://reactnavigation.org/docs/navigation-actions.html#setparams) for more details.

### `reset`

Previously, the `reset` method took an array of actions to apply. This was often not intuitive. Now, we have changed `reset` method to take the new state instead:

For example, this will reset the navigator's state to have one screen called `Home`:

```js
navigation.reset({
  routes: [{ name: 'Home' }],
});
```

The `reset` action is now also supported on all navigators instead of just stack.

See [`reset` action docs](https://reactnavigation.org/docs/navigation-actions.html#reset) for more details.

### `replace`

Previously, it was possible to pass an object `{ routeName, key, newKey, params }`. Now, `routeName` is called just `name`, and `newKey` is called `key`, so it'll be `{ name, key, params }`. The previous `key` can be specified using the `source` property.

The `replace` action also supported child actions in the `action` property which has been removed.

See [`replace` action docs](https://reactnavigation.org/docs/stack-actions.html#replace) for more details.

### `push`

Previously, it was possible to pass an object `{ routeName, params }`. Now, `routeName` is called just `name`, so it'll be `{ name, params }`.

The `push` action also supported child actions in the `action` property which has been removed.

See [`push` action docs](https://reactnavigation.org/docs/stack-actions.html#push) for more details.

### `pop`

Previously, the `pop` method used to take an object with a property called `n` which specified how many screens to go back to. Now, you can directly specify the number as the first argument instead of an object.

See [`pop` action docs](https://reactnavigation.org/docs/stack-actions.html#pop) for more details.

### `dismiss`

The `dismiss` method has been removed. You can achieve similar effect with following:

```js
navigation.dangerouslyGetParent().pop();
```

### `jumpTo`

Previously, the `jumpTo` method also took an optional `key` to specify which screen was setting its params. Now the `source` property can be used to achieve the same functionality.

See [`jumpTo` action docs](https://reactnavigation.org/docs/tab-actions.html#jumpto) for more details.

## Scrollables

React Navigation 4.x exported its own `ScrollView`, `FlatList`, and `SectionList` components. These were wrappers around the scrollable components [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) and would scroll to top when tapping on an active tab.

However, this was very restrictive since you may want to use another scrollable implementation which we didn't wrap. So now we have a [`useScrollToTop`](use-scroll-to-top.html) hook that can be used with any scrollable component.

## Higher order components

React Navigation 4.x included higher order components such as `withNavigation` and `withNavigationFocus`. Now they live in the [compat package](compatibility.html).

## Navigation state in Redux

We have long recommended not to store navigation state in Redux. We have finally dropped support for storing navigation state in Redux in React Navigation 5.x.

This means you cannot store navigation state in Redux. You can still use Redux (or any other library) for managing your app state and it will work fine. See [Redux integration](redux-integration.html) for more info.
