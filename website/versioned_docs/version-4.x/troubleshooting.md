---
id: version-4.x-troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
original_id: troubleshooting
---

This section attempts to outline issues that can happen during setup and may not be related to React Navigation itself. Also see [common mistakes](common-mistakes.md).

## I'm getting an error "Unable to resolve module" after updating to the latest version

This might happen for 2 reasons:

- Incorrect cache of Metro bundler
- Missing peer dependency

If the module points to a local file (i.e. the name of the module starts with `./`), then it's probably due to incorrect cache. To fix this, try the following solutions.

If you're using Expo, run:

```sh
expo start -c
```

If you're not using Expo, run:

```sh
react-native start --reset-cache
```

If the module points to an npm package (i.e. the name of the module doesn't with `./`), then it's probably due to a missing peer dependency. To fix this, install the dependency in your project:

```sh
yarn add name-of-the-module
```

## I'm getting an error "null is not an object (evaluating 'RNGestureHandlerModule.default.Direction')"

This and some similar errors might occur if you didn't link the [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) library.

- **React Native 0.60 and higher**

  On newer versions of React Native, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md), so if you have linked the library manually, first unlink it:

  ```sh
  react-native unlink react-native-gesture-handler
  ```

  If you're testing on iOS, make sure you have run `pod install` in the `ios/` folder:

  ```sh
  cd ios; pod install; cd ..
  ```

- **React Native 0.59 and lower**

  If you're on an older React Native version, you need to manually link the library. To do that, run:

  ```sh
  react-native link react-native-gesture-handler
  ```

Now rebuild the app and test on your device or simulator.

## I linked RNGestureHandler library but gestures won't work on Android

This might happen if you didn't update your MainActivity.java file (or wherever you create an instance of ReactActivityDelegate), so that it uses the root view wrapper provided by this library.

Check how to do it [here](https://software-mansion.github.io/react-native-gesture-handler/docs/getting-started.html).

## Pressing buttons don't do anything

Make sure you're not connected to Chrome Debugger. When connected to Chrome Debugger, you might encounter various issues related to timing, such as button presses and animations not working correctly.
