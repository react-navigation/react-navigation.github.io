---
id: static-typescript
title: Configuring TypeScript with static API
sidebar_label: Configuring TypeScript
---

There are 2 steps to configure TypeScript with the static API:

1. Each screen component needs to specify the type of the `route.params` prop that it accepts. The `StaticScreenProps` type makes it simpler:

```ts
import type { StaticScreenProps } from '@react-navigation/native';

type Props = StaticScreenProps<{
  username: string;
}>;

function ProfileScreen({ route }: Props) {
  // ...
}
```

1. Generate the `ParamList` type for the root navigator and specify it as the default type for the `RootParamList` type:

```ts
import type { StaticParamList } from '@react-navigation/native';

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

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

This is needed to type-check the `useNavigation` hook.

## Navigator specific types

Generally we recommend using the default types for the `useNavigation` prop to access the navigation object in a navigator agnostic manner. However, if you need to use navigator specific APIs, you need to manually annotate `useNavigation`:

```ts
type BottomTabParamList = StaticParamList<typeof BottomTabNavigator>;
type ProfileScreenNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'Profile'
>;

// ...

const navigation = useNavigation<ProfileScreenNavigationProp>();
```

This follows the same principle as the types described in [Type checking with TypeScript](typescript.md).

Note that annotating `useNavigation` this way not type-safe since we can't guarantee that the type you provided matches the type of the navigator.

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
  Home: HomeTabs,
});
```

Here, the `HomeTabs` component is defined using the dynamic API. This means that when we create the param list for the root navigator with `StaticParamList<typeof RootStack>`, it won't know about the screens defined in the nested navigator. To fix this, we'd need to specify the param list for the nested navigator explicitly.

This can be done by using the type of the `route` prop that the screen component receives:

```ts
type HomeTabsParamList = {
  Feed: undefined;
  Profile: undefined;
};

type HomeTabsProps = StaticScreenProps<
  NavigatorScreenParams<HomeTabsParamList>
>;

function HomeTabs(_: HomeTabsProps) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

Now, when using `StaticParamList<typeof RootStack>`, it will include the screens defined in the nested navigator.
