---
id: version-5.x-limitations
title: Limitations
sidebar_label: Limitations
original_id: limitations
---

As a potential user of the library, it's important to know what you can and cannot do with it. Armed with this knowledge, you may choose to adopt [a different library instead](alternatives.html). We discuss the high level design decisions in the [pitch & anti-pitch](pitch.html) section, and here we will cover some of the use cases that are either not supported or are so difficult to do that they may as well be impossible. If any of the following limitations are dealbreakers for your app, React Navigation might not be for you.

## Performance limitations

React Navigation implements animations and gestures using [Reanimated](https://software-mansion.github.io/react-native-reanimated/) and [Gesture Handler](https://kmagiera.github.io/react-native-gesture-handler/) which run in the native thread. This makes sure that the animations and gestures are smooth even if the JavaScript thread is blocked. However, you might still experience frame drops when rendering expensive components which render or update many complex views since rendering also happens on the same thread that the animations run in. We're also limited by the performance of Reanimated and Gesture Handler libraries.

The new [native stack navigator](native-stack-navigator.html) uses the platform navigation primitives. While the customization options are limited with it, you'll get much better performance with it.

## Right-to-left (RTL) layout support

We try to handle RTL layouts properly in React Navigation, however the team working on React Navigation is fairly small and we do not have the bandwidth or processes at the moment to test all changes against RTL layouts. So you might encounter issues with RTL layouts.

If you like what React Navigation has to offer but are turned off by this constraint, we encourage you to get involved and take ownership of RTL layout support. Please reach out to us on Twitter: [@reactnavigation](https://twitter.com/reactnavigation).

## Some platform-specific behavior

React Navigation doesn't support master-detail split-views on iPad yet. If you need this feature, you may want to use another library, although you can build it yourself if you like.

React Navigation does not include support for the peek & pop feature available on devices with 3D touch.
