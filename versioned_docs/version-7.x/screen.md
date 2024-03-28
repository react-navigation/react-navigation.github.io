---
id: screen
title: Screen
sidebar_label: Screen
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A screen represents routes in a navigator. A screen's configuration contains the component for the route, options, event listeners, etc.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

Screens can be defined under the `screens` key in the navigator configuration:

```js
const MyStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

A `Screen` component is returned from a `createXNavigator` function. After creating the navigator, it can be used as children of the `Navigator` component:

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

You need to provide at least a name and a component to render for each screen.

</TabItem>
</Tabs>

## Configuration

### Name

The name to use for the screen.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

The key in the `screens` object is used as the name:

```js
const Stack = createNativeStackNavigator({
  screens: {
    // highlight-next-line
    Profile: {
      screen: ProfileScreen,
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

It can be passed in the `name` prop to the `Screen` component:

```jsx
<Stack.Screen
  // highlight-next-line
  name="Profile"
  component={ProfileScreen}
/>
```

</TabItem>
</Tabs>

This name is used to navigate to the screen:

```js
navigation.navigate('Profile');
```

It is also used for the `name` property in the [`route`](route-object.md).

While it is supported, we recommend avoiding spaces or special characters in screen names and keeping them simple.

### Options

Options are used to configure how the screen gets presented in the navigator. It accepts either an object or a function returning an object:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      // highlight-start
      options: {
        title: 'Awesome app',
      },
      // highlight-end
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```jsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  // highlight-start
  options={{
    title: 'Awesome app',
  }}
  // highlight-end
/>
```

</TabItem>
</Tabs>

When you pass a function, it'll receive the [`route`](route-object.md), [`navigation`](navigation-object.md) and [`theme`](themes.md) as arguments:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      // highlight-start
      options: ({ route, navigation, theme }) => ({
        title: route.params.userId,
      }),
      // highlight-end
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```jsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  // highlight-start
  options={({ route, navigation }) => ({
    title: route.params.userId,
  })}
  // highlight-end
/>
```

</TabItem>
</Tabs>

See [Options for screens](screen-options.md) for more details and examples.

### Initial params

Initial params are used as the default params for the screen. If a screen is used as `initialRouteName`, it'll contain the params from `initialParams`. If you navigate to a new screen, the params passed are shallow merged with the initial params.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {
    Details: {
      screen: DetailsScreen,
      // highlight-next-line
      initialParams: { itemId: 42 },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```jsx
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  // highlight-next-line
  initialParams={{ itemId: 42 }}
/>
```

</TabItem>
</Tabs>

### ID

A screen can have an ID to identify it uniquely. This is useful when you want to ensure that the screen with the same ID doesn't appear multiple times in the stack.

This can be done by specifying the `getId` callback. It receives an object with the route params:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      // highlight-next-line
      getId: ({ params }) => params.userId,
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```jsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  // highlight-next-line
  getId={({ params }) => params.userId}
/>
```

</TabItem>
</Tabs>

By default, `navigate('ScreenName', params)` updates the current screen if the screen name matches, otherwise adds a new screen in a stack navigator. So if you're on `ScreenName` and navigate to `ScreenName` again, it won't add a new screen even if the params are different - it'll update the current screen with the new params instead:

```js
// Let's say you're on `Home` screen
// Then you navigate to `Profile` screen with `userId: 1`
navigation.navigate('Profile', { userId: 1 });

// Now the stack will have: `Home` -> `Profile` with `userId: 1`

// Then you navigate to `Profile` screen again with `userId: 2`
navigation.navigate('Profile', { userId: 2 });

// The stack will now have: `Home` -> `Profile` with `userId: 2`
```

If you specify `getId` and it doesn't return `undefined`, the screen is identified by both the screen name and the returned ID. That means that if you're on `ScreenName` and navigate to `ScreenName` again with different params - and return a different ID from the `getId` callback, it'll add a new screen to the stack:

```js
// Let's say you're on `Home` screen
// Then you navigate to `Profile` screen with `userId: 1`
navigation.navigate('Profile', { userId: 1 });

// Now the stack will have: `Home` -> `Profile` with `userId: 1`

// Then you navigate to `Profile` screen again with `userId: 2`
navigation.navigate('Profile', { userId: 2 });

// The stack will now have: `Home` -> `Profile` with `userId: 1` -> `Profile` with `userId: 2`
```

The `getId` callback can also be used to ensure that the screen with the same ID doesn't appear multiple times in the stack:

```js
// Let's say you have a stack with the screens: `Home` -> `Profile` with `userId: 1` -> `Settings`
// Then you navigate to `Profile` screen with `userId: 1` again
navigation.navigate('Profile', { userId: 1 });

// Now the stack will have: `Home` -> `Profile` with `userId: 1`
```

In the above examples, `params.userId` is used as an ID, subsequent navigation to the screen with the same `userId` will navigate to the existing screen instead of adding a new one to the stack. If the navigation was with a different `userId`, then it'll add a new screen.

If `getId` is specified in a tab or drawer navigator, the screen will remount if the ID changes.

### Component

Each screen must specify a component to render for that route.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

It can be passed under the `screen` property in the screen configuration:

```js
const Stack = createNativeStackNavigator({
  screens: {
    Profile: {
      // highlight-next-line
      screen: ProfileScreen,
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

#### `component`

It can be passed in the `component` prop to the `Screen` component:

```jsx
<Stack.Screen
  name="Profile"
  // highlight-next-line
  component={ProfileScreen}
/>
```

#### `getComponent`

It's also possible to pass a function in the `getComponent` prop to lazily evaluate the component:

```jsx
<Stack.Screen
  name="Profile"
  // highlight-next-line
  getComponent={() => require('./ProfileScreen').default}
/>
```

You can use this approach instead of the `component` prop if you want the `ProfileScreen` module to be lazily evaluated when needed. This is especially useful when using [ram bundles](https://reactnative.dev/docs/ram-bundles-inline-requires) to improve initial load.

#### `children`

Another way is to pass a render callback to return React Element to use for the screen:

```jsx
<Stack.Screen name="Profile">
  // highlight-next-line
  {(props) => <ProfileScreen {...props} />}
</Stack.Screen>
```

You can use this approach instead of the `component` prop if you need to pass additional props. Though we recommend using [React context](https://reactjs.org/docs/context.html) for passing data instead.

:::warning

By default, React Navigation applies optimizations to screen components to prevent unnecessary renders. Using a render callback removes those optimizations. So if you use a render callback, you'll need to ensure that you use [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo) or [`React.PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) for your screen components to avoid performance issues.

:::

</TabItem>
</Tabs>

### Layout

A layout is a wrapper around the screen. It makes it easier to provide things such as an error boundary and suspense fallback for a screen:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      // highlight-start
      layout: ({ children }) => (
        <ErrorBoundary>
          <React.Suspense
            fallback={
              <View style={styles.fallback}>
                <Text style={styles.text}>Loading…</Text>
              </View>
            }
          >
            {children}
          </React.Suspense>
        </ErrorBoundary>
      ),
      // highlight-end
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```jsx
<Stack.Screen
  name="MyScreen"
  component={MyScreenComponent}
  // highlight-start
  layout={({ children }) => (
    <ErrorBoundary>
      <React.Suspense
        fallback={
          <View style={styles.fallback}>
            <Text style={styles.text}>Loading…</Text>
          </View>
        }
      >
        {children}
      </React.Suspense>
    </ErrorBoundary>
  )}
  // highlight-end
/>
```

To specify a layout for all multiple screens, you can use `screenLayout` in a [group](group.md#screen-layout) or [navigator](navigator.md#screen-layout).

</TabItem>
</Tabs>

### Navigation key

A navigation key is an optional key for this screen. This doesn't need to be unique. If the key changes, existing screens with this name will be removed (if used in a stack navigator) or reset (if used in a tab or drawer navigator).

This can be useful when we have some screens that we want to be removed or reset when the condition changes:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      // highlight-next-line
      navigationKey: isSignedIn ? 'user' : 'guest',
    },
  },
});
```

For the static API, we recommend using the [`groups`](group.md#navigation-key) instead of the `navigationKey` for each screen as you can dynamically add or remove groups with the [`if`](static-configuration.md#if) property.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```jsx
<Stack.Screen
  // highlight-next-line
  navigationKey={isSignedIn ? 'user' : 'guest'}
  name="Profile"
  component={ProfileScreen}
/>
```

</TabItem>
</Tabs>

### Event listeners

Event listeners can be used to subscribe to various events emitted for the screen. See [`listeners` prop on `Screen`](navigation-events.md#listeners-prop-on-screen) for more details.
