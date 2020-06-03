---
id: limitations
title: Limitations
sidebar_label: Limitations
---

As a potential user of the library, it's important to know what you can and cannot do with it. Armed with this knowledge, you may choose to adopt [a different library instead](alternatives.md). We discuss the high level design decisions in the [pitch & anti-pitch](pitch.md) section, and here we will cover some of the use cases that are either not supported or are so difficult to do that they may as well be impossible. If any of the following limitations are dealbreakers for your app, React Navigation might not be for you.

## Limited right-to-left (RTL) layout support

We try to handle RTL layouts properly in React Navigation, however the team working on React Navigation is fairly small and we do not have the bandwidth or processes at the moment to test all changes against RTL layouts. So you might encounter issues with RTL layouts.

If you like what React Navigation has to offer but are turned off by this constraint, we encourage you to get involved and take ownership of RTL layout support. Please reach out to us on Twitter: [@reactnavigation](https://twitter.com/reactnavigation).

## Some platform-specific behavior

React Navigation does not include support for the peek & pop feature available on devices with 3D touch.
