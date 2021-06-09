---
id: react-native-screens
title: Optimize memory usage and performance
sidebar_label: Optimize memory usage and performance
---

Prior to `2.14.0`, all screens are essentially regular native `View` in each platform, which will increase memory usage and make the render tree deep in a heavy-stacked application. This is one of the reason your app is slowing down comparing to native navigation solution.

With the advent of `react-native-screens`, the native screen optimization is brought possible to React Navigation by bringing the native navigation component (`UIViewController` for iOS, and `FragmentActivity` for Android). By using `react-native-screens`, it is possible for each native platform to optimize the memory usage for screens that are under the view stack and also simplify the native node hierarchy. You can take a look at the comparison [here](https://twitter.com/janicduplessis/status/1039979591815897088?s=21) to see the performance gain.

React Navigation 6 incorporates `react-native-screens` in version >=3.0.0 which means the optimizations are already enabled by default.
## Setup when you are using Expo

Expo SDK 41 and up comes with `react-native-screens` that works out-of-the-box without additional configuration. If you installed dependencies with `expo install` as stated in [Getting started](http://localhost:3000/docs/6.x/getting-started#installing-dependencies-into-an-expo-managed-project) section of documentation you are good to go!

## Setup in normal react-native applications

### Setup on iOS

The installation of `react-native-screens` on iOS is supported by auto-linking, if you made sure the pods are installed with `pod install` in project directory, no other actions are necessary.

### Setup on Android

This change is required to avoid crashes related to View state being not persisted consistently across Activity restarts.

You'll need to edit `MainActivity.java` which is located in `android/app/src/main/java/<your package name>/MainActivity.java` file.

Add this method to the body of `MainActivity` class:
```java
@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(null);
}
```

and make sure to add an import statement at the top of the file:

```java
import android.os.Bundle;
```

and that's everything!

For more information consult installation instructions in [react-native-screens](https://github.com/software-mansion/react-native-screens#installation) repository.
