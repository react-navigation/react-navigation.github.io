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

The [drawer navigator](drawer-navigator.md) and [bottom tab navigator](bottom-tab-navigator.md) also have additional integration to provide a better experience on web by showing hyperlinks. The [stack navigator](stack-navigator.md) also disables gestures and animations on web because they don't integrate well with the platform.
