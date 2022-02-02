---
id: native-stack-navigator
title: Native Stack Navigator
sidebar_label: Native Stack
---

Native Stack Navigator provides a way for your app to transition between screens where each new screen is placed on top of a stack.

This navigator uses the native APIs `UINavigationController` on iOS and `Fragment` on Android so that navigation built with `createNativeStackNavigator` will behave exactly the same and have the same performance characteristics as apps built natively on top of those APIs. It also offers basic Web support using [`react-native-web`](https://github.com/necolas/react-native-web).

One thing to keep in mind is that while `@react-navigation/native-stack` offers native performance and exposes native features such as large title on iOS etc., it may not be as customizable as [`@react-navigation/stack`](stack-navigator.md) depending on your needs. So if you need more customization than what's possible in this navigator, consider using `@react-navigation/stack` instead - which is a more customizable JavaScript based implementation.

## Installation

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/native-stack`](https://github.com/react-navigation/react-navigation/tree/main/packages/native-stack):

```bash npm2yarn
npm install @react-navigation/native-stack
```

## API Definition

> 💡 If you encounter any bugs while using `createNativeStackNavigator`, please open issues on [`react-native-screens`](https://github.com/software-mansion/react-native-screens) rather than the `react-navigation` repository!

To use this navigator, import it from `@react-navigation/native-stack`:

<samp id="simple-native-stack" />

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

### Props

The `Stack.Navigator` component accepts following props:

#### `initialRouteName`

The name of the route to render on first load of the navigator.

#### `screenOptions`

Default options to use for the screens in the navigator.

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator:

#### `title`

String that can be used as a fallback for `headerTitle`.

#### `headerBackVisible`

Whether the back button is visible in the header. You can use it to show a back button alongside `headerLeft` if you have specified it.

This will have no effect on the first screen in the stack.

#### `headerBackTitle`

Title string used by the back button on iOS. Defaults to the previous scene's title, or "Back" if there's not enough space. Use `headerBackTitleVisible: false` to hide it.

Only supported on iOS.

#### `headerBackTitleVisible`

Whether the back button title should be visible or not.

Only supported on iOS.

#### `headerBackTitleStyle`

Style object for header back title. Supported properties:

- `fontFamily`
- `fontSize`

Only supported on iOS.

#### `headerBackImageSource`

Image to display in the header as the icon in the back button.  Defaults to back icon image for the platform

- A chevron on iOS
- An arrow on Android

#### `headerLargeStyle`

Style of the header when a large title is shown. The large title is shown if `headerLargeTitle` is `true` and the edge of any scrollable content reaches the matching edge of the header.

Supported properties:

- backgroundColor

Only supported on iOS.

#### `headerLargeTitle`

Whether to enable header with large title which collapses to regular header on scroll.

For large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`. If the scrollable area doesn't fill the screen, the large title won't collapse on scroll.

Only supported on iOS.

#### `headerLargeTitleShadowVisible`

Whether drop shadow of header is visible when a large title is shown.

#### `headerLargeTitleStyle`

Style object for large title in header. Supported properties:

- `fontFamily`
- `fontSize`
- `fontWeight`
- `color`

Only supported on iOS.

#### `headerShown`

Whether to show the header. The header is shown by default. Setting this to `false` hides the header.

#### `headerStyle`

Style object for header. Supported properties:

- `backgroundColor`

#### `headerShadowVisible`

Whether to hide the elevation shadow (Android) or the bottom border (iOS) on the header.

#### `headerTransparent`

Boolean indicating whether the navigation bar is translucent.

Defaults to `false`. Setting this to `true` makes the header absolutely positioned - so that the header floats over the screen so that it overlaps the content underneath, and changes the background color to `transparent` unless specified in `headerStyle`.

This is useful if you want to render a semi-transparent header or a blurred background.

Note that if you don't want your content to appear under the header, you need to manually add a top margin to your content. React Navigation won't do it automatically.

To get the height of the header, you can use [`HeaderHeightContext`](elements.md#headerheightcontext) with [React's Context API](https://reactjs.org/docs/context.html#contextconsumer) or [`useHeaderHeight`](elements.md#useheaderheight).

#### `headerBlurEffect`

Blur effect for the translucent header. The `headerTransparent` option needs to be set to `true` for this to work.

Supported values:

- `extraLight`
- `light`
- `dark`
- `regular`
- `prominent`
- `systemUltraThinMaterial`
- `systemThinMaterial`
- `systemMaterial`
- `systemThickMaterial`
- `systemChromeMaterial`
- `systemUltraThinMaterialLight`
- `systemThinMaterialLight`
- `systemMaterialLight`
- `systemThickMaterialLight`
- `systemChromeMaterialLight`
- `systemUltraThinMaterialDark`
- `systemThinMaterialDark`
- `systemMaterialDark`
- `systemThickMaterialDark`
- `systemChromeMaterialDark`

Only supported on iOS.

#### `headerTintColor`

Tint color for the header. Changes the color of back button and title.

#### `headerLeft`

Function which returns a React Element to display on the left side of the header. This replaces the back button. See `headerBackVisible` to show the back button along side left element.

#### `headerRight`

Function which returns a React Element to display on the right side of the header.

#### `headerTitle`

String or a function that returns a React Element to be used by the header. Defaults to `title` or name of the screen.

When a function is passed, it receives `tintColor` and`children` in the options object as an argument. The title string is passed in `children`.

Note that if you render a custom element by passing a function, animations for the title won't work.

#### `headerTitleAlign`

How to align the header title. Possible values:

- `left`
- `center`

Defaults to `left` on platforms other than iOS.

Not supported on iOS. It's always `center` on iOS and cannot be changed.

#### `headerTitleStyle`

Style object for header title. Supported properties:

- `fontFamily`
- `fontSize`
- `fontWeight`
- `color`

#### `headerSearchBarOptions`

Options to render a native search bar on iOS. Search bars are rarely static so normally it is controlled by passing an object to `headerSearchBarOptions` navigation option in the component's body.

Search bar is only supported on iOS.

Example:

```js
React.useEffect(() => {
  navigation.setOptions({
    headerSearchBarOptions: {
      // search bar options
    }
  });
}, [navigation]);
```

Supported properties are described below.

##### `autoCapitalize`

Controls whether the text is automatically auto-capitalized as it is entered by the user.
Possible values:

- `none`
- `words`
- `sentences`
- `characters`

Defaults to `sentences`.

##### `barTintColor`

The search field background color.

By default bar tint color is translucent.

##### `hideNavigationBar`

Boolean indicating whether to hide the navigation bar during searching.

Defaults to `true`.

##### `hideWhenScrolling`

Boolean indicating whether to hide the search bar when scrolling.

Defaults to `true`.

##### `obscureBackground`

Boolean indicating whether to obscure the underlying content with semi-transparent overlay.

Defaults to `true`.

##### `onBlur`

A callback that gets called when search bar has lost focus.

##### `onCancelButtonPress`

A callback that gets called when the cancel button is pressed.

##### `onChangeText`

A callback that gets called when the text changes. It receives the current text value of the search bar.

Example:

```js
const [search, setSearch] = React.useState('');

React.useEffect(() => {
  navigation.setOptions({
    headerSearchBar: {
      onChangeText: (event) => setSearch(event.nativeEvent.text),
    }
  });
}, [navigation]);
```

#### `header`

Custom header to use instead of the default header.

This accepts a function that returns a React Element to display as a header. The function receives an object containing the following properties as the argument:

- `navigation` - The navigation object for the current screen.
- `route` - The route object for the current screen.
- `options` - The options for the current screen
- `back` - Options for the back button, contains an object with a `title` property to use for back button label.

Example:

```js
import { getHeaderTitle } from '@react-navigation/elements';

// ..

header: ({ navigation, route, options, back }) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <MyHeader
      title={title}
      leftButton={
        back ? <MyBackButton onPress={navigation.goBack} /> : undefined
      }
      style={options.headerStyle}
    />
  );
};
```

To set a custom header for all the screens in the navigator, you can specify this option in the `screenOptions` prop of the navigator.

Note that if you specify a custom header, the native functionality such as large title, search bar etc. won't work.

#### `statusBarAnimation`

Sets the status bar animation (similar to the `StatusBar` component).

Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.

Only supported on iOS.

#### `statusBarHidden`

 Whether the status bar should be hidden on this screen.

Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.

Only supported on iOS.

#### `statusBarStyle`

Sets the status bar color (similar to the `StatusBar` component).

Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.

Only supported on iOS.

#### `contentStyle`

Style object for the scene content.

#### `customAnimationOnGesture`

Whether the gesture to dismiss should use animation provided to `animation` prop. Defaults to `false`.

Only supported on iOS.

#### `fullScreenGestureEnabled`

Whether the gesture to dismiss should work on the whole screen. Using gesture to dismiss with this option results in the same transition animation as `simple_push`. This behavior can be changed by setting `customAnimationOnGesture` prop. Achieving the default iOS animation isn't possible due to platform limitations. Defaults to `false`.

Only supported on iOS.

#### `gestureEnabled`

Whether you can use gestures to dismiss this screen. Defaults to `true`. Only supported on iOS.

#### `animationTypeForReplace`

The type of animation to use when this screen replaces another screen. Defaults to `pop`.

Supported values:

- `push`: the new screen will perform push animation.
- `pop`: the new screen will perform pop animation.

#### `animation`

How the screen should animate when pushed or popped.

Supported values:

- `default`: use the platform default animation
- `fade`: fade screen in or out
- `flip`: flip the screen, requires stackPresentation: "modal" (iOS only)
- `simple_push`: use the platform default animation, but without shadow and native header transition (iOS only)
- `slide_from_bottom`: slide in the new screen from bottom
- `slide_from_right`: slide in the new screen from right (Android only, uses default animation on iOS)
- `slide_from_left`: slide in the new screen from left (Android only, uses default animation on iOS)
- `none`: don't animate the screen

Only supported on Android and iOS.

#### `presentation`

How should the screen be presented.

Supported values:

- `card`: the new screen will be pushed onto a stack, which means the default animation will be slide from the side on iOS, the animation on Android will vary depending on the OS version and theme.
- `modal`: the new screen will be presented modally. this also allows for a nested stack to be rendered inside the screen.
- `transparentModal`: the new screen will be presented modally, but in addition, the previous screen will stay so that the content below can still be seen if the screen has translucent background.
- `containedModal`: will use "UIModalPresentationCurrentContext" modal style on iOS and will fallback to "modal" on Android.
- `containedTransparentModal`: will use "UIModalPresentationOverCurrentContext" modal style on iOS and will fallback to "transparentModal" on Android.
- `fullScreenModal`: will use "UIModalPresentationFullScreen" modal style on iOS and will fallback to "modal" on Android.
- `formSheet`: will use "UIModalPresentationFormSheet" modal style on iOS and will fallback to "modal" on Android.

Only supported on Android and iOS.

#### `orientation`

The display orientation to use for the screen.

Supported values:

- `default` - resolves to "all" without "portrait_down" on iOS. On Android, this lets the system decide the best orientation.
- `all`: all orientations are permitted.
- `portrait`: portrait orientations are permitted.
- `portrait_up`: right-side portrait orientation is permitted.
- `portrait_down`: upside-down portrait orientation is permitted.
- `landscape`: landscape orientations are permitted.
- `landscape_left`: landscape-left orientation is permitted.
- `landscape_right`: landscape-right orientation is permitted.

Only supported on Android and iOS.

### Events

The navigator can [emit events](navigation-events.md) on certain actions. Supported events are:

#### `transitionStart`

This event is fired when the transition animation starts for the current screen.

Event data:

- `e.data.closing` - Boolean indicating whether the screen is being opened or closed.

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

Event data:

- `e.data.closing` - Boolean indicating whether the screen was opened or closed.

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

The native stack navigator adds the following methods to the navigation prop:

#### `push`

Pushes a new screen to top of the stack and navigate to it. The method accepts following arguments:

- `name` - _string_ - Name of the route to push onto the stack.
- `params` - _object_ - Screen params to pass to the destination route.

```js
navigation.push('Profile', { owner: 'Michaś' });
```

#### `pop`

Pops the current screen from the stack and navigates back to the previous screen. It takes one optional argument (`count`), which allows you to specify how many screens to pop back by.

```js
navigation.pop();
```

#### `popToTop`

Pops all of the screens in the stack except the first one and navigates to it.

```js
navigation.popToTop();
```

## Example

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
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
