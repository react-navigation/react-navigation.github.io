---
id: navigator
title: Navigator
sidebar_label: Navigator
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A navigator is responsible for managing and rendering a set of screens. It can be created using the `createXNavigator` functions, e.g. [`createStackNavigator`](stack-navigator.md), [`createNativeStackNavigator`](native-stack-navigator.md), [`createBottomTabNavigator`](bottom-tab-navigator.md), [`createMaterialTopTabNavigator`](material-top-tab-navigator.md), [`createDrawerNavigator`](drawer-navigator.md) etc.:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

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

</TabItem>
</Tabs>

In addition to the built-in navigators, it's also possible to build your custom navigators or use third-party navigators. See [custom navigators](custom-navigators.md) for more details.

## Configuration

Different navigators accept different configuration options. You can find the list of options for each navigator in their respective documentation.

There is a set of common configurations that are shared across all navigators:

### ID

Optional unique ID for the navigator. This can be used with [`navigation.getParent`](navigation-object.md#getparent) to refer to this navigator in a child navigator.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  // highlight-next-line
  id: 'RootStack',
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      // highlight-next-line
      id="RootStack"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

### Initial route name

The name of the route to render on the first load of the navigator.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  // highlight-next-line
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      // highlight-next-line
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

### Layout

A layout is a wrapper around the navigator. It can be useful for augmenting the navigators with additional UI with a wrapper.

The difference from adding a wrapper around the navigator manually is that the code in a layout callback has access to the navigator's state, options etc.

It takes a function that returns a React element:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  // highlight-start
  layout: ({ children, state, descriptors, navigation }) => (
    <View style={styles.container}>
      <Breadcrumbs
        state={state}
        descriptors={descriptors}
        navigation={navigation}
      />
      {children}
    </View>
  ),
  // highlight-end
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      // highlight-start
      layout={({ children, state, descriptors, navigation }) => (
        <View style={styles.container}>
          <Breadcrumbs
            state={state}
            descriptors={descriptors}
            navigation={navigation}
          />
          {children}
        </View>
      )}
      // highlight-end
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

### Screen options

Default options to use for all the screens in the navigator. It accepts either an object or a function returning an object:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  // highlight-start
  screenOptions: {
    headerShown: false,
  },
  // highlight-end
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      // highlight-start
      screenOptions={{ headerShown: false }}
      // highlight-end
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

See [Options for screens](screen-options.md) for more details and examples.

### Screen listeners

Event listeners can be used to subscribe to various events emitted for the screen. See [`screenListeners` prop on the navigator](navigation-events.md#screenlisteners-prop-on-the-navigator) for more details.

### Screen layout

A screen layout is a wrapper around each screen in the navigator. It makes it easier to provide things such as an error boundary and suspense fallback for all screens in the navigator, or wrap each screen with additional UI.

It takes a function that returns a React element:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  // highlight-start
  screenLayout: ({ children }) => (
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
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      // highlight-start
      screenLayout={({ children }) => (
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
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

### Router

:::warning

This API is experimental and may change in a minor release.

:::

Routers can be customized with the `UNSTABLE_router` prop on navigator to override how navigation actions are handled.

It takes a function that receives the original router and returns an object with overrides:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  // highlight-start
  UNSTABLE_router: (original) => ({
    getStateForAction(state, action) {
      if (action.type === 'SOME_ACTION') {
        // Custom logic
      }

      // Fallback to original behavior
      return original.getStateForAction(state, action);
    },
  }),
  // highlight-end
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      // highlight-start
      UNSTABLE_router={(original) => ({
        getStateForAction(state, action) {
          if (action.type === 'SOME_ACTION') {
            // Custom logic
          }

          // Fallback to original behavior
          return original.getStateForAction(state, action);
        },
      })}
      // highlight-end
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

The function passed to `UNSTABLE_router` **must be a pure function and cannot reference outside dynamic variables**.

The overrides object is shallow merged with the original router. So you don't need to specify all properties of the router, only the ones you want to override.

See [custom routers](custom-routers.md) for more details on routers.

### Route names change behavior

:::warning

This API is experimental and may change in a minor release.

:::

When the list of available routes in a navigator changes dynamically, e.g. based on conditional rendering, looping over data from an API etc., the navigator needs to update the [navigation state](navigation-state.md) according to the new list of routes.

By default, it works as follows:

- Any routes not present in the new available list of routes are removed from the navigation state
- If the currently focused route is still present in the new available list of routes, it remains focused.
- If the currently focused route has been removed, but the navigation state has other routes that are present in the new available list, the first route in from the list of rendered routes becomes focused.
- If none of the routes in the navigation state are present in the new available list of routes, one of the following things can happen based on the `UNSTABLE_routeNamesChangeBehavior` prop:
  - `'firstMatch'` - The first route defined in the new list of routes becomes focused. This is the default behavior based on [`getStateForRouteNamesChange`](custom-routers.md) in the router.
  - `'lastUnhandled'` - The last state that was unhandled due to conditional rendering is restored.

Example cases where state might have been unhandled:

- Opened a deep link to a screen, but a login screen was shown.
- Navigated to a screen containing a navigator, but a different screen was shown.
- Reset the navigator to a state with different routes not matching the available list of routes.

In these cases, specifying `'lastUnhandled'` will reuse the unhandled state if present. If there's no unhandled state, it will fallback to `'firstMatch'` behavior.

Caveats:

- Direct navigation is only handled for `NAVIGATE` actions.
- Unhandled state is restored only if the current state becomes invalid, i.e. it doesn't contain any currently defined screens.

Example usage:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createNativeStackNavigator({
  // highlight-next-line
  UNSTABLE_routeNamesChangeBehavior: 'lastUnhandled',
  screens: {
    Home: {
      if: useIsSignedIn,
      screen: HomeScreen,
    },
    SignIn: {
      if: useIsSignedOut,
      screen: SignInScreen,
      options: {
        title: 'Sign in',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Navigator
  // highlight-next-line
  UNSTABLE_routeNamesChangeBehavior="lastUnhandled"
>
  {isSignedIn ? (
    <Stack.Screen name="Home" component={HomeScreen} />
  ) : (
    <Stack.Screen name="SignIn" component={SignInScreen} />
  )}
</Stack.Navigator>
```

</TabItem>
</Tabs>

The most common use case for this is to [show the correct screen based on authentication based on deep link](auth-flow.md#handling-deep-links-after-auth).
