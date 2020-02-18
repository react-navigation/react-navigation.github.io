---
id: version-3.x-navigation-views
title: Navigation views
sidebar_label: Navigation views
original_id: navigation-views
---

Navigation views are presentation components that take a [`router`](routers.html) and a [`navigation`](navigation-prop.html) prop, and can display several screens, as specified by the `navigation.state`.

Navigation views are controlled React components that can present the current navigation state. They manage switching of screens, animations and gestures. They also present persistent navigation views such as tab bars and headers.

## Built in Views

- [StackView](https://github.com/react-navigation/stack/blob/1.0/src/views/StackView/StackView.tsx) - Present a stack that looks suitable on any platform
    + [StackViewCard](https://github.com/react-navigation/stack/blob/1.0/src/views/StackView/StackViewCard.tsx) - Present one card from the card stack, with gestures
    + [Header](https://github.com/react-navigation/stack/blob/1.0/src/views/Header/Header.tsx) - The header view for the card stack
- [SwitchView](https://github.com/react-navigation/core/blob/ad6e5cecccb8bce081f773fdff7af000e0450746/src/views/SwitchView/SwitchView.js) - A navigator that only ever show one screen at a time, useful for authentication flows.
- [Tabs](https://github.com/react-navigation/tabs) - A configurable tab switcher / pager
- [Drawer](https://github.com/react-navigation/drawer) - A view with a drawer that slides from the left


## [Transitioner](transitioner.html)

`Transitioner` manages the animations during the transition and can be used to build fully custom navigation views. It is used inside the `StackView` view. [Learn more about Transitioner here.](transitioner.html)
