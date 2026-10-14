---
id: icons
title: Icons
sidebar_label: Using Icons
---

Many components in React Navigation accept icons to customize their appearance. Depending on the component and platform, different types of icons are supported.

Here are some common places where icons are used in React Navigation:

- [`tabBarIcon`](bottom-tab-navigator.md#tabbaricon) option in Bottom Tab Navigator
- [`tabBarIcon`](material-top-tab-navigator.md#tabbaricon) option in Material Top Tabs Navigator
- [`drawerIcon`](drawer-navigator.md#drawericon) option in Drawer Navigator
- [`icon`](drawer-navigator.md#draweritem) prop in `DrawerItem` component
- [`headerBackIcon`](native-stack-navigator.md#headerbackicon) option in Native Stack Navigator
- [`headerBackIcon`](stack-navigator.md#headerbackicon) option in Stack Navigator
- [`icon`](elements.md#headerbackbutton) prop in `HeaderBackButton` component
- [`icon`](drawer-navigator.md#headerleft) prop in `DrawerToggleButton` component
- [`icon`](native-stack-navigator.md#header-items) property in Native Stack header items (iOS only, `image` and `sfSymbol` only)

Typically, components accept an icon object with a `type` property:

- [`sfSymbol`](#sf-symbols) (iOS only)

  ```js
  headerBackIcon: {
    type: 'sfSymbol',
    name: 'arrow.left',
  }
  ```

- [`materialSymbol`](#material-symbols) (Android only)

  ```js
  headerBackIcon: {
    type: 'materialSymbol',
    name: 'arrow_back',
  }
  ```

- [`image`](#images) (All platforms)

  ```js
  headerBackIcon: {
    type: 'image',
    source: require('./path/to/icon.png'),
  }
  ```

The `sfSymbol` and `materialSymbol` types use the respective icon libraries on each platform. The `image` type allows you to use a custom image as an icon on any platform, drawable resources on Android, and asset catalog images on iOS.

## SF Symbols

SF Symbols is a library of over 6,900 symbols designed to integrate well with the San Francisco system font on Apple platforms. It comes included with iOS and other Apple platforms.

Where SF Symbols are supported, icon options and props accept an object with `type: 'sfSymbol'` and a `name` property to specify the SF Symbol to use:

```js
tabBarIcon: {
  type: 'sfSymbol',
  name: 'star.fill',
}
```

The `renderingMode` property can be used to specify how to color the symbol:

- `monochrome`: Single color, using the tint color.
- `multicolor`: Uses the symbol's built-in multicolor scheme.

System symbols use a single color by default.

Example:

```js
tabBarIcon: {
  type: 'sfSymbol',
  name: 'cloud.sun.rain.fill',
  renderingMode: 'multicolor',
}
```

In addition, React Navigation also exports a `SFSymbol` component that you can use to render SF Symbols directly in your own components:

```js
import { SFSymbol } from '@react-navigation/native';

function MyComponent() {
  return <SFSymbol name="star.fill" size={24} />;
}
```

<video
  playsInline
  autoPlay
  muted
  loop
  style={{ width: '400px', aspectRatio: 4 / 5 }}
>
  <source src="/assets/icons/sf-symbol.mp4" />
</video>

The component accepts the following props:

- `name`

  The name of the SF Symbol to display (required).

  The SF Symbol icons have multiple variants for the same icon. Different variants can be used by adding a suffix to the name. For example, `star`, `star.fill`, and `star.circle` are all variants of the star symbol.

  You can browse the available symbols and their variants in the [SF Symbols app](https://developer.apple.com/sf-symbols/).

- `size`

  The size of the symbol. Defaults to `24`.

- `color`

  The color of the symbol. Defaults to black.

  In `monochrome` mode, this is used as the tint color. In `hierarchical` and `palette` modes, it is used as the fallback for `colors.primary`.

- `weight`

  The weight of the symbol. Defaults to `regular`.

  Can be one of:
  - `'thin'` (`100`)
  - `'ultralight'` (`200`)
  - `'light'` (`300`)
  - `'regular'` (`400`)
  - `'medium'` (`500`)
  - `'semibold'` (`600`)
  - `'bold'` (`700`)
  - `'extrabold'` (`800`)
  - `'black'` (`900`)

- `scale`

  The scale variant of the symbol relative to its font size. Defaults to `medium`.

  Can be one of:
  - `'small'`
  - `'medium'`
  - `'large'`

- `variableValue`

  A value between `0` and `1` used to customize variable symbols.

  Variable symbols, such as `wifi` or `speaker.wave.3`, have layers that progressively activate to represent a magnitude. `0` renders the fewest layers, while `1` renders the full symbol.

  This can be used for status indicators such as signal strength, battery level, volume, brightness, or progress. It has no effect on symbols that aren't variable.

- `variableValueMode`

  How the partial state from `variableValue` is rendered. Requires iOS 26+. Ignored on earlier versions. Defaults to `automatic`.

  Can be one of:
  - `'automatic'`: The system chooses based on the symbol.
  - `'color'`: Inactive layers are faded with opacity.
  - `'draw'`: Layers are partially drawn instead of faded.

- `renderingMode`

  The rendering mode of the symbol. Can be one of:
  - `'monochrome'` (default): Single color tint.
  - `'hierarchical'`: Derived hierarchy from a single color.
  - `'palette'`: Explicit colors for each layer.
  - `'multicolor'`: Symbol's built-in multicolor scheme.

- `colors`

  Object of colors to use for non-monochrome rendering modes. It can have the following properties:
  - `primary`: Base color for `hierarchical` mode.
  - `secondary`: Second layer in `palette` mode.
  - `tertiary`: Third layer in `palette` mode.

  Ignored when `renderingMode` is `'multicolor'`. If the prop is not provided, the primary color defaults to the `color` prop.

  Example:

  ```js
  <SFSymbol
    name="star.fill"
    size={30}
    renderingMode="palette"
    colors={{
      primary: 'red',
      secondary: 'yellow',
      tertiary: 'blue',
    }}
  />
  ```

- `colorRenderingMode`

  How color is applied across the symbol's layers. Requires iOS 26+. Ignored on earlier versions. Defaults to `automatic`.

  Can be one of:
  - `'automatic'`: The system chooses based on the symbol.
  - `'flat'`: A solid color per layer.
  - `'gradient'`: A gradient derived from each layer's color.

- `effect`

  The symbol effect to apply. Requires iOS 17+. Effects introduced in later iOS versions are ignored on earlier versions.

  It can be a string with the following values:
  - `'bounce'`
  - `'pulse'`
  - `'appear'`
  - `'disappear'`
  - `'variableColor'`
  - `'scale'`
  - `'breathe'`
  - `'wiggle'`
  - `'rotate'`
  - `'drawOn'`
  - `'drawOff'`

  Or a custom effect object with a `type` property and additional options:

  ```js
  <SFSymbol
    name="bell.fill"
    effect={{
      type: 'bounce',
      direction: 'up',
      repeat: { count: 2, delay: 0.2 },
      speed: 1.5,
      scope: 'wholeSymbol',
    }}
  />
  ```

  All effects support the following options:
  - `type`: The effect to apply. One of the values listed above.
  - `speed`: Speed multiplier for the effect. Defaults to `1`.
  - `repeat`: Repeat behavior. Supported values are:
    - `'continuous'`: Repeat indefinitely with no delay.
    - `'nonRepeating'`: Run the effect once.
    - An object with the following properties:
      - `count`: Number of times to repeat the effect.
      - `delay`: Delay in seconds between repeated effect cycles.

  Some options are only supported by specific effects:
  - `bounce`, `appear`, `disappear`, and `scale`:
    - `direction`: Direction for the effect. Can be one of:
      - `'up'`
      - `'down'`
    - `scope`: Whether to animate the whole symbol at once or by layer. Can be one of:
      - `'byLayer'` (default)
      - `'wholeSymbol'`

  - `pulse`:
    - `scope`: Whether to animate the whole symbol at once or by layer. Can be one of:
      - `'byLayer'` (default)
      - `'wholeSymbol'`

  - `breathe`:
    - `variant`: Breathe effect variant. Can be one of:
      - `'plain'`
      - `'pulse'`
    - `scope`: Whether to animate the whole symbol at once or by layer. Can be one of:
      - `'byLayer'` (default)
      - `'wholeSymbol'`

  - `wiggle`:
    - `direction`: Direction for the effect. Can be one of:
      - `'up'`
      - `'down'`
      - `'left'`
      - `'right'`
      - `'forward'`
      - `'backward'`
      - `'clockwise'`
      - `'counterClockwise'`
    - `angle`: Custom wiggle angle in degrees. Overrides `direction` when set.
    - `scope`: Whether to animate the whole symbol at once or by layer. Can be one of:
      - `'byLayer'` (default)
      - `'wholeSymbol'`

  - `rotate`:
    - `direction`: Direction for the effect. Can be one of:
      - `'clockwise'`
      - `'counterClockwise'`
    - `scope`: Whether to animate the whole symbol at once or by layer. Can be one of:
      - `'byLayer'` (default)
      - `'wholeSymbol'`

  - `drawOn`:
    - `scope`: Whether to animate the whole symbol at once, by layer, or individually. Can be one of:
      - `'byLayer'` (default)
      - `'wholeSymbol'`
      - `'individually'`

  - `drawOff`:
    - `scope`: Whether to animate the whole symbol at once, by layer, or individually. Can be one of:
      - `'byLayer'` (default)
      - `'wholeSymbol'`
      - `'individually'`
    - `drawDirection`: Whether the animation follows the symbol's authored draw order or plays it in reverse. Can be one of:
      - `'nonReversed'`: Follows the symbol's draw order.
      - `'reversed'`: Plays the draw order in reverse.

  - `variableColor`:
    - `reversing`: Whether the effect reverses with each cycle. Defaults to `false`.
    - `cumulative`: Whether layers light up cumulatively and stay active through the cycle. Defaults to `false`.
    - `inactiveLayers`: How inactive layers are displayed. Can be one of:
      - `'hide'`: Inactive layers are invisible.
      - `'dim'`: Inactive layers stay visible but faded.

- `contentTransition`

  The transition to apply when the symbol `name` or `variableValue` changes. Requires iOS 17+. Ignored on earlier versions.

  It can be a string with the following values:
  - `'automatic'`
  - `'replace'`

  Or a custom transition object:

  ```js
  <SFSymbol
    name={isConnected ? 'wifi' : 'wifi.slash'}
    contentTransition={{
      type: 'replace',
      magic: true,
    }}
  />
  ```

  Transitions have the following options:
  - `type`: The transition to apply. One of the values listed above.
  - `speed`: Speed multiplier for the transition. Defaults to `1`.
  - `variant`: Direction for the `replace` transition. Can be one of:
    - `'downUp'`
    - `'upUp'`
    - `'offUp'`
  - `scope`: Whether the `replace` transition runs by layer or on the whole symbol. Can be one of:
    - `'byLayer'` (default)
    - `'wholeSymbol'`
  - `magic`: Whether to prefer Magic Replace for `replace` transitions when possible. Falls back to regular Replace on iOS 17.

  This can be used to animate changes to the icon in response to state. For example, changing `wifi` to `wifi.slash` with a `magic` replace transition animates the slash across the symbol.

  <video
    playsInline
    autoPlay
    muted
    loop
    style={{ width: '150px', aspectRatio: 1 / 1 }}
  >
    <source src="/assets/icons/sf-symbol-magic-replace.mp4"></source>
  </video>

- `style`

  Plain style object for the symbol's native view. If you need to pass a style array, use `StyleSheet.flatten` to convert it to a plain style object.

### Custom SF Symbol names

The `SFSymbol` component and the icon objects support custom SF Symbols included in the app's asset catalog as well. But TypeScript needs to be informed about these custom names to provide proper type checking.

To do this, you can extend the `SFSymbolNames` interface with module augmentation:

```tsx
import '@react-navigation/native';

declare module '@react-navigation/native' {
  interface SFSymbolNames {
    'my.custom.symbol': true;
  }
}
```

They can then be used in the `SFSymbol` component and icon objects:

```js
tabBarIcon: {
  type: 'sfSymbol',
  name: 'my.custom.symbol',
}
```

To generate custom SF Symbols from SVG files, see [React Native Nano Icons](#react-native-nano-icons).

## Material Symbols

Material Symbols is a library of over 2,500 glyphs designed to integrate well with Material Design on Android.

Unlike SF Symbols, Material Symbols are not included on Android. So React Navigation includes copies of the Material Symbols fonts to render the icons. By default, it uses the `"outlined"` variant with `400` weight.

You can customize which variant and weights are included in the bundle by setting a `"react-navigation"` key in your app's `package.json`:

```json
"react-navigation": {
  "material-symbols": {
    "fonts": [
      {
        "variant": "rounded",
        "weights": [300],
        "fills": [0, 1]
      }
    ]
  }
}
```

This will include the `"rounded"` variant with `300` weight, and the unfilled (`0`) and filled (`1`) forms in the bundle.

If you don't use Material Symbols and want to reduce your app size, you can also disable the font entirely by specifying an empty array for `fonts`:

```json
"react-navigation": {
  "material-symbols": {
    "fonts": []
  }
}
```

:::info

You'll need to rebuild your app after changing the font configuration in `package.json`.

:::

Where Material Symbols are supported, icon options and props accept an object with `type: 'materialSymbol'` and a `name` property to specify the Material Symbol to use:

```js
tabBarIcon: {
  type: 'materialSymbol',
  name: 'star',
}
```

The behavior differs depending on the weights and variants included in the bundle. If there is a single variant and weight included, it will be used by default. You don't need to specify the variant or weight in the icon object. The built-in icons such as icons in the header will also use the included variant and weight automatically.

If multiple variants or weights are included, `outlined` and `400` are used if available. Otherwise, you'll need to specify the variant or weight explicitly by specifying the `variant` and `weight` properties in the icon object to choose which one to use:

```js
tabBarIcon: {
  type: 'materialSymbol',
  name: 'star',
  variant: 'rounded',
  weight: 300,
}
```

Similarly, if there is a single fill included for the selected variant and weight, it will be used by default. If both unfilled and filled forms are included, the unfilled form will be used by default.

In addition, React Navigation also exports a `MaterialSymbol` component that you can use to render Material Symbols directly in your own components:

```js
import { MaterialSymbol } from '@react-navigation/native';

function MyComponent() {
  return <MaterialSymbol name="star" size={24} />;
}
```

<video playsInline autoPlay muted loop style={{ width: '400px', aspectRatio: 4 / 5 }}>

  <source src="/assets/icons/material-symbol.mp4" />
</video>

The component accepts the following props:

- `name`

  The name of the Material Symbol to display (required).

  You can browse the available symbols in the [Material Symbols website](https://fonts.google.com/icons).

- `size`

  The size of the symbol. Defaults to `24`.

- `color`

  The color of the symbol. Defaults to black.

- `variant`

  The variant of the symbol. Can be one of:
  - `'outlined'`
  - `'rounded'`
  - `'sharp'`

  The available variants depend on which variants are included in the bundle. If the specified variant is not included, it will throw an error.

- `weight`

  The weight of the symbol. Can be one of:
  - `"thin"` (`100`)
  - `"ultralight"` (`200`)
  - `"light"` (`300`)
  - `"regular"` (`400`)
  - `"medium"` (`500`)
  - `"semibold"` (`600`)
  - `"bold"` (`700`)

  The available weights depend on which weights are included in the bundle. If the specified weight is not included, it will throw an error.

- `fill`

  Whether to use the filled symbol. Automatically set if only one fill is available for the selected variant and weight. Defaults to `false` when both are included.

  The available fills depend on which fills are included in the bundle (`0` for unfilled, `1` for filled). If the specified fill is not included, it will throw an error.

- `style`

  Plain style object for the symbol's native view. If you need to pass a style array, use `StyleSheet.flatten` to convert it to a plain style object.

## Images

React Navigation also supports using images as icons. It supports the same formats as React Native's [`Image`](https://reactnative.dev/docs/image) component.

You can use the `type: 'image'` option with a `source` property pointing to your image file:

```js
tabBarIcon: {
  type: 'image',
  source: require('./path/to/icon.png'),
}
```

:::note

It's necessary to provide icons for multiple screen densities (1x, 2x, 3x), e.g.: `icon.png`, `icon@2x.png`, `icon@3x.png`, as icons are not scaled automatically on iOS.

:::

Images also include [drawable resources](https://developer.android.com/guide/topics/resources/drawable-resource) on Android and [asset catalogs](https://developer.apple.com/documentation/xcode/adding-images-to-your-xcode-project) on iOS, which can be specified using `uri`:

```js
tabBarIcon: {
  type: 'image',
  source: { uri: 'icon_name' },
}
```

Here `icon_name` is the resource name without the file extension. On Android, this can refer to a bitmap drawable such as `res/drawable/icon_name.png` or a vector drawable such as `res/drawable/icon_name.xml`. On iOS, this can refer to an image in an asset catalog, such as an image set named `icon_name`. To generate vector drawables from SVG files, see [React Native Nano Icons](#react-native-nano-icons).

## Other sources

### [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

The React Native Vector Icons library provides various sets of font icons. Font icons cannot be used directly in most native navigation components such as tab bars or headers. But they can be [rasterized into images](https://github.com/oblador/react-native-vector-icons?tab=readme-ov-file#usage-as-png-imagesource-object) and used with the `type: 'image'` option.

To do this, install the appropriate icon package, such as `@react-native-vector-icons/lucide`, then install `@react-native-vector-icons/get-image` and rebuild the app.

Now you can use the `getImageSourceSync` to create the image:

```js
import { Lucide } from '@react-native-vector-icons/lucide';

// ...

tabBarIcon: {
  type: 'image',
  source: Lucide.getImageSourceSync('heart', 22),
},
```

### [React Native Nano Icons](https://github.com/software-mansion-labs/react-native-nano-icons)

[React Native Nano Icons](https://nano-icons.swmansion.com/) provides a way to use custom SVG files as performant font-based icons, both in JavaScript-based and native navigation components.

To use it, install the `react-native-nano-icons` package, then set it up depending on where the icons are rendered.

For JavaScript-based components, such as the `custom` [implementation](bottom-tab-navigator.md#implementation) of Bottom Tab Navigator, follow the [quick start](https://github.com/software-mansion-labs/react-native-nano-icons#-quick-start) and use the `Icon` component created with `createNanoIconSet`.

For native components, such as the tab bar with the `native` implementation, follow the [native symbols setup](https://github.com/software-mansion-labs/react-native-nano-icons#-native-symbols) to generate SF Symbols on iOS and vector drawables on Android from your SVG files, and rebuild the app.

Pass the SVG file name to the `nativeNanoSymbol` function to create a type-safe icon. For example, for `newspaper.svg`:

```js
import { nativeNanoSymbol } from 'react-native-nano-icons/symbols';

// ...

tabBarIcon: nativeNanoSymbol('newspaper'),
```

It returns `{ type: 'sfSymbol', name: 'nano.newspaper' }` on iOS, and `{ type: 'image', source: { uri: 'nano_newspaper' } }` on Android, which resolves to a native vector drawable asset.

The second argument specifies how to color the symbol:

- `monochrome` (default): Single color, using the tint color.
- `multicolor`: Uses the original colors of the SVG file.

For example, to show the colors only when the tab is focused:

```js
tabBarIcon: ({ focused }) =>
  nativeNanoSymbol('microscope', focused ? 'multicolor' : 'monochrome'),
```

<video
  playsInline
  autoPlay
  muted
  loop
  style={{ width: '400px', aspectRatio: 800 / 180 }}
>
  <source src="/assets/icons/nano-icons-ios.mp4" />
</video>

<video
  playsInline
  autoPlay
  muted
  loop
  style={{ width: '400px', aspectRatio: 800 / 202 }}
>
  <source src="/assets/icons/nano-icons-android.mp4" />
</video>

The generated symbols are named with the [prefix](https://github.com/software-mansion-labs/react-native-nano-icons#symbolsets-options) of the symbol set, `nano` by default, and are added to [`SFSymbolNames`](#custom-sf-symbol-names) automatically. They can also be rendered with the standalone `SFSymbol` component:

```js
import { SFSymbol } from '@react-navigation/native';

function MyComponent() {
  return <SFSymbol name="nano.newspaper" size={24} />;
}
```
