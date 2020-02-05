---
id: version-5.x-react-native-screens
title: Optimize memory usage and performance
sidebar_label: Optimize memory usage and performance
original_id: react-native-screens
---

Prior to `2.14.0`, all screens are essentially regular native `View` in each platform, which will increase memory usage and make the render tree deep in a heavy-stacked application. This is one of the reason your app is slowing down comparing to native navigation solution.

With the advent of `react-native-screens`, the native screen optimization is brought possible to React Navigation by bringing the native navigation component (`UIViewController` for iOS, and `FragmentActivity` for Android). By using `react-native-screens`, it is possible for each native platform to optimize the memory usage for screens that are under the view stack and also simplify the native node hierarchy. You can take a look at the comparison [here](https://twitter.com/janicduplessis/status/1039979591815897088?s=21) to see the performance gain.

## Setup when you are using Expo

By default expo already included `react-native-screens`, all you need to do is pasting the following snippet before your navigation stacks are rendered (typically in an `index.js` or `App.js` file):

```js
// Before rendering any navigation stack
import { useScreens } from 'react-native-screens';
useScreens();
```

## Setup in normal react-native applications

You will need to follow the installation instruction from [react-native-screens](https://github.com/kmagiera/react-native-screens) first. After that, you can import the library like mentioned above and enjoy the optimization.
