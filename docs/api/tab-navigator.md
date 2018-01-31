---
id: tab-navigator
title: Tab-based navigation
sidebar_label: Tab-based navigation
---

TODO: First talk about putting a Stack within a Stack for modals. Then talk about TabNavigator later.

TODO: Talk about why not just use TabBarIOS or some other thing that isn't integrated with React Navigation

It is common in mobile apps to compose various forms of navigation. The routers and navigators in React Navigation are composable (a navigator can contain other navigators), which allows you to define a complicated navigation structure for your app.

For our chat app, we want to put several tabs on the first screen, to view recent chat threads or all contacts.

## Introducing Tab Navigator

Lets create a new `TabNavigator` in our `App.js`:

```js
import { TabNavigator } from "react-navigation";

class RecentChatsScreen extends React.Component {
  render() {
    return <Text>List of recent chats</Text>
  }
}

class AllContactsScreen extends React.Component {
  render() {
    return <Text>List of all contacts</Text>
  }
}

const MainScreenNavigator = TabNavigator({
  Recent: { screen: RecentChatsScreen },
  All: { screen: AllContactsScreen },
});
```

If the `MainScreenNavigator` was rendered as the top-level navigator component, it would look like this:

```phone-example
simple-tabs
```

## Nesting a Navigator in a screen

We want these tabs to be visible in the first screen of the app, but new screens in the stack should cover the tabs.

Lets add our tabs navigator as a screen in our top-level `StackNavigator` that we set up in the [previous step](/docs/intro/).

```js
const SimpleApp = StackNavigator({
  Home: { screen: MainScreenNavigator },
  Chat: { screen: ChatScreen },
});
```

Because `MainScreenNavigator` is being used as a screen, we can give it `navigationOptions`:

```js
const SimpleApp = StackNavigator({
  Home: { 
    screen: MainScreenNavigator,
    navigationOptions: {
      title: 'My Chats',
    },
  },
  Chat: { screen: ChatScreen },
})
```

Lets also add a button to each tab that links to a chat:

```js
<Button
  onPress={() => this.props.navigation.navigate('Chat', { user: 'Lucy' })}
  title="Chat with Lucy"
/>
```

Now we have put one navigator inside another, and we can `navigate` between navigators:

```phone-example
nested
```

## Nesting a Navigator in a Component
Sometimes it is desirable to nest a navigator that is wrapped in a component. This is useful in cases where the navigator only takes up part of the screen. For the child navigator to be wired into the navigation tree, it needs the `navigation` property from the parent navigator.

```js
const SimpleApp = StackNavigator({
  Home: { screen: NavigatorWrappingScreen },
  Chat: { screen: ChatScreen },
});
```
In this case, the NavigatorWrappingScreen is not a navigator, but it renders a navigator as part of its output.

If this navigator renders blank then change `<View>` to `<View style={{flex: 1}}>`.

```js
class NavigatorWrappingScreen extends React.Component {
  render() {
    return (
      <View>
        <SomeComponent/>
        <MainScreenNavigator/>
      </View>
    );
  }
}
```

To wire `MainScreenNavigator` into the navigation tree, we assign its `router` to the wrapping component. This makes `NavigatorWrappingScreen` "navigation aware", which tells the parent navigator to pass the navigation object down. Since the `NavigatorWrappingScreen`'s `router` is overridden with the child navigator's `router`, the child navigator will receive the needed `navigation`.

```js
class NavigatorWrappingScreen extends React.Component {
  render() {
    return (
      <View>
        <SomeComponent/>
        <MainScreenNavigator navigation={this.props.navigation}/>
      </View>
    );
  }
}
NavigatorWrappingScreen.router = MainScreenNavigator.router;
```

