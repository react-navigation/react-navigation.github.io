---
id: common-mistakes
title: Common mistakes
sidebar_label: Common mistakes
---

This section attempts to outline issues that users frequently encounter when first getting accustomed to using React Navigation and serves as a reference in some cases for error messages.

## Wrapping AppContainer in a View without flex

If you wrap the `AppContainer` in a `View`, make sure the `View` is using flex.

```js
import * as React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';

// without the style you will see a blank screen
export default () => (
  <View style={{ flex: 1 }}>
    <NavigationNativeContainer>{/* ... */}</NavigationNativeContainer>
  </View>
);
```

# Troubleshooting

This section points out issues not directly connected with React Navigation but which may occur while using it.

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

## I'm getting an error "null is not an object ( evaluating 'RNGestureHandlerModule.default.Direction')".

This and some similar errors might occur if you didn't link the RNGestureHandler library.

To fix it, run this command in your project directory:

```sh
react-native link react-native-gesture-handler
```

## I linked RNGestureHandler library but gestures won't work on Android.

This might happen if you didn't update your MainActivity.java file (or wherever you create an instance of ReactActivityDelegate), so that it uses the root view wrapper provided by this library.

Check how to do it [here](https://software-mansion.github.io/react-native-gesture-handler/docs/getting-started.html).
