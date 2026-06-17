---
id: typescript
title: Type checking with TypeScript
sidebar_label: Configuring TypeScript
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

React Navigation can be configured to type-check screens and their params, as well as various other APIs using TypeScript. This provides better IntelliSense and type safety when working with React Navigation.

First, make sure you have the following configuration in your `tsconfig.json` under `compilerOptions`:

- `strict: true` or `strictNullChecks: true` - Necessary for IntelliSense and type inference to work correctly.
- `moduleResolution: "bundler"` - Necessary to resolve the types correctly and match the behavior of [Metro](https://metrobundler.dev/) and other bundlers.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

## Setting up the types

There are 2 steps to configure TypeScript with the static API:

### Specifying the root navigator's type

For the type-inference to work, React Navigation needs to know the type of the root navigator in your app. To do this, you can declare a module augmentation for `@react-navigation/native` and extend the `RootNavigator` interface with the type of your root navigator.

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
declare module '@react-navigation/native' {
  interface RootNavigator extends RootStackType {}
}
// highlight-end
```

This is needed to type-check hooks such as [`useNavigation`](use-navigation.md), [`useRoute`](use-route.md), [`useNavigationState`](use-navigation-state.md) etc.

### Specifying param types for screens

After setting up the type for the root navigator, all we need to do is specify the type of params that our screens accept.

This can be done in 2 ways:

1. The path pattern specified in the linking config (e.g. for `path: 'profile/:userId'`, the type of `route.params` is `{ userId: string }`). The type can be further customized by:
   - Using a `parse` function:

     ```ts
     linking: {
       // highlight-start
       path: 'profile/:userId',
       parse: {
         userId: (id) => parseInt(id, 10),
       },
       // highlight-end
     },
     ```

   - Using a Standard Schema:

     ```ts
     import { z } from 'zod';

     linking: {
       // highlight-start
       path: 'profile/:userId',
       parse: {
         userId: z.coerce.number(),
       },
       // highlight-end
     },
     ```

   The above examples would also make the type of `route.params` be `{ userId: number }`. See [passing params](configuring-links.md#passing-params) for the API and [Parse function vs Standard Schema](#parse-function-vs-standard-schema) for the differences in type inference.

   This is the recommended way to specify params for screens that are accessible via deep linking or if your app runs on the Web, as it ensures that the types of params are consistent with the URL.

2. The type annotation for the component specified in `screen`:

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

Or with a Standard Schema:

```ts
import { z } from 'zod';

const MyStack = createNativeStackNavigator({
  screens: {
    // highlight-start
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
      linking: {
        path: 'profile/:userId',
        parse: {
          userId: z.coerce.number(),
        },
      },
    }),
    // highlight-end
  },
});
```

If you have specified the params in `linking`, it's recommended to not specify them again in the component's props, and use [`useRoute('ScreenName')`](#using-typed-hooks) instead to get the correctly typed `route` object.

The `createXScreen` helper functions enable type inference in screen configuration callbacks like `options`, `listeners`, etc. Each navigator exports its own version of the helper function:

- `createNativeStackScreen` from `@react-navigation/native-stack`
- `createStackScreen` from `@react-navigation/stack`
- `createBottomTabScreen` from `@react-navigation/bottom-tabs`
- `createDrawerScreen` from `@react-navigation/drawer`
- `createMaterialTopTabScreen` from `@react-navigation/material-top-tabs`

See [Static configuration](static-configuration.md#createxscreen) for more details.

## Parse function vs Standard Schema

Both parse functions and Standard Schemas infer param types from the `parse` config, but they differ in how they handle type inference for query params.

### Path pattern params

For params in path pattern, both approaches work the same way:

- The return type of the function or the output type of the schema is used as the param type.
- If the pattern includes the `?` suffix, it's inferred as optional.

e.g. both of the following configs would make the type of `route.params` be `{ id: number }`:

Parse function:

```ts
parse: {
  id: Number,
}
```

Standard Schema:

```ts
parse: {
  id: z.coerce.number(),
}
```

### Query params

Query params are inferred differently based on whether you use a parse function or a Standard Schema.

- With a parse function, query params are always inferred as optional since they may not be present in the URL:

  ```ts
  parse: {
    sort: (value: string) => (value === 'new' ? 'new' : 'top'),
  }
  ```

  Here `route.params` are inferred as `{ sort?: 'new' | 'top' }`.

- With a Standard Schema, query params are inferred as required or optional based on the schema's output type:

  ```ts
  parse: {
    sort: z.string(),
  }
  ```

  Here `route.params` are inferred as `{ sort: string }`.

  ```ts
  parse: {
    sort: z.string().optional(),
  }
  ```

  Here `route.params` are inferred as `{ sort?: string | undefined }`.

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

  // Helpers like `jumpTo` are correctly typed here
  navigation.jumpTo('Feed');

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

  // The route is a union of all routes in the app
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

## Nesting a dynamic navigator

If you render a dynamic navigator inside a static navigator, see [Mixing Static & Dynamic APIs](combine-static-with-dynamic.md#static-root-navigator-dynamic-nested-navigator) for the additional typing and linking configuration needed for the nested navigator.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

## Setting up the types {#setting-up-the-types-dynamic}

There are 2 steps to configure TypeScript with the dynamic API:

### Specifying the root navigator's type {#specifying-the-root-navigators-type-dynamic}

You can specify the type for your root navigator which will enable automatic type inference for [`useRoute`](use-route.md), [`useNavigation`](use-navigation.md), [`useNavigationState`](use-navigation-state.md), [`Link`](link.md), [`ref`](navigation-container.md#ref), [`linking`](navigation-container.md#linking) etc.

To do this, use module augmentation for `@react-navigation/native` and extend the `RootNavigator` interface with the type of your root navigator.

```ts
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// highlight-next-line
type RootStackType = typeof RootStack;

