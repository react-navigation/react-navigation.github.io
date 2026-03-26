---
id: static-vs-dynamic
title: Static API vs Dynamic API
sidebar_label: Static API vs Dynamic API
---

React Navigation provides two ways to configure your navigation:

- Static API - object-based configuration with automatic TypeScript types and deep linking
- Dynamic API - component-based dynamic configuration

If you're already familiar with the dynamic API, this guide explains how each concept maps to the static API - whether you're migrating an existing app or just learning the static API.

## Limitations

Since the static API is designed for static configuration, there are some limitations to be aware of:

- The navigation tree must be static - you cannot create the list of screens dynamically. However, you can [conditionally render screens using the `if` property](#conditional-screens).
- React hooks cannot be used in `options`, `listeners` etc. However, [`React.use()`](https://react.dev/reference/react/use) can be used to read context values in `options` callback (though it may produce ESLint warnings since ESLint cannot detect that it runs during render), and you can use the `theme` parameter instead of `useTheme()`.

## Basic usage

In the dynamic API, navigators are React components rendered inside `NavigationContainer`. In the static API, you pass the configuration object to `createXNavigator` and render the component returned by `createStaticNavigation`:

```js title="Dynamic API"
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
```

```js title="Static API"
import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}
```

The component returned by [`createStaticNavigation`](static-configuration.md#createstaticnavigation) accepts the [same props as `NavigationContainer`](navigation-container.md#props).

## Navigation object

Screens no longer receive the `navigation` object as a prop in the static API. It's necessary to use the [`useNavigation`](use-navigation.md) hook instead:

```js title="Dynamic API"
function HomeScreen({ navigation }) {
  return (
    <Button
      title="Go to profile"
      onPress={() => navigation.navigate('Profile')}
    />
  );
}
```

```js title="Static API"
function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <Button
      title="Go to profile"
      onPress={() => navigation.navigate('Profile')}
    />
  );
}
```

The `route` prop is still passed to the screen component as a prop in the static API. But it maybe preferable to use the [`useRoute`](use-route.md) hook when [defining types with `linking`](#typescript-types).

## Navigator options

In the dynamic API, [navigator configuration](navigator.md#configuration) is passed as props to the navigator component. In the static API, they become top-level keys in the config object.

The screens are defined in a `screens` property instead of as children. It contains a mapping of screen name to screen components, a nested navigator, or a screen configuration object.

```js title="Dynamic API"
<Stack.Navigator
  initialRouteName="Home"
  screenOptions={{
    headerTintColor: 'white',
    headerStyle: { backgroundColor: 'tomato' },
  }}
>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
</Stack.Navigator>
```

```js title="Static API"
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerTintColor: 'white',
    headerStyle: { backgroundColor: 'tomato' },
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

## Screen configuration

All props passed to `<Stack.Screen>` except `name` and `component` become properties in the screen configuration object. The component passed to `component` becomes the value of the `screen` property in the screen config:

```js title="Dynamic API"
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={({ route }) => ({
    title: route.params.userId,
  })}
  listeners={{
    focus: () => console.log('focused'),
  }}
  getId={({ params }) => params.userId}
/>
```

```js title="Static API"
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
      options: ({ route }) => ({
        title: route.params.userId,
      }),
      listeners: {
        focus: () => console.log('focused'),
      },
      getId: ({ params }) => params.userId,
    }),
  },
});
```

The [`createXScreen`](static-configuration.md#createxscreen) helper is for type inference in `options` and `listeners` callbacks. Each navigator exports its own screen helper: [`createNativeStackScreen`](native-stack-navigator.md), [`createStackScreen`](stack-navigator.md), [`createBottomTabScreen`](bottom-tab-navigator.md), [`createDrawerScreen`](drawer-navigator.md), [`createMaterialTopTabScreen`](material-top-tab-navigator.md).

## Conditional screens

In the dynamic API, screens can be conditionally defined by rendering `Screen` components conditionally. In the static API, the [`if`](static-configuration.md#if) property can be used to conditionally render screens based on a hook returning a boolean.

```js title="Dynamic API"
function RootStack() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <Stack.Screen name="SignIn" component={SignInScreen} />
      )}
    </Stack.Navigator>
  );
}
```

```js title="Static API"
const useIsGuest = () => !useIsLoggedIn();

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      if: useIsLoggedIn,
    },
    SignIn: {
      screen: SignInScreen,
      if: useIsGuest,
    },
  },
});
```

See [Authentication flow](auth-flow.md?config=static) for a complete example.

## Nested navigators

In the dynamic API, a nested navigator is a component passed as the `component` prop of a screen. In the static API, it's a configuration object and not a component. The configuration object can be used the same way as a screen component in the static API:

```js title="Dynamic API"
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeTabs} />
    </Stack.Navigator>
  );
}
```

```js title="Static API"
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

