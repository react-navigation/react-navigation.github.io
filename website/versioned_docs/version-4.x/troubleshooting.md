---
id: version-4.x-troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
original_id: troubleshooting
---

This section attempts to outline issues that can happen during setup and may not be related to React Navigation itself. Also see [common mistakes](common-mistakes.html).

Before troubleshooting an issue, make sure that you have upgraded to **the latest available versions** of the packages. You can install the latest versions by installing the packages again (e.g. `npm install package-name`).

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
npx react-native start --reset-cache
```

If the module points to an npm package (i.e. the name of the module doesn't with `./`), then it's probably due to a missing peer dependency. To fix this, install the dependency in your project:

```sh
npm install name-of-the-module
```

## I'm getting an error "null is not an object (evaluating 'RNGestureHandlerModule.default.Direction')"

This and some similar errors might occur if you didn't link the [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) library.

- **React Native 0.60 and higher**

  On newer versions of React Native, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md), so if you have linked the library manually, first unlink it:

  ```sh
  react-native unlink react-native-gesture-handler
  ```

  If you're testing on iOS and use Mac, make sure you have run `pod install` in the `ios/` folder:

  ```sh
  cd ios; pod install; cd ..
  ```

- **React Native 0.59 and lower**

  If you're on an older React Native version, you need to manually link the library. To do that, run:

  ```sh
  react-native link react-native-gesture-handler
  ```

Now rebuild the app and test on your device or simulator.

## I'm getting an error "TypeError: Cannot read property 'bind' of undefined" or "TypeError: propListener.apply is not a function"

This error can often happen if you have a Babel plugin that compiles the code in a non-spec compliant way. For example:

```sh
["@babel/plugin-proposal-class-properties", { "loose": true}]
```

The above compiles class properties in `loose` mode, which is not spec compliant. To prevent such issues, avoid using any additional Babel plugins or presets which change the way Metro compiles code by default. Your `babel.config.js` should look like this:

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
};
```

Or if you're using Expo:

```js
module.exports = {
  presets: ['babel-preset-expo'],
};
```

If you have additional options configured here, try removing them to see if it fixes the issue. After changing config, always clear the cache.

If you're using Expo, run:

```sh
expo start -c
```

If you're not using Expo, run:

```sh
npx react-native start --reset-cache
```

## I linked `react-native-gesture-handler` library but gestures won't work on Android

This might happen if you didn't update your MainActivity.java file (or wherever you create an instance of ReactActivityDelegate), so that it uses the root view wrapper provided by this library.

Check how to do it [here](https://software-mansion.github.io/react-native-gesture-handler/docs/getting-started.html).

## Pressing buttons don't do anything

Make sure you're not connected to Chrome Debugger. When connected to Chrome Debugger, you might encounter various issues related to timing, such as button presses and animations not working correctly.
