---
id: typescript
title: Type checking with TypeScript
sidebar_label: Configuring TypeScript
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

React Navigation can be configured to type-check screens and their params, as well as various other APIs using TypeScript. This provides better intelliSense and type safety when working with React Navigation.

First, make sure you have the following configuration in your `tsconfig.json` under `compilerOptions`:

- `strict: true` or `strictNullChecks: true` - Necessary for intelliSense and type inference to work correctly.
- `moduleResolution: "bundler"` - Necessary to resolve the types correctly and match the behavior of [Metro](https://metrobundler.dev/) and other bundlers.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

## Setting up the types

There are 2 steps to configure TypeScript with the static API:

### Specify the root navigator's type

For the type-inference to work, React Navigation needs to know the type of the root navigator in your app. To do this, you can declare a module augmentation for `@react-navigation/core` and extend the `RootNavigator` interface with the type of your root navigator.

```ts
const HomeTabs = createBottomTabNavigator({
  screens: {
    Feed: FeedScreen,
    Profile: ProfileScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeTabs,
  },
});

// highlight-next-line
type RootStackType = typeof RootStack;

// highlight-start
declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
// highlight-end
```

This is needed to type-check hooks such as [`useNavigation`](use-navigation.md), [`useRoute`](use-route.md), [`useNavigationState`](use-navigation-state.md) etc.

### Specify param types for screens

After setting up the type for the root navigator, all we need to do is specify the type of params that our screens accept.

This can be done in 2 ways:

1. The type annotation for the component specified in `screen`:

   ```ts
   import type { StaticScreenProps } from '@react-navigation/native';

   // highlight-start
   type ProfileParams = {
     userId: string;
   };
   // highlight-end

   // highlight-next-line
   function ProfileScreen({ route }: StaticScreenProps<ProfileParams>) {
     // ...
   }
   ```

   In the above example, the type of `route.params` is `{ userId: string }` based on the type annotation in `StaticScreenProps<ProfileParams>`.

   If you aren't using the `route` object in the component, you can specify the `props` as `_` to avoid unused variable warnings:

   ```ts
   // highlight-next-line
   function ProfileScreen(_: StaticScreenProps<ProfileParams>) {
     // ...
   }
   ```

2. The path pattern specified in the linking config (e.g. for `linking: 'profile/:userId'`, the type of `route.params` is `{ userId: string }`). The type can be further customized by using a [`parse` function in the linking config](configuring-links.md#passing-params):

   ```ts
   linking: {
     path: 'profile/:userId',
     parse: {
       userId: (id) => parseInt(id, 10),
     },
   },
   ```

   The above example would make the type of `route.params` be `{ userId: number }` since the `parse` function converts the string from the URL to a number.

If both `screen` and `linking` specify params, the final type of `route.params` is the intersection of both types.

This is how the complete example would look like:

```ts
const MyStack = createNativeStackNavigator({
  screens: {
    // highlight-start
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
      linking: {
        path: 'profile/:userId',
        parse: {
          userId: (id) => parseInt(id, 10),
        },
      },
    }),
    // highlight-end
  },
});
```

If your app supports deep linking or runs on the Web, it is recommended to specify params that appear in the path pattern in the linking config. Any additional params (e.g. query params) can be specified in the component's props.

If you have specified the params in `linking`, it's recommended to not specify them again in the component's props, and use `useRoute('ScreenName')` instead to get the correctly typed `route` object.

The `createXScreen` helper functions enable type inference in screen configuration callbacks like `options`, `listeners`, etc. Each navigator exports its own version of the helper function:

- `createNativeStackScreen` from `@react-navigation/native-stack`
- `createStackScreen` from `@react-navigation/stack`
- `createBottomTabScreen` from `@react-navigation/bottom-tabs`
- `createDrawerScreen` from `@react-navigation/drawer`
- `createMaterialTopTabScreen` from `@react-navigation/material-top-tabs`

See [Static configuration](static-configuration.md#createxscreen) for more details.

## Using typed hooks

The [`useRoute`](use-route.md), [`useNavigation`](use-navigation.md), and [`useNavigationState`](use-navigation-state.md) hooks accept the name of the current screen or any parent screen where it's nested as an argument to infer the correct types.

Once the types are set up, these hooks are automatically typed based on the name of the screen passed to them.

With `useRoute`:

```ts
function ProfileScreen() {
  const route = useRoute('Profile');

  // The params are correctly typed here
  const { userId } = route.params;

  // ...
}
```

With `useNavigation`:

```ts
function ProfileScreen() {
  const navigation = useNavigation('Profile');

  // Helpers like `push` are correctly typed here
  navigation.push('Feed');

  // ...
}
```

With `useNavigationState`:

```ts
function ProfileScreen() {
  const focusedRouteName = useNavigationState(
    'Profile',
    // The state is correctly typed here
    (state) => state.routes[state.index].name
  );

  // The `focusedRouteName` type is one of the route names
  // defined in the navigator where `Profile` is defined
  console.log(focusedRouteName);

  // ...
}
```

It's also possible to use these hooks without specifying the screen name - which can be useful in re-usable components that can be used across multiple screens. In this case, different things happen based on the hook.

The `useRoute` hook returns a union of all routes in the app, and can be narrowed down using type guards:

```ts
function Header() {
  const route = useRoute();

  // The route is an union of all routes in the app
  console.log(route.name);

  // It's possible to narrow down the type using type guards
  if (route.name === 'Profile') {
    // Here route.params is correctly typed
    const { userId } = route.params;
  }

  // ...
}
```

The `useNavigation` hook returns a generic navigation object that refers to the root navigator. This means that any navigation actions can be called as if they are used in a screen of the root navigator:

```ts
function Header() {
  const navigation = useNavigation();

  // A generic navigation object that refers to the root navigator
  navigation.navigate('Profile', { userId: '123' });

  // ...
}
```

The `useNavigationState` hook returns a generic navigation state without any navigator-specific types:

```ts
function Header() {
  const focusedRouteName = useNavigationState((state) => {
    // The state is a generic navigation state
    return state.routes[state.index].name;
  });

  // The `focusedRouteName` type is `string`
  console.log(focusedRouteName);

  // ...
}
```

## Nesting navigator using dynamic API

Consider the following example:

```js
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeTabs,
  },
});
```

Here, the `HomeTabs` component is defined using the dynamic API. This means that React Navigation won't know about the screens defined in the nested navigator and the types for those screens. To fix this, we'd need to specify the types for the nested navigator explicitly.

This can be done by annotating the type of the [`route`](route-object.md) prop that the screen component receives:

```ts
type HomeTabsParamList = {
  Feed: undefined;
  Profile: undefined;
};

// highlight-start
type HomeTabsProps = StaticScreenProps<
  NavigatorScreenParams<HomeTabsParamList>
>;
// highlight-end

// highlight-next-line
function HomeTabs(_: HomeTabsProps) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

Here the `HomeTabsParamList` type defines the mapping of route names in the tab navigator to the types of their params. We then use the `NavigatorScreenParams` utility to say that these are the screens in a nested navigator in the `HomeTabs` component.

Now, React Navigation knows about the screens in the nested navigator and their params, and the types can be inferred with hooks such as `useRoute`.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

When using the dynamic API, it is necessary to specify the types for each screen as well as the nesting structure as it cannot be inferred from the code.

## Typechecking the navigator

To typecheck our route name and params, the first thing we need to do is to create an object type with mappings for route names to the params of the route. For example, say we have a route called `Profile` in our root navigator which should have a param `userId`:

```tsx
type RootStackParamList = {
  Profile: { userId: string };
};
```

Similarly, we need to do the same for each route:

```tsx
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
};
```

Specifying `undefined` means that the route doesn't have params. A union type with `undefined` (e.g. `SomeType | undefined`) means that params are optional.

After we have defined the mapping, we need to tell our navigator to use it. To do that, we can pass it as a generic to the [`createXNavigator`](static-configuration.md) functions:

```tsx
import { createStackNavigator } from '@react-navigation/stack';

const RootStack = createStackNavigator<RootStackParamList>();
```

And then we can use it:

```tsx
<RootStack.Navigator initialRouteName="Home">
  <RootStack.Screen name="Home" component={Home} />
  <RootStack.Screen
    name="Profile"
    component={Profile}
    initialParams={{ userId: user.id }}
  />
  <RootStack.Screen name="Feed" component={Feed} />
</RootStack.Navigator>
```

This will provide type checking and intelliSense for props of the [`Navigator`](navigator.md) and [`Screen`](screen.md) components.

:::note

The type containing the mapping must be a type alias (e.g. `type RootStackParamList = { ... }`). It cannot be an interface (e.g. `interface RootStackParamList { ... }`). It also shouldn't extend `ParamListBase` (e.g. `interface RootStackParamList extends ParamListBase { ... }`). Doing so will result in incorrect type checking which allows you to pass incorrect route names.

:::

## Type checking screens

To typecheck our screens, we need to annotate the `navigation` and the `route` props received by a screen. The navigator packages in React Navigation export generic types to define types for both the `navigation` and `route` props from the corresponding navigator.

For example, you can use `NativeStackScreenProps` for the Native Stack Navigator.

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
```

The type takes 2 generics:

- The param list object we defined earlier
- The name of the route the screen belongs to

This allows us to type check route names and params which you're navigating using [`navigate`](navigation-object.md#navigate), [`push`](stack-actions.md#push) etc. The name of the current route is necessary to type check the params in `route.params` and when you call [`setParams`](navigation-actions#setparams) or [`replaceParams`](navigation-actions#replaceparams).

Similarly, you can import `StackScreenProps` from [`@react-navigation/stack`](stack-navigator.md), `DrawerScreenProps` from [`@react-navigation/drawer`](drawer-navigator.md), `BottomTabScreenProps` from [`@react-navigation/bottom-tabs`](bottom-tab-navigator.md) and so on.

Then you can use the `Props` type you defined above to annotate your component.

For function components:

```tsx
function ProfileScreen({ route, navigation }: Props) {
  // ...
}
```

For class components:

```ts
class ProfileScreen extends React.Component<Props> {
  render() {
    // ...
  }
}
```

You can get the types for `navigation` and `route` from the `Props` type as follows:

```ts
type ProfileScreenNavigationProp = Props['navigation'];

type ProfileScreenRouteProp = Props['route'];
```

Alternatively, you can also annotate the `navigation` and `route` objects separately.

To get the type for the `navigation` prop, we need to import the corresponding type from the navigator. For example, `NativeStackNavigationProp` for `@react-navigation/native-stack`:

```tsx
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;
```

Similarly, you can import `StackNavigationProp` from [`@react-navigation/stack`](stack-navigator.md), `DrawerNavigationProp` from [`@react-navigation/drawer`](drawer-navigator.md), `BottomTabNavigationProp` from [`@react-navigation/bottom-tabs`](bottom-tab-navigator.md) etc.

To get the type for the `route` object, we need to use the `RouteProp` type from `@react-navigation/native`:

```tsx
import type { RouteProp } from '@react-navigation/native';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
```

We recommend creating a separate file: `types.tsx` - where you keep the types and import from there in your component files instead of repeating them in each file.

## Nesting navigators

### Type checking screens and params in nested navigator

You can [navigate to a screen in a nested navigator](nesting-navigators.md#navigating-to-a-screen-in-a-nested-navigator) by passing `screen` and `params` properties for the nested screen:

```ts
navigation.navigate('Home', {
  screen: 'Feed',
  params: { sort: 'latest' },
});
```

To be able to type check this, we need to extract the params from the screen containing the nested navigator. This can be done using the `NavigatorScreenParams` utility:

```ts
import { NavigatorScreenParams } from '@react-navigation/native';

type TabParamList = {
  Home: NavigatorScreenParams<StackParamList>;
  Profile: { userId: string };
};
```

### Combining navigation props

When you nest navigators, the navigation prop of the screen is a combination of multiple navigation props. For example, if we have a tab inside a stack, the `navigation` prop will have both [`jumpTo`](tab-actions.md#jumpto) (from the tab navigator) and [`push`](stack-actions.md#push) (from the stack navigator). To make it easier to combine types from multiple navigators, you can use the `CompositeScreenProps` type.

For example, if we have a `Profile` in a navigator, nested inside `Account` screen of a stack navigator, we can combine the types as follows:

```ts
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StackScreenProps } from '@react-navigation/stack';

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  StackScreenProps<StackParamList, 'Account'>
>;
```

The `CompositeScreenProps` type takes 2 parameters:

- The first parameter is the type for the navigator that owns this screen, in our case the tab navigator which contains the `Profile` screen
- The second parameter is the type of props for a parent navigator, in our case the stack navigator which contains the `Account` screen

For multiple parent navigators, this second parameter can nest another `CompositeScreenProps`:

```ts
type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  CompositeScreenProps<
    StackScreenProps<StackParamList, 'Account'>,
    DrawerScreenProps<DrawerParamList, 'Home'>
  >
>;
```

If annotating the `navigation` prop separately, you can use `CompositeNavigationProp` instead. The usage is similar to `CompositeScreenProps`:

```ts
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profile'>,
  StackNavigationProp<StackParamList, 'Account'>
>;
```

## Annotating hooks

The [`useRoute`](use-route.md), [`useNavigation`](use-navigation.md), and [`useNavigationState`](use-navigation-state.md) hooks accept the name of the current screen or any parent screen where it's nested as an argument for limited type inference in dynamic API after [specifying root navigator type](#specifying-root-navigator-type).

With `useRoute`:

```ts
function ProfileScreen() {
  const route = useRoute('Profile');

  // The params are correctly typed here
  const { userId } = route.params;

  // ...
}
```

With `useNavigation`:

```ts
function ProfileScreen() {
  const navigation = useNavigation('Profile');

  // Helpers like `getState` are correctly typed here
  const state = navigation.getState();

  // ...
}
```

This will automatically infer the type for methods such as `getState`, `setParams` etc. However, it doesn't include navigator-specific types, and they cannot be automatically inferred when using the dynamic configuration.

So if we want to use a navigator-specific method (e.g. `push` from stack navigator), we need to annotate the type of the returned `navigation` object.

This can be done using [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) with the `as` keyword:

```ts
function ProfileScreen() {
  const navigation = useNavigation('Profile') as ProfileScreenNavigationProp;

  // ...
}
```

:::danger

Annotating `useNavigation` isn't type-safe because we cannot verify that the provided type matches the actual navigators.

:::

With `useNavigationState`:

```ts
function ProfileScreen() {
  const focusedRouteName = useNavigationState(
    'Profile',
    // The state is correctly typed here
    (state) => state.routes[state.index].name
  );

  // The `focusedRouteName` type is one of the route names
  // defined in the navigator where `Profile` is defined
  console.log(focusedRouteName);

  // ...
}
```

## Annotating `options` and `screenOptions`

When you pass the `options` to a `Screen` or `screenOptions` prop to a `Navigator` component, they are already type-checked and you don't need to do anything special. However, sometimes you might want to extract the options to a separate object, and you might want to annotate it.

To annotate the options, we need to import the corresponding type from the navigator. For example, `StackNavigationOptions` for `@react-navigation/stack`:

```ts
import type { StackNavigationOptions } from '@react-navigation/stack';

const options: StackNavigationOptions = {
  headerShown: false,
};
```

Similarly, you can import `DrawerNavigationOptions` from `@react-navigation/drawer`, `BottomTabNavigationOptions` from `@react-navigation/bottom-tabs` etc.

When using the function form of `options` and `screenOptions`, you can annotate the arguments with a type exported from the navigator, e.g. `StackOptionsArgs` for `@react-navigation/stack`, `DrawerOptionsArgs` for `@react-navigation/drawer`, `BottomTabOptionsArgs` for `@react-navigation/bottom-tabs` etc.:

```ts
import type {
  StackNavigationOptions,
  StackOptionsArgs,
} from '@react-navigation/stack';

const options = ({ route }: StackOptionsArgs): StackNavigationOptions => {
  return {
    headerTitle: route.name,
  };
};
```

If you want to annotate the type of params in the `route` object, you can use pass the param list and route name as generics to the `StackOptionsArgs` type:

```ts
import type {
  StackNavigationOptions,
  StackOptionsArgs,
} from '@react-navigation/stack';

const options = ({
  route,
}: StackOptionsArgs<RootStackParamList, 'Profile'>): StackNavigationOptions => {
  const { userId } = route.params;

  return {
    headerTitle: `Profile of ${userId}`,
  };
};
```

## Annotating `ref` on `NavigationContainer`

If you use the `createNavigationContainerRef()` method to create the ref, you can annotate it to type-check navigation actions:

```ts
import { createNavigationContainerRef } from '@react-navigation/native';

// ...

const navigationRef = createNavigationContainerRef<RootStackParamList>();
```

Similarly, for `useNavigationContainerRef()`:

```ts
import { useNavigationContainerRef } from '@react-navigation/native';

// ...

const navigationRef = useNavigationContainerRef<RootStackParamList>();
```

If you're using a regular `ref` object, you can pass a generic to the `NavigationContainerRef` type..

Example when using `React.useRef` hook:

```ts
import type { NavigationContainerRef } from '@react-navigation/native';

// ...

const navigationRef =
  React.useRef<NavigationContainerRef<RootStackParamList>>(null);
```

Example when using `React.createRef`:

```ts
import type { NavigationContainerRef } from '@react-navigation/native';

// ...

const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();
```

## Specifying root navigator type

You can specify the type for your root navigator which will enable automatic type inference (with limitations) for [`useRoute`](use-route.md), [`useNavigation`](use-navigation.md), [`useNavigationState`](use-navigation-state.md), [`Link`](link.md), [`ref`](navigation-container.md#ref), [`linking`](navigation-container.md#linking) etc.

To do this, you can use module augmentation for `@react-navigation/core` and extend the `RootNavigator` interface with the type of your root navigator.

```ts
const RootStack = createNativeStackNavigator<RootStackParamList>();

function App() {
  // ...
}

// highlight-next-line
type RootStackType = typeof RootStack;

// highlight-start
declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
// highlight-end
```

Here `RootStack` refers to the navigator used at the root of your app.

## Organizing types

When writing types for React Navigation, there are a couple of things we recommend to keep things organized.

1. It's good to create a separate file (e.g. `navigation/types.tsx`) that contains the types related to React Navigation.
2. Instead of using `CompositeNavigationProp` directly in your components, it's better to create a helper type that you can reuse.
3. Specifying a global type for your root navigator would avoid manual annotations in many places.

Considering these recommendations, the file containing the types may look something like this:

```ts
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  PostDetails: { id: string };
  NotFound: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type HomeTabParamList = {
  Popular: undefined;
  Latest: undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList, 'Home'>
  >;
```

Then, you'd set up the global type for your root navigator in the same file where your root navigator is defined:

```ts
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from './navigation/types';

const RootStack = createStackNavigator<RootStackParamList>();

function App() {
  // ...
}

// Specify the global type for the root navigator
type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
```

Now, when annotating your components, you can write:

```ts
import type { HomeTabScreenProps } from './navigation/types';

function PopularScreen({ navigation, route }: HomeTabScreenProps<'Popular'>) {
  // ...
}
```

</TabItem>
</Tabs>