// highlight-start
declare module '@react-navigation/native' {
  interface RootNavigator extends RootStackType {}
}
// highlight-end
```

Here `RootStack` refers to the navigator used at the root of your app. The `RootStackParamList` type is covered in the next section.

### Specifying param types for screens {#specifying-param-types-for-screens-dynamic}

To type check route names and params, create an object type with mappings from route names to the params of each route. For example, say we have a route called `Profile` in our root navigator which should have a param `userId`:

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

After defining the mapping, tell the navigator to use it by passing it as a generic to the `createXNavigator` functions:

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

This will provide type checking and IntelliSense for props of the [`Navigator`](navigator.md) and [`Screen`](screen.md) components.

When a screen renders a nested navigator, use `NavigatorScreenParams` for that route. Define the child navigator first:

```ts title="navigation/HomeStack.tsx"
import { createStackNavigator } from '@react-navigation/stack';

type HomeStackParamList = {
  Feed: { sort: 'latest' | 'top' } | undefined;
};

// highlight-next-line
export const HomeStack = createStackNavigator<HomeStackParamList>();
```

Then pass the type of the child navigator to `NavigatorScreenParams` in the parent navigator:

```ts title="navigation/RootTabs.tsx"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { HomeStack } from './HomeStack';

type RootTabsParamList = {
  // highlight-next-line
  Home: NavigatorScreenParams<typeof HomeStack>;
  Profile: { userId: string };
};

const RootTabs = createBottomTabNavigator<RootTabsParamList>();
```

:::note

The type containing the mapping must be a type alias (e.g. `type RootStackParamList = { ... }`). It cannot be an interface (e.g. `interface RootStackParamList { ... }`) or extend `ParamListBase` (e.g. `interface RootStackParamList extends ParamListBase { ... }`).

:::

## Using typed hooks {#using-typed-hooks-dynamic}

The [`useRoute`](use-route.md), [`useNavigation`](use-navigation.md), and [`useNavigationState`](use-navigation-state.md) hooks accept the name of the current screen or any parent screen where it's nested as an argument to infer the correct types.

Once the root navigator and nested navigator routes are set up, these hooks are automatically typed based on the name of the screen passed to them.

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
  navigation.push('Feed', { sort: 'latest' });

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

  // The route is a union of all routes in the app
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

If you want to annotate the type of params in the `route` object, you can pass the param list and route name as generics to the `StackOptionsArgs` type:

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

## Advanced

The sections below cover manual annotations and escape hatches that are usually not needed when you use the typed hooks with the root navigator and nested navigators set up as described above. They may still be useful for legacy code or some [Mixing Static & Dynamic APIs](combine-static-with-dynamic.md) cases.

### Overriding the inferred navigation type

If the types are not set up to infer the screen's navigator type (e.g. you use `NavigatorScreenParams<SomeParamList>` instead of `NavigatorScreenParams<typeof SomeNavigator>`), the hooks will still infer the type for methods such as `getState`, `setParams` etc, but navigator-specific methods won't be inferred.

In that case, you can override the type of the returned `navigation` object. This can be done using [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) with the `as` keyword:

```ts
function ProfileScreen() {
  const navigation = useNavigation('Profile') as ProfileScreenNavigationProp;

  // ...
}
```

:::danger

Annotating `useNavigation` with `as` isn't type-safe because we cannot verify that the provided type matches the actual navigators.

:::

### Annotating screen props

If you need to annotate screen props manually, the navigator packages in React Navigation export generic types to define types for both the `navigation` and `route` props from the corresponding navigator.

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

This allows us to type check route names and params which you're navigating using [`navigate`](navigation-object.md#navigate), [`push`](stack-actions.md#push) etc. The name of the current route is necessary to type check the params in `route.params` and when you call [`setParams`](navigation-actions.md#setparams) or [`replaceParams`](navigation-actions.md#replaceparams).

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

### Combining navigation props

When you manually annotate screen props for nested navigators, the navigation prop of the screen is a combination of multiple navigation props. For example, if we have a tab inside a stack, the `navigation` prop will have both [`jumpTo`](tab-actions.md#jumpto) (from the tab navigator) and [`push`](stack-actions.md#push) (from the stack navigator). To make it easier to combine types from multiple navigators, you can use the `CompositeScreenProps` type.

For example, if we have a `Profile` in a navigator, nested inside `Account` screen of a stack navigator, we can combine the types as follows:

```ts
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StackScreenProps } from '@react-navigation/stack';

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsParamList, 'Profile'>,
  StackScreenProps<RootStackParamList, 'Account'>
