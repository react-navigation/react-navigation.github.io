---
id: typescript
title: Type checking with TypeScript
sidebar_label: Type checking with TypeScript
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

Specifying `undefined` means that the route doesn't have params. A union type with `undefined` (e.g. `SomeType | undefined`) means that params are optional.

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

Similarly, you can import `DrawerNavigationProp` from `@react-navigation/drawer`, `BottomTabNavigationProp` from `@react-navigation/bottom-tabs` etc.

To annotate the `route` prop, we need to use the `RouteProp` type from `@react-navigation/native`:

```tsx
import { RouteProp } from '@react-navigation/native';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type Props = {
  route: ProfileScreenRouteProp;
};
```

This allows us to type check the route object, such as `route.params`.

To summarize:

```tsx
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};
```

Alternatively, you can also import a generic type to define types for both the `navigation` and `route` props from the corresponding navigator:

```tsx
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
};

type Props = StackScreenProps<RootStackParamList, 'Profile'>;
```

Similarly, you can import `DrawerScreenProps` from `@react-navigation/drawer`, `BottomTabScreenProps` from `@react-navigation/bottom-tabs` etc.

Then you can use the `Props` type to annotate your component.

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

We recommend creating a separate `types.tsx` file where you keep the types and import them in your component files instead of repeating them in each file.

### Nesting navigators

#### Type checking screens and params in nested navigator

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

#### Combining navigation props

When you nest navigators, the navigation prop of the screen is a combination of multiple navigation props. For example, if we have a tab inside a stack, the `navigation` prop will have both `jumpTo` (from the tab navigator) and `push` (from the stack navigator). To make it easier to combine types from multiple navigator, you can use the `CompositeNavigationProp` type:

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

### Annotating `options` and `screenOptions`

When you pass the `options` to a `Screen` or `screenOptions` prop to a `Navigator` component, they are already type-checked and you don't need to do anything special. However, sometimes you might want to extract the options to a separate object, and you might want to annotate it.

To annotate the options, we need to import the corresponding type from the navigator. For example, `StackNavigationOptions` for `@react-navigation/stack`:

```ts
import { StackNavigationProp } from '@react-navigation/stack';

const options: StackNavigationOptions = {
  headerShown: false,
};
```

Similarly, you can import `DrawerNavigationOptions` from `@react-navigation/drawer`, `BottomTabNavigationOptions` from `@react-navigation/bottom-tabs` etc.

### Annotating `ref` on `NavigationContainer`

When adding a `ref` to `NavigationContainer`, you can use the `NavigationContainerRef` type to annotate it.

Example when using `React.useRef` hook:

```ts
import { NavigationContainerRef } from '@react-navigation/native';

// ...

const navigationRef = React.useRef<NavigationContainerRef>(null);
```

Example when using `React.createRef`:

```ts
import { NavigationContainerRef } from '@react-navigation/native';

// ...

const navigationRef = React.createRef<NavigationContainerRef>();
```
