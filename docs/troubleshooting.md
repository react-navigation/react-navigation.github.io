---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

This section attempts to outline issues that users frequently encounter when first getting accustomed to using React Navigation. These issues may or may not be related to React Navigation itself.

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
npm install name-of-the-module
```

## I'm getting "SyntaxError in @react-navigation/xxx/xxx.tsx"

This might happen if you have an old version of the `metro-react-native-babel-preset` package. The easiest way to fix it is to delete your lock file and reinstall your dependencies.

If you use `npm`:

```sh
rm package-lock.json
npm install
```

If you use `yarn`:

```sh
rm yarn.lock
yarn
```

## I'm getting an error "null is not an object (evaluating 'RNGestureHandlerModule.default.Direction')"

This and some similar errors might occur if you didn't link the [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) library.

Linking is automatic from React Native 0.60, so if you have linked the library manually, first unlink it:

```sh
react-native unlink react-native-gesture-handler
```

If you're testing on iOS, make sure you have run `pod install` in the `ios/` folder:

```sh
cd ios; pod install; cd ..
```

Now rebuild the app and test on your device or simulator.

## I linked RNGestureHandler library but gestures won't work on Android

This might happen if you didn't update your MainActivity.java file (or wherever you create an instance of ReactActivityDelegate), so that it uses the root view wrapper provided by this library.

Check how to do it [here](https://software-mansion.github.io/react-native-gesture-handler/docs/getting-started.html).

## Pressing buttons don't do anything

Make sure you're not connected to Chrome Debugger. When connected to Chrome Debugger, you might encounter various issues related to timing, such as button presses and animations not working correctly.

## Nothing is visible on the screen after adding a `View`

If you wrap the container in a `View`, make sure the `View` stretches to fill the container using `flex: 1`:

```js
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>{/* ... */}</NavigationContainer>
    </View>
  );
}
```