>;
```

The `CompositeScreenProps` type takes 2 parameters:

- The first parameter is the type for the navigator that owns this screen, in our case the tab navigator which contains the `Profile` screen
- The second parameter is the type of props for a parent navigator, in our case the stack navigator which contains the `Account` screen

For multiple parent navigators, this second parameter can nest another `CompositeScreenProps`:

```ts
type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsParamList, 'Profile'>,
  CompositeScreenProps<
    StackScreenProps<RootStackParamList, 'Account'>,
    DrawerScreenProps<RootDrawerParamList, 'Home'>
  >
>;
```

If annotating the `navigation` prop separately, you can use `CompositeNavigationProp` instead. The usage is similar to `CompositeScreenProps`:

```ts
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabsParamList, 'Profile'>,
  StackNavigationProp<RootStackParamList, 'Account'>
>;
```

### Annotating `ref` on `NavigationContainer`

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

If you're using a regular `ref` object, you can pass a generic to the `NavigationContainerRef` type.

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

## Organizing types

We recommend relying on the typed hooks instead of manually annotating screen props for simplicity.

1. Define each navigator's param list in the same module as that navigator.
2. When a navigator renders another navigator as a screen, use `NavigatorScreenParams<typeof ChildNavigator>` for that route's params.
3. Specify the type of your root navigator once with module augmentation.
4. In screen components, use the hooks with the current screen name instead of annotating `navigation` and `route` props manually.

First, define the child navigator and its param list:

```ts title="navigation/HomeTabs.tsx"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type HomeTabsParamList = {
  Popular: undefined;
  Latest: undefined;
};

export const HomeTabs = createBottomTabNavigator<HomeTabsParamList>();
```

Then, in any parent navigator that renders this navigator as a screen, use `NavigatorScreenParams<typeof HomeTabs>`:

```ts title="navigation/AppStack.tsx"
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeTabs } from './HomeTabs';

type AppStackParamList = {
  Home: NavigatorScreenParams<typeof HomeTabs>;
  PostDetails: { id: string };
  NotFound: undefined;
};

export const AppStack = createStackNavigator<AppStackParamList>();
```

Use the same pattern at each nesting level. The parent route's params should use `NavigatorScreenParams<typeof ChildNavigator>`. This is necessary for proper type inference when using the typed hooks.

Then, the root navigator's type needs to be specified with module augmentation. For example, if `AppStack` is the root navigator in your app:

```ts
type RootStackType = typeof AppStack;

declare module '@react-navigation/native' {
  interface RootNavigator extends RootStackType {}
}
```

Now, screen components can use typed hooks instead of importing navigator types:

```ts
import { useNavigation, useRoute } from '@react-navigation/native';

function PopularScreen() {
  const navigation = useNavigation('Popular');
  const route = useRoute('Popular');

  // ...
}

function PostDetailsScreen() {
  const route = useRoute('PostDetails');

  // The params are correctly typed here
  const { id } = route.params;

  // ...
}
```

### Legacy setup

If you have a legacy setup with manual screen prop annotations, this section will cover recommendations for organizing the types. For newer projects, we recommend using the typed hooks instead of manually annotating screen props.

- Create a separate file (e.g. `navigation/types.tsx`) that contains the types related to React Navigation.
- Instead of using `CompositeNavigationProp` directly in your components, create helper types that you can reuse.
- Specify the type of your root navigator to avoid manual annotations.

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
    RootStackScreenProps<'Home'>
  >;
```

Then, you'd set up the type for your root navigator in the same file where your root navigator is used:

```ts
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from './navigation/types';

const RootStack = createStackNavigator<RootStackParamList>();

function App() {
  // ...
}

type RootStackType = typeof RootStack;

declare module '@react-navigation/native' {
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
