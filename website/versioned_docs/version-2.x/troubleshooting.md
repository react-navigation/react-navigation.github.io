---
id: version-2.x-troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
original_id: troubleshooting
---

Here you can find some solutions of common issues. These are not the library's bugs or your mistakes.

### Android back button after using core-js `Symbol` polyfill

Related issue: https://github.com/react-navigation/react-navigation/issues/5171

This is due to the fact that by default in older `react-native` versions (`<=0.59.0`), the Javascript engine used in Android (JSC) was really outdated and missing some new and important features such as `Symbol`. However, you can easily upgrade the JSC yourself according to [this guide](https://github.com/react-community/jsc-android-buildscripts)

> Please note that from `react-native@^0.59.0` and `expo@^31.0.0` the newer JSC Engine for Android is already included by default so you don't have to do anything :)