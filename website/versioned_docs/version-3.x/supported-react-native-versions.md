---
id: version-3.x-supported-react-native-versions
title: Supported React Native versions
sidebar_label: Supported React Native versions
original_id: supported-react-native-versions
---

Since `react-navigation@3.x` depends on the new `React.createContext` API, which was added in `react@16.3.x`, we require `react-native@^0.54.x`. Also, `react-navigation@3.x` needs [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler#react-native-support) to work, so you will need to make sure that the version of `react-native-gesture-handler` you are using matches your current `react-native` version.

If you are using [react-native-screens](react-native-screens.html), you will need to be aware of its own supported `react-native` version too.

> Please note that the statements above may not be correct for a particular `react-native` version. If you notice a version that is not working properly, feel free to either file an [issue](https://github.com/react-navigation/react-navigation.github.io/issues/new) or correct it in this page.
