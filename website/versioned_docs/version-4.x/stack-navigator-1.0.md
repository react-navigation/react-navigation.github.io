---
id: version-4.x-stack-navigator-1.0
title: createStackNavigator (1.x)
sidebar_label: createStackNavigator (1.x)
original_id: stack-navigator-1.0
---

Provides a way for your app to transition between screens where each new screen is placed on top of a stack.

By default the stack navigator is configured to have the familiar iOS and Android look & feel: new screens slide in from the right on iOS, fade in from the bottom on Android. On iOS the stack navigator can also be configured to a modal style where screens slide in from the bottom.

To use this navigator, ensure that you have [react-navigation and its dependencies installed](getting-started.md), then install [`react-navigation-stack`](https://github.com/react-navigation/stack/tree/1.0).

```sh
npm install react-navigation-stack@^1.10.3
```

## API

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

* `navigationOptions` - Navigation options for the navigator itself, to configure a parent navigator
* `defaultNavigationOptions` - Default navigation options to use for screens

- `paths` - A mapping of overrides for the paths set in the route configs
- `disableKeyboardHandling` - If true, the keyboard will NOT automatically dismiss when navigating to a new screen. Defaults to false. This is ignored in the web platform.

Visual options:

- `mode` - Defines the style for rendering and transitions:
  - `card` - Use the standard iOS and Android screen transitions. This is the default.
  - `modal` - Make the screens slide in from the bottom which is a common iOS pattern. Only works on iOS, has no effect on Android.
- `headerMode` - Specifies how the header should be rendered:
  - `float` - Render a single header that stays at the top and animates as screens are changed. This is a common pattern on iOS.
  - `screen` - Each screen has a header attached to it and the header fades in and out together with the screen. This is a common pattern on Android.
  - `none` - No header will be rendered.
- `headerBackTitleVisible` - A reasonable default is supplied for whether the back button title should be visible or not, but if you want to override that you can use `true` or `false` in this option.
- `headerTransitionPreset` - Specifies how the header should transition from one screen to another when `headerMode: float` is enabled.
  - `fade-in-place` - Header components cross-fade without moving, similar to the Twitter, Instagram, and Facebook app for iOS. This is the default value.
  - `uikit` - An approximation of the default behavior for iOS.
- `headerLayoutPreset` - Specifies how to lay out the header components.
  - `left` - Anchor the title to the left, near the back button or other left component. This is the default on Android. When used on iOS, the header back title is hidden. Content from the left component will overflow underneath the title, if you need to adjust this you can use `headerLeftContainerStyle` and `headerTitleContainerStyle`. Additionally, this alignment is incompatible with `headerTransitionPreset: 'uikit'`.
  - `center` - Center the title, this is the default on iOS.
- `cardStyle` - Use this prop to override or extend the default style for an individual card in stack.
- `cardShadowEnabled` - Use this prop to have visible shadows during transitions. Defaults to `true`
- `cardOverlayEnabled` - Use this prop to have visible stack card overlays during transitions. Defaults to `false`.
- `transitionConfig` - Function to return an object that is merged with the default screen transitions (take a look at TransitionConfig in [type definitions](https://github.com/react-navigation/stack/blob/1.0/src/types.tsx#L232)). Provided function will be passed the following arguments:
  - `transitionProps` - Transition props for the new screen.
  - `prevTransitionProps` - Transitions props for the old screen.
  - `isModal` - Boolean specifying if screen is modal.
- `onTransitionStart` - Function to be invoked when the card transition animation is about to start.
- `onTransitionEnd` - Function to be invoked once the card transition animation completes.
- `transparentCard` - _Experimental_ - Prop to keep all cards in the stack visible and add a transparent background instead of a white one. This is useful to implement things like modal dialogs where the previous scene should still be visible underneath the current one.

### `navigationOptions` for screens inside of the navigator

#### `title`

String that can be used as a fallback for `headerTitle`. Additionally, will be used as a fallback for `tabBarLabel` (if nested in a TabNavigator) or `drawerLabel` (if nested in a DrawerNavigator).

#### `header`

React Element or a function that given `HeaderProps` returns a React Element, to display as a header.

#### `headerShown`

Whether to show or hide the header for the screen. The header is shown by default unless `headerMode` was set to `none`. Setting this to `false` hides the header.

#### `headerTitle`

String, React Element or a function that returns a React Element to be used by the header. Defaults to scene `title`. When a function is used, it receives an object containing `allowFontScaling`, `style` and `children` properties. The `children` property contains the title string.

#### `headerTitleAllowFontScaling`

Whether header title font should scale to respect Text Size accessibility settings. Defaults to true.

#### `headerBackAllowFontScaling`

Whether back button title font should scale to respect Text Size accessibility settings. Defaults to false.

#### `headerBackImage`

Function which returns a React Element to display custom image in header's back button. When a function is used, it receives the `tintColor` in it's argument object. Defaults to Image component with back image source, which is the default back icon image for the platform (a chevron on iOS and an arrow on Android).

#### `headerBackTitle`

Title string used by the back button on iOS, or `null` to disable label. Defaults to the previous scene's `headerTitle`. `headerBackTitle` has to be defined in the origin screen, not in the destination screen. For instance, when you have a transition A to B and you want to disable the `headerBackTitle` on `B`:

```js
StackNavigator({
  A: {
    screen: AScreen,
    navigationOptions: () => ({
      title: `A`,
      headerBackTitle: null,
    }),
  },
  B: {
    screen: BScreen,
    navigationOptions: () => ({
      title: `B`,
    }),
  },
});
```

#### `headerTruncatedBackTitle`

Title string used by the back button when `headerBackTitle` doesn't fit on the screen. `"Back"` by default. `headerTruncatedBackTitle` has to be defined in the origin screen, not in the destination screen. For instance, when you have a transition A to B and you want to truncate the label on `B`:

```js
StackNavigator({
  A: {
    screen: AScreen,
    navigationOptions: () => ({
      title: `A`,
      headerBackTitle: 'A much too long text for back button from B to A',
      headerTruncatedBackTitle: `to A`,
    }),
  },
  B: {
    screen: BScreen,
    navigationOptions: () => ({
      title: `B`,
    }),
  },
});
```

#### `headerRight`

React Element to display on the right side of the header.

#### `headerLeft`

Function which returns a React Element to display on the left side of the header. When a function is used, it receives a number of arguments when rendered (`onPress`, `title`, `titleStyle` and more).

#### `headerStyle`

Style object for the header

#### `headerForceInset`

Allows to pass `forceInset` object to internal SafeAreaView used in the header.

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

Defaults to `false`. If `true`, the header will not have a background unless you explicitly provide it with `headerStyle` or `headerBackground`.

#### `headerBackground`

Use this with `headerTransparent` to provide a Function which returns a React Element to render in the background of the header. You can use this with a blur view, for example, to create a translucent header.

#### `headerBackgroundTransitionPreset`

One of `toggle` | `fade` | `translate`; lets you choose how to transition your custom `headerBackground` components between screens.

#### `gesturesEnabled`

Whether you can use gestures to dismiss this screen. Defaults to true on iOS, false on Android.

#### `gestureResponseDistance`

Object to override the distance of touch start from the edge of the screen to recognize gestures. It takes the following properties:

- `horizontal` - _number_ - Distance for horizontal direction. Defaults to 25.
- `vertical` - _number_ - Distance for vertical direction. Defaults to 135.

#### `gestureDirection`

String to override the direction for dismiss gesture. `default` for normal behaviour or `inverted` for right-to-left swipes.

#### `params`

You can provide default params inside route definitions:

```js
const Store = createStackNavigator({
  Playstation: { screen: ProductScreen, params: { product: 'Playstation' } },
  Xbox: { screen: ProductScreen, params: { product: 'Xbox' } },
});
```

### Examples

See the examples [SimpleStack.tsx](https://github.com/react-navigation/react-navigation-4/blob/master/example/src/SimpleStack.tsx) and [ModalStack.tsx](https://github.com/react-navigation/react-navigation-4/blob/master/example/src/ModalStack.tsx) which you can run locally as part of the [NavigationPlayground](https://github.com/react-navigation/react-navigation-4/tree/master/example) app.

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

We can't set the `StackNavigatorConfig`'s `mode` dynamically. Instead we are going to use a custom `transitionConfig` to render the specific transition we want - modal or card - on a screen by screen basis.

```js
import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation';

/* The screens you add to IOS_MODAL_ROUTES will have the modal transition.  */
const IOS_MODAL_ROUTES = ['OptionsScreen'];

let dynamicModalTransition = (transitionProps, prevTransitionProps) => {
  const isModal = IOS_MODAL_ROUTES.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName)
  );
  return StackViewTransitionConfigs.defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal
  );
};

const HomeStack = createStackNavigator(
  { DetailScreen, HomeScreen, OptionsScreen },
  { initialRouteName: 'HomeScreen', transitionConfig: dynamicModalTransition }
);
```

## Peer dependencies

react-navigation-stack depends on the following libraries in addition to react-navigation itself:

- react-native-gesture-handler
- react-native-screens
