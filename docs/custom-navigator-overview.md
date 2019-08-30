---
id: custom-navigator-overview
title: Overview
sidebar_label: Overview
---

Navigators allow you to define your application's navigation structure. Navigators also render common elements such as headers and tab bars which you can configure.

Under the hood, navigators are plain React components.

## Built-in Navigators

`react-navigation` includes some commonly needed navigators such as:

- [createStackNavigator](stack-navigator.html) - Renders one screen at a time and provides transitions between screens. When a new screen is opened it is placed on top of the stack.
- [createBottomTabNavigator](bottom-tab-navigator.html) - Renders a tab bar that lets the user switch between several screens.
- [createSwitchNavigator](switch-navigator.html) - Switch between one screen and another with no UI on top of it, unmount screens when they become inactive.
- [createDrawerNavigator](drawer-navigator.html) - Provides a drawer that slides in from the left of the screen.

## Rendering screens with Navigators

The navigators render application screens which are just React components.

To learn how to create screens, read about:

#TODO - not sure?

- [Screen `navigation` prop](navigation-prop.html) to allow the screen to dispatch navigation actions, such as opening another screen
- Screen `navigationOptions` to customize how the screen gets presented by the navigator (e.g. [header title](stack-navigator.html#navigationoptions-used-by-stacknavigator), tab label)
