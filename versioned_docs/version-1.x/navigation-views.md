---
id: navigation-views
title: Navigation views
sidebar_label: Navigation views
---

Navigation views are presentation components that take a [`router`](routers.md) and a [`navigation`](navigation-prop.md) prop, and can display several screens, as specified by the `navigation.state`.

Navigation views are controlled React components that can present the current navigation state. They manage switching of screens, animations and gestures. They also present persistent navigation views such as tab bars and headers.

## Built in Views

- [CardStack](https://github.com/react-navigation/react-navigation/blob/1.x/src/views/CardStack/CardStack.js) - Present a stack that looks suitable on any platform
    + [Card](https://github.com/react-navigation/react-navigation/blob/1.x/src/views/CardStack/Card.js) - Present one card from the card stack, with gestures
    + [Header](https://github.com/react-navigation/react-navigation/blob/1.x/src/views/Header/Header.js) - The header view for the card stack
- [Tabs](https://github.com/react-navigation/react-navigation/blob/1.x/src/views/TabView/TabView.js) - A configurable tab switcher / pager
- [Drawer](https://github.com/react-navigation/react-navigation/blob/1.x/src/views/Drawer/DrawerView.js) - A view with a drawer that slides from the left


## [Transitioner](transitioner.md)

`Transitioner` manages the animations during the transition and can be used to build fully custom navigation views. It is used inside the `CardStack` view. [Learn more about Transitioner here.](transitioner.md)
