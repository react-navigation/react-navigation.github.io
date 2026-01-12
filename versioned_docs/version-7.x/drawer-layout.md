---
id: drawer-layout
title: React Native Drawer Layout
sidebar_label: Drawer Layout
---

A cross-platform Drawer component for React Native implemented using [`react-native-gesture-handler`](https://docs.swmansion.com/react-native-gesture-handler/) and [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) on native platforms and CSS transitions on Web.

<video playsInline autoPlay muted loop>
  <source src="/assets/7.x/drawer-layout.mp4" />
</video>

This package doesn't integrate with React Navigation. If you want to integrate the drawer layout with React Navigation's navigation system, e.g. want to show screens in the drawer and be able to navigate between them using `navigation.navigate` etc, use [Drawer Navigator](drawer-navigator.md) instead.

## Installation

To use this package, open a Terminal in the project root and run:

```bash npm2yarn
npm install react-native-drawer-layout
```

The library depends on [`react-native-gesture-handler`](https://docs.swmansion.com/react-native-gesture-handler/) for gestures and [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) for animations.

<Tabs groupId='framework' queryString="framework">
<TabItem value='expo' label='Expo' default>

If you have a Expo managed project, in your project directory, run:

```bash
npx expo install react-native-gesture-handler react-native-reanimated react-native-worklets
```

</TabItem>
<TabItem value='community-cli' label='Community CLI'>

If you have a bare React Native project, in your project directory, run:

```bash npm2yarn
npm install react-native-gesture-handler react-native-reanimated react-native-worklets
```

After installation, configure the Reanimated Babel Plugin in your project following the [installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started).

</TabItem>
</Tabs>

If you're on a Mac and developing for iOS, you also need to install [pods](https://cocoapods.org/) to complete the linking.

```bash
npx pod-install ios
```

## Quick start

```js
import * as React from 'react';
import { Text } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { Button } from '@react-navigation/elements';

export default function DrawerExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return <Text>Drawer content</Text>;
      }}
    >
      <Button
        onPress={() => setOpen((prevOpen) => !prevOpen)}
        title={`${open ? 'Close' : 'Open'} drawer`}
      />
    </Drawer>
  );
}
```

## API reference

The package exports a `Drawer` component which is the one you'd use to render the drawer.

### `Drawer`

Component is responsible for rendering a drawer sidebar with animations and gestures.

#### Drawer Props

##### `open`

Whether the drawer is open or not.

##### `onOpen`

Callback which is called when the drawer is opened.

##### `onClose`

Callback which is called when the drawer is closed.

##### `renderDrawerContent`

Callback which returns a react element to render as the content of the drawer.

##### `layout`

Object containing the layout of the container. Defaults to the dimensions of the application's window.

##### `drawerPosition`

Position of the drawer on the screen. Defaults to `right` in RTL mode, otherwise `left`.

##### `drawerType`

Type of the drawer. It determines how the drawer looks and animates.

- `front`: Traditional drawer which covers the screen with a overlay behind it.
- `back`: The drawer is revealed behind the screen on swipe.
- `slide`: Both the screen and the drawer slide on swipe to reveal the drawer.
- `permanent`: A permanent drawer is shown as a sidebar.

Defaults to `front`.

##### `drawerStyle`

Style object for the drawer. You can pass a custom background color for drawer or a custom width for the drawer.

##### `overlayStyle`

Style object for the overlay.

##### `hideStatusBarOnOpen`

Whether to hide the status bar when the drawer is open. Defaults to `false`.

##### `keyboardDismissMode`

Whether to dismiss the keyboard when the drawer is open. Supported values are:

- `none`: The keyboard will not be dismissed when the drawer is open.
- `on-drag`: The keyboard will be dismissed when the drawer is opened by a swipe gesture.

Defaults to `on-drag`.

##### `statusBarAnimation`

Animation to use when the status bar is hidden. Supported values are:

- `slide`: The status bar will slide out of view.
- `fade`: The status bar will fade out of view.
- `none`: The status bar will not animate.

Use it in combination with `hideStatusBarOnOpen`.

##### `swipeEnabled`

Whether to enable swipe gestures to open the drawer. Defaults to `true`.

Swipe gestures are only supported on iOS and Android.

##### `swipeEdgeWidth`

How far from the edge of the screen the swipe gesture should activate. Defaults to `32`.

This is only supported on iOS and Android.

##### `swipeMinDistance`

Minimum swipe distance that should activate opening the drawer. Defaults to `60`.

This is only supported on iOS and Android.

##### `swipeMinVelocity`

Minimum swipe velocity that should activate opening the drawer. Defaults to `500`.

This is only supported on iOS and Android.

#### `configureGestureHandler`

Callback to configure the underlying [gesture from `react-native-gesture-handler`](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/gesture). It receives the `gesture` object as an argument:

```js
configureGestureHandler={({ gesture }) => {
  return gesture.enableTrackpadTwoFingerGesture(false);
}}
```

##### `children`

Content that the drawer should wrap.

### `useDrawerProgress`

The `useDrawerProgress` hook returns a Reanimated `SharedValue` which represents the progress of the drawer. It can be used to animate the content of the screen.

Example with modern implementation:

```js
import { Animated } from 'react-native-reanimated';
import { useDrawerProgress } from 'react-native-drawer-layout';

// ...

function MyComponent() {
  const progress = useDrawerProgress();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(progress, [0, 1], [-100, 0]),
        },
      ],
    };
  });

  return <Animated.View style={animatedStyle}>{/* ... */}</Animated.View>;
}
```

If you are using class components, you can use the `DrawerProgressContext` to get the progress value.

```js
import { DrawerProgressContext } from 'react-native-drawer-layout';

// ...

class MyComponent extends React.Component {
  static contextType = DrawerProgressContext;

  render() {
    const progress = this.context;

    // ...
  }
}
```

:::warning

The `useDrawerProgress` hook (or `DrawerProgressContext`) will return a mock value on Web since Reanimated is not used on Web. The mock value can only represent the open state of the drawer (`0` when closed, `1` when open), and not the progress of the drawer.

:::
