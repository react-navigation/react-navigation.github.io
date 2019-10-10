---
id: native-stack-navigator
title: createNativeStackNavigator
sidebar_label: createNativeStackNavigator
---

Provides a way for your app to transition between screens where each new screen is placed on top of a stack.

By default the stack navigator is configured to have the familiar iOS and Android look & feel: new screens slide in from the right on iOS, fade in from the bottom on Android. On iOS the stack navigator can also be configured to a modal style where screens slide in from the bottom.

This uses native primitives for navigation using [`react-native-screens`](https://github.com/kmagiera/react-native-screens) under the hood, as opposed to the JS based stack navigator. While this provides native feeling and performance, it's not as customizable.

Expo is currently not supported as it includes an older version of `react-native-screens`.

To use this navigator, you need to install [`@react-navigation/native-stack`](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack):

```sh
yarn add @react-navigation/core@next @react-navigation/native-stack@next
```

Now we need to install [`react-native-screens`](https://github.com/kmagiera/react-native-screens).

```sh
yarn add react-native-screens
```

To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

```sh
cd ios
pod install
cd ..
```

To finalize installation of `react-native-screens` for Android, add the following two lines to dependencies section in `android/app/build.gradle`:

```gradle
implementation 'androidx.appcompat:appcompat:1.1.0-rc01'
implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0-alpha02'
```

Make sure to enable `react-native-screens`. This needs to be done before our app renders. To do it, add the following code in your entry file (e.g. `App.js`):

```js
import { useScreens } from 'react-native-screens';

useScreens();
```

Finally, run `react-native run-android` or `react-native run-ios` to launch the app on your device/simulator.

## API Definition

To use this navigator, import it from `@react-navigation/native-stack`:

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
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

### Props

The `Stack.Navigator` component accepts following props:

#### `initialRouteName`

The name of the route to render on first load of the navigator.

#### `screenOptions`

Default options to use for the screens in the navigator.

### Options for `Stack.Screen`

The `options` prop can be used to configure individual screens inside the navigator. Supported options are:

#### `title`

String that can be used as a fallback for `headerTitle`.

#### `headerShown`

Whether to show or hide the header for the screen. The header is shown by default. Setting this to `false` hides the header.

#### `headerTitle`

String to be used by the header as title string. Defaults to scene `title`.

#### `headerBackTitle`

Title string used by the back button on iOS. Defaults to the previous scene's `headerTitle`.

#### `headerRight`

Function which returns a React Element to display on the right side of the header.

#### `headerTranslucent`

Boolean indicating whether the navigation bar is translucent. Only supported on iOS.

#### `headerLargeTitle`

Boolean to set native property to prefer large title header (like in iOS setting).  Only supported on iOS.

#### `headerTintColor`

Tint color for the header. Changes the color of back button and title.

#### `headerStyle`

Style object for the header. Supported properties:

- `backgroundColor`

#### `headerTitleStyle`

Style object for header title. Supported properties:

- `fontFamily`
- `fontSize`
- `color`

#### `headerBackTitleStyle`

Style object for header back title. Supported properties:

- `fontFamily`
- `fontSize`

#### `contentStyle`

Style object for the scene content.

#### `gestureEnabled`

Whether you can use gestures to dismiss this screen. Defaults to `true` on iOS, Only supported on iOS.

#### `presentation`

How should the screen be presented. Available options:

- `modal`
- `transparentModal`
- `push`

Defaults to `push`. Only supported on iOS.

### Events

The navigator doesn't emit any events.

## Example

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'tomato' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Awesome app',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'My profile',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
```
