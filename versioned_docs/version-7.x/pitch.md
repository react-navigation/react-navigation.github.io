---
id: pitch
title: Pitch & anti-pitch
sidebar_label: Pitch & anti-pitch
---

Choosing a navigation library means choosing its tradeoffs. This page summarizes the problems React Navigation is designed to solve, as well as cases where it may not be the right fit. Please [submit a pull request](https://github.com/react-navigation/react-navigation.github.io) if you believe we have omitted something important.

## Pitch

- **Explicit navigation graph** - Routes, nesting, groups, and navigator options are declared in code, making the navigation structure directly inspectable and independent of the filesystem.
- **Simple setup with flexible configuration** - [Static configuration](static-configuration.md) provides automatic TypeScript type inference from the navigator configuration and can generate paths for deep linking. It can also [conditionally include screens and groups](static-configuration.md#if) based on application state. For navigation structures defined at runtime, you can use [dynamic configuration](static-vs-dynamic.md) or [combine both approaches](combine-static-with-dynamic.md).
- **State-based navigation with advanced control** - The state model supports nested histories and high-level operations such as [reset](navigation-actions.md#reset), [persistence](state-persistence.md), and [preload](navigation-object.md#preload), while [actions](navigation-actions.md) and [custom routers](custom-routers.md) provide deeper control when needed.
- **URLs independent of UI structure** - Navigator nesting can change without changing public URLs, allowing the navigation UI to evolve without breaking existing links.
- **Flexible linking** - The [linking configuration](configuring-links.md) supports custom path patterns, parameter parsing, regular expressions, catch-all routes, and fully custom conversion between paths and navigation state.
- **Choice of native or JavaScript implementations** - [Native Stack](native-stack-navigator.md) and [Native Bottom Tabs](native-bottom-tab-navigator.md) use platform navigation primitives. JavaScript implementations provide more control over UI, animations, and gestures, and are easier to debug, customize, and update over the air.
- **Extensible building blocks** - [Custom navigators](custom-navigators.md) and [custom routers](custom-routers.md) integrate with the same navigation actions, deep linking, state persistence, and nesting used by built-in navigators.
- **React Native and Web** - The same navigation model works across React Native and [Web](web-support.md). On Web, React Navigation integrates with URLs, browser history, links, and accessibility features.
- **Works with Expo and Community CLI** - React Navigation doesn't require Expo or a particular project structure.

## Anti-pitch

- **No file-based routing** - Routes are configured in code rather than generated from the filesystem. React Navigation doesn't provide automatic route discovery.
- **Not a full-stack framework** - As a navigation library, React Navigation doesn't provide application framework features such as API routes, server middleware, or bundler integration for automatic code splitting.
- **Limited web rendering infrastructure** - Web support is primarily designed for client-rendered apps and PWAs. [Server rendering](server-rendering.md) requires manual setup and has limitations, and static rendering isn't built in. A web-focused framework may be a better fit when rendering infrastructure and SEO are primary requirements.
- **JavaScript navigators don't exactly reproduce native behavior** - Their transitions, gestures, and lifecycle behavior may differ from the platform's native navigation components. If exact platform behavior is required, use a navigator backed by native primitives or consider a library with fully native navigation APIs, such as [React Native Navigation](https://github.com/wix/react-native-navigation).
- **Native navigators have customization constraints** - Their behavior and customization are limited to what the underlying platform components expose. Features available to JavaScript navigators may not be available to their native counterparts.
- **Native dependencies may require native builds** - Some navigators depend on native libraries such as [Screens](https://github.com/software-mansion/react-native-screens), [Reanimated](https://docs.swmansion.com/react-native-reanimated/), and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/). Installing or updating their native code requires a new app build and cannot be delivered over the air.
