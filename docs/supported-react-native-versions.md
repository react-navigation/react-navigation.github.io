---
id: supported-react-native-versions
title: Supported React Native versions
sidebar_label: Supported React Native versions
---

Since `react-navigation@5.x` depends on the new hooks API which is available from `react-native@^0.59.0` onwards, you'll need to be on at least `0.59.0`. If you're using Expo, your SDK version should be at least 34.

Also, `react-navigation@5.x` needs [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler#react-native-support) to work, so you will need to make sure that the version of `react-native-gesture-handler` you are using matches your current `react-native` version.

If you are using [react-native-screens](react-native-screens.html), you will need to be aware of its own supported `react-native` version too.

> Please note that the statements above may not be correct for a particular `react-native` version. If you notice a version that is not working properly, feel free to either file an [issue](https://github.com/react-navigation/react-navigation.github.io/issues/new) or correct it in this page.
