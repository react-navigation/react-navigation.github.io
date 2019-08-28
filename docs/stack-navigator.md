---
id: stack-navigator
title: createStackNavigator
sidebar_label: createStackNavigator
---

Provides a way for your app to transition between screens where each new screen is placed on top of a stack.

By default the stack navigator is configured to have the familiar iOS and Android look & feel: new screens slide in from the right on iOS, fade in from the bottom on Android. On iOS the stack navigator can also be configured to a modal style where screens slide in from the bottom.

## API Definition

```js
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

* `initialRouteName` - Sets the default screen of the stack. Must match one of the keys in route configs.
* `initialRouteParams` - The params for the initial route
* `initialRouteKey` - Optional identifier of the initial route
* `navigationOptions` - Navigation options for the navigator itself, to configure a parent navigator
* `defaultNavigationOptions` - Default navigation options to use for screens
* `paths` - A mapping of overrides for the paths set in the route configs

Visual options:

* `mode` - Defines the style for rendering and transitions:
  * `card` - Use the standard iOS and Android screen transitions. This is the default.
  * `modal` - Make the screens slide in from the bottom which is a common iOS pattern. Only works on iOS, has no effect on Android.
* `headerMode` - Specifies how the header should be rendered:
  * `float` - Render a single header that stays at the top and animates as screens are changed. This is a common pattern on iOS.
  * `screen` - Each screen has a header attached to it and the header fades in and out together with the screen. This is a common pattern on Android.
  * `none` - No header will be rendered.

### `navigationOptions` for screens inside of the navigator

#### `title`

String that can be used as a fallback for `headerTitle`. Additionally, will be used as a fallback for `tabBarLabel` (if nested in a TabNavigator) or `drawerLabel` (if nested in a DrawerNavigator).

#### `header`

Function that given `HeaderProps` returns a React Element, to display as a header. Setting to `null` hides header.

#### `headerTitle`

String or a function that returns a React Element to be used by the header. Defaults to scene `title`. When a function is specified, it receives `allowFontScaling`, `onLayout`, `style` and `children` as the arguments. The title string is passed in `children`.

#### `headerTitleAllowFontScaling`

Whether header title font should scale to respect Text Size accessibility settings. Defaults to false.

#### `headerBackAllowFontScaling`

Whether back button title font should scale to respect Text Size accessibility settings. Defaults to false.

#### `headerBackImage`

Function which returns a React Element to display custom image in header's back button. When a function is used, it receives the `tintColor` in it's argument object. Defaults to Image component with `react-navigation/views/assets/back-icon.png` back image source, which is the default back icon image for the platform (a chevron on iOS and an arrow on Android).

#### `headerBackTitle`

Title string used by the back button on iOS, or `null` to disable label. Defaults to the previous scene's `headerTitle`.

#### `headerBackTitleVisible`

A reasonable default is supplied for whether the back button title should be visible or not, but if you want to override that you can use `true` or `false` in this option.

#### `headerTruncatedBackTitle`

Title string used by the back button when `headerBackTitle` doesn't fit on the screen. `"Back"` by default.

#### `headerRight`

Function which returns a React Element to display on the right side of the header.

#### `headerLeft`

Function which returns a React Element to display on the left side of the header. When a function is used, it receives a number of arguments when rendered (`onPress`, `label`, `labelStyle` and more - check [types.tsx](https://github.com/react-navigation/react-navigation-stack/blob/master/src/types.tsx) for the complete list).

#### `headerStyle`

Style object for the header. You can specify a custom background color here, for example.

#### `headerStatusBarHeight`

Allows to pass a custom status bar height to set as the top padding in the header.

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

#### `headerBackground`

Function which returns a React Element to render as the background of the header. This is useful for using backgrounds such as an image or a gradient.

You can use this with `headerTransparent` to render a blur view, for example, to create a translucent header.

#### `cardShadowEnabled`

Use this prop to have visible shadows during transitions. Defaults to `true`.

#### `cardOverlayEnabled`

Use this prop to have a semi-transparent dark overlay visible under the card during transitions. Defaults to `true` on Android and `false` on iOS.

#### `cardTransparent`

Use this prop to use a transparent background for the card instead of a white one. This is useful to implement things like modal dialogs where the previous scene should still be visible underneath the current one. Defaults to `false`.

If you use [`react-native-screens`](https://github.com/kmagiera/react-native-screens), you should also specify `mode: 'modal'` in the stack view config so previous screens aren't detached.

#### `cardStyle`

Style object for the card in stack. You can provide a custom background color to use instead of the default background here.

#### `disableKeyboardHandling`

If true, the keyboard will NOT automatically dismiss when navigating to a new screen. Defaults to `false`.

#### `animationEnabled`

Whether transition animation should be enabled the screen. If you set it to `false`, the screen won't animate when pushing or popping. Defaults to `true`.

#### `gesturesEnabled`

Whether you can use gestures to dismiss this screen. Defaults to `true` on iOS, `false` on Android.

#### `gestureResponseDistance`

Object to override the distance of touch start from the edge of the screen to recognize gestures. It takes the following properties:

* `horizontal` - _number_ - Distance for horizontal direction. Defaults to 25.
* `vertical` - _number_ - Distance for vertical direction. Defaults to 135.

#### `gestureDirection`

The direction of swipe gestures, `horizontal` or `vertical`.

#### `transitionSpec`

An object which specifies the animation type (timing or spring) and their options (such as duration for timing). It takes 2 properties, `open` for the transition when adding a screen and `close` for the transition when removing a screen.

#### `cardStyleInterpolator`

This is a function which specifies interpolated styles for various parts of the card. Is expected to return at least empty object, possibly containing styles for container, the card itself, overlay and shadow.

#### `headerStyleInterpolator`

This is a function which specifies interpolated styles for various parts of the header. Is expected to return at least empty object, possibly containing styles for left label and button, right button, title and background.

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

### Navigator Props

The navigator component created by `createStackNavigator(...)` takes the following props:

* `screenProps` - Pass down extra options to child screens, for example:


```js
const SomeStack = createStackNavigator({
  // config
});