## Groups

In the dynamic API, groups are rendered as `<Stack.Group>` elements wrapping screens. In the static API, they are defined in a `groups` object in the navigator config:

```js title="Dynamic API"
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Group screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Group>
</Stack.Navigator>
```

```js title="Static API"
const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  },
  groups: {
    Modals: {
      screenOptions: { presentation: 'modal' },
      screens: {
        Settings: SettingsScreen,
        Profile: ProfileScreen,
      },
    },
  },
});
```

Groups in the static API support the same `if` hook as individual screens, so you can conditionally render an entire group of screens based on auth state or other conditions.

In addition, if you were using `navigationKey` to remove or remount screens on auth state changes (e.g. `navigationKey={isSignedIn ? 'user' : 'guest'}`), the group name serves the same purpose in the static API. So if a screen is placed in 2 groups with different conditions, it'll be removed or remounted similarly to how it would be with `navigationKey` in the dynamic API.

## Wrappers around navigators

In the dynamic API, it's possible to wrap the navigator component. For example, to add context providers or additional UI around the navigator.

In most cases, it can be done in following ways with the static API:

### `layout` on the navigator

If your wrapper doesn't access the navigator's state, you can use the [`layout`](navigator.md#layout) property on the navigator to wrap the navigator's content:

```js title="Dynamic API"
function RootStack() {
  return (
    <SomeProvider>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </SomeProvider>
  );
}
```

```js title="Static API"
const RootStack = createNativeStackNavigator({
  layout: ({ children }) => <SomeProvider>{children}</SomeProvider>,
  screens: {
    Home: HomeScreen,
  },
});
```

A navigator's layout is rendered as part of the navigator and has access to the navigator's state and options, whereas a wrapper component shown in the dynamic API example does not. So hooks such as [`useNavigationState`](use-navigation-state.md) used in `SomeProvider` will return the parent navigator's state in the dynamic example, but the current navigator's state in the static example.

Using `layout` is the recommended approach if your wrapper doesn't need the parent navigator's state. Otherwise, see the next approach.

### `with` method on the navigator

The [`with`](static-configuration.md#passing-dynamic-props-or-wrapping-the-navigator) method on the navigator returned by `createXNavigator` is the direct equivalent of wrapping the navigator component:

```js title="Dynamic API"
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <SomeProvider>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </SomeProvider>
  );
}
```

```js title="Static API"
const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
}).with(({ Navigator }) => (
  <SomeProvider>
    <Navigator />
  </SomeProvider>
));
```

The component passed to `with` receives the `Navigator` component to render as a prop and is equivalent to the navigator component in the dynamic API.

## Dynamic navigator props

In the dynamic API, you can use hooks inside the navigator component to pass dynamic props to the navigator. In the static API, the [`with`](static-configuration.md#passing-dynamic-props-or-wrapping-the-navigator) method on the navigator lets you do the same:

```js title="Dynamic API"
const Stack = createNativeStackNavigator();

function RootStack() {
  const isLargeScreen = useIsLargeScreen();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: isLargeScreen,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

```js title="Static API"
const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
}).with(({ Navigator }) => {
  const isLargeScreen = useIsLargeScreen();

  return (
    <Navigator
      screenOptions={{
        headerShown: isLargeScreen,
      }}
    />
  );
});
```

The component passed to `with` receives the `Navigator` component as a prop. You can pass any props supported by the navigator to the `Navigator` component.

To provide dynamic values for individual screen options, you can use the callback for [`screenOptions`](screen-options.md#screenoptions-prop-on-the-navigator) and use `route.name` to return different options for different screens:

```js title="Dynamic API"
const Stack = createNativeStackNavigator();

function RootStack() {
  const user = useUser();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({
          headerRight:
            user.id === route.params.userId ? () => <EditButton /> : undefined,
        })}
      />
    </Stack.Navigator>
  );
}
```

```js title="Static API"
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

