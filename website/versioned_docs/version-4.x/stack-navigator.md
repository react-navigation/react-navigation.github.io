---
id: version-4.x-stack-navigator
title: createStackNavigator
sidebar_label: createStackNavigator
original_id: stack-navigator
---

Provides a way for your app to transition between screens where each new screen is placed on top of a stack.

By default the stack navigator is configured to have the familiar iOS and Android look & feel: new screens slide in from the right on iOS, fade in from the bottom on Android. On iOS the stack navigator can also be configured to a modal style where screens slide in from the bottom.

To use this navigator, ensure that you have [react-navigation and its dependencies installed](getting-started.md), then install [`react-navigation-stack`](https://github.com/react-navigation/stack).

```sh
yarn add react-navigation-stack @react-native-community/masked-view
```

## API Definition

```js
import { createStackNavigator } from 'react-navigation-stack';

createStackNavigator(RouteConfigs, StackNavigatorConfig);
```

### RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route.

```js
createStackNavigator({
  // For each screen that you can navigate to, create a new entry like this:
  Profile: {
    // `ProfileScreen` is a React component that will be the main content of the screen.
    screen: ProfileScreen,
    // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'people/:name',
    // The action and route params are extracted from the path.

    // Optional: Override the `navigationOptions` for the screen
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.name}'s Profile'`,
    }),
  },

  ...MyOtherRoutes,
});
```

### StackNavigatorConfig

Options for the router:

- `initialRouteName` - Sets the default screen of the stack. Must match one of the keys in route configs.
- `initialRouteParams` - The params for the initial route
- `initialRouteKey` - Optional identifier of the initial route
- `navigationOptions` - Navigation options for the navigator itself, to configure a parent navigator
- `defaultNavigationOptions` - Default navigation options to use for screens
- `paths` - A mapping of overrides for the paths set in the route configs

Visual options:

- `mode` - Defines the style for rendering and transitions:
  - `card` - Use the standard iOS and Android screen transitions. This is the default.
  - `modal` - Make the screens slide in from the bottom which is a common iOS pattern. Only works on iOS, has no effect on the transition on Android. This also disables `react-native-screens` for the stack.
- `headerMode` - Specifies how the header should be rendered:
  - `float` - Render a single header that stays at the top and animates as screens are changed. This is a common pattern on iOS.
  - `screen` - Each screen has a header attached to it and the header fades in and out together with the screen. This is a common pattern on Android.
  - `none` - No header will be rendered.

### `navigationOptions` for screens inside of the navigator

#### `title`

String that can be used as a fallback for `headerTitle`. Additionally, will be used as a fallback for `tabBarLabel` (if nested in a TabNavigator) or `drawerLabel` (if nested in a DrawerNavigator).

#### `header`

Function that given `HeaderProps` returns a React Element, to display as a header.

Example:

```js
header: ({ scene, previous, navigation }) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.routeName;

  return (
    <MyHeader
      title={title}
      leftButton={
        previous ? <MyBackButton onPress={navigation.goBack} /> : undefined
      }
    />
  );
};
```

By default, there is one floating header which renders headers for multiple screens on iOS. These headers include animations to smoothly switch to one another. When using a custom header, it's recommended set the `headerMode` option on the navigator to `screen` so that you don't have to implement animations.

```js
headerStyle: {
  height: 80, // Specify the height of your custom header
};
```

To set a custom header for all the screens in the navigator, you can specify this option in the `defaultNavigationOptions` option of the navigator.

#### `headerShown`

Whether to show or hide the header for the screen. The header is shown by default unless `headerMode` was set to `none`. Setting this to `false` hides the header.

When hiding the header on specific screens, you might also want to set `headerMode` option to `screen`.

#### `headerTitle`

String or a function that returns a React Element to be used by the header. Defaults to scene `title`. When a function is specified, it receives an object containing `allowFontScaling`, `style` and `children` properties. The `children` property contains the title string.

#### `headerTitleAlign`

How to align the header title. Possible values:

- `left`
- `center`

Defaults to `center` on iOS and `left` on Android.

#### `headerTitleAllowFontScaling`

Whether header title font should scale to respect Text Size accessibility settings. Defaults to false.

#### `headerBackAllowFontScaling`

Whether back button title font should scale to respect Text Size accessibility settings. Defaults to false.

#### `headerBackImage`

Function which returns a React Element to display custom image in header's back button. When a function is used, it receives the `tintColor` in it's argument object. Defaults to Image component with `react-navigation/views/assets/back-icon.png` back image source, which is the default back icon image for the platform (a chevron on iOS and an arrow on Android).

#### `headerBackTitle`

Title string used by the back button on iOS. Defaults to the previous scene's `headerTitle`.

#### `headerBackTitleVisible`

A reasonable default is supplied for whether the back button title should be visible or not, but if you want to override that you can use `true` or `false` in this option.

#### `headerTruncatedBackTitle`

Title string used by the back button when `headerBackTitle` doesn't fit on the screen. `"Back"` by default.

#### `headerRight`

Function which returns a React Element to display on the right side of the header.

#### `headerLeft`

Function which returns a React Element to display on the left side of the header. When a function is used, it receives a number of arguments when rendered (`onPress`, `label`, `labelStyle` and more - check [types.tsx](https://github.com/react-navigation/stack/blob/master/src/types.tsx) for the complete list).

#### `headerStyle`

Style object for the header. You can specify a custom background color here, for example.

#### `headerTitleStyle`

Style object for the title component

#### `headerBackTitleStyle`

Style object for the back title

#### `headerLeftContainerStyle`

Customize the style for the container of the `headerLeft` component, for example to add padding.

#### `headerRightContainerStyle`

Customize the style for the container of the `headerRight` component, for example to add padding.

#### `headerTitleContainerStyle`

Customize the style for the container of the `headerTitle` component, for example to add padding.

By default, `headerTitleContainerStyle` is with an absolute position style and offsets both `left` and `right`. This may lead to white space or overlap between `headerLeft` and `headerTitle` if a customized `headerLeft` is used. It can be solved by adjusting `left` and `right` style in `headerTitleContainerStyle` and `marginHorizontal` in `headerTitleStyle`.

#### `headerTintColor`

Tint color for the header

#### `headerPressColorAndroid`

Color for material ripple (Android >= 5.0 only)

#### `headerTransparent`

Defaults to `false`. If `true`, the header will not have a background unless you explicitly provide it with `headerBackground`. The header will also float over the screen so that it overlaps the content underneath.

This is useful if you want to render a semi-transparent header or a blurred background.

Note that if you don't want your content to appear under the header, you need to manually add a top margin to your content. React Navigation won't do it automatically.

To get the height of the header, you can use `HeaderHeightContext` with [React's Context API](https://reactjs.org/docs/context.html#contextconsumer) or `useHeaderHeight`:

```js
import { useHeaderHeight } from 'react-navigation-stack';

