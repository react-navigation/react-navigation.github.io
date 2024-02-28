---
id: static-configuration
title: Static configuration
sidebar_label: Static configuration
---

The bulk of the static configuration is done using the `createXNavigator` functions, e.g. [`createNativeStackNavigator`](native-stack-navigator.md), [`createBottomTabNavigator`](bottom-tab-navigator.md), [`createDrawerNavigator`](drawer-navigator.md) etc. We'll refer to these functions as `createXNavigator` in the rest of this guide.

## `createXNavigator`

The `createXNavigator` functions take one argument, which is an object with the following properties:

- Same props as the navigator component, e.g. `id`, `initialRouteName`, `screenOptions` etc. See the docs for each navigator for more details on the props they accept.
- `screens` - an object containing configuration for each screen in the navigator.
- `groups` - an optional object containing groups of screens (equivalent to [`Group`](group.md) in the dynamic API).

For example:

```js
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: 'tomato',
    },
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

### `screens`

The `screens` object can contain key value pairs where the key is the name of the screen and the value can be several things:

- A component to render:

  ```js
  const RootStack = createNativeStackNavigator({
    screens: {
      Home: HomeScreen,
    },
  });
  ```

- A navigator configured using `createXNavigator` for nested navigators:

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

- An object containing configuration for the screen. This configuration contains the various properties:

  ```js
  const RootStack = createNativeStackNavigator({
    screens: {
      Home: {
        screen: HomeScreen,
        linking: {
          path: 'home',
        },
      },
    },
  });
  ```

  See [Screen configuration](#screen-configuration) for more details.

### `groups`

The `groups` object can contain key value pairs where the key is the name of the group and the value is the group configuration. The group configuration can contain the following properties:

- `if` - this can be used to conditionally render the group and works the same as the [`if` property in the screen configuration](#if).
- `screenOptions` - default options for all screens under this group.
- `screens` - an object containing configuration for each screen in the group. The configuration is the same as the [`screens` object in the navigator configuration](#screens).

Example:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
  groups: {
    Guest: {
      if: useIsGuest,
      screenOptions: {
        headerShown: false,
      },
      screens: {
        // ...
      }
    },
    User: {
      if: useIsUser,
      screens: {
        // ...
      }
    }
  },
});
```

The keys of the `groups` object (e.g. `Guest`, `User`) are used as the [`navigationKey`](group.md#navigationkey) for the group - this means if a screen is defined in 2 groups and the groups use the [`if`](#if) property, the screen will remount if the condition changes resulting in one group being removed and other group being used. You can use any string as the key.

### Screen configuration

The configuration object for a screen can contain the following properties:

#### `screen`

The React component or navigator to render for the screen:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
    },
  },
});
```

The screen components defined with the static configuration receive the [`route`](route-object.md) prop. Unlike the dynamic API, they don't get the `navigation` object as prop and it must be accessed via the [`useNavigation`](use-navigation.md) hook.

#### `linking`

[Linking configuration](configuring-links.md) for the screen. It can be either a string for a path or an object with the linking configuration:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      linking: {
        path: 'u/:userId',
        parse: {
          userId: (id) => id.replace(/^@/, ''),
        },
        stringify: {
          userId: (id) => `@${id}`,
        },
      },
    },
    Chat: {
      screen: ChatScreen,
      linking: 'chat/:chatId',
    },
  },
});
```

The `linking` object supports the same configuration options described in [Configuring links](configuring-links.md) such as `parse`, `stringify` and `exact`.

