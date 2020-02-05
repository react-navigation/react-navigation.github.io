---
title: React Navigation meets native
author: Michał Osadnik
authorURL: https://twitter.com/mosdnk
---

React Navigation steps firmly into the next level and we’re very excited to announce to you something great happening in React Navigation codebase.

## Make it custom

From the very beginning of React Navigation we have been following the important motto to make navigation experience customizable in every detail. We, front-end engineers, mobile developers and User Experience lovers, have a deep need to make decisions about each layout component.

Guided by this idea we (well, not necessarily “we” because I haven’t even written a single line of code this time 😄) made architectural decisions, which might appear controversial for developers with the native background.

We have decided to write React Navigation only in JavaScript replicating native animations and interactions. This is the main decision making our solution very different from other React Native navigation libraries (like [React Native Navigation](https://wix.github.io/react-native-navigation) by Wix or [The Navigation Router](https://grahammendick.github.io/navigation/) by Graham Mendick).

But… why? What’s the purpose of reinventing the wheel?

Firstly, because JavaScript implementation can be more customizable. It’s easy to maintain and develop new features. Additionally, being independent of native code makes our codebase more reliable.

Furthermore, it’s easy not only for maintainers but also for developers using our library. No need for native setup makes it super simple to start developing and integrating with the existing (e.g. brownfield) app. Eventually, a very wide range of customizations makes it a great solution for developers with very high UX requirements.

The above reasons have made React Navigation navigation super popular among a number of developers but…

After years of growing development, we need to admit that we’re not always able to deliver an exactly native-like experience, especially when it comes to stack navigation. We also see a ton of users that use just a few ways of customization React Navigation offers…

## **Native reveal**

…so, we have decided to export native stack (*FragmentTransaction *on Android and *UINavigationController *on iOS) in order to deliver an even better experience.

Thanks to the great work of Krzysztof Magiera for [React Native Screens](https://github.com/kmagiera/react-native-screens) library now we can use truly native components instead of JS replicas.

<img src="/blog/assets/android-native-stack.gif" height="530" />
<img src="/blog/assets/ios-native-stack.gif" height="530" />

We believe you will find it useful in your projects and strongly encourage you to get acquainted with our [documentation](https://reactnavigation.org/docs/en/next/native-stack-navigator.html). Things that I’m the most excited about are iOS header animations!

Please, note that we don’t intend this component to be a drop-off replacement for the currently existing stack. There are many benefits of using JavaScript-based stack. Moreover, the range of customization of the native stack is very limited and probably won’t get broader due to the limitations of native API.

Native Stack is available in the new 5.0 alpha API and with [Satyajit](https://github.com/satya164)’s help, I have managed to release the first version of the [library](https://www.npmjs.com/package/@react-navigation/native-stack) a few days ago. It’s in alpha so don’t expect everything to be perfect, but… don’t hesitate to submit a [PR](https://github.com/react-navigation/react-navigation/pulls) and help us grow React Navigation!
