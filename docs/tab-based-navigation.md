---
id: tab-based-navigation
title: Tab navigation
sidebar_label: Tab navigation
---

In a `StackNavigator` when you navigate to a new route, you are *pushing* the route to the stack and making it the active screen. When you *pop* a screen from the stack (by going back), the screen is no longer rendered and the resources are freed up. The only way to change the active screen is to push or pop a route from the stack.

In tab-based navigation, you cannot *push* a new route, you can only *jump to* a route. To change the active screen, you just change the tab navigation state to point to the route that is now active; the inactive route is not unmounted but it is hidden from view. This is what *jump to* is in tab navigation -- it changes a pointer to the active screen but it doesn't actually add or remove any screens from the tab navigation state. In React Navigation, you can use [TabNavigator](__TODO__) to implement tab-based navigation.

The actions that are performed and the state that is modified in response to the actions is handled by a [router](__TODO__). For most applications you shouldn't have to implement any custom routers, but if you would like to implement your own navigator that models navigation state differently from `StackNavigator` or `TabNavigator` then you may need to create a new router to do so. You can read more about creating a custom navigator in the ["Build your own Navigator"](__TODO__) section.

TODO: Talk about why not just use TabBarIOS or some other thing that isn't integrated with React Navigation

It is common in mobile apps to compose various forms of navigation. The routers and navigators in React Navigation are composable (a navigator can contain other navigators), which allows you to define a complicated navigation structure for your app.

For our chat app, we want to put several tabs on the first screen, to view recent chat threads or all contacts.

## Introducing TabNavigator

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