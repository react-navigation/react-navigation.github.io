---
id: getting-started
title: Getting started
sidebar_label: Getting started
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

Next, install react-native-gesture-handler. If you’re using the [Expo managed workflow](https://docs.expo.io/versions/latest/introduction/managed-vs-bare/) then you don’t need to do anything here, it’s included in the SDK. Otherwise:

```bash
yarn add react-native-gesture-handler
# or with npm
# npm install react-native-gesture-handler
```

Then run the following to link it:

```bash
react-native link react-native-gesture-handler
```

No additional steps are required for iOS.

To finalise installation of react-native-gesture-handler for Android, be sure to make the necessary modifications to `MainActivity.java`:

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

If you're on React Native >= 0.60, you also need to do the following:

[Disable autolinking for `react-native-gesture-handler`](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md#how-can-i-disable-autolinking-for-unsupported-library). To disable autolinking for it, create a `react-native.config.js` file in the root of your project with the following content:

```js
module.exports = {
  dependencies: {
    'react-native-gesture-handler': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
```

Use [jetifier](https://github.com/mikehardy/jetifier) to work around libraries using the support library on Android:

Add `jetify` under `scripts.postinstall` in your `package.json`:

```json
"scripts": {
  "postinstall": "jetify"
}
```

Then install it:

```sh
yarn add --dev jetifier
# or with npm
# npm install react-navigation
```

Finally, run `react-native run-android` or `react-native run-ios` to launch the app on your device/simulator.

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
