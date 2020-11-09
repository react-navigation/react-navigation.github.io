---
id: stack-navigator
title: createStackNavigator
sidebar_label: createStackNavigator
---

Provides a way for your app to transition between screens where each new screen is placed on top of a stack.

By default the stack navigator is configured to have the familiar iOS and Android look & feel: new screens slide in from the right on iOS, fade in from the bottom on Android. On iOS the stack navigator can also be configured to a modal style where screens slide in from the bottom.

<div style={{ display: 'flex', margin: '16px 0' }}>
  <video playsInline autoPlay muted loop>
    <source src="/assets/navigators/stack/stack.mov" />
  </video>
</div>

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/stack`](https://github.com/react-navigation/react-navigation/tree/main/packages/stack):

```bash npm2yarn
npm install @react-navigation/stack
```

## API Definition

To use this navigator, import it from `@react-navigation/stack`:

<samp id="simple-stack" />

```js
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

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

### Props

The `Stack.Navigator` component accepts following props:

#### `initialRouteName`

The name of the route to render on first load of the navigator.

#### `screenOptions`

Default options to use for the screens in the navigator.

#### `keyboardHandlingEnabled`

If `false`, the on screen keyboard will NOT automatically dismiss when navigating to a new screen. Defaults to `true`.

#### `mode`

Defines the style for rendering and transitions:

- `card` - Use the standard iOS and Android screen transitions. This is the default.
- `modal` - This does 2 things:
  - Sets `headerMode` to `screen` for the stack unless specified
  - Make the screens slide in from the bottom on iOS which is a common iOS pattern.

#### `headerMode`

Specifies how the header should be rendered:

- `float` - Render a single header that stays at the top and animates as screens are changed. This is a common pattern on iOS.
- `screen` - Each screen has a header attached to it and the header fades in and out together with the screen. This is a common pattern on Android.
- `none` - No header will be shown. It's recommended to use [`headerShown`](#headershown) option instead for more granularity.

#### `detachInactiveScreens`

