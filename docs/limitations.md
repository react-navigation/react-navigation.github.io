---
id: limitations
title: Limitations
sidebar_label: Limitations
---

As the potential user of a library it's important to know what you can and cannot do with it. Armed with this knowledge, you may choose to adopt [a different library instead](/docs/alternatives.html). We discuss the high level design decisions in the [pitch & anti-pitch](/docs/pitch.html) section, and here we will cover some of the use cases that are either not supported or are so difficult to do that they may as well be impossible. If any of the following limitations are dealbreakers for your app, React Navigation might not be for you.

## Dynamic routes

This one requires a bit of understanding of React Navigation to fully grok.

React Navigation requires that you define your routes statically, like so:

```js
let FriendsNavigator = createDrawerNavigator({
  PersonalityQuiz: QuizScreen,
  FriendList: FriendListScreen,
});

let AuthNavigator = createStackNavigator({
  SignIn: SignInScreen,
  ForgotPassword: ForgotPasswordScreen,
});

let AppNavigator = createSwitchNavigator({
  App: FriendsNavigator,
  Auth: AuthNavigator,
});

export default class PersonalityTestApp extends React.Component {
  render() {
    return <AppNavigator />;
  }
}
```

Let's say that you're Cambridge Analytica and when a user signs in to the app, you want to get a list of the user's friends and add a route for each friend in the `FriendsNavigator`. This would make it so there is a button with each of their names in the drawer. React Navigation does not currently provide an easy way to do this. React Navigation currently works best in situations where your routes can be defined statically. Keep in mind that this does not mean that you cannot pass arbitrary data to your routes &mdash; you can do this using [params]().

There are workarounds if you absolutely need dynamic routes but you can expect some additional complexity.

## iOS11-style header with large text

This is on the roadmap to implement, but it's not currently available in the React Navigation. Some folks have [gone ahead and built their own version of this](https://github.com/react-navigation/react-navigation/issues/2749#issuecomment-367516290), but your mileage may vary.
