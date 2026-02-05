---
id: icons
title: Icons
sidebar_label: Using Icons
---

Many components in React Navigation accept icons to customize their appearance. Depending on the component and platform, different types of icons are supported.

Here are some common places where icons are used in React Navigation:

- [`tabBarIcon`](bottom-tab-navigator.md#tabbaricon) option in Bottom Tab Navigator
- [`headerBackIcon`](native-stack-navigator.md#headerbackicon) option in Native Stack Navigator
- [`headerBackIcon`](stack-navigator.md#headerbackicon) option in Stack Navigator
- [`icon`](elements.md#headerbackbutton) prop in `HeaderBackButton` component
- [`icon`](drawer-navigator.md#headerleft) option in `DrawerToggleButton` component

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

- `image`

  ```js
  headerBackIcon: {
    type: 'image',
    source: require('./path/to/icon.png'),
  }
  ```

The `sfSymbol` and `materialSymbol` types use the respective system icon libraries on each platform. The `image` type allows you to use a custom image as an icon on any platform.

## SF Symbols

SF Symbols is a library of over 6,900 symbols designed to integrate well with the San Francisco system font on Apple platforms. It comes included with iOS and other Apple platforms.

Options such as `tabBarIcon` and `headerBackIcon` accept an object with `type: 'sfSymbol'` and a `name` property to specify the SF Symbol to use:

```js
tabBarIcon: {
  type: 'sfSymbol',
  name: 'star.fill',
}
```

In addition, React Navigation also exports a `SFSymbol` component that you can use to render SF Symbols directly in your own components:

```js
import { SFSymbol } from '@react-navigation/native';

function MyComponent() {
  return <SFSymbol name="star.fill" size={24} />;
}
```

The component accepts the following props:

- `name`

  The name of the SF Symbol to display (required).

  The SF Symbol icons have multiple variants for the same icon. Different variants can be used by adding a suffix to the name. For example, `star`, `star.fill`, and `star.circle` are all variants of the star symbol.

  You can browse the available symbols and their variants in the [SF Symbols app](https://developer.apple.com/sf-symbols/).

- `size`

  The size of the symbol. Defaults to `24`.

- `color`

  The color of the symbol.

- `weight`

  The weight of the symbol. Can be one of:
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

  The scale of the symbol relative to the font size. Can be one of:
  - `'small'`
  - `'medium'`
  - `'large'`

- `mode`

  The rendering mode of the symbol. Can be one of:
  - `'monochrome'` (single color tint, default)
  - `'hierarchical'` (derived hierarchy from a single color)
  - `'palette'` (explicit colors for each layer)
  - `'multicolor'` (symbol's built-in multicolor scheme)

- `colors`

  Object of colors to use for `hierarchical` and `palette` modes. It can have the following properties:
  - `primary` (base color for `hierarchical` mode)
  - `secondary` (second layer in `palette` mode)
  - `tertiary` (third layer in `palette` mode).

  Example:

  ```js
  <SFSymbol
    name="star.fill"
    size={30}
    mode="palette"
    colors={{
      primary: 'red',
      secondary: 'yellow',
      tertiary: 'blue',
    }}
  />
  ```

  If the prop is not provided, the primary color defaults to the `color` prop.

- `animation`

  The animation effect to apply when the symbol changes. Requires iOS 17+. Ignored on earlier versions.

  It can be a string with the following values:
  - `'bounce'`
  - `'pulse'`
  - `'appear'`
  - `'disappear'`
  - `'variableColor'`
  - `'breathe'`
  - `'wiggle'`
  - `'rotate'`

  Or a custom animation object with the following properties:
  - `effect`: The animation effect to apply (such as `'bounce'`, `'pulse'`, etc.).
  - `repeating`: Whether the animation repeats continuously. Defaults to `false`.
  - `repeatCount`: Number of times to repeat the animation. Ignored if `repeating` is `true`.
  - `speed`: Speed multiplier for the animation. Defaults to `1`.
  - `wholeSymbol`: Whether to animate the whole symbol at once or layer by layer. Defaults to `false`.
  - `direction`: Direction of the animation. Applicable to `bounce` and `wiggle`.
  - `reversing`: Whether the variable color effect reverses with each cycle. Only applicable to `variableColor`. Defaults to `false`.
  - `cumulative`: Whether each layer remains changed until the end of the cycle. Only applicable to `variableColor`. Defaults to `false`.

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
        "weights": [300]
      }
    ]
  }
}
```

This will include the `"rounded"` variant with `300` weight in the bundle.

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

Options such as `tabBarIcon` and `headerBackIcon` accept an object with `type: 'materialSymbol'` and a `name` property to specify the Material Symbol to use:

```js
tabBarIcon: {
  type: 'materialSymbol',
  name: 'star',
}
```

The behavior differs depending on the weights and variants included in the bundle. If there is a single variant and weight included, it will be used by default. You don't need to specify the variant or weight in the icon object. The built-in icons such as icons in the header will also use the included variant and weight automatically.

If there are multiple variants or weights included, you can specify the `variant` and `weight` properties in the icon object to choose which one to use:

```js
tabBarIcon: {
  type: 'materialSymbol',
  name: 'star',
  variant: 'rounded',
  weight: 300,
}
```

In addition, React Navigation also exports a `MaterialSymbol` component that you can use to render Material Symbols directly in your own components:

```js
import { MaterialSymbol } from '@react-navigation/native';

function MyComponent() {
  return <MaterialSymbol name="star" size={24} />;
}
```

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
