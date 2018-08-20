---
id: tab-based-navigation
title: Tab navigation
sidebar_label: Tab navigation
---

Possibly the most common style of navigation in mobile apps is tab-based navigation. This can be tabs on the bottom of the screen or on the top below the header (or even instead of a header).

This guide covers [createBottomTabNavigator](bottom-tab-navigator.html). You may also use [createMaterialBottomTabNavigator](material-bottom-tab-navigator.html) and [createMaterialTopTabNavigator](material-top-tab-navigator.html) to add tabs to your application.

## Minimal example of tab-based navigation

```js
import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

export default createBottomTabNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen,
});
```

<a href="https://snack.expo.io/@react-navigation/basic-tabs" target="blank" class="run-code-button">&rarr; Run this code</a>

## Customizing the appearance

This is similar to how you would customize a stack navigator &mdash; there are some properties that are set when you initialize the tab navigator and others that can be customized per-screen in `navigationOptions`.

```js
// You can import Ionicons from @expo/vector-icons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';

export default createBottomTabNavigator(
  {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          iconName = `ios-options${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);
```

<a href="https://snack.expo.io/@react-navigation/tabs-with-icons" target="blank" class="run-code-button">&rarr; Run this code</a>

Let's dissect this:

* `tabBarIcon` is a property on `navigationOptions`, so we know we can use it on our screen components, but in this case chose to put it in the `createBottomTabNavigator` configuration in order to centralize the icon configuration for convenience.
* `tabBarIcon` is a function that is given the `focused` state and `tintColor`. If you take a peek further down in the configuration you will see `tabBarOptions` and `activeTintColor` and `inactiveTintColor`. These default to the the iOS platform defaults, but you can change them here. The `tintColor` that is passed through to the `tabBarIcon` is either the active or inactive one, depending on the `focused` state (focused is active).
* Read the [full API reference](bottom-tab-navigator.html) for further information on `createBottomTabNavigator` configuration options.

## Jumping between tabs

Switching from one tab to another has a familiar API &mdash; `this.props.navigation.navigate`.

```js
import { Button, Text, View } from 'react-native';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
        <Button
          title="Go to Settings"
          onPress={() => this.props.navigation.navigate('Settings')}
        />
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}
```

<a href="https://snack.expo.io/@react-navigation/jumping-between-tabs" target="blank" class="run-code-button">&rarr; Run this code</a>

## A stack navigator for each tab

Usually tabs don't just display one screen &mdash; for example, on your Twitter feed, you can tap on a tweet and it brings you to a new screen within that tab with all of the replies. You can think of this as there being separate navigation stacks within each tab, and that's exactly how we will model it in React Navigation.

```js
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Details!</Text>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* other code from before here */}
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* other code from before here */}
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  Details: DetailsScreen,
});

export default createBottomTabNavigator(
  {
    Home: HomeStack,
    Settings: SettingsStack,
  },
  {
    /* Other configuration remains unchanged */
  }
);
```

<a href="https://snack.expo.io/@react-navigation/stacks-in-tabs" target="blank" class="run-code-button">&rarr; Run this code</a>

## Why do we need a TabNavigator instead of TabBarIOS or some other component?

It's common to attempt to use a standalone tab bar component without integrating it into the navigation library you use in your app. In some cases, this works fine! You should be warned, however, that you may run into some frustrating unanticipated issues when doing this.

For example, React Navigation's `TabNavigator` takes care of handling the Android back button for you, while standalone components typically do not. Additionally, it is more difficult for you (as the developer) to perform actions such as "jump to this tab and then go to this screen" if you need to call into two distinct APIs for it. Lastly, mobile user interfaces have numerous small design details that require that certain components are aware of the layout or presence of other components &mdash; for example, if you have a translucent tab bar, content should scroll underneath it and the scroll view should have an inset on the bottom equal to the height of the tab bar so you can see all of the content. Double tapping the tab bar should make the active navigation stack pop to the top of the stack, and doing it again should scroll the active scroll view in that stack scroll to the top. While not all of these behaviors are implemented out of the box yet with React Navigation, they will be and you will not get any of this if you use a standalone tab view component.

## A tab navigator contains a stack and you want to hide the tab bar on specific screens
[See the documentation here](navigation-options-resolution.html#a-tab-navigator-contains-a-stack-and-you-want-to-hide-the-tab-bar-on-specific-screens)
