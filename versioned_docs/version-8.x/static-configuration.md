---
id: static-configuration
title: Static configuration
sidebar_label: Static configuration
---

The bulk of the static configuration is done using the `createXNavigator` functions, e.g. [`createNativeStackNavigator`](native-stack-navigator.md), [`createBottomTabNavigator`](bottom-tab-navigator.md), [`createDrawerNavigator`](drawer-navigator.md) etc. We'll refer to these functions as `createXNavigator` in the rest of this guide.

## `createXNavigator`

The `createXNavigator` functions take one argument, which is an object with the following properties:

- Same props as the navigator component, e.g. `id`, `initialRouteName`, `screenOptions` etc. See [Navigator](navigator.md) as well as the docs for each navigator for more details on the props they accept.
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

The `groups` object can contain key-value pairs where the key is the name of the group and the value is the group configuration.

The configuration object for a group accepts the [properties described in the Group page](group.md). In addition, the following properties are available when using static configuration:

- `if` - this can be used to conditionally render the group and works the same as the [`if` property in the screen configuration](#if).
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
      },
    },
    User: {
      if: useIsUser,
      screens: {
        // ...
      },
    },
  },
});
```

### Screen configuration

The configuration object for a screen accepts the [properties described in the Screen page](screen.md). In addition, the following properties are available when using static configuration:

#### `createXScreen`

Each navigator exports a helper function to create screen configurations with proper TypeScript types. These helpers enable type inference for the params in the configuration.

Example usage:

```js
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator({
  screens: {
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
      options: ({ route }) => {
        const userId = route.params.userId;

        return {
          title: `${userId}'s profile`,
        };
      },
    }),
  },
});
```

Each navigator exports its own helper function:

- `createNativeStackScreen` from `@react-navigation/native-stack`
- `createStackScreen` from `@react-navigation/stack`
- `createBottomTabScreen` from `@react-navigation/bottom-tabs`
- `createDrawerScreen` from `@react-navigation/drawer`
- `createMaterialTopTabScreen` from `@react-navigation/material-top-tabs`

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

### Passing dynamic props or wrapping the navigator

To pass dynamic props or wrap the navigator created using `createXNavigator`, you can pass a component to the `with` method:

```js
const MyDrawer = createDrawerNavigator({
  screenOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: 'tomato',
    },
  },
  screens: {
    Home: HomeScreen,
  },
}).with(({ Navigator }) => {
  const isLargeScreen = useIsLargeScreen();

  return (
    <Navigator
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'front',
      }}
    />
  );
});
```

The component passed to `with` receives the `Navigator` component to render as a prop. It accepts any props supported by the navigator.

To provide dynamic values for individual screen options, you can use the callback for [`screenOptions`](screen-options.md#screenoptions-prop-on-the-navigator) and use `route.name` to return different options for different screens:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
}).with(({ Navigator }) => {
  const user = useUser();

  return (
    <Navigator
      screenOptions={({ route }) => {
        if (route.name === 'Profile') {
          return {
            headerRight:
              user.id === route.params.userId
                ? () => <EditButton />
                : undefined,
          };
        }

        return {};
      }}
    />
  );
});
```

Similarly, the [`screenListeners`](navigation-events.md#screenlisteners-prop-on-the-navigator) prop can be used to provide dynamic listeners for the screens:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
}).with(({ Navigator }) => {
  return (
    <Navigator
      screenListeners={({ route }) => {
        if (route.name === 'Profile') {
          return {
            focus: () => {
              console.log(`Profile of user ${route.params.userId} focused`);
            },
          };
        }

        return {};
      }}
    />
  );
});
```

The `screenOptions` and `screenListeners` props passed to the component will be shallow merged with the ones defined in the static config if they are defined in both places.

You can also wrap the `Navigator` component in a provider or any additional UI components:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  },
}).with(({ Navigator }) => {
  return (
    <MyProvider>
      <Navigator />
    </MyProvider>
  );
});
```

Here, the `Navigator` component is wrapped inside a `MyProvider` component.

### Creating a component

The `getComponent()` method on the object returned by `createXNavigator` functions returns a React component to render for the navigator:

```js
const RootStackNavigator = RootStack.getComponent();
```

This is useful when [combining static and dynamic APIs](combine-static-with-dynamic.md), and not intended to be used directly if you're using static configuration for your whole app.

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

This is intended to be used when [combining static and dynamic APIs](combine-static-with-dynamic.md) for more details.

## `createStaticNavigation`

The `createStaticNavigation` function takes the static config returned by `createXNavigator` functions and returns a React component to render:

```js
const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}
```

This component is a wrapper around the `NavigationContainer` component and accepts the [same props and ref as the `NavigationContainer`](navigation-container.md) component. It is intended to be rendered once at the root of your app similar to how you'd use `NavigationContainer` component.

### Differences in the `linking` prop

Similar to `NavigationContainer`, the component returned by `createStaticNavigation` also accepts a [`linking`](navigation-container.md#linking) prop. However, there are some key differences:

1. It's not possible to pass a full `config` object to the `linking` prop. It can only accept [`path`](configuring-links.md#apps-under-subpaths) and an [`initialRouteName` for the root navigator](configuring-links.md#rendering-an-initial-route).
2. The linking config is collected from the [`linking`](#linking) properties specified in the screen configuration.
3. It's possible to pass `enabled: 'auto'` to automatically generate paths for all leaf screens:

   ```js
   const Navigation = createStaticNavigation(RootStack);

   const linking = {
     enabled: 'auto',
     prefixes: ['https://example.com', 'example://'],
   };

   function App() {
     return <Navigation linking={linking} />;
   }
   ```

   See [How does automatic path generation work](configuring-links.md#how-does-automatic-path-generation-work) for more details.

By default, linking is enabled in static configuration with automatic path generation. It needs to be explicitly disabled by passing `enabled: false` to the `linking` prop if you don't want linking support.
