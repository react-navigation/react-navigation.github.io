---
id: navigation-views
title: Navigation views
sidebar_label: Navigation views
---

Navigation views are presentation components that take a [`router`](routers.md) and a [`navigation`](navigation-prop.md) prop, and can display several screens, as specified by the `navigation.state`.

Navigation views are controlled React components that can present the current navigation state. They manage switching of screens, animations and gestures. They also present persistent navigation views such as tab bars and headers.

## Built in Views

- [StackView](https://github.com/react-navigation/react-navigation/blob/4.x/packages/stack/src/views/StackView.tsx) - Present a stack that looks suitable on any platform
  - [StackViewCard](https://github.com/react-navigation/stack/blob/1.0/src/views/StackView/StackViewCard.tsx) - Present one card from the card stack, with gestures
  - [Header](https://github.com/react-navigation/stack/blob/1.0/src/views/Header/Header.tsx) - The header view for the card stack
- [SwitchView](https://github.com/react-navigation/react-navigation/blob/4.x/packages/core/src/views/SwitchView/SwitchView.js) - A navigator that only ever show one screen at a time, useful for authentication flows.
- [Tabs](https://github.com/react-navigation/react-navigation/tree/4.x/packages/tabs) - A configurable tab switcher / pager
- [Drawer](https://github.com/react-navigation/react-navigation/tree/4.x/packages/drawer) - A view with a drawer that slides from the left
