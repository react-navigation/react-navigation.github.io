---
id: version-4.x-typescript
title: Type checking with TypeScript
sidebar_label: Type checking with TypeScript
original_id: typescript
---

React Navigation exports type definitions for TypeScript projects, which can be used to type check screens, navigation options, and the navigation prop.

### Type checking `navigation` prop

The `navigation` prop can be annotated to provide type checking for params and basic type checking for the available methods.

The type depends on the navigator that renders the screen. For example, the `navigation` prop provided by `createStackNavigator` can be used like:

```tsx
import { NavigationStackProp } from 'react-navigation-stack';

type Props = {
  navigation: NavigationStackProp<{ userId: string }>;
};

class ProfileScreen extends React.Component<Props> {
  // ...
}
```

The types take a generic for the params object.

Along with `NavigationStackProp`, each navigator exports its own type for navigation prop:

- `NavigationStackProp` for `createStackNavigator` from `react-navigation-stack`
- `NavigationTabProp` for `createBottomTabNavigator` and `createMaterialTopTabNavigator` from `react-navigation-tabs`
- `NavigationDrawerProp` for `createDrawerNavigator` from `react-navigation-drawer`

### Type checking all props for a screen

A screen receives the `theme` and `screenProps` props along with the `navigation` prop. Instead of needing to annotate each property, they can be consolidated.

The type depends on the navigator that renders the screen. For example, for a screen in `createStackNavigator`:

```tsx
import { NavigationStackScreenProps } from 'react-navigation-stack';

type Params = { userId: string };

type ScreenProps = { language: string };

class ProfileScreen extends React.Component<
  NavigationStackScreenProps<Params, ScreenProps>
> {
  // ...
}
```

The `Params` and `ScreenProps` generics are optional, and can be omitted if you're not using them.

Along with `NavigationStackScreenProps`, each navigator exports its own type for navigation prop:

- `NavigationStackScreenProps` for `createStackNavigator` from `react-navigation-stack`
- `NavigationTabScreenProps` for `createBottomTabNavigator` and `createMaterialTopTabNavigator` from `react-navigation-tabs`
- `NavigationDrawerScreenProps` for `createDrawerNavigator` from `react-navigation-drawer`

### Type checking `navigationOptions`

Different navigators accept different set of options for the screen. They are specified in the `navigationOptions` static property which can be annotated to provide type-checking:

```tsx
import { NavigationStackOptions } from 'react-navigation-stack';

// ...

class ProfileScreen extends React.Component<Props> {
  static navigationOptions: NavigationStackOptions = {
    headerTitle: 'Profile',
  };

  // ...
}
```

Along with `NavigationStackOptions`, each navigator exports its own type for navigation prop:

- `NavigationStackOptions` for `createStackNavigator` from `react-navigation-stack`
- `NavigationBottomTabOptions` for `createBottomTabNavigator` from `react-navigation-tabs`
- `NavigationMaterialTabOptions` for `createMaterialTopTabNavigator` from `react-navigation-tabs`
- `NavigationDrawerOptions` for `createDrawerNavigator` from `react-navigation-drawer`

### Type checking screen components

Screens can be annotated to provide type-checking for the props it receives, as well as `navigationOptions` in a single type annotation.

The type depends on the navigator that renders the screen. For example, for a screen in `createStackNavigator`:

```tsx
import { NavigationStackScreenComponent } from 'react-navigation-stack';

type Params = { userId: string };

type ScreenProps = { language: string };

const ProfileScreen: NavigationStackScreenComponent<
  Params,
  ScreenProps
> = props => {
  // ...
};

ProfileScreen.navigationOptions = {
  headerTitle: 'Profile',
};
```

The `Params` and `ScreenProps` generics are optional, and can be omitted if you're not using them.

Along with `NavigationStackScreenComponent`, each navigator exports its own type for navigation prop:

- `NavigationStackScreenComponent` for `createStackNavigator` from `react-navigation-stack`
- `NavigationBottomTabScreenComponent` for `createBottomTabNavigator` from `react-navigation-tabs`
- `NavigationMaterialTabScreenComponent` for `createMaterialTopTabNavigator` from `react-navigation-tabs`
- `NavigationDrawerScreenComponent` for `createDrawerNavigator` from `react-navigation-drawer`
