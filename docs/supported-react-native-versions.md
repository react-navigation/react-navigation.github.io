---
id: supported-react-native-versions
title: Supported React Native versions
sidebar_label: Supported React Native versions
---

Since `react-navigation@3.x` depends on the new `React.createContext` API, which is added in `react@16.3.x`, we will require `react-native@^0.54.x`. Also, `react-navigation@3.x` needs [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler#react-native-support) to work, you will need to make sure that the version of `react-native-gesture-handler` you are using matches your current `react-native` version.

If you are using [react-native-screens](react-native-screens.html), you will need to be aware of its own supported `react-native` version too.

> Please note that the above speculation may not be correct in some particular `react-native` version. If you caught which version is not working properly, feel free to update about that in this page!