Similarly, the [`screenListeners`](navigation-events.md#screenlisteners-prop-on-the-navigator) prop can be used to provide dynamic listeners:

```js title="Dynamic API"
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ route }) => ({
          focus: () => {
            console.log(`Profile of user ${route.params.userId} focused`);
          },
        })}
      />
    </Stack.Navigator>
  );
}
```

```js title="Static API"
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

The `screenOptions` and `screenListeners` props passed to the `Navigator` component will be shallow merged with the ones defined in the static config if they are defined in both places.

## Deep linking

For deep links and dynamic links, the dynamic API requires a linking configuration that maps navigation structure to path patterns. In the static API, deep linking is automatic by default and paths are generated based on the screen name. Custom path patterns can be defined on each screen's `linking` property:

```js title="Dynamic API"
const linking = {
  config: {
    screens: {
      Home: '',
      Profile: 'user/:userId',
      Chat: 'chat/:chatId',
      Settings: 'settings',
    },
  },
};

function App() {
  return (
    <NavigationContainer linking={linking}>
      <RootStack />
    </NavigationContainer>
  );
}
```

```js title="Static API"
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Profile: {
      screen: ProfileScreen,
      linking: 'user/:userId',
    },
    Chat: {
      screen: ChatScreen,
      linking: 'chat/:chatId',
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}
```

If automatic path generation is not desired, `enabled: true` can be used to use only explicitly defined paths, or `enabled: false` to disable linking entirely:

```js title="Static API with linking disabled"
function App() {
  return <Navigation linking={{ enabled: false }} />;
}
```

See [Configuring links](configuring-links.md) for more details.

## TypeScript types

In the dynamic API, param types are defined in a separate `RootStackParamList` type and each screen component is annotated with a navigator-specific prop type. In the static API, param types are inferred from the `linking` config:

```ts title="Dynamic API"
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function ProfileScreen({ route }: ProfileScreenProps) {
  return <Text>{route.params.userId}</Text>;
}
```

```ts title="Static API"
function ProfileScreen() {
  const route = useRoute('Profile');

  return <Text>{route.params.userId}</Text>;
}

const RootStack = createNativeStackNavigator({
  screens: {
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
      linking: {
        path: 'user/:userId',
      },
    }),
  },
});

type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
```

Here, the param type `{ userId: string }` is automatically inferred from the path pattern. The [`useRoute('ScreenName')`](use-route.md) hook with the screen name can be used to get the correctly typed route object inside the screen component.

The module augmentation with the root navigator type is used for type inference for [`useNavigation`](use-navigation.md), [`useRoute`](use-route.md), [`Link`](link.md) etc.

Alternately, params can be typed with `StaticScreenProps` that annotates the props of the screen component, useful if deep linking is not being used:

```ts
import type { StaticScreenProps } from '@react-navigation/native';

function ProfileScreen({ route }: StaticScreenProps<{ userId: string }>) {
  return <Text>{route.params.userId}</Text>;
}
```

See [Configuring TypeScript](typescript.md) for more details.

## Mixing Static and Dynamic APIs

Sometimes it may not be possible to use the static API for everything. So we have made sure that you can combine static and dynamic configuration in the same app. For example, keeping a dynamic root navigator while migrating nested navigators to static, or vice versa.

See [Mixing Static and Dynamic APIs](combine-static-with-dynamic.md) for details.