Used to easily set up a screen with several tabs with a TabRouter. For a live example, open [this project with Expo](https://expo.io/@react-navigation/NavigationPlayground).

```js
class MyHomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./chats-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Notifications',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./notif-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

const MyApp = TabNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Notifications: {
    screen: MyNotificationsScreen,
  },
}, {
  tabBarPosition: 'top',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});
```

## API Definition

```js
TabNavigator(RouteConfigs, TabNavigatorConfig)
```

### RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](/docs/api/navigators/StackNavigator.md#routeconfigs) from `StackNavigator`.

### TabNavigatorConfig

- `tabBarComponent` - Component to use as the tab bar, e.g. `TabBarBottom`
(this is the default on iOS), `TabBarTop`
(this is the default on Android).
- `tabBarPosition` - Position of the tab bar, can be `'top'` or `'bottom'`.
- `swipeEnabled` - Whether to allow swiping between tabs.
- `animationEnabled` - Whether to animate when changing tabs.
- `configureTransition` - a function that, given `currentTransitionProps` and `nextTransitionProps`, returns a configuration object that describes the animation between tabs.
- `lazy` - Whether to lazily render tabs as needed as opposed to rendering them upfront.
- `initialLayout` - Optional object containing the initial `height` and `width`, can be passed to prevent the one frame delay in [react-native-tab-view](https://github.com/react-native-community/react-native-tab-view#avoid-one-frame-delay) rendering.
- `tabBarOptions` - Configure the tab bar, see below.

Several options get passed to the underlying router to modify navigation logic:

- `initialRouteName` - The routeName for the initial tab route when first loading.
- `order` - Array of routeNames which defines the order of the tabs.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause a tab switch to the initial tab? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### `tabBarOptions` for `TabBarBottom` (default tab bar on iOS)

- `activeTintColor` - Label and icon color of the active tab.
- `activeBackgroundColor` - Background color of the active tab.
- `inactiveTintColor` - Label and icon color of the inactive tab.
- `inactiveBackgroundColor` - Background color of the inactive tab.
- `showLabel` - Whether to show label for tab, default is true.
- `style` - Style object for the tab bar.
- `labelStyle` - Style object for the tab label.
- `tabStyle` - Style object for the tab.
- `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings, default is true.

Example:

```js
tabBarOptions: {
  activeTintColor: '#e91e63',
  labelStyle: {
    fontSize: 12,
  },
  style: {
    backgroundColor: 'blue',
  },
}
```

### `tabBarOptions` for `TabBarTop` (default tab bar on Android)

- `activeTintColor` - Label and icon color of the active tab.
- `inactiveTintColor` - Label and icon color of the inactive tab.
- `showIcon` - Whether to show icon for tab, default is false.
- `showLabel` - Whether to show label for tab, default is true.
- `upperCaseLabel` - Whether to make label uppercase, default is true.
- `pressColor` - Color for material ripple (Android >= 5.0 only).
- `pressOpacity` - Opacity for pressed tab (iOS and Android < 5.0 only).
- `scrollEnabled` - Whether to enable scrollable tabs.
- `tabStyle` - Style object for the tab.
- `indicatorStyle` - Style object for the tab indicator (line at the bottom of the tab).
- `labelStyle` - Style object for the tab label.
- `iconStyle` - Style object for the tab icon.
- `style` - Style object for the tab bar.
- `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings, default is true.

Example:

```js
tabBarOptions: {
  labelStyle: {
    fontSize: 12,
  },
  tabStyle: {
    width: 100,    
  },
  style: {
    backgroundColor: 'blue',
  },
}
```

### Screen Navigation Options

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarVisible`

True or false to show or hide the tab bar, if not set then defaults to true.

#### `swipeEnabled`

True or false to enable or disable swiping between tabs, if not set then defaults to TabNavigatorConfig option swipeEnabled.

#### `tabBarIcon`

React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see `tabBarOptions.showLabel` in the previous section.

#### `tabBarOnPress`

Callback to handle tap events; the argument is an object containing:

* the `previousScene: { route, index }` which is the scene we are leaving
* the `scene: { route, index }` that was tapped
* the `jumpToIndex` method that can perform the navigation for you

Useful for adding a custom logic before the transition to the next scene (the tapped one) starts.

### Navigator Props

The navigator component created by `TabNavigator(...)` takes the following props:

- `screenProps` - Pass down extra options to child screens and navigation options, for example:


 ```jsx
 const TabNav = TabNavigator({
   // config
 });

 <TabNav
   screenProps={/* this prop will get passed to the screen components as this.props.screenProps */}
 />
 ```
