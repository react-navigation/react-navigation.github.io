---
id: navigation-lifecycle
title: Navigation lifecycle
sidebar_label: Navigation lifecycle
---

In the previous section, we worked with a stack navigator that has two screens (`Home` and `Details`) and learned how to use `this.props.navigation.navigate('RouteName')` to navigate between the routes.

An important question in this context is: what happens with `Home` when we navigate away from it, or when we come back to it? How does a route find out that a user is leaving it or coming back to it?

Coming to React Navigation from the web, you may assume that when user navigates from route `A` to route `B`, `A` will unmount and its `componentWillUnmount` will be called. You may also expect `A` will remount again when user comes back to it. While these React lifecycle methods are still valid and are used in React Navigation, their usage differs from the web. This is driven by more complex needs of mobile navigation.

## Example scenario

Consider a stack navigator with screens `A` and `B`. After navigating to `A`, its `componentDidMount` is called. When pushing `B`, its `componentDidMount` is also called, but `A` remains mounted on the stack and its `componentWillUnmount` is therefore not called.

When going back from `B` to `A`, `componentWillUnmount` of `B` is called, but `componentDidMount` of `A` is not because `A` remained mounted the whole time.

## Subscribing to lifecycle events

Now that we understand how React lifecycle methods work in React Navigation, let's answer the question we asked at the beginning: "How do we find out that a user is leaving it or coming back to it?"

React Navigation emits events to screen components that subscribe to them. There are four different events that you can subscribe to: `willFocus`, `willBlur`, `didFocus` and `didBlur`. Read more about them in the [API reference](navigation-prop.md#addlistener---subscribe-to-updates-to-navigation-lifecycle).

Many of your use cases may be covered with the [`withNavigationFocus` higher-order-component](with-navigation-focus.md), the [`<NavigationEvents />` component](navigation-events.md), or the [useFocusState hook](https://github.com/react-navigation/hooks#usefocusstate).

## Summary

- While Reacts lifecycle methods are still valid, React Navigation adds more lifecycle events that you can subscribe to through the `navigation` prop.
- You may also use the `withNavigationFocus` HOC or `<NavigationEvents />` component to react to lifecycle changes.
