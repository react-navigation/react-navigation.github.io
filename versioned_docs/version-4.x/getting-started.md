---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

React Navigation is born from the React Native community's need for an extensible yet easy-to-use navigation solution written entirely in JavaScript (so you can read and understand all of the source), on top of powerful native primitives.

Before you commit to using React Navigation for your project, you might want to read the [anti-pitch](pitch.md) &mdash; it will help you to understand the tradeoffs that we have chosen along with the areas where we consider the library to be deficient currently.

## What to expect

If you're already familiar with React Native then you'll be able to get moving with React Navigation quickly! If not, you may want to read sections 1 to 4 (inclusive) of [React Native Express](http://reactnativeexpress.com/) first, then come back here when you're done.

What follows within the _Fundamentals_ section of this documentation is a tour of the most important aspects of React Navigation. It should cover enough for you to know how to build your typical small mobile application, and give you the background that you need to dive deeper into the more advanced parts of React Navigation.

## Start from a template

The easiest way to get running with `react-navigation` is to initialize a project using `expo-cli`. You can install this with `npm i -g expo-cli`.

- If you'd like to create a [managed React Native project](https://docs.expo.io/versions/latest/introduction/managed-vs-bare) then choose the `blank` template under the Managed workflow heading.
- If you'd like a [bare React Native project](https://docs.expo.io/versions/latest/introduction/managed-vs-bare/#bare-workflow), then choose `minimal` under the Bare workflow heading.
- In both cases you can pick the TypeScript version of the template if you prefer &mdash; React Navigation ships with TypeScript types.

Once the project is initialized, in the project directory run `expo install react-navigation react-native-gesture-handler react-native-reanimated react-native-screens`, and you're ready to go! You can now continue to ["Hello React Navigation"](hello-react-navigation.md) to start writing some code.

## Install into an existing project

Install the `react-navigation` package in your React Native project.

```bash npm2yarn
npm install react-navigation
```

React Navigation is made up of some core utilities and those are then used by navigators to create the navigation structure in your app. Don't worry too much about this for now, it'll become clear soon enough! To frontload the installation work, let's also install and configure dependencies used by most navigators, then we can move forward with starting to write some code.

The libraries we will install now are [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler), [`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated), [`react-native-screens`](https://github.com/software-mansion/react-native-screens) and [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context). If you already have these libraries installed and at the latest version, you are done here! Otherwise, read on.

#### Installing dependencies into an Expo managed project

In your project directory, run:

```sh
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

This will install versions of these libraries that are compatible.

You can now continue to ["Hello React Navigation"](hello-react-navigation.md) to start writing some code.

#### Installing dependencies into a bare React Native project

In your project directory, run:

```bash npm2yarn
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

> Note: You might get warnings related to peer dependencies after installation. They are usually caused by incorrect version ranges specified in some packages. You can safely ignore most warnings as long as your app builds.

Next, we need to link these libraries. The steps depends on your React Native version:

- **React Native 0.60 and higher**

  On newer versions of React Native, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

  If you're on a Mac and developing for iOS, you need to install pods to complete the linking. Make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

  ```sh
  cd ios; pod install; cd ..
  ```

- **React Native 0.59 and lower**

  If you're on an older React Native version, you need to manually link the dependencies. To do that, run:

  ```sh
  react-native link react-native-reanimated
  react-native link react-native-gesture-handler
  react-native link react-native-screens
  react-native link react-native-safe-area-context
  ```

  You also need to configure [jetifier](https://github.com/mikehardy/jetifier) to support dependencies using `androidx`:

  ```bash npm2yarn
  npm install --save-dev jetifier
  ```

  Then add it to the `postinstall` script in `package.json`:

  ```json
  "scripts": {
    "postinstall": "jetifier -r"
  }
  ```

  > Note: Remember to remove this when you upgrade to React Native 0.60 and higher.

  Now, run the `postinstall` script manually:

  ```sh
  npm run postinstall
  ```

To finalize installation of `react-native-gesture-handler` for Android, make the following modifications to `MainActivity.java`:

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
+        return new RNGestureHandlerEnabledRootView(MainActivity.this);
+      }
+    };
+  }
}
```

Then add the following at the top of your entry file, such as `index.js` or `App.js`:

```js
import 'react-native-gesture-handler';
```

> Note: When you use a navigator (such as stack navigator), you'll need to follow the installation instructions of that navigator for any additional dependencies. If you're getting an error "Unable to resolve module", you need to install that module in your project.

Now you are ready to build and run your app on the device/simulator.

Continue to ["Hello React Navigation"](hello-react-navigation.md) to start writing some code.
