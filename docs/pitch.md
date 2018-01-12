---
id: pitch
title: Pitch & anti-pitch
sidebar_label: Pitch & anti-pitch
---

It's useful when considering whether or not to use a project to understand the tradeoffs that the developers of the project made when building it. What problems does it explicitly try to solve for you, and which ones does it ignore? What are the current limitations of the project and common problems that people encounter? These are the kinds of questions that we believe you should have answers to when making an important technology decision for your project, and so we have documented answers to these questions as best we can here, in the form of a "pitch" (why you should use it) and "anti-pitch" (why you should not use it). Please [submit a pull request](https://github.com/react-navigation/website) if you believe we have omitted important information!

## Pitch

- Everything is written in JavaScript on top of React Native primitives &mdash; for example, animations use the `Animated` API and its native driver option in order to run the animations on the main thread and produce smooth 60 fps transitions. Writing everything except the low-level primitives like animations and gestures in JavaScript has a lot of benefits:
  - Easy OTA updates
  - Debuggable
  - Customizable
- Most apps heavily customize navigation, to do this with an API that wraps native navigation you will need to write a lot of native code.
- It's easy to write your own navigators that integrate cleanly with standard navigators, or to fork the standard navigators and create your own version of them with the exact look and feel you want in your app.

## Anti-pitch

- The API is sometimes unintuitive and difficult to use, improvements may require breaking changes. We are working to make ["easy things easy and hard things possible"](https://www.quora.com/What-is-the-origin-of-the-phrase-make-the-easy-things-easy-and-the-hard-things-possible) and this may require us to change the API at times.
- React Navigation does not directly use the native navigation APIs on iOS and Android; rather, it re-creates some subset of those APIs. This a conscious choice in order to make it possible for users to customize any part of the navigation experience (because it's implemented in JavaScript) and to be able to debug issues that they encounter without needing to learn Objective C / Swift / Java / Kotlin.
  - If you need the exact platform behavior you are better off using another library that wraps the platform APIs. Read more about these in [Alternatives](alternatives.html) and be sure to understand the tradeoffs that they make before digging in!
  - Another 
- Because much of the logic for React Navigation runs in JavaScript rather than in native, the usual concerns about blocking the JavaScript thread come into play.