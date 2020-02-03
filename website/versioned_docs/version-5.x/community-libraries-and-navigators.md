---
id: version-5.x-community-libraries-and-navigators
title: Community-developed Navigators and Libraries
sidebar_label: Community Navigators and Libraries
original_id: community-libraries-and-navigators
---

> Libraries listed in this guide may not have been updated to work with the latest version of React Navigation. Please refer to the library's documentation to see which version of React Navigation it supports.

# Navigators

## Fluid Transitions

Fluid Transitions is a library that provides Shared Element Transitions during navigation between screens using react-navigation.

A Shared Element Transition is the visualization of an element in one screen being transformed into a corresponding element in another screen during the navigation transition.

The library implements a custom navigator called `FluidNavigator` that makes all this and more possible.

#### Links

[github.com/fram-x/FluidTransitions](https://github.com/fram-x/FluidTransitions)

# Libraries

## react-navigation-collapsible

react-navigation-collapsible is a library and a `Higher Order Component` that adjusts your screen options and makes your screen header collapsible.

Since react-navigation's header is designed as `Animated` component, you can animate the header by passing `Animated.Value` from your `ScrollView` or `FlatList` to the header.

#### Links

[github.com/benevbright/react-navigation-collapsible](https://github.com/benevbright/react-navigation-collapsible)

[Demo on Snack](https://snack.expo.io/@benevbright/react-navigation-collapsible)

## react-native-screens

This project aims to expose native navigation container components to React Native and React Navigation can integrate with it since version 2.14.0. Using `react-native-screens` brings several benefits, such as support for the ["reachability feature"](https://www.cnet.com/how-to/how-to-use-reachability-on-iphone-6-6-plus/) on iOS, and improved memory consumption on both platforms.

#### Links

[github.com/kmagiera/react-native-screens](https://github.com/kmagiera/react-native-screens)

## react-navigation-header-buttons

Helps you to render buttons in the navigation bar and handle the styling so you don't have to. It tries to mimic the appearance of native navbar buttons and attempts to offer a simple interface for you to interact with.

#### Links

[github.com/vonovak/react-navigation-header-buttons](https://github.com/vonovak/react-navigation-header-buttons)

[Demo on expo](https://expo.io/@vonovak/navbar-buttons-demo)

## react-navigation-props-mapper

Provides simple HOCs that map react-navigation props to your screen components directly - ie. instead of `const user = this.props.route.params.activeUser`, you'd write `const user = this.props.activeUser`.

#### Links

[github.com/vonovak/react-navigation-props-mapper](https://github.com/vonovak/react-navigation-props-mapper)

## react-navigation-backhandler

Easily handle Android back button behavior with React-Navigation with a component based API.

#### Links

[github.com/vonovak/react-navigation-backhandler](https://github.com/vonovak/react-navigation-backhandler)

## react-native-header-scroll-view

This component implements [iOS large header with grow/shrink on scroll](https://react-navigation.canny.io/feature-requests/p/ios-11-large-header-and-growshrink-on-scroll), made by [@jonsamp](https://github.com/jonsamp). Note that it doesn't handle header animation between screens, it only handles animating the header title on scroll.

To use this component, we'd want to disable the built-in header. There are 2 ways to disable the header in React Navigation:

1. Disable the default header for one screen:

```js
static navigationOptions = {
  headerShown: false
};
```

2. Disable header globally in `createStackNavigator`

```js
const Home = createStackNavigator(
  {
    ExampleScreen1,
    ExampleScreen1,
  },
  {
    headerMode: 'none',
  }
);
```

#### Links

[https://github.com/jonsamp/react-native-header-scroll-view](https://github.com/jonsamp/react-native-header-scroll-view)

[Demo on expo via VaxNow](https://expo.io/@thomaswangio/vax-now)
