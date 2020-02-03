---
id: version-5.x-typescript
title: Type checking with TypeScript
sidebar_label: Type checking with TypeScript
original_id: typescript
---

React Navigation is written with TypeScript and exports type definitions for TypeScript projects.

### Type checking the navigator

To type check our route name and params, the first thing we need to do is to create an object type with mappings for route name to the params of the route. For example, say we have a route called `Profile` in our root navigator which should have a param `userId`:

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

Specifying `undefined` means that the route doesn't have params. An union type with `undefined` (`SomeType | undefined`) means that params are optional.

After we have defined the mappings, we need to tell our navigator to use it. To do that, we can pass it as a generic to the `createXNavigator` functions:

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

This will provide type checking and intelliSense for props of the `Navigator` and `Screen` components.

### Type checking screens

To type check our screens, we need to annotate the `navigation` prop and the `route` prop received by a screen.

To annotate the `navigation` prop, we need to import the corresponding type from the navigator. For example, `StackNavigationProp` for `@react-navigation/stack`:

```tsx
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};
```

The type for the navigation prop takes 2 generics, the param list object we defined earlier, and the name of the current route. This allows us to type check route names and params which you're navigating using `navigate`, `push` etc. The name of the current route is necessary to type check the params when you call `setParams`.

To annotate the `route` prop, we need to use the `RouteProp` type from `@react-navigation/native`:

```tsx
import { RouteProp } from '@react-navigation/native';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type Props = {
  route: ProfileScreenRouteProp;
};
```

This allows us to type check the route object, such as `route.params`.

### Nesting navigators

When we nest navigators, the navigation prop of the screen is a combination of multiple navigation props. For example, if we have a tab inside a stack, the `navigation` prop will have both `jumpTo` (from the tab navigator) and `push` (from the stack navigator). To make it easier to combine types from multiple navigator, you can use the `CompositeNavigationProp` type:

```ts
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profile'>,
  StackNavigationProp<StackParamList>
>;
```

The `CompositeNavigationProp` type takes 2 parameters, first parameter is the primary navigation type (type for the navigator that owns this screen, in our case the tab navigator which contains the `Profile` screen) and second parameter is the secondary navigation type (type for a parent navigator). The primary navigation type should always have the screen's route name as it's second parameter.

For multiple parent navigators, this secondary type should be nested:

```ts
type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profile'>,
  CompositeNavigationProp<
    StackNavigationProp<StackParamList>,
    DrawerNavigationProp<DrawerParamList>
  >
>;
```

### Annotating `useNavigation`

To annotate the `navigation` prop that we get from `useNavigation`, we can use a type parameter:

```ts
const navigation = useNavigation<ProfileScreenNavigationProp>();
```

It's important to note that this isn't completely type-safe because the type parameter you use may not be correct and we cannot statically verify it.

### Annotating `useRoute`

To annotate the `route` prop that we get from `useRoute`, we can use a type parameter:

```ts
const route = useRoute<ProfileScreenRouteProp>();
```

It's important to note that this isn't completely type-safe, similar to `useNavigation`.
