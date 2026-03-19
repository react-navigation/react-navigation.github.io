---
id: native-stack-navigator
title: Native Stack Navigator
sidebar_label: Native Stack
---

<div className="feature-grid">

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/highlights/formsheet.mp4" /></video>

  [Form sheet](#form-sheets)

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/highlights/search-bar.mp4" /></video>

  [Search bar](#headersearchbaroptions)

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/highlights/large-title.mp4" /></video>

  [Large title header](#headerlargetitleenabled)

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/highlights/header-items.mp4" /></video>

  [Header items](#header-items)

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/highlights/transparent-modal.mp4" /></video>

  [Transparent modal](#presentation)

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/highlights/animation.mp4" /></video>

  [Transition animations](#animation)

</div>

Native Stack Navigator provides a way for your app to transition between screens where each new screen is placed on top of a stack.

<details>
<summary>Comparison with [Stack Navigator](stack-navigator.md)</summary>

The Native Stack navigator uses the native APIs `UINavigationController` on iOS and `Fragment` on Android. This means animations and gestures are handled by the platform, resulting in smoother transitions and better performance compared to the JavaScript-based [Stack Navigator](stack-navigator.md).

It also exposes native features such as large titles on iOS, form sheets etc., and offers a more native look and feel out of the box.

However, because it relies on native components, it may not support customizations or behaviors not supported by the underlying platforms.

</details>

## Installation

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/native-stack`](https://github.com/react-navigation/react-navigation/tree/main/packages/native-stack):

```bash npm2yarn
npm install @react-navigation/native-stack@next
```

## Usage

To use this navigator, import it from `@react-navigation/native-stack`:

```js name="Native Stack Navigator" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// codeblock-focus-end
function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const MyStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return <Navigation />;
}
```

:::info

If you encounter any bugs while using `createNativeStackNavigator`, please open issues on [`react-native-screens`](https://github.com/software-mansion/react-native-screens) rather than the `react-navigation` repository!

:::

## API Definition

### Props

The native stack navigator accepts the [common props](navigator.md#configuration) shared by all navigators.

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator:

#### `inactiveBehavior`

This controls what should happen when screens become inactive.

It supports the following values:

- `pause`: Effects are cleaned up - e.g. timers are cleared, subscriptions are removed, etc. This avoids unnecessary renders when the screen is inactive.
- `unmount`: The screen is unmounted when it becomes inactive.
- `none`: Screen renders normally.

Defaults to `pause`.

If you [`preload`](navigation-actions.md#preload) a screen, it won't be paused until after the first time it becomes focused.

If a screen contains a nested navigator, it won't be unmounted, but paused instead.

See [Inactive screens](navigation-lifecycle.md#inactive-screens) for more details.

#### `title`

String that can be used as a fallback for `headerTitle`.

#### `statusBarAnimation`

Sets the status bar animation (similar to the `StatusBar` component). Defaults to `fade` on iOS and `none` on Android.

Supported values:

- `"fade"`
- `"none"`
- `"slide"`

On Android, setting either `fade` or `slide` will set the transition of status bar color. On iOS, this option applies to the appearance animation of the status bar.

Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.

Only supported on Android and iOS.

#### `statusBarHidden`

Whether the status bar should be hidden on this screen.

Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.

Only supported on Android and iOS.

#### `statusBarStyle`

Sets the status bar color (similar to the `StatusBar` component).

Supported values:

- `"auto"` (iOS only)
- `"inverted"` (iOS only)
- `"dark"`
- `"light"`

Defaults to `auto` on iOS and `light` on Android.

Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.

Only supported on Android and iOS.

#### `contentStyle`

Style object for the scene content.

#### `animationMatchesGesture`

Whether the gesture to dismiss should use animation provided to `animation` prop. Defaults to `false`.

Doesn't affect the behavior of screens presented modally.

Only supported on iOS.

#### `fullScreenGestureEnabled`

Whether the gesture to dismiss should work on the whole screen. Using gesture to dismiss with this option results in the same transition animation as `simple_push`. This behavior can be changed by setting `customAnimationOnGesture` prop. Achieving the default iOS animation isn't possible due to platform limitations. Defaults to `false`.

Doesn't affect the behavior of screens presented modally.

Only supported on iOS.

#### `fullScreenGestureShadowEnabled`

Whether the full screen dismiss gesture has shadow under view during transition. Defaults to `true`.

This does not affect the behavior of transitions that don't use gestures enabled by `fullScreenGestureEnabled` prop.

#### `gestureEnabled`

Whether you can use gestures to dismiss this screen. Defaults to `true`. Only supported on iOS.

#### `animationTypeForReplace`

The type of animation to use when this screen replaces another screen. Defaults to `push`.

Supported values:

- `push`: the new screen will perform a push animation.
- `pop`: the new screen will perform a pop animation.

This can be useful to provide appropriate animations, such as `push` for login and `pop` for logout.

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/animation-type-for-replace.mp4" />
</video>

#### `animation`

How the screen should animate when pushed or popped.

Only supported on Android and iOS.

Supported values:

<div className="options-grid">

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/animation-default.mp4" /></video>

  `default`

  Use the platform default animation.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/animation-fade.mp4" /></video>

  `fade`

  Fade the screen in or out.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/animation-fade-from-bottom.mp4" /></video>

  `fade_from_bottom`

  Fade the new screen in from the bottom.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/animation-flip.mp4" /></video>

  `flip`

  Flip the screen. Requires `presentation: "modal"` on iOS.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/animation-simple-push.mp4" /></video>

  `simple_push`

  Use the default animation without the shadow and native header transition. On Android, this falls back to the default animation.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/animation-slide-from-bottom.mp4" /></video>

  `slide_from_bottom`

  Slide the new screen in from the bottom.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/animation-slide-from-right.mp4" /></video>

  `slide_from_right`

  Slide the new screen in from the right. On iOS, this falls back to the default animation.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/animation-slide-from-left.mp4" /></video>

  `slide_from_left`

  Slide the new screen in from the left. On iOS, this falls back to the default animation.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/animation-none.mp4" /></video>

  `none`

  Don't animate the screen.

</div>

#### `presentation`

How should the screen be presented.

Only supported on Android and iOS.

Supported values:

<div className="options-grid">

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/presentation-card.mp4" /></video>

  `card`

  The new screen will be pushed onto a stack, which means the default animation will be slide from the side on iOS, the animation on Android will vary depending on the OS version and theme.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/presentation-modal.mp4" /></video>

  `modal`

  The new screen will be presented modally. This also allows for a nested stack to be rendered inside the screen.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/presentation-contained-modal.mp4" /></video>

  `containedModal`

  Uses "UIModalPresentationCurrentContext" modal style on iOS and falls back to "modal" on Android.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/presentation-fullscreen-modal.mp4" /></video>

  `fullScreenModal`

  Uses "UIModalPresentationFullScreen" modal style on iOS and falls back to "modal" on Android. A screen using this presentation style can't be dismissed by gesture.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/presentation-transparent-modal.mp4" /></video>

  `transparentModal`

  The new screen will be presented modally, but in addition, the previous screen will stay so that the content below can still be seen if the screen has translucent background.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/presentation-contained-transparent-modal.mp4" /></video>

  `containedTransparentModal`

  Uses "UIModalPresentationOverCurrentContext" modal style on iOS and falls back to "transparentModal" on Android.

- <video playsInline autoPlay muted loop><source src="/assets/navigators/native-stack/presentation-formsheet-ios.mp4" /></video>

  `formSheet`

  Uses "BottomSheetBehavior" on Android and "UIModalPresentationFormSheet" modal style on iOS. See [Form Sheets](#form-sheets) for a detailed guide.

</div>

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

#### `autoHideHomeIndicator`

Boolean indicating whether the home indicator should prefer to stay hidden. Defaults to `false`.

Only supported on iOS.

#### `gestureDirection`

Sets the direction in which you should swipe to dismiss the screen.

Supported values:

- `vertical` – dismiss screen vertically
- `horizontal` – dismiss screen horizontally (default)

When using `vertical` option, options `fullScreenGestureEnabled: true`, `customAnimationOnGesture: true` and `animation: 'slide_from_bottom'` are set by default.

Only supported on iOS.

#### `animationDuration`

Changes the duration (in milliseconds) of `slide_from_bottom`, `fade_from_bottom`, `fade` and `simple_push` transitions on iOS. Defaults to `500`.

The duration is not customizable for:

- Screens with `default` and `flip` animations
- Screens with `presentation` set to `modal`, `formSheet`, `pageSheet` (regardless of animation)

Only supported on iOS.

#### `navigationBarHidden`

Boolean indicating whether the navigation bar should be hidden. Defaults to `false`.

Only supported on Android.

#### `freezeOnBlur`

Boolean indicating whether to prevent inactive screens from re-rendering. Defaults to `false`.
Defaults to `true` when `enableFreeze()` from `react-native-screens` package is run at the top of the application.

Only supported on iOS and Android.

#### `scrollEdgeEffects`

Configures the scroll edge effect for the _content ScrollView_ (the ScrollView that is present in first descendants chain of the Screen).
Depending on values set, it will blur the scrolling content below certain UI elements (e.g. header items, search bar) for the specified edge of the ScrollView.
When set in nested containers, i.e. Native Stack inside Native Bottom Tabs, or the other way around, the ScrollView will use only the innermost one's config.

Edge effects can be configured for each edge separately. The following values are currently supported:

- `automatic` - the automatic scroll edge effect style,
- `hard` - a scroll edge effect with a hard cutoff and dividing line,
- `soft` - a soft-edged scroll edge effect,
- `hidden` - no scroll edge effect.

Defaults to `automatic` for each edge.

:::note

Using both `blurEffect` and `scrollEdgeEffects` (>= iOS 26) simultaneously may cause overlapping effects.

:::

Only supported on iOS, starting from iOS 26.

### Form sheet options

The following options only work when [`presentation`](#presentation) is set to `formSheet`. See [Form Sheets](#form-sheets) for a detailed usage guide.

#### `sheetAllowedDetents`

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/sheet-allowed-detents.mp4" />
</video>

Describes heights where a sheet can rest.

Supported values: `'fitToContents'` or an array of fractions (e.g. `[0.25, 0.5, 0.75]`). The array must be sorted in ascending order. This invariant is verified only in development mode, where violation results in an error. Android is limited to 3 detents.

Defaults to `[1.0]`. Only supported on Android and iOS.

See [Configuring sheet sizes](#configuring-sheet-sizes) for usage examples.

#### `sheetElevation`

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/sheet-elevation.mp4" />
</video>

Integer value describing elevation of the sheet, impacting shadow on the top edge.

Not dynamic - changing it after the component is rendered won't have an effect.

Defaults to `24`. Only supported on Android.

#### `sheetExpandsWhenScrolledToEdge`

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/sheet-expands-when-scrolled-to-edge.mp4" />
</video>

Whether the sheet should expand to a larger detent when scrolling.

The `ScrollView` must be reachable by following the first child view at each level of the view hierarchy from the screen component.

Defaults to `true`. Only supported on iOS.

See [Scroll behavior](#scroll-behavior) for more details.

#### `sheetCornerRadius`

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/sheet-corner-radius.mp4" />
</video>

The corner radius of the sheet. If set to a non-negative value it will use the provided radius, otherwise the system default is used.

Only supported on Android and iOS.

#### `sheetInitialDetentIndex`

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/sheet-initial-detent-index.mp4" />
</video>

Index of the detent the sheet should expand to after being opened. If the specified index is out of bounds of the `sheetAllowedDetents` array, an error will be thrown in development mode and the value will be reset to the default in production.

Can also be set to `'last'` to open at the largest detent.

Defaults to `0`. Only supported on Android and iOS.

See [Configuring sheet sizes](#configuring-sheet-sizes) for usage examples.

#### `sheetGrabberVisible`

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/sheet-grabber-visible.mp4" />
</video>

Whether the sheet shows a grabber handle at the top.

Defaults to `false`. Only supported on iOS.

#### `sheetLargestUndimmedDetentIndex`

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/sheet-largest-undimmed-detent-index.mp4" />
</video>

The largest detent index for which the view underneath won't be dimmed.

Can be set to a number (index into `sheetAllowedDetents`), `'none'` (always dim), or `'last'` (never dim).

Defaults to `'none'`. Only supported on Android and iOS.

See [Controlling dimming](#controlling-dimming) for usage examples.

#### `sheetShouldOverflowTopInset`

Whether the sheet content should be rendered behind the status bar or display cutouts.

When `true`, detent ratios in `sheetAllowedDetents` are measured relative to the full stack height. When `false`, they are measured relative to the adjusted height (excluding the top inset).

Defaults to `false`. Only supported on Android.

#### `sheetResizeAnimationEnabled`

Whether the default native animation should be used when the sheet's content size changes (specifically when using `fitToContents`).

Set to `false` to implement custom resizing animations.

Defaults to `true`. Only supported on Android.

### Header related options

The navigator supports following options to configure the header:

#### `headerBackButtonMenuEnabled`

Boolean indicating whether to show the menu on longPress of iOS >= 14 back button. Defaults to `true`.

Only supported on iOS.

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/native-stack/header-back-button-menu-enabled.mp4" />
</video>

#### `headerBackVisible`

Whether the back button is visible in the header. You can use it to show a back button alongside `headerLeft` if you have specified it.

This will have no effect on the first screen in the stack.

#### `headerBackTitle`

Title string used by the back button on iOS. Defaults to the previous scene's title, "Back" or arrow icon depending on the available space. See `headerBackButtonDisplayMode` to read about limitations and customize the behavior.

Use `headerBackButtonDisplayMode: "minimal"` to hide it.

Only supported on iOS.

![Header back title](/assets/navigators/native-stack/header-back-title.png)

#### `headerBackButtonDisplayMode`

How the back button displays icon and title.

Supported values:

- "default" - Displays one of the following depending on the available space: previous screen's title, generic title (e.g. 'Back') or no title (only icon).
- "generic" – Displays one of the following depending on the available space: generic title (e.g. 'Back') or no title (only icon).
- "minimal" – Always displays only the icon without a title.

The space-aware behavior is disabled when:

- The iOS version is 13 or lower
- Custom font family or size is set (e.g. with `headerBackTitleStyle`)
- Back button menu is disabled (e.g. with `headerBackButtonMenuEnabled`)

In such cases, a static title and icon are always displayed.

Only supported on iOS.

#### `headerBackTitleStyle`

Style object for header back title. Supported properties:

- `fontFamily`
- `fontSize`

Only supported on iOS.

![Header back title style](/assets/navigators/native-stack/header-back-title-style.png)

Example:

```js
headerBackTitleStyle: {
  fontSize: 16,
  fontFamily: 'RobotoSlab_400Regular',
},
```

#### `headerBackIcon`

Icon to display in the header as the icon in the back button.

It supports the following types:

- `materialSymbol` (Android only)

  ```js
  headerBackIcon: {
    type: 'materialSymbol',
    name: 'arrow_back',
  }
  ```

  See [Icons](icons.md#material-symbols) for more details.

- `sfSymbol` (iOS only)

  ```js
  headerBackIcon: {
    type: 'sfSymbol',
    name: 'arrow.left',
  }
  ```

  See [Icons](icons.md#sf-symbols) for more details.

  This is only supported when using [`Header`](elements.md#header) from `@react-navigation/elements` as the header component. The native header doesn't support SF Symbols.

- `image`

  ```js
  headerBackIcon: {
    type: 'image',
    source: require('./path/to/icon.png'),
  }
  ```

Defaults to back icon image for the platform:

- A chevron on iOS
- An arrow on Android

#### `headerLargeStyle`

Style of the header when a large title is shown. The large title is shown if `headerLargeTitleEnabled` is `true` and the edge of any scrollable content reaches the matching edge of the header.

Supported properties:

- backgroundColor

Only supported on iOS.

#### `headerLargeTitleEnabled`

Whether to enable header with large title which collapses to regular header on scroll.
Defaults to `false`.

For large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`. If the scrollable area doesn't fill the screen, the large title won't collapse on scroll. You also need to specify `contentInsetAdjustmentBehavior="automatic"` in your `ScrollView`, `FlatList` etc.

Only supported on iOS.

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/native-stack/highlights/large-title.mp4" />
</video>

#### `headerLargeTitleShadowVisible`

Whether drop shadow of header is visible when a large title is shown.

#### `headerLargeTitleStyle`

Style object for large title in header. Supported properties:

- `fontFamily`
- `fontSize`
- `fontWeight`
- `color`

Only supported on iOS.

Example:

```js
headerLargeTitleStyle: {
  fontFamily: 'Georgia',
  fontSize: 22,
  fontWeight: '500',
  color: 'blue',
},
```

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

To get the height of the header, you can use [`HeaderHeightContext`](elements.md#headerheightcontext) with [React's Context API](https://react.dev/reference/react/useContext#contextconsumer) or [`useHeaderHeight`](elements.md#useheaderheight).

#### `headerBlurEffect`

Blur effect for the translucent header. The `headerTransparent` option needs to be set to `true` for this to work.

Supported values:

<div className="options-grid">

- ![Header blur effect extraLight](/assets/navigators/native-stack/header-blur-effect-extra-light.png)

  `extraLight`

- ![Header blur effect light](/assets/navigators/native-stack/header-blur-effect-light.png)

  `light`

- ![Header blur effect regular](/assets/navigators/native-stack/header-blur-effect-regular.png)

  `regular`

- ![Header blur effect prominent](/assets/navigators/native-stack/header-blur-effect-prominent.png)

  `prominent`

- ![Header blur effect systemUltraThinMaterial](/assets/navigators/native-stack/header-blur-effect-system-ultra-thin-material.png)

  `systemUltraThinMaterial`

- ![Header blur effect systemThinMaterial](/assets/navigators/native-stack/header-blur-effect-system-thin-material.png)

  `systemThinMaterial`

- ![Header blur effect systemMaterial](/assets/navigators/native-stack/header-blur-effect-system-material.png)

  `systemMaterial`

- ![Header blur effect systemThickMaterial](/assets/navigators/native-stack/header-blur-effect-system-thick-material.png)

  `systemThickMaterial`

- ![Header blur effect systemChromeMaterial](/assets/navigators/native-stack/header-blur-effect-system-chrome-material.png)

  `systemChromeMaterial`

- ![Header blur effect systemUltraThinMaterialLight](/assets/navigators/native-stack/header-blur-effect-system-ultra-thin-material-light.png)

  `systemUltraThinMaterialLight`

- ![Header blur effect systemThinMaterialLight](/assets/navigators/native-stack/header-blur-effect-system-thin-material-light.png)

  `systemThinMaterialLight`

- ![Header blur effect systemMaterialLight](/assets/navigators/native-stack/header-blur-effect-system-material-light.png)

  `systemMaterialLight`

- ![Header blur effect systemThickMaterialLight](/assets/navigators/native-stack/header-blur-effect-system-thick-material-light.png)

  `systemThickMaterialLight`

- ![Header blur effect systemChromeMaterialLight](/assets/navigators/native-stack/header-blur-effect-system-chrome-material-light.png)

  `systemChromeMaterialLight`

- ![Header blur effect dark](/assets/navigators/native-stack/header-blur-effect-dark.png)

  `dark`

- ![Header blur effect systemUltraThinMaterialDark](/assets/navigators/native-stack/header-blur-effect-system-ultra-thin-material-dark.png)

  `systemUltraThinMaterialDark`

- ![Header blur effect systemThinMaterialDark](/assets/navigators/native-stack/header-blur-effect-system-thin-material-dark.png)

  `systemThinMaterialDark`

- ![Header blur effect systemMaterialDark](/assets/navigators/native-stack/header-blur-effect-system-material-dark.png)

  `systemMaterialDark`

- ![Header blur effect systemThickMaterialDark](/assets/navigators/native-stack/header-blur-effect-system-thick-material-dark.png)

  `systemThickMaterialDark`

- ![Header blur effect systemChromeMaterialDark](/assets/navigators/native-stack/header-blur-effect-system-chrome-material-dark.png)

  `systemChromeMaterialDark`

</div>

:::note

Using both [`headerBlurEffect`](#headerblureffect) and `scrollEdgeEffects` (>= iOS 26) simultaneously may cause overlapping effects.

:::

Only supported on iOS.

#### `headerBackground`

Function which returns a React Element to render as the background of the header. This is useful for using backgrounds such as an image or a gradient.

Example:

```js
headerBackground: () => (
  <LinearGradient
    colors={['#c17388', '#90306f']}
    style={{ flex: 1 }}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  />
),
```

#### `headerTintColor`

Tint color for the header. Changes the color of back button and title.

#### `headerLeft`

Function which returns a React Element to display on the left side of the header. This replaces the back button. See `headerBackVisible` to show the back button along side left element. It receives the following properties in the arguments:

- `tintColor` - The tint color to apply. Defaults to the [theme](themes.md)'s primary color.
- `canGoBack` - Boolean indicating whether there is a screen to go back to.
- `label` - Label text for the button. Usually the title of the previous screen.
- `href` - The `href` to use for the anchor tag on web

Example:

```js
headerLeft: () => (
  <MaterialCommunityIcons name="map" color="gray" size={36} />
),
headerBackVisible: true,
headerBackTitle: 'Back',
```

#### `headerLeftBackgroundVisible`

Whether the liquid glass background is visible for the item.

Only supported on iOS 26.0 and later. Older versions of iOS and other platforms never show the background.

Defaults to `true`.

#### `unstable_headerLeftItems`

:::warning

This option is experimental and may change in a minor release.

:::

Function which returns an array of items to display as on the left side of the header. This will override `headerLeft` if both are specified. It receives the following properties in the arguments:

- `tintColor` - The tint color to apply. Defaults to the [theme](themes.md)'s primary color.
- `canGoBack` - Boolean indicating whether there is a screen to go back to.

Example:

```js
unstable_headerLeftItems: () => [
  {
    type: 'button',
    title: 'Edit',
    onPress: () => {
      // Do something
    },
  },
],
```

See [Header items](#header-items) for more information.

Only supported on iOS.

#### `headerRight`

Function which returns a React Element to display on the right side of the header. It receives the following properties in the arguments:

- `tintColor` - The tint color to apply. Defaults to the [theme](themes.md)'s primary color.
- `canGoBack` - Boolean indicating whether there is a screen to go back to.

```js
headerRight: () => <MaterialCommunityIcons name="map" color="blue" size={36} />;
```

#### `headerRightBackgroundVisible`

Whether the liquid glass background is visible for the item.

Only supported on iOS 26.0 and later. Older versions of iOS and other platforms never show the background.\

Defaults to `true`.

#### `unstable_headerRightItems`

:::warning

This option is experimental and may change in a minor release.

:::

Function which returns an array of items to display as on the right side of the header. This will override `headerRight` if both are specified. It receives the following properties in the arguments:

- `tintColor` - The tint color to apply. Defaults to the [theme](themes.md)'s primary color.
- `canGoBack` - Boolean indicating whether there is a screen to go back to.

Example:

```js
unstable_headerRightItems: () => [
  {
    type: 'button',
    title: 'Edit',
    onPress: () => {
      // Do something
    },
  },
],
```

See [Header items](#header-items) for more information.

Only supported on iOS.

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

Example:

```js
headerTitleStyle: {
  color: 'blue',
  fontSize: 22,
  fontFamily: 'Georgia',
  fontWeight: 300,
},
```

#### `headerSearchBarOptions`

Options to render a native search bar. Search bars are rarely static so normally it is controlled by passing an object to `headerSearchBarOptions` navigation option in the component's body.

On iOS, you also need to specify `contentInsetAdjustmentBehavior="automatic"` in your `ScrollView`, `FlatList` etc. If you don't have a `ScrollView`, specify `headerTransparent: false`.

Example:

```js
React.useLayoutEffect(() => {
  navigation.setOptions({
    headerSearchBarOptions: {
      // search bar options
    },
  });
}, [navigation]);
```

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/native-stack/highlights/search-bar.mp4" />
</video>

Supported properties are:

##### `ref`

Ref to manipulate the search input imperatively. It contains the following methods:

- `focus` - focuses the search bar
- `blur` - removes focus from the search bar
- `setText` - sets the search bar's content to given value
- `clearText` - removes any text present in the search bar input field
- `cancelSearch` - cancel the search and close the search bar
- `toggleCancelButton` - depending on passed boolean value, hides or shows cancel button (only supported on iOS)

##### `autoCapitalize`

Controls whether the text is automatically auto-capitalized as it is entered by the user.
Possible values:

- `systemDefault`
- `none`
- `words`
- `sentences`
- `characters`

Defaults to `systemDefault` which is the same as `sentences` on iOS and `none` on Android.

##### `autoFocus`

Whether to automatically focus search bar when it's shown. Defaults to `false`.

Only supported on Android.

##### `barTintColor`

The search field background color. By default bar tint color is translucent.

Only supported on iOS.

##### `tintColor`

The color for the cursor caret and cancel button text.

Only supported on iOS.

##### `cancelButtonText`

The text to be used instead of default `Cancel` button text.

Only supported on iOS. **Deprecated** starting from iOS 26.

##### `disableBackButtonOverride`

Whether the back button should close search bar's text input or not. Defaults to `false`.

Only supported on Android.

##### `hideNavigationBar`

Boolean indicating whether to hide the navigation bar during searching.

If left unset, system default is used.

Only supported on iOS.

##### `hideWhenScrolling`

Boolean indicating whether to hide the search bar when scrolling. Defaults to `true`.

Only supported on iOS.

##### `inputType`

The type of the input. Defaults to `"text"`.

Supported values:

- `"text"`
- `"phone"`
- `"number"`
- `"email"`

Only supported on Android.

##### `obscureBackground`

Boolean indicating whether to obscure the underlying content with semi-transparent overlay.

If left unset, system default is used.

Only supported on iOS.

##### `placement`

Controls preferred placement of the search bar. Defaults to `automatic`.

Supported values:

- `automatic`
- `stacked`
- `inline` (**deprecated** starting from iOS 26, it is mapped to `integrated`)
- `integrated` (available starting from iOS 26, on prior versions it is mapped to `inline`)
- `integratedButton` (available starting from iOS 26, on prior versions it is mapped to `inline`)
- `integratedCentered` (available starting from iOS 26, on prior versions it is mapped to `inline`)

Only supported on iOS.

##### `allowToolbarIntegration`

Boolean indicating whether the system can place the search bar among other toolbar items on iPhone.

Set this prop to `false` to prevent the search bar from appearing in the toolbar when `placement` is `automatic`, `integrated`, `integratedButton` or `integratedCentered`.

Defaults to `true`. If `placement` is set to `stacked`, the value of this prop will be overridden with `false`.

Only supported on iOS, starting from iOS 26.

##### `placeholder`

Text displayed when search field is empty.

##### `textColor`

The color of the text in the search field.

##### `hintTextColor`

The color of the hint text in the search field.

Only supported on Android.

##### `headerIconColor`

The color of the search and close icons shown in the header

Only supported on Android.

##### `shouldShowHintSearchIcon`

Whether to show the search hint icon when search bar is focused. Defaults to `true`.

Only supported on Android.

##### `onBlur`

A callback that gets called when search bar has lost focus.

##### `onCancelButtonPress`

A callback that gets called when the cancel button is pressed.

##### `onSearchButtonPress`

A callback that gets called when the search button is pressed.

```js
const [search, setSearch] = React.useState('');

React.useLayoutEffect(() => {
  navigation.setOptions({
    headerSearchBarOptions: {
      onSearchButtonPress: (event) => setSearch(event?.nativeEvent?.text),
    },
  });
}, [navigation]);
```

##### `onChange`

A callback that gets called when the text changes. It receives en event containing the current text value of the search bar.

Example:

```js
const [search, setSearch] = React.useState('');

React.useLayoutEffect(() => {
  navigation.setOptions({
    headerSearchBarOptions: {
      onChange: (event) => setSearch(event.nativeEvent.text),
    },
  });
}, [navigation]);
```

#### `headerShown`

Whether to show the header. The header is shown by default. Setting this to `false` hides the header.

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

Also see [icons documentation](icons.md) to use system icons such as [`SF Symbols`](https://developer.apple.com/sf-symbols/) and [Material Design Icons](https://material.io/resources/icons/) in your custom header.

Note that if you specify a custom header, the native functionality such as large title, search bar etc. won't work.

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

#### `gestureCancel`

This event is fired when the swipe back gesture is canceled. Only supported on iOS.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('gestureCancel', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

#### `sheetDetentChange`

This event is fired when the screen has [`presentation`](#presentation) set to `formSheet` and the sheet detent changes.

Event data:

- `e.data.index` - Index of the current detent in the `sheetAllowedDetents` array.
- `e.data.stable` - Boolean indicating whether the sheet is being dragged or settling. Only supported on Android. On iOS, this is always `true`.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('sheetDetentChange', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

### Helpers

The native stack navigator adds the following methods to the navigation object:

#### `replace`

Replaces the current screen with a new screen in the stack. The method accepts the following arguments:

- `name` - _string_ - Name of the route to push onto the stack.
- `params` - _object_ - Screen params to pass to the destination route.

```js
navigation.replace('Profile', { owner: 'Michaś' });
```

#### `push`

Pushes a new screen to the top of the stack and navigate to it. The method accepts the following arguments:

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

#### `popTo`

Navigates back to a previous screen in the stack by popping screens after it. The method accepts the following arguments:

- `name` - _string_ - Name of the route to navigate to.
- `params` - _object_ - Screen params to pass to the destination route.
- `options` - Options object containing the following properties:
  - `merge` - _boolean_ - Whether params should be merged with the existing route params, or replace them (when navigating to an existing screen). Defaults to `false`.

If a matching screen is not found in the stack, this will pop the current screen and add a new screen with the specified name and params.

```js
navigation.popTo('Profile', { owner: 'Michaś' });
```

If [`getId`](screen.md#id) is specified for the screen, `popTo` will match the screen by id instead of name.

#### `popToTop`

Pops all of the screens in the stack except the first one and navigates to it.

```js
navigation.popToTop();
```

### Hooks

The native stack navigator exports the following hooks:

#### `useAnimatedHeaderHeight`

The hook returns an animated value representing the height of the header. This is similar to [`useHeaderHeight`](elements.md#useheaderheight) but returns an animated value that changes as the header height changes, e.g. when expanding or collapsing large title or search bar on iOS.

It can be used to animate content along with header height changes.

```js
import { Animated } from 'react-native';
import { useAnimatedHeaderHeight } from '@react-navigation/native-stack';

const MyView = () => {
  const headerHeight = useAnimatedHeaderHeight();

  return (
    <Animated.View
      style={{
        height: 100,
        aspectRatio: 1,
        backgroundColor: 'tomato',
        transform: [{ translateY: headerHeight }],
      }}
    />
  );
};
```

## Form sheets

Form sheets present content in a sheet that slides up from the bottom of the screen. They are commonly used for secondary actions, forms, or detail views that don't need to take over the full screen.

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/presentation-formsheet-android.mp4" />
</video>

<video playsInline autoPlay muted loop> <source src="/assets/navigators/native-stack/presentation-formsheet-ios.mp4" />
</video>

To present a screen as a form sheet, set [`presentation`](#presentation) to `formSheet` in the screen's options:

```js name="Form Sheet" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';

// codeblock-focus-start
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation('Profile');

  return (
    <View style={{ padding: 15 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Profile Screen</Text>
      <Text style={{ marginTop: 10 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam accumsan
        euismod enim, quis porta ligula egestas sed. Maecenas vitae consequat
        odio, at dignissim lorem. Ut euismod eros ac mi ultricies, vel pharetra
        tortor commodo. Interdum et malesuada fames ac ante ipsum primis in
        faucibus. Nullam at urna in metus iaculis aliquam at sed quam. In
        ullamcorper, ex ut facilisis commodo, urna diam posuere urna, at
        condimentum mi orci ac ipsum. In hac habitasse platea dictumst. Donec
        congue pharetra ipsum in finibus. Nulla blandit finibus turpis, non
        vulputate elit viverra a. Curabitur in laoreet nisl.
      </Text>
      <Button onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
        Go back
      </Button>
    </View>
  );
}

// codeblock-focus-start
const MyStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        presentation: 'formSheet',
        headerShown: false,
        sheetAllowedDetents: 'fitToContents',
      },
    },
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return <Navigation />;
}
```

### Configuring sheet sizes

By default, a form sheet takes up the full screen height. You can customize the heights at which the sheet can rest using the [`sheetAllowedDetents`](#sheetalloweddetents) option:

- Use `'fitToContents'` to size the sheet based on its content:

  ```js
  {
    presentation: 'formSheet',
    sheetAllowedDetents: 'fitToContents',
  }
  ```

- Use an array of fractions to define specific heights as a fraction of the screen height. For example, to allow the sheet to rest at 25% and 75% of the screen:

  ```js
  {
    presentation: 'formSheet',
    sheetAllowedDetents: [0.25, 0.75],
  }
  ```

  :::warning

  The array must be sorted in ascending order. On Android, only up to 3 detents are supported - any additional values are ignored.

  :::

To control which detent the sheet opens at, use [`sheetInitialDetentIndex`](#sheetinitialdetentindex). By default, it opens at the first (smallest) detent:

```js
{
  presentation: 'formSheet',
  sheetAllowedDetents: [0.25, 0.5, 1],
  // Open at 50% height initially
  sheetInitialDetentIndex: 1,
}
```

You can also use `'last'` to open at the largest detent.

### Listening to detent changes

You can listen to the [`sheetDetentChange`](#sheetdetentchange) event to know when the user drags the sheet to a different detent:

```js
navigation.addListener('sheetDetentChange', (e) => {
  console.log('New detent index:', e.data.index);
  console.log('Is stable:', e.data.stable);
});
```

### Customizing appearance

#### Grabber

On iOS, you can show a grabber handle at the top of the sheet using [`sheetGrabberVisible`](#sheetgrabbervisible):

```js
{
  presentation: 'formSheet',
  sheetGrabberVisible: true,
}
```

#### Corner radius

Customize the corner radius of the sheet with [`sheetCornerRadius`](#sheetcornerradius). If not set, the system default is used:

```js
{
  presentation: 'formSheet',
  sheetCornerRadius: 20,
}
```

#### Elevation (Android)

On Android, control the sheet's shadow with [`sheetElevation`](#sheetelevation) (defaults to `24`):

```js
{
  presentation: 'formSheet',
  sheetElevation: 10,
}
```

#### Background color

If the content's height is less than the sheet's height, the remaining area may appear translucent or use the default theme background. To fix this, set `backgroundColor` in the `contentStyle` option:

```js
{
  presentation: 'formSheet',
  contentStyle: {
    backgroundColor: 'white',
  },
}
```

### Controlling dimming

By default, a dimmed overlay appears behind the sheet. Use [`sheetLargestUndimmedDetentIndex`](#sheetlargestundimmeddetentindex) to control when dimming is applied:

- `'none'` (default) - always show the dimming overlay.
- `'last'` - never show the dimming overlay.
- A number - the index of the largest detent that should **not** have dimming. The dimming overlay is shown when the sheet is at a larger detent.

For example, to only dim when the sheet is above the first detent:

```js
{
  presentation: 'formSheet',
  sheetAllowedDetents: [0.25, 0.5, 1],
  // No dimming at 25%, dimming at 50% and 100%
  sheetLargestUndimmedDetentIndex: 0,
}
```

:::warning

On iOS, the native implementation may resize the sheet without explicitly changing the detent level (e.g. when the keyboard appears). If the sheet exceeds the height for which a dimming view would normally be applied, the dimming view will appear even if the detent hasn't changed.

:::

### Scroll behavior

By default on iOS, scrolling inside the sheet can expand it to a larger detent. Control this with [`sheetExpandsWhenScrolledToEdge`](#sheetexpandswhenscrolledtoedge):

```js
{
  presentation: 'formSheet',
  sheetAllowedDetents: [0.5, 1],
  // Prevent scroll from expanding the sheet
  sheetExpandsWhenScrolledToEdge: false,
}
```

:::warning

For this interaction to work, the `ScrollView` must be reachable by following the first child view at each level of the view hierarchy from the screen component. This is a platform requirement.

:::

### Platform considerations

#### `flex: 1` limitations

Due to platform component integration issues with `react-native`, `presentation: 'formSheet'` has limited support for `flex: 1`:

- **Android**: Using `flex: 1` on a top-level content container with `sheetAllowedDetents: 'fitToContents'` causes the sheet to not display at all, leaving only the dimmed background visible. This is because the sheet, not the parent, is the source of the size. Use fixed detent values (e.g. `[0.4, 0.9]`) instead.
- **iOS**: `flex: 1` with `'fitToContents'` works properly, but setting fixed detent values causes the content to not fill the sheet height - it inherits the intrinsic size of its contents instead. This tradeoff is _currently_ necessary to prevent the ["sheet flickering" problem on iOS](https://github.com/software-mansion/react-native-screens/issues/1722).

If the content's height is less than the sheet's height, the remaining area may appear translucent or use the default theme background color. To fix this, set `backgroundColor` in the [`contentStyle`](#contentstyle) option.

#### Android-specific limitations

- Nested stack navigators and `headerShown` are not currently supported inside form sheet screens.
- Nested `ScrollView` components need `nestedScrollEnabled` set to `true`, but this does not work if the content's height is less than the `ScrollView`'s height. See [this PR](https://github.com/facebook/react-native/pull/44099) for details and a suggested [workaround](https://github.com/facebook/react-native/pull/44099#issuecomment-2058469661).

## Header items

The [`unstable_headerLeftItems`](#unstable_headerleftitems) and [`unstable_headerRightItems`](#unstable_headerrightitems) options allow you to add header items to the left and right side of the header respectively. These items can show native buttons, menus or custom React elements.

On iOS 26+, the header right items can also be collapsed into an overflow menu by the system when there is not enough space to show all items. Note that custom elements (with `type: 'custom'`) won't be collapsed into the overflow menu.

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/native-stack/highlights/header-items.mp4" />
</video>

There are 3 categories of items that can be displayed in the header:

### Action

A regular button that performs an action when pressed, or shows a menu.

Common properties:

- `type`: Must be `button` or `menu`.
- `label`: Label of the item. The label is not shown if `icon` is specified. However, it is used by screen readers, or if the header items get collapsed due to lack of space.
- `labelStyle`: Style object for the label. Supported properties:
  - `fontFamily`
  - `fontSize`
  - `fontWeight`
  - `color`
- `icon`: Optional icon to show instead of the label.

  The icon can be one of the following types:
  - Local image

    ```js
    icon: {
      type: 'image',
      source: require('./path/to/icon.png'),
    }
    ```

    It's necessary to provide icons for multiple screen densities (1x, 2x, 3x), e.g.: `icon.png`, `icon@2x.png`, `icon@3x.png` etc. as icons are not scaled automatically.

    It also supports [xcasset](https://developer.apple.com/documentation/xcode/adding-images-to-your-xcode-project):

    ```js
    icon: {
      type: 'image',
      source: { uri: 'icon_name' },
    }
    ```

    A `tinted` property can be used to control whether the icon should be tinted with the active/inactive color:

    ```js
    icon: {
      type: 'image',
      source: require('./path/to/icon.png'),
      tinted: false,
    }
    ```

    Set `tinted` to `false` if the image has its own colors that you want to preserve.

  - [SF Symbols](https://developer.apple.com/sf-symbols/) name

    ```js
    {
      type: 'sfSymbol',
      name: 'heart',
    }
    ```

- `variant`: Visual variant of the button. Supported values:
  - `plain` (default)
  - `done`
  - `prominent` (iOS 26+)
- `tintColor`: Tint color to apply to the item.
- `disabled`: Whether the item is disabled.
- `width`: Width of the item.
- `hidesSharedBackground` (iOS 26+): Whether the background this item may share with other items in the bar should be hidden. Setting this to `true` hides the liquid glass background.
- `sharesBackground` (iOS 26+): Whether this item can share a background with other items. Defaults to `true`.
- `identifier` (iOS 26+) - An identifier used to match items across transitions.
- `badge` (iOS 26+): An optional badge to display alongside the item. Supported properties:
  - `value`: The value to display in the badge. It can be a string or a number.
  - `style`: Style object for the badge. Supported properties:
    - `fontFamily`
    - `fontSize`
    - `fontWeight`
    - `color`
    - `backgroundColor`
- `accessibilityLabel`: Accessibility label for the item.
- `accessibilityHint`: Accessibility hint for the item.

Supported properties when `type` is `button`:

- `onPress`: Function to call when the button is pressed.
- `selected`: Whether the button is in a selected state.

Example:

```js
unstable_headerRightItems: () => [
  {
    type: 'button',
    label: 'Edit',
    icon: {
      type: 'sfSymbol',
      name: 'pencil',
    },
    onPress: () => {
      // Do something
    },
  },
],
```

Supported properties when `type` is `menu`:

- `changesSelectionAsPrimaryAction`: Whether the menu is a selection menu. Tapping an item in a selection menu will add a checkmark to the selected item. Defaults to `false`.
- `menu`: An object containing the menu items. It contains the following properties:
  - `title`: Optional title to show on top of the menu.
  - `multiselectable`: Whether multiple items in the menu can be selected (i.e. in "on" state). Defaults to `false`.
  - `layout`: How the menu items are displayed. Supported values:
    - `default` (default): menu items are displayed normally.
    - `palette`: menu items are displayed in a horizontal row.
  - `items`: An array of menu items. A menu item can be either an `action` or a `submenu`.
    - `action`: An object with the following properties:
      - `type`: Must be `action`.
      - `label`: Label of the menu item.
      - `description`: The secondary text displayed alongside the label of the menu item.
      - `icon`: Optional icon to show alongside the label. It accepts the same formats as `icon` above.

      - `onPress`: Function to call when the menu item is pressed.
      - `state`: Optional state of the menu item. Supported values:
        - `on`
        - `off`
        - `mixed`
      - `disabled`: Whether the menu item is disabled.
      - `destructive`: Whether the menu item is styled as destructive.
      - `hidden`: Whether the menu item is hidden.
      - `keepsMenuPresented`: Whether to keep the menu open after selecting this item. Defaults to `false`.
      - `discoverabilityLabel`: An elaborated title that explains the purpose of the action. On iOS, the system displays this title in the discoverability heads-up display (HUD). If this is not set, the HUD displays the label property.

    - `submenu`: An object with the following properties:
      - `type`: Must be `submenu`.
      - `label`: Label of the submenu item.
      - `icon`: Optional icon to show alongside the label. It accepts the same formats as `icon` above.

      - `inline`: Whether the menu is displayed inline with the parent menu. By default, submenus are displayed after expanding the parent menu item. Inline menus are displayed as part of the parent menu as a section. Defaults to `false`.
      - `layout`: How the submenu items are displayed. Supported values:
        - `default` (default): menu items are displayed normally.
        - `palette`: menu items are displayed in a horizontal row.
      - `destructive`: Whether the submenu is styled as destructive.
      - `multiselectable`: Whether multiple items in the submenu can be selected (i.e. in "on" state). Defaults to `false`.
      - `items`: An array of menu items (can be either `action` or `submenu`).

Example:

```js
unstable_headerRightItems: () => [
  {
    type: 'menu',
    label: 'Options',
    icon: {
      type: 'sfSymbol',
      name: 'ellipsis',
    },
    menu: {
      title: 'Options',
      items: [
        {
          type: 'action',
          label: 'Edit',
          icon: {
            type: 'sfSymbol',
            name: 'pencil',
          },
          onPress: () => {
            // Do something
          },
        },
        {
          type: 'submenu',
          label: 'More',
          items: [
            {
              type: 'action',
              label: 'Delete',
              destructive: true,
              onPress: () => {
                // Do something
              },
            },
          ],
        },
      ],
    },
  },
],
```

### Spacing

An item to add spacing between other items in the header.

Supported properties:

- `type`: Must be `spacing`.
- `spacing`: Amount of spacing to add.

```js
unstable_headerRightItems: () => [
  {
    type: 'button',
    label: 'Edit',
    onPress: () => {
      // Do something
    },
  },
  {
    type: 'spacing',
    spacing: 10,
  },
  {
    type: 'button',
    label: 'Delete',
    onPress: () => {
      // Do something
    },
  },
],
```

### Custom

A custom item to display any React Element in the header.

Supported properties:

- `type`: Must be `custom`.
- `element`: A React Element to display as the item.
- `hidesSharedBackground`: Whether the background this item may share with other items in the bar should be hidden. Setting this to `true` hides the liquid glass background on iOS 26+.

Example:

```js
unstable_headerRightItems: () => [
  {
    type: 'custom',
    element: <MaterialCommunityIcons name="map" color="gray" size={36} />,
  },
],
```

The advantage of using this over [`headerLeft`](#headerleft) or [`headerRight`](#headerright) options is that it supports features like shared background on iOS 26+.
