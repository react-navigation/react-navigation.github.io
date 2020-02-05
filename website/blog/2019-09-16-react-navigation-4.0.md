---
title: React Navigation 4.0
author: Satyajit Sahoo
authorURL: https://twitter.com/satya164
---

The documentation is now live at https://reactnavigation.org, and v3 lives [here](/docs/en/3.x/getting-started.html).

In this release, we have removed the navigators from the react-navigation package. The navigators have lived in separate packages for quite a while and you could already use those packages manually, but we still bundled them in the react-navigation package. This made it difficult for us to release significant updates to navigators, because we had to then do a major version release of react-navigation too. By separating the navigator packages there is more freedom to update and improve navigators without any impact on folks that don't use them.

For example, you will find when you install the latest versions of the drawer and tab navigators that the animations are more performant because they use react-native-reanimated to smoothly animate gestures. These have been available in react-navigation-drawer and react-navigation-tabs for several months now but we delayed updating them in react-navigation itself because we did not want to force every user to update.

With this version, you now install the navigators from their respective packages, which means that you can independently update them.

The navigators live at:

- `createStackNavigator` - [`react-navigation-stack`](https://github.com/react-navigation/stack)
- `createBottomTabNavigator`, `createMaterialTopTabNavigator` - [`react-navigation-tabs`](https://github.com/react-navigation/tabs)
- `createDrawerNavigator` - [`react-navigation-drawer`](https://github.com/react-navigation/drawer)

For upgrade instructions, please check the [release notes](https://github.com/react-navigation/react-navigation-4/releases/tag/v4.0.0).

If you're using TypeScript, navigator specific types were also removed from the main package. We've mentioned the replacement types in the release notes. But if you are still having problems, please open an issue and let us know.

---

Thanks for reading, please post any issues you encounter to https://github.com/react-navigation/react-navigation-4/issues!