To make deep links work on native apps, you also need to [configure your app](deep-linking.md) and pass `prefixes` to the navigation component returned by [`createStaticNavigation`](static-configuration.md#createstaticnavigation):

```js
const Navigation = createStaticNavigation(RootStack);

const linking = {
  prefixes: ['https://example.com', 'example://'],
};

function App() {
  return <Navigation linking={linking} />;
}
```

#### `if`

Callback to determine whether the screen should be rendered or not. It doesn't receive any arguments. This can be useful for conditional rendering of screens, e.g. - if you want to render a different screen for logged in users.

You can use a custom hook to use custom logic to determine the return value:

```js
const useIsLoggedIn = () => {
  const { isLoggedIn } = React.useContext(AuthContext);

  return isLoggedIn;
};

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      if: useIsLoggedIn,
    },
  },
});
```

The above example will only render the `HomeScreen` if the user is logged in.

For more details, see [Authentication flow](auth-flow.md?config=static).

#### `options`

Options to configure how the screen gets presented in the navigator. It accepts either an object or a function returning an object:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Awesome app',
      },
    },
  },
});
```

When you pass a function, it'll receive the [`route`](route-object.md) and [`navigation`](navigation-object.md):

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      options: ({ route, navigation }) => ({
        title: route.params.userId,
      }),
    },
  },
});
```

See [Options for screens](screen-options.md) for more details and examples.

#### `initialParams`

Initial params to use for the screen. If a screen is used as `initialRouteName`, it'll contain the params from `initialParams`. If you navigate to a new screen, the params passed are shallow merged with the initial params.

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Details: {
      screen: DetailsScreen,
      initialParams: { itemId: 5 },
    },
  },
});
```

#### `getId`

Callback to return an unique ID to use for the screen. It receives an object with the route params:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      getId: ({ params }) => params.userId,
    },
  },
});
```

By default, calling `navigate('ScreenName', params)` identifies the screen by its name, and navigates to the existing screen instead of adding a new one. If you specify `getId` and it doesn't return `undefined`, the screen is identified by both the screen name and the returned ID.

This is useful for preventing multiple instances of the same screen in the navigator, e.g. - when `params.userId` is used as an ID, subsequent navigation to the screen with the same `userId` will navigate to the existing screen instead of adding a new one to the stack. If the navigation was with a different `userId`, then it'll add a new screen.

#### `listeners`

Event listeners to subscribe to. It takes an object with the event names as keys and the listener callbacks as values:

```js
const BottomTab = createBottomTabNavigator({
  screens: {
    Chat: {
      screen: ChatScreen,
      listeners: {
        tabPress: (e) => {
          // Prevent default action
          e.preventDefault();
        },
      },
    },
  },
});
```

## `createStaticNavigation`

The `createStaticNavigation` function takes the static config returned by `createXNavigator` functions and returns a React component to render:

```js
const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}
```

This component is a wrapper around the `NavigationContainer` component and accepts the [same props and ref as the `NavigationContainer`](navigation-container.md) component. There's however one difference - the `linking` prop accepted by this component doesn't take a `config` property. Instead, the linking config is automatically inferred from the static config.

This is intended to be rendered once at the root of your app similar to how you'd use `NavigationContainer` component.

## `createComponentForStaticNavigation`

The `createComponentForStaticNavigation` function takes the static config returned by `createXNavigator` functions and returns a React component to render. The second argument is a name for the component that'd be used in React DevTools:

```js
const RootStackNavigator = createComponentForStaticNavigation(RootStack, 'RootNavigator');
```

The returned component doesn't take any props. All of the configuration is inferred from the static config. It's essentially the same as defining a component using the dynamic API.

This looks similar to `createStaticNavigation` however they are very different. When using static configuration, you'd never use this function directly. The only time you'd use this is if you're migrating away from static configuration and want to reuse existing code you wrote instead of rewriting it to the dynamic API. See [Combining static and dynamic APIs](combine-static-with-dynamic.md) for more details.

## `createPathConfigForStaticNavigation`

The `createPathConfigForStaticNavigation` function takes the static config returned by `createXNavigator` functions and returns a path config object that can be used within the linking config.

```js
const config = {
  screens: {
    Home: {
      screens: createPathConfigForStaticNavigation(HomeTabs),
    },
  },
};
```

Similar to `createComponentForStaticNavigation`, this is intended to be used when migrating away from static configuration. See [Combining static and dynamic APIs](combine-static-with-dynamic.md) for more details.