Boolean used to indicate whether inactive screens should be detached from the view hierarchy to save memory. Make sure to call `enableScreens` from [react-native-screens](https://github.com/software-mansion/react-native-screens) to make it work. Defaults to `true`.

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator:

#### `title`

String that can be used as a fallback for `headerTitle`.

#### `header`



Function that returns a React Element to display as a header. It accepts an object containing the following properties as the argument:

- `mode` - Mode of the header - `float` or `screen`
- `layout` - Dimensions of the screen
- `insets` - Safe area insets to use in the header
- `scene` - This contains 2 properties:
  - `route` - The route object for the header
  - `descriptor` - The descriptor containing the `navigation` prop and `options` for the screen
- `previous` - The `scene` object of the previous screen, will be undefined if there's no previous screen
- `navigation` prop for the header
- `styleInterpolator` - Function which returns interpolated styles for various elements in the header.

Make sure to set `headerMode` to `screen` as well when using a custom header (see below for more details).

Example:

```js
header: ({ scene, previous, navigation }) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  return (
    <MyHeader
      title={title}
      leftButton={
        previous ? <MyBackButton onPress={navigation.goBack} /> : undefined
      }
      style={options.headerStyle}
    />
  );
};
```

To set a custom header for all the screens in the navigator, you can specify this option in the `screenOptions` prop of the navigator.

When using a custom header, there are 2 important things to keep in mind:

##### Set `headerMode` to `screen`

By default, there is one floating header which renders headers for multiple screens on iOS. These headers include animations to smoothly switch to one another.

Setting the `headerMode` prop to `screen` makes the header part of the screen, so you don't have to implement animations to animate it separately.

If you want to customize how the header animates and want to keep `headerMode` as `float`, you can interpolate on the `scene.progress.current` and `scene.progress.next` props. For example, following will cross-fade the header:

```js
const progress = Animated.add(scene.progress.current, scene.progress.next || 0);

const opacity = progress.interpolate({
  inputRange: [0, 1, 2],
  outputRange: [0, 1, 0],
});

return (
  <Animated.View style={{ opacity }}>{/* Header content */}</Animated.View>
);
```

##### Specify a `height` in `headerStyle`

If your header's height differs from the default header height, then you might notice glitches due to measurement being async. Explicitly specifying the height will avoid such glitches.

Example:

```js
headerStyle: {
  height: 80, // Specify the height of your custom header
};
```

Note that this style is not applied to the header by default since you control the styling of your custom header. If you also want to apply this style to your header, use `scene.descriptor.options.headerStyle` from the props.

#### `headerShown`

Whether to show or hide the header for the screen. The header is shown by default unless the `headerMode` prop on the navigator was set to `none`. Setting this to `false` hides the header.

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

#### `headerBackAccessibilityLabel`

Accessibility label for the header back button.

#### `headerBackImage`

Function which returns a React Element to display custom image in header's back button. When a function is used, it receives the `tintColor` in it's argument object. Defaults to Image component with back image source, which is the default back icon image for the platform (a chevron on iOS and an arrow on Android).

#### `headerBackTitle`

Title string used by the back button on iOS. Defaults to the previous scene's `headerTitle`.

#### `headerBackTitleVisible`

A reasonable default is supplied for whether the back button title should be visible or not, but if you want to override that you can use `true` or `false` in this option.

#### `headerTruncatedBackTitle`

Title string used by the back button when `headerBackTitle` doesn't fit on the screen. `"Back"` by default.

#### `headerRight`

Function which returns a React Element to display on the right side of the header.

#### `headerLeft`

Function which returns a React Element to display on the left side of the header. When a function is used, it receives a number of arguments when rendered (`onPress`, `label`, `labelStyle` and more - check [types.tsx](https://github.com/react-navigation/react-navigation/blob/main/packages/stack/src/types.tsx#L373-L441) for the complete list).

By default, `HeaderBackButton` component is used. You can implement it and use it to override the back button press, for example:

```js
import { HeaderBackButton } from '@react-navigation/stack';

// ...

<Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerLeft: (props) => (
      <HeaderBackButton
        {...props}
        onPress={() => {
          // Do something
        }}
      />
    ),
  }}
/>;
```

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
import { HeaderHeightContext } from '@react-navigation/stack';

// ...

<HeaderHeightContext.Consumer>
  {headerHeight => (
    /* render something */
  )}
</HeaderHeightContext.Consumer>
```

or

```js
import { useHeaderHeight } from '@react-navigation/stack';

// ...

const headerHeight = useHeaderHeight();
```

#### `headerBackground`

Function which returns a React Element to render as the background of the header. This is useful for using backgrounds such as an image or a gradient.

For example, you can use this with `headerTransparent` to render a blur view to create a translucent header.

<samp id="header-blur" />

```js
import { BlurView } from 'expo-blur';

// ...

<Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerTransparent: true,
    headerBackground: () => (
      <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
    ),
  }}
/>;
```

#### `headerStatusBarHeight`

Extra padding to add at the top of header to account for translucent status bar. By default, it uses the top value from the safe area insets of the device. Pass 0 or a custom value to disable the default behavior, and customize the height.

#### `cardShadowEnabled`

Use this prop to have visible shadows during transitions. Defaults to `true`.

#### `cardOverlayEnabled`

Use this prop to have a semi-transparent dark overlay visible under the card during transitions. Defaults to `true` on Android and `false` on iOS.

#### `cardOverlay`

Function which returns a React Element to display as the overlay for the card. Make sure to set `cardOverlayEnabled` to `true` when using this.

#### `cardStyle`

Style object for the card in stack. You can provide a custom background color to use instead of the default background here.

You can also specify `{ backgroundColor: 'transparent' }` to make the previous screen visible underneath (for transparent modals). This is useful to implement things like modal dialogs. You should also specify `mode: 'modal'` in the stack view config when using a transparent background so previous screens aren't detached and stay visible underneath.

#### `animationEnabled`

Whether transition animation should be enabled on the screen. If you set it to `false`, the screen won't animate when pushing or popping. Defaults to `true` on iOS and Android, `false` on Web.

#### `animationTypeForReplace`

The type of animation to use when this screen replaces another screen. It takes the following values:

- `push` - The animation of a new screen being pushed will be used
- `pop` - The animation of a screen being popped will be used

Defaults to `push`.

When `pop` is used, the `pop` animation is applied to the screen being replaced.

#### `gestureEnabled`

Whether you can use gestures to dismiss this screen. Defaults to `true` on iOS, `false` on Android.

Gestures are not supported on Web.

#### `gestureResponseDistance`

Object to override the distance of touch start from the edge of the screen to recognize gestures. The object can contain the following properties:

- `horizontal` - _number_ - Distance for horizontal direction. Defaults to 50.
- `vertical` - _number_ - Distance for vertical direction. Defaults to 135.

This is not supported on Web.

#### `gestureVelocityImpact`

Number which determines the relevance of velocity for the gesture. Defaults to 0.3.

This is not supported on Web.

#### `gestureDirection`

Direction of the gestures. Refer the [Animations section](#animations) for details.

This is not supported on Web.

#### `transitionSpec`

Configuration object for the screen transition. Refer the [Animations section](#animations) for details.

#### `cardStyleInterpolator`

Interpolated styles for various parts of the card. Refer the [Animations section](#animations) for details.

#### `headerStyleInterpolator`

Interpolated styles for various parts of the header. Refer the [Animations section](#animations) for details.

#### `detachPreviousScreen`

Boolean used to indicate whether to detach the previous screen from the view hierarchy to save memory. Set it to `false` if you need the previous screen to be seen through the active screen. Only applicable if `detachInactiveScreens` isn't set to `false`. Defaults to `false` for the last screen when `mode='modal'`, otherwise `true`.

#### `safeAreaInsets`

Safe area insets for the screen. This is used to avoid elements like notch and status bar. By default, the device's safe area insets are automatically detected. You can override the behavior with this option.

Takes an object containing following optional properties:

- `top` - _number_ - The value of the top inset, e.g. area containing the status bar and notch.
- `right` - _number_ - The value of the left inset.
- `bottom` - _number_ - The value of the top inset, e.g. area navigation bar on bottom.
- `left`. - _number_ - The value of the right inset.

### Events

The navigator can [emit events](navigation-events.md) on certain actions. Supported events are:

#### `transitionStart`

This event is fired when the transition animation starts for the current screen.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('transitionStart', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

#### `transitionEnd`

This event is fired when the transition animation ends for the current screen.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('transitionEnd', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

### Helpers

The stack navigator adds the following methods to the navigation prop:

#### `push`

Pushes a new screen to top of the stack and navigate to it. The method accepts following arguments:

- `name` - _string_ - Name of the route to push onto the stack.
- `params` - _object_ - Screen params to merge into the destination route (found in the pushed screen through `route.params`).

<samp id="stack-with-options" />

```js
navigation.push('Profile', { owner: 'Michaś' });
```

#### `pop`

Pops the current screen from the stack and navigates back to the previous screen. It takes one optional argument (`count`), which allows you to specify how many screens to pop back by.

<samp id="stack-with-options" />

```js
navigation.pop();
```

#### `popToTop`

Pops all of the screens in the stack except the first one and navigates to it.

<samp id="stack-with-options" />

```js
navigation.popToTop();
```

## Example

<samp id="stack-with-options" />

```js
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function MyStack() {
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

## Animations

### Animation related options

Stack Navigator exposes various options to configure the transition animation when a screen is added or removed. These transition animations can be customized on a per-screen basis by specifying the options in the `options` prop for each screen.

- `gestureDirection` - The direction of swipe gestures:

  - `horizontal` - The gesture to close the screen will start from the left, and from the right in RTL. For animations, screen will slide from the right with `SlideFromRightIOS`, and from the left in RTL.
  - `horizontal-inverted` - The gesture to close the screen will start from the right, and from the left in RTL. For animations, screen will slide from the left with `SlideFromRightIOS`, and from the right in RTL as the direction is inverted.
  - `vertical` - The gesture to close the screen will start from the top. For animations, screen will slide from the bottom.
  - `vertical-inverted` - The gesture to close the screen will start from the bottom. For animations, screen will slide from the top.

  You may want to specify a matching horizontal/vertical animation along with `gestureDirection` as well. For the animations included in the library, if you set `gestureDirection` to one of the inverted ones, it'll also flip the animation direction.

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

  We can pass this config in the `transitionSpec` option:

  <samp id="stack-animation-config" />

  ```js
  <Stack.Screen
    name="Profile"
    component={Profile}
    options={{
      transitionSpec: {
        open: config,
        close: config,
      },
    }}
  />
  ```

- `cardStyleInterpolator` - This is a function which specifies interpolated styles for various parts of the card. This allows you to customize the transitions when navigating from screen to screen. It is expected to return at least empty object, possibly containing interpolated styles for container, the card itself, overlay and shadow. Supported properties are:

  - `containerStyle` - Style for the container view wrapping the card.
  - `cardStyle` - Style for the view representing the card.
  - `overlayStyle` - Style for the view representing the semi-transparent overlay below
  - `shadowStyle` - Style for the view representing the card shadow.

  The function receives the following properties in its argument:

  - `current` - Values for the current screen:
    - `progress` - Animated node representing the progress value of the current screen.
  - `next` - Values for the screen after this one in the stack. This can be `undefined` in case the screen animating is the last one.
    - `progress` - Animated node representing the progress value of the next screen.
  - `index` - The index of the card in the stack.
  - `closing` - Animated node representing whether the card is closing. `1` when closing, `0` if not.
  - `layouts` - Layout measurements for various items we use for animation.
    - `screen` - Layout of the whole screen. Contains `height` and `width` properties.

  > **Note that when a screen is not the last, it will use the next screen's transition config.** This is because many transitions involve an animation of the previous screen, and so these two transitions need to be kept together to prevent running two different kinds of transitions on the two screens (for example a slide and a modal). You can check the `next` parameter to find out if you want to animate out the previous screen. For more information about this parameter, see [Animation](/docs/stack-navigator#animations) section.

  A config which just fades the screen looks like this:

  ```js
  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });
  ```

  We can pass this function in `cardStyleInterpolator` option:

  <samp id="stack-for-fade-card" />

  ```js
  <Stack.Screen
    name="Profile"
    component={Profile}
    options={{ cardStyleInterpolator: forFade }}
  />
  ```

  The interpolator will be called for each screen. For example, say you have a 2 screens in the stack, A & B. B is the new screen coming into focus and A is the previous screen. The interpolator will be called for each screen:

  - The interpolator is called for `B`: Here, the `current.progress` value represents the progress of the transition, which will start at `0` and end at `1`. There won't be a `next.progress` since `B` is the last screen.
  - The interpolator is called for `A`: Here, the `current.progress` will stay at the value of `1` and won't change, since the current transition is running for `B`, not `A`. The `next.progress` value represents the progress of `B` and will start at `0` and end at `1`.

  Say we want to animate both screens during the transition. The easiest way to do it would be to combine the progress value of current and next screens:

  ```js
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );
  ```

  Here, the screen `A` will have both `current.progress` and `next.progress`, and since `current.progress` stays at `1` and `next.progress` is changing, combined, the progress will change from `1` to `2`. The screen `B` will only have `current.progress` which will change from `0` to `1`. So, we can apply different interpolations for `0-1` and `1-2` to animate focused screen and unfocused screen respectively.

  A config which translates the previous screen slightly to the left, and translates the current screen from the right edge would look like this:

  ```js
  const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
    const progress = Animated.add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })
        : 0
    );

    return {
      cardStyle: {
        transform: [
          {
            translateX: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                  screen.width, // Focused, but offscreen in the beginning
                  0, // Fully focused
                  screen.width * -0.3, // Fully unfocused
                ],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
        ],
      },
    };
  };
  ```

- `headerStyleInterpolator` - This is a function which specifies interpolated styles for various parts of the header. It is expected to return at least empty object, possibly containing interpolated styles for left label and button, right button, title and background. Supported properties are:

  - `leftLabelStyle` - Style for the label of the left button (back button label).
  - `leftButtonStyle` - Style for the left button (usually the back button).
  - `rightButtonStyle` - Style for the right button.
  - `titleStyle` - Style for the header title text.
  - `backgroundStyle` - Style for the header background.

  The function receives the following properties in it's argument:

  - `current` - Values for the current screen (the screen which owns this header).
    - `progress` - Animated node representing the progress value of the current screen. `0` when screen should start coming into view, `0.5` when it's mid-way, `1` when it should be fully in view.
  - `next` - Values for the screen after this one in the stack. This can be `undefined` in case the screen animating is the last one.
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

  <samp id="stack-for-fade-header" />

  ```js
  <Stack.Screen
    name="Profile"
    component={Profile}
    options={{ headerStyleInterpolator: forFade }}
  />
  ```

### Pre-made configs

With these options, it's possible to build custom transition animations for screens. We also export various configs from the library with ready-made animations which you can use:

#### `TransitionSpecs`

- `TransitionIOSSpec` - Exact values from UINavigationController's animation configuration.
- `FadeInFromBottomAndroidSpec` - Configuration for activity open animation from Android Nougat.
- `FadeOutToBottomAndroidSpec` - Configuration for activity close animation from Android Nougat.
- `RevealFromBottomAndroidSpec` - Approximate configuration for activity open animation from Android Pie.

Example:

```js
import { TransitionSpecs } from '@react-navigation/stack';

// ...

<Stack.Screen
  name="Profile"
  component={Profile}
  options={{
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
  }}
/>;
```

#### `CardStyleInterpolators`

- `forHorizontalIOS` - Standard iOS-style slide in from the right.
- `forVerticalIOS` - Standard iOS-style slide in from the bottom (used for modals).
- `forModalPresentationIOS` - Standard iOS-style modal animation in iOS 13.
- `forFadeFromBottomAndroid` - Standard Android-style fade in from the bottom for Android Oreo.
- `forRevealFromBottomAndroid` - Standard Android-style reveal from the bottom for Android Pie.

Example configuration for Android Oreo style vertical screen fade animation:

<samp id="stack-card-style-interpolator" />

```js
import { CardStyleInterpolators } from '@react-navigation/stack';

// ...

<Stack.Screen
  name="Profile"
  component={Profile}
  options={{
    title: 'Profile',
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
  }}
/>;
```

#### `HeaderStyleInterpolators`

- `forUIKit` - Standard UIKit style animation for the header where the title fades into the back button label.
- `forFade` - Simple fade animation for the header elements.
- `forStatic` - Simple translate animation to translate the header along with the sliding screen.

Example configuration for default iOS animation for header elements where the title fades into the back button:

<samp id="stack-for-ui-kit" />

```js
import { HeaderStyleInterpolators } from '@react-navigation/stack';

// ...

<Stack.Screen
  name="Profile"
  component={Profile}
  options={{
    title: 'Profile',
    headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
  }}
/>;
```

> Note: Always define your animation configuration at the top-level of the file to ensure that the references don't change across re-renders. This is important for smooth and reliable transition animations.

#### `TransitionPresets`

We export various transition presets which bundle various set of these options together to match certain native animations. A transition preset is an object containing few animation related screen options exported under `TransitionPresets`. Currently the following presets are available:

- `SlideFromRightIOS` - Standard iOS navigation transition.
- `ModalSlideFromBottomIOS` - Standard iOS navigation transition for modals.
- `ModalPresentationIOS` - Standard iOS modal presentation style (introduced in iOS 13).
- `FadeFromBottomAndroid` - Standard Android navigation transition when opening or closing an Activity on Android < 9 (Oreo).
- `RevealFromBottomAndroid` - Standard Android navigation transition when opening or closing an Activity on Android 9 (Pie).
- `ScaleFromCenterAndroid` - Standard Android navigation transition when opening or closing an Activity on Android >= 10.
- `DefaultTransition` - Default navigation transition for the current platform.
- `ModalTransition` - Default modal transition for the current platform.

You can spread these presets in `options` to customize the animation for a screen:

<samp id="stack-modal-slide-from-bottom" />

```js
import { TransitionPresets } from '@react-navigation/stack';

// ...

<Stack.Screen
  name="Profile"
  component={Profile}
  options={{
    title: 'Profile',
    ...TransitionPresets.ModalSlideFromBottomIOS,
  }}
/>;
```

If you want to customize the transition animations for all of the screens in the navigator, you can specify it in `screenOptions` prop for the navigator.

Example configuration for iOS modal presentation style:

<samp id="stack-modal-presentation" />

```js
import { TransitionPresets } from '@react-navigation/stack';

// ...

<Stack.Navigator
  initialRouteName="Home"
  screenOptions={({ route, navigation }) => ({
    headerShown: false,
    gestureEnabled: true,
    cardOverlayEnabled: true,
    headerStatusBarHeight:
      navigation
        .dangerouslyGetState()
        .routes.findIndex((r) => r.key === route.key) > 0
        ? 0
        : undefined,
    ...TransitionPresets.ModalPresentationIOS,
  })}
  mode="modal"
>
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="Profile" component={Profile} />
</Stack.Navigator>;
```

> Note: The `ModalPresentationIOS` preset needs to be configured for the whole stack for it to work correctly. If you want few screens to have this transition, you can add a modal stack at root with this transition, and nest a regular stack inside it.

### Transparent modals

A transparent modal is like a modal dialog which overlays the screen. The previous screen still stays visible underneath. To get a transparent modal screen, it's usually easier to create a separate modal stack. In the modal stack, you will want to configure few things:

- Set the `mode` prop to `modal` which sets `detachPreviousScreen` option to `false` for the last screen
- Set the card background to transparent using `cardStyle`
- Use a custom animation instead of the default platform animation (we'll use fade in this case)
- Disable the header with `headerShown: false` (optional)
- Enable the overlay with `cardOverlayEnabled: true` (optional)

Example:

```js
<Stack.Navigator
  screenOptions={{
    headerShown: false,
    cardStyle: { backgroundColor: 'transparent' },
    cardOverlayEnabled: true,
    cardStyleInterpolator: ({ current: { progress } }) => ({
      cardStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 0.5, 0.9, 1],
          outputRange: [0, 0.25, 0.7, 1],
        }),
      },
      overlayStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
          extrapolate: 'clamp',
        }),
      },
    }),
  }}
  mode="modal"
>
  <Stack.Screen name="Home" component={HomeStack} />
  <Stack.Screen name="Modal" component={ModalScreen} />
</Stack.Navigator>
```

Now, when you navigate to the `Modal` screen, the `Home` screen will still be visible underneath.
