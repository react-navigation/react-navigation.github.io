---
title: React Navigation 4.0
author: Core Team
authorURL: https://twitter.com/reactnavigation
---

The documentation is now live at https://reactnavigation.org, and v3 lives [here](/docs/en/3.x/getting-started.html).

In this release, we have removed the navigators from the `react-navigation` package. The navigators have lived in separate packages for a quite a while and you could already use those packages manually, but we still bundled them in the `react-navigation` package. This resulted in the bundled navigators not being up-to-date.

With this version, you now install the navigators from their respective packages, which means that you can independently update them.

The navigators live at:

- `createStackNavigator` - [`react-navigation-stack`](https://github.com/react-navigation/stack)
- `createBottomTabNavigator`, `createMaterialTopTabNavigator` - [`react-navigation-tabs`](https://github.com/react-navigation/tabs)
- `createDrawerNavigator` - [`react-navigation-drawer`](https://github.com/react-navigation/drawer)

For upgrade instructions, please check the [release notes](https://github.com/react-navigation/react-navigation/releases/tag/v4.0.0).

---

Thanks for reading, please post any issues you encounter to https://github.com/react-navigation/react-navigation/issues!
