---
id: combine-static-with-dynamic
title: Mixing Static & Dynamic APIs
sidebar_label: Mixing Static & Dynamic APIs
---

While the static API has many advantages, it doesn't fit use cases where the navigation configuration needs to be dynamic. So React Navigation supports interop between the static and dynamic APIs.

Keep in mind that the features provided by the static API such as automatic linking configuration and automatic TypeScript types need the whole configuration to be static. If part of the configuration is dynamic, you'll need to handle those parts manually.

There are 2 ways you may want to combine the static and dynamic APIs:

## Static root navigator, dynamic nested navigator

This is useful if you want to keep your configuration static, but need to use a dynamic configuration for a specific navigator.

Let's consider the following example:

- You have a root stack navigator that contains a tab navigator in a screen.
- The tab navigator is defined using the dynamic API.

Our static configuration would look like this:

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Feed: {
      screen: FeedScreen,
      linking: {
        path: 'feed',
      },
    },
  },
});
```

Here, `FeedScreen` is a component that renders a bottom tab navigator and is defined using the dynamic API:

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const FeedTabs = createBottomTabNavigator();

function FeedScreen() {
  return (
    <FeedTabs.Navigator>
      <FeedTabs.Screen name="Latest" component={LatestScreen} />
      <FeedTabs.Screen name="Popular" component={PopularScreen} />
    </FeedTabs.Navigator>
  );
}
```

This code will work, but we're missing 2 things:

- Linking configuration for the screens in the bottom tab navigator.
- TypeScript types for the screens in the bottom tab navigator.

Since the nested navigator is defined using the dynamic API, we need to handle these manually. For the linking configuration, we can define the screens in the `linking` property of the `Feed` screen:

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Feed: {
      screen: FeedScreen,
      linking: {
        path: 'feed',
        // highlight-start
        screens: {
          Latest: 'latest',
          Popular: 'popular',
        },
        // highlight-end
      },
    },
  },
});
```

Here the `screens` property is the same as how you'd define it with `linking` config with the dynamic API. It can contain configuration for any nested navigators as well. See [configuring links](configuring-links.md) for more details on the API.

For the TypeScript types, we can define the type of the `FeedScreen` component:

```tsx
import {
  StaticScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

type FeedTabsParamList = {
  Latest: undefined;
  Popular: undefined;
};

const FeedTabs = createBottomTabNavigator<FeedTabsParamList>();

// highlight-next-line
type Props = StaticScreenProps<NavigatorScreenParams<typeof FeedTabs>>;

// highlight-next-line
function FeedScreen(_: Props) {
  // ...
}
```

In the above snippet:

1. We first define the param list type for screens in the navigator that defines params for each screen
2. Then we create the dynamic navigator with that param list
3. Then we use the `NavigatorScreenParams` type with `typeof FeedTabs` to get the type of route's `params` which will include types for the nested screens and the concrete navigator type
4. Finally, we use the type of `params` with `StaticScreenProps` to define the type of the screen component

Using `typeof FeedTabs` lets typed hooks such as `useNavigation('Latest')`, `useRoute('Latest')`, and `useNavigationState('Latest', selector)` infer the screens inside the nested tab navigator.

This is based on how we'd define the type for a screen with a nested navigator with the dynamic API. See [Type checking screens and params in nested navigator](typescript.md#type-checking-screens-and-params-in-nested-navigator).

## Dynamic root navigator, static nested navigator

This is useful if you already have a dynamic configuration, but want to migrate to the static API. This way you can migrate one navigator at a time.

Let's consider the following example:

- You have a root stack navigator that contains a tab navigator in a screen.
- The root stack navigator is defined using the dynamic API.

Our dynamic configuration would look like this:

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen name="Feed" component={FeedScreen} />
    </RootStack.Navigator>
  );
}
```

Here, `FeedScreen` is a component that renders a tab navigator and is defined using the static API:

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const FeedTabs = createBottomTabNavigator({
  screens: {
    Latest: {
      screen: LatestScreen,
    },
    Popular: {
      screen: PopularScreen,
    },
  },
});
```

To use the `FeedTabs` navigator for the `Feed` screen, we need to get a component from the static navigator using the `getComponent()` method:

```js
const FeedScreen = FeedTabs.getComponent();
```

In addition, we can use the type of the `FeedTabs` navigator in the types of `RootStack`:

```tsx
import { NavigatorScreenParams } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  // highlight-next-line
  Feed: NavigatorScreenParams<typeof FeedTabs>;
};
```

Similarly, we can generate the linking configuration for the `FeedTabs` navigator and use it in the linking configuration passed to `NavigationContainer`:

```js
import { createPathConfigForStaticNavigation } from '@react-navigation/native';

// highlight-next-line
const feedScreens = createPathConfigForStaticNavigation(FeedTabs);

const linking = {
  config: {
    screens: {
      Home: '',
      Feed: {
        path: 'feed',
        // highlight-next-line
        screens: feedScreens,
      },
    },
  },
};
```

This will generate the linking configuration for the `Feed` screen based on the configuration of the `FeedTabs` navigator.
