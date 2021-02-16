---
id: navigation-context
title: NavigationContext
sidebar_label: NavigationContext
---

`NavigationContext` provides the `navigation` object (similar to the [navigation](navigation-prop.md) prop). In fact, [withNavigation](with-navigation.md) uses this context to inject the `navigation` prop to your wrapped component. The [hook counterpart](https://github.com/react-navigation/react-navigation-hooks#usenavigation) is essentially an `useContext` with this context as well.

Most of the time, you won't use `NavigationContext` directly, as the provided [withNavigation](with-navigation.md) already cover most use cases. But just in case you have something else in mind, `NavigationContext` is available for you to use.
