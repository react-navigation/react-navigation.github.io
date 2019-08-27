---
id: navigation-lifecycle
title: Navigation lifecycle
sidebar_label: Navigation lifecycle
---

In the previous section, we worked with a stack navigator that has two screens (`Home` and `Details`) and learned how to use `this.props.navigation.navigate('RouteName')` to navigate between the routes.

An important question in this context is: what happens with `Home` when we navigate away from it, or when we come back to it? How does a route find out that a user is leaving it or coming back to it?

Coming to react-navigation from the web, you may assume that when user navigates from route A to route B, A will unmount (its `componentWillUnmount` is called) and A will mount again when user comes back to it. While these React lifecycle methods are still valid and are used in react-navigation, their usage differs from the web. This is driven by more complex needs of mobile navigation. 

## Example scenario

Consider a stack navigator with screens A and B. After navigating to A, its `componentDidMount` is called. When pushing B, its `componentDidMount` is also called, but A remains mounted on the stack and its `componentWillUnmount` is therefore not called.

When going back from B to A, `componentWillUnmount` of B is called, but `componentDidMount` of A is not because A remained mounted the whole time.

Similar results can be observed (in combination) with other navigators as well. Consider a tab navigator with two tabs, where each tab is a stack navigator:

#TODO 

```jsx
const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  Profile: ProfileScreen,
});

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Settings: SettingsStack,
  }
);
```

We start on the `HomeScreen` and navigate to `DetailsScreen`. Then we use the tab bar to switch to the `SettingsScreen` and navigate to `ProfileScreen`. After this sequence of operations is done, all 4 of the screens are mounted! If you use the tab bar to switch back to the `HomeStack`, you'll notice you'll be presented with the `DetailsScreen` - the navigation state of the `HomeStack` has been preserved!

## React Navigation lifecycle events

Now that we understand how React lifecycle methods work in React Navigation, let's answer the question we asked at the beginning: "How do we find out that a user is leaving it or coming back to it?"

React Navigation emits events to screen components that subscribe to them. There are four different events that you can subscribe to: `willFocus`, `willBlur`, `didFocus` and `didBlur`. Read more about them in the [API reference](navigation-prop.html#addlistener-subscribe-to-updates-to-navigation-lifecycle).

Many of your use cases may be covered with the [`withNavigationFocus` HOC](with-navigation-focus.html) or the [`<NavigationEvents />` component](navigation-events.html) which are a little more straightforward to use.

## Summary

- while React's lifecycle methods are still valid, React Navigation adds more lifecycle events that you can subscribe to through the `navigation` prop.
- you may also use the `withNavigationFocus` HOC or `<NavigationEvents />` component to react to lifecycle changes