// ...

const headerHeight = useHeaderHeight();
```

#### `headerBackground`

Function which returns a React Element to render as the background of the header. This is useful for using backgrounds such as an image or a gradient.

For example, you can use this with `headerTransparent` to render a blur view to create a translucent header.

```js
import { BlurView } from 'expo-blur';

// ...

MyScreen.navigationOptions = {
  headerTransparent: true,
  headerBackground: () => (
    <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
  ),
};
```

#### `headerStatusBarHeight`

Extra padding to add at the top of header to account for translucent status bar. By default, it uses the top value from the safe area insets of the device. Pass 0 or a custom value to disable the default behavior, and customize the height.

#### `cardShadowEnabled`

Use this prop to have visible shadows during transitions. Defaults to `true`.

#### `cardOverlayEnabled`

Use this prop to have a semi-transparent dark overlay visible under the card during transitions. Defaults to `true` on Android and `false` on iOS.

#### `cardStyle`

Style object for the card in stack. You can provide a custom background color to use instead of the default background here.

You can also specify `{ backgroundColor: 'transparent' }` to make the previous screen visible underneath. This is useful to implement things like modal dialogs. If you use [`react-native-screens`](https://github.com/kmagiera/react-native-screens), you should also specify `mode: 'modal'` in the stack view config when using a transparent background so previous screens aren't detached.

#### `disableKeyboardHandling`

If true, the keyboard will NOT automatically dismiss when navigating to a new screen. Defaults to `false`.

#### `animationEnabled`

Whether transition animation should be enabled the screen. If you set it to `false`, the screen won't animate when pushing or popping. Defaults to `true`.

#### `gestureEnabled`

Whether you can use gestures to dismiss this screen. Defaults to `true` on iOS, `false` on Android.

#### `gestureResponseDistance`

Object to override the distance of touch start from the edge of the screen to recognize gestures. It takes the following properties:

- `horizontal` - _number_ - Distance for horizontal direction. Defaults to 25.
- `vertical` - _number_ - Distance for vertical direction. Defaults to 135.

#### `gestureVelocityImpact`

Number which determines the relevance of velocity for the gesture. Defaults to 0.3.

#### `gestureDirection`

Direction of the gesture. Refer the [Animations section](#animations) for details.

#### `transitionSpec`

Configuration object for the screen transition. Refer the [Animations section](#animations) for details.

#### `cardStyleInterpolator`

Interpolated styles for various parts of the card. Refer the [Animations section](#animations) for details.

#### `headerStyleInterpolator`

Interpolated styles for various parts of the header. Refer the [Animations section](#animations) for details.

#### `safeAreaInsets`

Safe area insets for the screen. This is used to avoid elements like notch and status bar. By default, the device's safe area insets are automatically detected. You can override the behavior with this option.

Takes an object containing following optional properties: `top`, `right`, `bottom` and `left`.

#### `onTransitionStart`

Callback which is called when a transition animation starts (both when screen appears and hides).

#### `onTransitionEnd`

Callback which is called when a transition animation ends.

### `params`

You can provide default params inside route definitions:

```js
const Store = createStackNavigator({
  Playstation: { screen: ProductScreen, params: { product: 'Playstation' } },
  Xbox: { screen: ProductScreen, params: { product: 'Xbox' } },
});
```

### Examples

See the examples in the [example app](https://github.com/react-navigation/stack/tree/master/example) in the repo.

### Animations

Stack Navigator exposes various options to configure the transition animation when a screen is added or removed. These transition animations can be customize on a per-screen basis by specifying the options in the `navigationOptions` config.

- `gestureDirection` - The direction of swipe gestures, `horizontal`, `vertical` or `vertical-inverted`.
- `transitionSpec` - An object which specifies the animation type (`timing` or `spring`) and their options (such as `duration` for `timing`). It takes 2 properties:

  - `open` - Configuration for the transition when adding a screen
  - `close` - Configuration for the transition when removing a screen.

  Each of the object should specify 2 properties:

  - `animation` - The animation function to use for the animation. Supported values are `timing` and `spring`.
  - `config` - The configuration object for the timing function. For `timing`, it can be `duration` and `easing`. For `spring`, it can be `stiffness`, `damping`, `mass`, `overshootClamping`, `restDisplacementThreshold` and `restSpeedThreshold`.

  A config which uses spring animation looks like this:

  ```js
  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };
  ```

  We can pass this function in `transitionSpec` option:

  ```js
  Profile.navigationOptions = {
    transitionSpec: {
      open: config,
      close: config,
    },
  };
  ```

- `cardStyleInterpolator` - This is a function which specifies interpolated styles for various parts of the card. Is expected to return at least empty object, possibly containing interpolated styles for container, the card itself, overlay and shadow. Supported properties are:

  - `containerStyle` - Style for the container view wrapping the card.
  - `cardStyle` - Style for the view representing the card.
  - `overlayStyle` - Style for the view representing the semi-transparent overlay below
  - `shadowStyle` - Style for the view representing the card shadow.

  The function receives the following properties in it's argument:

  - `current` - Values for the current screen:
    - `progress` - Animated node representing the progress value of the current screen.
  - `next` - Values for the current screen the screen after this one in the stack. This can be `undefined` in case the screen animating is the last one.
    - `progress` - Animated node representing the progress value of the next screen.
  - `index` - The index of the card in the stack.
  - `closing` - Animated node representing whether the card is closing. `1` when closing, `0` if not.
  - `layouts` - Layout measurements for various items we use for animation.
    - `screen` - Layout of the whole screen. Contains `height` and `width` properties.

  A config which just fades the card looks like this:

  ```js
  const forFade = ({ current, closing }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });
  ```

  We can pass this function in `cardStyleInterpolator` option:

  ```js
  Profile.navigationOptions = {
    cardStyleInterpolator: forFade,
  };
  ```

- `headerStyleInterpolator` - This is a function which specifies interpolated styles for various parts of the header. Is expected to return at least empty object, possibly containing interpolated styles for left label and button, right button, title and background. Supported properties are:

  - `leftLabelStyle` - Style for the label of the left button (back button label).
  - `leftButtonStyle` - Style for the left button (usually the back button).
  - `rightButtonStyle` - Style for the right button.
  - `titleStyle` - Style for the header title text.
  - `backgroundStyle` - Style for the header background.

  The function receives the following properties in it's argument:

  - `current` - Values for the current screen (the screen which owns this header).
    - `progress` - Animated node representing the progress value of the current screen.
  - `next` - Values for the current screen the screen after this one in the stack. This can be `undefined` in case the screen animating is the last one.
    - `progress` - Animated node representing the progress value of the next screen.
  - `layouts` - Layout measurements for various items we use for animation. Each layout object contain `height` and `width` properties.
    - `screen` - Layout of the whole screen.
    - `title` - Layout of the title element. Might be `undefined` when not rendering a title.
    - `leftLabel` - Layout of the back button label. Might be `undefined` when not rendering a back button label.

  A config which just fades the elements looks like this:

  ```js
  const forFade = ({ current, next }) => {
    const opacity = Animated.add(
      current.progress,
      next ? next.progress : 0
    ).interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0],
    });

    return {
      leftButtonStyle: { opacity },
      rightButtonStyle: { opacity },
      titleStyle: { opacity },
      backgroundStyle: { opacity },
    };
  };
  ```

  We can pass this function in `headerStyleInterpolator` option:

  ```js
  Profile.navigationOptions = {
    headerStyleInterpolator: forFade,
  };
  ```

With these options, it's possible to build custom transition animations for screens. We also export various configs from the library with ready-made animations which you can use:

- `TransitionSpecs`

  - `TransitionIOSSpec` - Exact values from UINavigationController's animation configuration.
  - `FadeInFromBottomAndroidSpec` - Configuration for activity open animation from Android Nougat.
  - `FadeOutToBottomAndroidSpec` - Configuration for activity close animation from Android Nougat.
  - `RevealFromBottomAndroidSpec` - Approximate configuration for activity open animation from Android Pie.

- `CardStyleInterpolators`

  - `forHorizontalIOS` - Standard iOS-style slide in from the right.
  - `forVerticalIOS` - Standard iOS-style slide in from the bottom (used for modals).
  - `forModalPresentationIOS` - Standard iOS-style modal animation in iOS 13.
  - `forFadeFromBottomAndroid` - Standard Android-style fade in from the bottom for Android Oreo.
  - `forRevealFromBottomAndroid` - Standard Android-style reveal from the bottom for Android Pie.

  Example configuration for Android Oreo style vertical screen fade animation:

  ```js
  static navigationOptions = {
    title: 'Profile',
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
  }
  ```

- `HeaderStyleInterpolators`

  - `forUIKit` - Standard UIKit style animation for the header where the title fades into the back button label.
  - `forFade` - Simple fade animation for the header elements.
  - `forStatic` - Simple translate animation to translate the header along with the sliding screen.

  Example configuration for default iOS animation for header elements where the title fades into the back button:

  ```js
  static navigationOptions = {
    title: 'Profile',
    headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
  }
  ```

> Note: Always define your animation configuration at the top-level of the file to ensure that the references don't change across re-renders. This is important for smooth and reliable transition animations.

We export various transition presets which bundle various set of these options together to match certain native animations. A transition preset is an object containing few animation related screen options exported under `TransitionPresets`. Currently the following presets are available:

- `SlideFromRightIOS` - Standard iOS navigation transition.
- `ModalSlideFromBottomIOS` - Standard iOS navigation transition for modals.
- `ModalPresentationIOS` - Standard iOS modal presentation style (introduced in iOS 13).
- `FadeFromBottomAndroid` - Standard Android navigation transition when opening or closing an Activity on Android < 9 (Oreo).
- `RevealFromBottomAndroid` - Standard Android navigation transition when opening or closing an Activity on Android >= 9 (Pie).
- `DefaultTransition` - Default navigation transition for the current platform.
- `ModalTransition` - Default modal transition for the current platform.

You can spread these presets in `navigationOptions` to customize the animation for a screen:

```js
static navigationOptions = {
  title: 'Profile',
  ...TransitionPresets.ModalSlideFromBottomIOS
}
```

If you want to customize the transition animations for all of the screens in the navigator, you can specify it in `defaultNavigationOptions` when defining a navigator.

Example configuration for iOS modal presentation style:

```js
const Stack = createStackNavigator(
  {
    Home,
    Profile,
    Settings,
  },
  {
    mode: 'modal',
    headerMode: 'none',
    defaultNavigationOptions: {
      gestureEnabled: true,
      cardOverlayEnabled: true,
      ...TransitionPresets.ModalPresentationIOS,
    },
  }
);
```
