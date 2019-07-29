---
id: version-3.x-getting-started
title: Getting started
sidebar_label: Getting started
original_id: getting-started
---

React Navigation is born from the React Native community's need for an extensible yet easy-to-use navigation solution written entirely in JavaScript (so you can read and understand all of the source), on top of powerful native primitives.

Before you commit to using React Navigation for your project, you might want to read the [anti-pitch](pitch.html) &mdash; it will help you to understand the tradeoffs that we have chosen along with the areas where we consider the library to be deficient currently.

## What to expect

If you're already familiar with React Native then you'll be able to get moving with React Navigation quickly! If not, you may want to read sections 1 to 4 (inclusive) of [React Native Express](http://reactnativeexpress.com/) first, then come back here when you're done.

What follows within the _Fundamentals_ section of this documentation is a tour of the most important aspects of React Navigation. It should cover enough for you to know how to build your typical small mobile application, and give you the background that you need to dive deeper into the more advanced parts of React Navigation.

## Installation

Install the `react-navigation` package in your React Native project.

```bash
yarn add react-navigation
# or with npm
# npm install react-navigation
```

Next, install `react-native-gesture-handler` and `react-native-reanimated`.

If you're using Expo, to ensure that you get the compatible versions of the libraries you should run:

```bash
expo install react-native-gesture-handler react-native-reanimated
```

Otherwise, just use yarn or npm directly:

```bash
yarn add react-native-gesture-handler react-native-reanimated
# or with npm
# npm install react-native-gesture-handler react-native-reanimated
```

Next, if you are not using the Expo managed workflow then you need to link these libraries if you haven't already. The steps depends on your React Native version:

- **React Native 0.60 and higher**

  On newer versions of React Native, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

  On iOS, to complete the linking, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

  ```sh
  cd ios
  pod install
  cd ..
  ```

  On Android, it shouldn't need any more steps. But if you get errors regarding Android Support library during building the app, you need to install and configure [jetifier](https://github.com/mikehardy/jetifier).

- **React Native 0.59 and lower**

  If you're on an older React Native version, you need to manually link the dependencies. To do that, run:

  ```sh
  react-native link react-native-reanimated
  react-native link react-native-gesture-handler
  ```

To finalize installation of `react-native-gesture-handler` for Android, be sure to make the necessary modifications to `MainActivity.java`:

```diff
package com.reactnavigation.example;

import com.facebook.react.ReactActivity;
+ import com.facebook.react.ReactActivityDelegate;
+ import com.facebook.react.ReactRootView;
+ import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Example";
  }

+  @Override
+  protected ReactActivityDelegate createReactActivityDelegate() {
+    return new ReactActivityDelegate(this, getMainComponentName()) {
+      @Override
+      protected ReactRootView createRootView() {
+       return new RNGestureHandlerEnabledRootView(MainActivity.this);
+      }
+    };
+  }
}
```

Finally, run `react-native run-android` or `react-native run-ios` to launch the app on your device/simulator.

## Hybrid iOS Applications (Skip for RN only projects)

If you're using React Navigation within a hybrid app - an iOS app that has both Swift/ObjC and React Native parts - you may be missing the `RCTLinkingIOS` subspec in your Podfile, which is installed by default in new RN projects. To add this, ensure your Podfile looks like the following:

```
 pod 'React', :path => '../node_modules/react-native', :subspecs => [
    . . . // other subspecs
    'RCTLinkingIOS',
    . . .
  ]
```

You're good to go! Continue to ["Hello React Navigation"](hello-react-navigation.html) to start writing some code.
