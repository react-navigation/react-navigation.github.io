---
id: web-support
title: React Navigation on the Web
sidebar_label: Web support
---

> Note: Support for web is experimental and a work in progress. It has bugs, is missing many features and the API for web integration may change in minor versions. Please help us test it and open bug reports if you encounter a bug.

React Navigation's web support currently requires using [React Native for Web](https://github.com/necolas/react-native-web). This approach lets us reuse the same code on both React Native and Web.

Currently, the following features are available:

- [URL integration in browser](configuring-links.md)
- [Accessible links](link.md)
- [Server rendering](server-rendering.md)

It's important to use links as the primary way of navigation instead of navigation actions such as `navigation.navigate`. It'll ensure that your links are properly usable on web.

Some of the navigators are also configured differently on web or provide additional web specific features:

1. The [drawer](drawer-navigator.md) and [bottom tab](bottom-tab-navigator.md) navigators show hyperlinks in the drawer sidebar and tab bar respectively.
2. Swipe gestures are not available on [drawer](drawer-navigator.md) and [stack](stack-navigator.md) navigators when using on the web.
3. By default, [stack](stack-navigator.md) navigator disables page transition animations, but it can be re-enabled by specifying `animationEnabled: true`.

> Note: Unlike React Navigation 4, you don't need to install a separate package to use web integration when using React Native for Web. If you have the `@react-navigation/web` package installed, please uninstall it because it cannot be used with React Navigation 5.
