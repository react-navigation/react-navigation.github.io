---
id: native-stack-navigator
title: createNativeStackNavigator
sidebar_label: createNativeStackNavigator
---

Provides a way for your app to transition between screens where each new screen is placed on top of a stack.

This navigator uses the native APIs `UINavigationController` on iOS and `Fragment` on Android so that navigation built with `createNativeStackNavigator` will behave exactly the same and have the same performance characteristics as apps built natively on top of those APIs.

The tradeoff is that `createNativeStackNavigator` isn't quite as customizable, so sometimes you may want to use `createStackNavigator` instead in order to achieve the exact appearance or behaviour that you desire for your app.

This navigator does not currently support web. Use `createStackNavigator` for the web navigation in your app instead.

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md).

## API Definition

> 💡 If you encounter any bugs while using `createNativeStackNavigator`, please open isues on [react-native-screens](https://github.com/software-mansion/react-native-screens) rather than the react-navigation repository!

To use this navigator, import `enableScreens` from `react-native-screens` and invoke it, and import `createNativeStackNavigator` from `react-native-screens/native-stack`:

<samp id="simple-native-stack" />

```js
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

enableScreens();
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
```

For the full, up-to-date API reference, please refer to the README for [react-native-screens/native-stack](https://github.com/software-mansion/react-native-screens/tree/master/native-stack).
