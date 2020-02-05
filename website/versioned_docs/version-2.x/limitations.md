---
id: version-2.x-limitations
title: Limitations
sidebar_label: Limitations
original_id: limitations
---

As a potential user of the library, it's important to know what you can and cannot do with it. Armed with this knowledge, you may choose to adopt [a different library instead](alternatives.html). We discuss the high level design decisions in the [pitch & anti-pitch](pitch.html) section, and here we will cover some of the use cases that are either not supported or are so difficult to do that they may as well be impossible. If any of the following limitations are dealbreakers for your app, React Navigation might not be for you.

## Dynamic routes

This one requires a bit of understanding of React Navigation to fully grok.

React Navigation requires that you define your routes statically, like so:

```js
const FriendsNavigator = createDrawerNavigator({
  Feed: FeedScreen,
  FriendList: FriendListScreen,
});

const AuthNavigator = createStackNavigator({
  SignIn: SignInScreen,
  ForgotPassword: ForgotPasswordScreen,
});

const AppNavigator = createSwitchNavigator({
  App: FriendsNavigator,
  Auth: AuthNavigator,
});

export default class MyApp extends React.Component {
  render() {
    return <AppNavigator />;
  }
}
```

Let's say that when a user signs in to the app, you want to get a list of the user's friends and add a route for each friend in the `FriendsNavigator`. This would make it so there is a button with each of their names in the drawer. React Navigation does not currently provide an easy way to do this. React Navigation currently works best in situations where your routes can be defined statically. Keep in mind that this does not mean that you cannot pass arbitrary data to your routes &mdash; you can do this using [params](params.html).

There are workarounds if you absolutely need dynamic routes but you can expect some additional complexity.

## iOS 11 style header with large text

This is on the roadmap to implement, but it's not currently available in the React Navigation. Some folks have [gone ahead and built their own version of this](https://github.com/react-navigation/react-navigation-4/issues/2749#issuecomment-367516290), but your mileage may vary.

## Right-to-left (RTL) layout support

You may encounter issues with RTL layouts when using React Navigation. The team working on React Navigation is fairly small and we do not have the bandwidth or processes at the moment to test all changes against RTL layouts. If you like what React Navigation has to offer but are turned off by this constraint, we encourage you to get involved and take ownership of RTL layout support. Please reach out to us on Twitter: [@reactnavigation](https://twitter.com/reactnavigation).

## Performance limitations

We are able to offload animations to another thread using React Native's [Animated native driver](https://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html), but we currently still need to call back into JavaScript for gestures (although there are plans to remedy this in the near future). React Navigation is entirely made up of React components and the state is managed in JavaScript on the same thread as the rest of your app. This is what makes React Navigation great in many ways but it also means that your app logic contends for CPU time with React Navigation &mdash; there's only so much JavaScript execution time available per frame.

## Nuanced platform-specific behavior

Some platform-specific behavior either cannot be implemented or has not yet been implemented in React Navigation.

Versions prior to 2.14.0 do not support the ["reachability feature" on iOS](https://www.cnet.com/how-to/how-to-use-reachability-on-iphone-6-6-plus/). When you toggle this feature, the app moves down towards the bottom of the screen so you can easily reach the navigation bar and other functionality near the top of the UI. When you navigate to another screen using the built-in iOS navigation API, the UI will jump back up to the top of the screen. React-navigation 2.14.0 and later supports this feature through integration with [react-native-screens](react-native-screens.html).

React-navigation does not include support for the peek & pop feature available on devices with 3D touch.