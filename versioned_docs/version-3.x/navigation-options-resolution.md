---
id: navigation-options-resolution
title: Navigation options resolution
sidebar_label: Navigation options resolution
---

Each screen can configure various aspects about how it gets presented in the navigator that renders it. In the [Configuring the header bar](headers.md) section of the fundamentals documentation we explain the basics of how this works.

In this document we'll explain how this works when there are multiple navigators. It's important to understand this so that you put your `navigationOptions` in the correct place and can properly configure your navigators. If you put them in the wrong place, at best nothing will happen and at worst something confusing and unexpected will happen. Thankfully, the logic for this could not be any easier to understand:

**You can only modify navigation options for a navigator from one of its screen components. This applies equally to navigators that are nested as screens.**

Let's take for example a tab navigator that contains a stack in each tab. What happens if we set the `navigationOptions` on a screen inside of the stack?

```js
class A extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home!',
  };

  // etc..
}

class B extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Settings!',
  };

  // etc..
}

const HomeStack = createStackNavigator({ A });
const SettingsStack = createStackNavigator({ B });

export default createAppContainer(
  createBottomTabNavigator({
    HomeStack,
    SettingsStack,
  })
);
```

<a href="https://snack.expo.io/@react-navigation/nested-navigationoptions-wrong-v3" target="blank" class="run-code-button">&rarr; Run this code</a>

As we mentioned earlier, you can only modify navigation options for a navigator from one of its screen components. `A` and `B` above are screen components in `HomeStack` and `SettingsStack` respectively, not in the tab navigator. So the result will be that the `tabBarLabel` property is not applied to the tab navigator. We can fix this though!

```js
const HomeStack = createStackNavigator({ A });
const SettingsStack = createStackNavigator({ B });

HomeStack.navigationOptions = {
  tabBarLabel: 'Home!',
};

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings!',
};

export default createAppContainer(
  createBottomTabNavigator({
    HomeStack,
    SettingsStack,
  })
);
```

<a href="https://snack.expo.io/@react-navigation/nested-navigationoptions-correct-v3" target="blank" class="run-code-button">&rarr; Run this code</a>

To understand what is going on here, first recall that in the following example, `MyComponent` and `MyOtherComponent` are identical:

```js
class MyComponent extends React.Component {
  static navigationOptions = {
    title: 'Hello!',
  };
  // etc.
}

class MyOtherComponent extends React.Component {
  // etc.
}

MyOtherComponent.navigationOptions = {
  title: 'Hello!',
};
```

We also know that `createStackNavigator` and related functions return React components. So when we set the `navigationOptions` directly on the `HomeStack` and `SettingsStack` component, it allows us to control the `navigationOptions` for its parent navigator when its used as a screen component. In this case, the `navigationOptions` on our stack components configure the label in the tab navigator that renders the stacks.

```js
const HomeStack = createStackNavigator(
  { A },
  {
    // This is the default for screens in the stack, so `A` will
    // use this title unless it overrides it
    defaultNavigationOptions: {
      title: 'Welcome',
    },
  }
);

// These are the options that are used by the navigator that renders
// the HomeStack, in our example above this is a tab navigator.
HomeStack.navigationOptions = {
  tabBarLabel: 'Home!',
};
```

Another way you could write this is:

```js
const HomeStack = createStackNavigator(
  { A },
  {
    // This applies to the parent navigator
    navigationOptions: {
      tabBarLabel: 'Home!',
    },
    // This applies to child routes
    defaultNavigationOptions: {
      title: 'Welcome',
    },
  }
);
```

<a href="https://snack.expo.io/@react-navigation/nested-navigationoptions-title-v3" target="blank" class="run-code-button">&rarr; Run this code</a>

## getActiveChildNavigationOptions

If you would like to get the `navigationOptions` from the active child of a navigator, you can do that with `getActiveChildNavigationOptions`. This makes it possible for you to set the `tabBarLabel` directly on a screen inside of a stack that is inside of a tab, for example.

```jsx
class A extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
    tabBarLabel: 'Home!',
  };

  render() {
    return <Placeholder text="A!" />;
  }
}

const HomeStack = createStackNavigator(
  { A },
  {
    navigationOptions: ({ navigation, screenProps }) => ({
      // you can put fallback values before here, eg: a default tabBarLabel
      ...getActiveChildNavigationOptions(navigation, screenProps),
      // put other navigationOptions that you don't want the active child to
      // be able to override here!
    }),
  }
);
```

<a href="https://snack.expo.io/@react-navigation/nested-navigationoptions-active-child-v3" target="blank" class="run-code-button">&rarr; Run this code</a>

## **Note**: the navigationOptions property vs navigator configuration

