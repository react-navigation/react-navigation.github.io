---
id: upgrading-from-4.x
title: Upgrading from 4.x
sidebar_label: Upgrading from 4.x
---

> TODO: This guide is a work in progress. Please send pull requests to improve it.

React Navigation 5 has a completely new component based API. While the main concepts are the same, the API is different. In this guide, we aim to document all the differences so that it's easier to upgrade your app.

You can also use the [compatibility layer](compatibility.md) to reuse code using the old API with minimal changes.

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

There are few key differences here:

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

But what if we want to define options statically on the component? It's less flexible to do it, but we could do it if we wanted:

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    // ...
  }
}

// ...

<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={HomeScreen.navigationOptions}
/>
```

You might be curious, why don't we support it by default anymore if it's so easy?

- Static properties need extra code to work if you have a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html)
- You lose the ability to use props and context here, making them less flexible
- They cannot be type-checked automatically, you need to manually annotate this property
- They don't play well with Fast Refresh, as changing them doesn't trigger a re-render
- We've seen people get confused on how to use static properties when transitioning from class components to function components

Due to the numerous disadvantages with this pattern, we decided to drop it in favor of the current API.

## The `navigation` prop

In React Navigation 4.x, the `navigation` prop contained various helper methods as well as the current screen's state. In React Navigation 5.x, we have split the `navigation` prop into 2 props: `navigation` prop contains helper methods such as `navigate`, `goBack` etc., `route` prop contains the current screen's data (previously accessed via `navigation.state`).

This means, now we can access screen's params through `route.params` instead of `navigation.state.params`:

```js
function ProfileScreen({ route }) {
  const useerId = route.params.me;

  // ...
}
```

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

Remember to add the Babel plugins for [optional-chaining](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining) and [nullish-coalescing-operator](https://babeljs.io/docs/en/next/babel-plugin-proposal-nullish-coalescing-operator).

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
  const [selctionCount, setSelectionCount] = React.useState(0);

  navigation.setOptions({
    title:
      selctionCount === 0 ? 'Select items' : `${selectionCount} items selected`,
  });

  // ...
}
```

## Navigation events

In React Navigation 4.x, there were 4 navigation events to notify focus state of the screen:

- `willFocus`: emitted when screen comes into focus
- `didFocus`: emitted when the transition animation for focus finishes
- `willBlur`: emitted when the screen goes out of focus
- `didBlur`: emitted when the transition animation for blur finishes

It was confusing to decide which events to use and what each event meant. Some navigators also didn't emit events for transition animations which made the events inconsistent.

We have simplified the events in React Navigation 5.x, so now we have only `focus` and `blur` events which are equivalent to `willFocus` and `willBlur` events. To run tasks after an animation finishes, we can use the [`InteractionManager`](https://facebook.github.io/react-native/docs/interactionmanager) API provided by React Native. See the docs for [Navigation lifecycle](navigation-lifecycle.md) for more details.

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
function App() {
  return (
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
  );
}
```

The new approach is more maintainable and removes the need for something like Switch Navigator. So it has been removed.

See [Authentication flows](auth-flow.md) for more info on implementing authentication flows.

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

In React navigation 5.x, we have revamped the theme system for easier customization. Now you can provide a theme object with your desired colors for background, accent color etc. and it will automatically change the colors of all navigators without any extra code. See the [Themes](themes.md) documentation for more details on how to customize the theme.

## Navigation state in Redux

We have long recommended not to store navigation state in Redux. We have finally dropped support for storing navigation state in Redux in React Navigation 5.x.

This means you cannot store navigation state in Redux. You can still use Redux (or any other library) for managing your app state and it will work fine. See [Redux integration](redux-integration.md) for more info.
