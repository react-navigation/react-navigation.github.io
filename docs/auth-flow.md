---
id: auth-flow
title: Authentication flows
sidebar_label: Authentication flows
---

Most apps require that a user authenticate in some way to have access to data associated with a user or other private content. Typically the flow will look like this:

* The user opens the app.
* The app loads some authentication state from persistent storage (for example, `AsyncStorage`).
* When the state has loaded, the user is presented with either authentication screens or the main app, depending on whether valid authentication state was loaded.
* When the user signs out, we clear the authentication state and send them back to authentication screens.

> Note: we say "authentication screens" because usually there is more than one. You may have a main screen with a username and password field, another for "forgot password", and another set for sign up.

## Set up our navigators

```js
import { StackNavigator, SwitchNavigator } from 'react-navigation';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = StackNavigator({ Home: HomeScreen, Other: OtherScreen });
const AuthStack = StackNavigator({ SignIn: SignInScreen });

export default SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
```
<a href="https://snack.expo.io/@react-navigation/auth-flow" target="blank" class="run-code-button">&rarr; Run this code</a>

You may not be familiar with `SwitchNavigator` yet. The purpose of `SwitchNavigator` is to only ever show one screen at a time. By default, it does not handle back actions and it resets routes to their default state when you switch away. This is the exact behavior that we want from the authentication flow: when users sign in, we want to throw away the state of the authentication flow and unmount all of the screens, and when we press the hardware back button we expect to not be able to go back to the authentication flow. We switch between routes in the `SwitchNavigator` by using the `navigate` action. You can read more about the `SwitchNavigator` in the [API reference](/docs/switch-navigator).

We set the `initialRouteName` to `'AuthLoading'` because we will fetch our authentication state from persistent storage inside of that screen component.

## Implement our authentication loading screen

```js
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
```
<a href="https://snack.expo.io/@react-navigation/auth-flow" target="blank" class="run-code-button">&rarr; Run this code</a>

## Fill in other components

Our `App` and `Auth` routes are both `StackNavigators`, but you could do whatever you like here. As mentioned above, you probably want your authentication route to be a stack for password reset, signup, etc. Similarly for your app, you probbaly have more than one screen. We won't talk about how to implement the text inputs and buttons for the authentication screen, that is outside of the scope of navigation. We'll just fill in some placeholder content.

```js
class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

// More code like OtherScreen omitted for brevity
```
<a href="https://snack.expo.io/@react-navigation/auth-flow" target="blank" class="run-code-button">&rarr; Run this code</a>

That's about all there is to it. At the moment, `SwitchNavigator` doesn't support animating between screens. Let us know if this is important to you [on Canny](https://react-navigation.canny.io/feature-requests).