Navigators are initialized with `create*Navigator(routeConfig, navigatorConfig)`. Inside of `navigatorConfig` we can add a `defaultNavigationOptions` property. These `defaultNavigationOptions` are the default options for screens within that navigator ([read more about sharing common navigationOptions](headers.md#sharing-common-navigationoptions-across-screens)), they do not refer to the `navigationOptions` for that navigator &mdash; as we have seen above, we set the `navigationOptions` property directly on the navigator for that use case.

## A stack contains a tab navigator and you want to set the title on the stack header

Imagine the following configuration:

```js
const TabNavigator = createBottomTabNavigator({
  Feed: FeedScreen,
  Profile: ProfileScreen,
});

const AppNavigator = createStackNavigator({
  Home: TabNavigator,
  Settings: SettingsScreen,
});
```

If we were to set the `headerTitle` with `navigationOptions` on the `FeedScreen`, this would not work. This is because the `AppNavigator` stack will only look at its immediate children for configuration: `TabNavigator` and `SettingsScreen`. So we can set the `headerTitle` on the `TabNavigator` instead, like so:

```js
const TabNavigator = createBottomTabNavigator({
  Feed: FeedScreen,
  Profile: ProfileScreen,
});

TabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];

  // You can do whatever you like here to pick the title based on the route name
  const headerTitle = routeName;

  return {
    headerTitle,
  };
};
```

Another option is to re-organize your navigators, such that each tab has its own stack. You can then hide the top-level stack's header when the tab screen is focused.

```js
const FeedStack = createStackNavigator({
  FeedHome: FeedScreen,
  /* other routes here */
});

const ProfileStack = createStackNavigator({
  ProfileHome: ProfileScreen,
  /* other routes here */
});

const TabNavigator = createBottomTabNavigator({
  Feed: FeedStack,
  Profile: ProfileStack,
});

TabNavigator.navigationOptions = {
  // Hide the header from AppNavigator stack
  header: null,
};

const AppNavigator = createStackNavigator({
  Home: TabNavigator,
  Settings: SettingsScreen,
});
```

Using this configuration, the `headerTitle` or `title` from `navigationOptions` on `FeedScreen` and `ProfileScreen` will not determine the title in their headers.

Additionally, you can push new screens to the feed and profile stacks without hiding the tab bar by adding more routes to those stacks. If you want to push screens on top of the tab bar, then you can add them to the `AppNavigator` stack.

## A tab navigator contains a stack and you want to hide the tab bar on specific screens

Similar to the example above where a stack contains a tab navigator, we can solve this in two ways: add `navigationOptions` to our tab navigator to set the tab bar to hidden depending on which route is active in the child stack, or we can move the tab navigator inside of the stack.

Imagine the following configuration:

```js
const FeedStack = createStackNavigator({
  FeedHome: FeedScreen,
  Details: DetailsScreen,
});

const TabNavigator = createBottomTabNavigator({
  Feed: FeedStack,
  Profile: ProfileScreen,
});

const AppNavigator = createSwitchNavigator({
  Auth: AuthScreen,
  Home: TabNavigator,
});
```

If we want to hide the tab bar when we navigate from the feed home to a details screen without shuffling navigators, we cannot set the `tabBarVisible: false` configuration in `navigationOptions` on `DetailsScreen`, because those options will only apply to the `FeedStack`. Instead, we can do the following:

```js
const FeedStack = createStackNavigator({
  FeedHome: FeedScreen,
  Details: DetailsScreen,
});

FeedStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};
```

This will hide the tab bar any time we navigate away from the feed home. We could switch visibility based on route name, but it would be strange to have the tab bar be hidden and then appear again when pushing another route &mdash; it should only be visible when returning to a route where it was previously visible.

Another option here would be to add another stack navigator as a parent of the tab navigator, and put the details screen there. This is recommended.

```js
const FeedStack = createStackNavigator({
  FeedHome: FeedScreen,
  /* any other route you want to render under the tab bar */
});

const TabNavigator = createBottomTabNavigator({
  Feed: FeedStack,
  Profile: ProfileScreen,
});

const HomeStack = createStackNavigator({
  Tabs: TabNavigator,
  Details: DetailsScreen,
  /* any other route you want to render above the tab bar */
});

const AppNavigator = createSwitchNavigator({
  Auth: AuthScreen,
  Home: HomeStack,
});
```

## A drawer has a stack inside of it and you want to lock the drawer on certain screens

This is conceptually identical to having a tab with a stack inside of it (read that above if you have not already), where you want to hide the tab bar on certain screens. The only difference is that rather than using `tabBarVisible` you will use `drawerLockMode`.

Imagine the following configuration:

```js
const FeedStack = createStackNavigator({
  FeedHome: FeedScreen,
  Details: DetailsScreen,
});

const DrawerNavigator = createDrawerNavigator({
  Feed: FeedStack,
  Profile: ProfileScreen,
});

const AppNavigator = createSwitchNavigator({
  Auth: AuthScreen,
  Home: DrawerNavigator,
});
```

In order to hide the drawer when we push the details screen to the feed stack, we need to set `navigationOptions` on the `FeedStack`. If we were to set `navigationOptions` on the `DetailsScreen`, they would be configuring the feed stack (its direct parent) and not the drawer.

```js
const FeedStack = createStackNavigator({
  FeedHome: FeedScreen,
  Details: DetailsScreen,
});

FeedStack.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};
```

Another option here would be to add another stack navigator as a parent of the drawer navigator, and put the details screen there. This is recommended.

```js
const FeedStack = createStackNavigator({
  FeedHome: FeedScreen,
  /* any other route where you want the drawer to remain available */
  /* keep in mind that it will conflict with the swipe back gesture on ios */
});

const DrawerNavigator = createDrawerNavigator({
  Feed: FeedStack,
  Profile: ProfileScreen,
});

const HomeStack = createStackNavigator({
  Drawer: DrawerNavigator,
  Details: DetailsScreen,
  /* add routes here where you want the drawer to be locked */
});

const AppNavigator = createSwitchNavigator({
  Auth: AuthScreen,
  Home: HomeStack,
});
```
