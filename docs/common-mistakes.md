---
id: common-mistakes
title: Common mistakes
sidebar_label: Common mistakes
---

This section attempts to outline issues that users frequently encounter when first getting accustomed to using React Navigation and serves as a reference in some cases for error messages.

## Explicitly rendering more than one navigator

Most apps should only ever render one navigator inside of a React component, and this is usually somewhere near the root component of your app. This is a little bit counter-intuitive at first but it's important for the architecture of React Navigation.

Here's what you might write in your code -- note that this example would be incorrect:

```javascript
export default class App extends React.Component {
  render() {
    /* In the root component we are rendering the app navigator */
    return <AppContainer />;
  }
}

const AuthenticationNavigator = createStackNavigator({
  SignIn: SignInScreen,
  ForgotPassword: ForgotPasswordScreen,
});

const AuthenticationContainer = createAppContainer(AuthenticationNavigator);

class AuthenticationScreen extends React.Component {
  render() {
    /*
     * In a screen inside of the navigator we are rendering another navigator 
     * You should avoid this! It will have its own navigation state and be unable
     * To interact with any parent navigator, eg: it would not know the route "Home" exists
     */
    return (
      <AuthenticationContainer />
    );
  }
}

const AppNavigator = createSwitchNavigator({
  Auth: AuthenticationScreen, // This screen renders a navigator!
  Home: HomeScreen,
});

const AppContainer = createAppContainer(AppNavigator)
``` 

The correct way to write this would be the following:

```javascript
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const AuthenticationNavigator = createStackNavigator({
  SignIn: SignInScreen,
  ForgotPassword: ForgotPasswordScreen,
});

const AppNavigator = createSwitchNavigator({
  /* 
   * Rather than being rendered by a screen component, the
   * AuthenticationNavigator is a screen component
   */
  Auth: AuthenticationNavigator,
  Home: HomeScreen,
});

const AppContainer = createAppContainer(AppNavigator);
```

Alternatively, the following would also work because it exposes the `router` static on `AuthenticationScreen` and threads through the `navigation` prop:

```javascript
export default class App extends React.Component {
  render() {
    /* In the root component we are rendering the app navigator */
    return <AppContainer />;
  }
}

const AuthenticationNavigator = createStackNavigator({
  SignIn: SignInScreen,
  ForgotPassword: ForgotPasswordScreen,
});

class AuthenticationScreen extends React.Component {
  static router = AuthenticationNavigator.router;

  render() {
    return (
      <AuthenticationNavigator navigation={this.props.navigation} />
    );
  }
}

const AppNavigator = createSwitchNavigator({
  Auth: AuthenticationScreen, // This screen renders a navigator!
  Home: HomeScreen,
});

const AppContainer = createAppContainer(AppNavigator);
```

## Assigning navigationOptions to the wrong component

In previous version of React Navigation, the library used to dig through your component tree to find `navigationOptions`. This is no longer the case, and only `navigationOptions` on screen components of a particular navigator will apply to that navigator. You can read more about this in the [Navigation options resolution](navigation-options-resolution.html) guide.

## Wrapping AppContainer in a View without flex

If you wrap the `AppContainer` in a `View`, make sure the `View` is using flex.
```javascript
import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

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

const TabNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen,
});

const AppContainer = createAppContainer(TabNavigator)

// without the style you will see a blank screen
export default ()=><View style={{flex: 1}}><AppContainer/></View>;
```
