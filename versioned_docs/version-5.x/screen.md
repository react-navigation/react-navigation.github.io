---
id: screen
title: Screen
sidebar_label: Screen
---

`Screen` components are used to configure various aspects of screens inside a navigator.

A `Screen` is returned from a `createNavigatorX` function:

```js
const Stack = createStackNavigator(); // Stack contains Screen & Navigator properties
```

After creating the navigator, it can be used as children of the `Navigator` component:

```js
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
</Stack.Navigator>
```

You need to provide at least a name and a component to render for each screen.

## Props

### `name`

The name to use for the screen. It accepts a string:

```js
<Stack.Screen name="Profile" component={ProfileScreen} />
```

This name is used to navigate to the screen:

```js
navigation.navigate('Profile');
```

It is also used for the `name` property in the [`route`](route-prop.md).

While it is supported, we recommend to avoid spaces or special characters in screen names and keep them simple.

### `options`

Options to configure how the screen gets presented in the navigator. It accepts either an object or a function returning an object:

```js
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    title: 'Awesome app',
  }}
/>
```

When you pass a function, it'll receive the [`route`](route-prop.md) and [`navigation`](navigation-prop.md):

```js
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={({ route, navigation }) => ({
    title: route.params.userId,
  })}
/>
```

See [Options for screens](screen-options.md) for more details and examples.

### `getId`

Callback to return an unique ID to use for the screen. It receives an object with the route params:

```js
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  getId={({ params }) => params.userId}
/>
```

By default, calling `navigate('ScreenName', params)` identifies the screen by its name, and navigates to the existing screen instead of adding a new one. If you specify `getId` and it doesn't return `undefined`, the screen is identified by both the screen name and the returned ID.

This is useful for preventing multiple instances of the same screen in the navigator, e.g. - when `params.userId` is used as an ID, subsequent navigation to the screen with the same `userId` will navigate to the existing screen instead of adding a new one to the stack. If the navigation was with a different `userId`, then it'll add a new screen.

### `component`

The React Component to render for the screen:

```js
<Stack.Screen name="Profile" component={ProfileScreen} />
```

### `getComponent`

Callback to return the React Component to render for the screen:

```js
<Stack.Screen
  name="Profile"
  getComponent={() => require('./ProfileScreen').default}
/>
```

You can use this approach instead of the `component` prop if you want the `ProfileScreen` module to be lazily evaluated when needed. This is especially useful when using [ram bundles](https://reactnative.dev/docs/ram-bundles-inline-requires) to improve initial load.

### `children`

Render callback to return React Element to use for the screen:

```js
<Stack.Screen name="Profile">
  {(props) => <ProfileScreen {...props} />}
</Stack.Screen>
```

You can use this approach instead of the `component` prop if you need to pass additional props. Though we recommend using [React context](https://reactjs.org/docs/context.html) for passing data instead.

> Note: By default, React Navigation applies optimizations to screen components to prevent unnecessary renders. Using a render callback removes those optimizations. So if you use a render callback, you'll need to ensure that you use [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo) or [`React.PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) for your screen components to avoid performance issues.