<SomeStack
  screenProps={/* this prop will get passed to the screen components as this.props.screenProps */}
/>
```

### Examples

See the examples [SimpleStack.tsx](https://github.com/react-navigation/react-navigation/blob/master/examples/NavigationPlayground/src/SimpleStack.tsx) and [ModalStack.tsx](https://github.com/react-navigation/react-navigation/blob/master/examples/NavigationPlayground/src/ModalStack.tsx) which you can run locally as part of the [NavigationPlayground](https://github.com/react-community/react-navigation/tree/master/examples/NavigationPlayground) app.

You can view these examples directly on your phone by visiting [our expo demo](https://exp.host/@react-navigation/NavigationPlayground).

#### Modal StackNavigator with Custom Screen Transitions

```js
const ModalNavigator = createStackNavigator(
  {
    Main: { screen: Main },
    Login: { screen: Login },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    }),
  }
);
```

Header transitions can also be configured using `headerLeftInterpolator`, `headerTitleInterpolator` and `headerRightInterpolator` fields under `transitionConfig`.

#### Specifying the transition mode for a stack's screens explicitly

We can't set the `StackNavigatorConfig`'s `mode` dynamically. Instead we are going to use a custom `transitionConfig` to render the specfific transition we want - modal or card - on a screen by screen basis.

```js
import { createStackNavigator, StackViewTransitionConfigs } from 'react-navigation';

/* The screens you add to IOS_MODAL_ROUTES will have the modal transition.  */
const IOS_MODAL_ROUTES = ['OptionsScreen'];

let dynamicModalTransition = (transitionProps, prevTransitionProps) => {
  const isModal = IOS_MODAL_ROUTES.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName),
  );
  return StackViewTransitionConfigs.defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal,
  );
};

const HomeStack = createStackNavigator(
  { DetailScreen, HomeScreen, OptionsScreen },
  { initialRouteName: 'HomeScreen', transitionConfig: dynamicModalTransition },
);
```

## Migration to version 2.0.0 of stack navigator

The new release of stack navigator involved rewriting all underneath mechanisms to use `react-native-reanimated` and benefit from high performance animations. It resulted in philosophy shift that might be tricky to adopt in some cases.

Most changes are related to giving each screen more control via `navigationOptions`. Interpolating styles during transitions, specifying card transparency, opening and closing callbacks now all belong there instead to the config of the whole navigator.

### Removal of `transitionConfig`

The least trivial change is related to drop of `transitionConfig` callback which was responsible for returning card styles (possibly animated) based on current and previous props. In consequence, apps often happened to have complicated logic for determining current screen, its phase (whether opening or closing) and relation to others.

Now, using `cardStyleInterpolator`s, each screen (or all via `defaultNavigationConfig`) gets its own interpolator, allowing for more fine-grained styling. The drawback of this approach is that arguments to this callback provide less information, especially lacking properties of previous screen.

### `transitionSpec`

TODO
