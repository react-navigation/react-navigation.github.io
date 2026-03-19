---
id: themes
title: Themes
sidebar_label: Customizing Themes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemeColors from '@site/src/components/ThemeColors';

Themes allow you to change the colors and fonts of various components provided by React Navigation. You can use themes to:

- Customize the colors and fonts to match your brand
- Provide light and dark themes based on the time of the day or user preference

## Basic usage

To pass a custom theme, you can pass the `theme` prop to the navigation container.

```js name="Simple theme" snack static2dynamic
// codeblock-focus-start
import * as React from 'react';
import { createStaticNavigation, DefaultTheme } from '@react-navigation/native';
// codeblock-focus-end
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// codeblock-focus-start

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(140, 201, 125)',
    primary: 'rgb(255, 45, 85)',
  },
};
// codeblock-focus-end

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
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

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

// codeblock-focus-start

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return (
    <Navigation
      // highlight-next-line
      theme={MyTheme}
    />
  );
}
// codeblock-focus-end
```

You can change the theme prop dynamically and all the components will automatically update to reflect the new theme. If you haven't provided a `theme` prop, the default theme will be used.

## Properties

A theme is a JS object containing a list of colors to use. It contains the following properties:

- `dark` (`boolean`): Whether this is a dark theme or a light theme
- `colors` (`object`): Various colors used by react navigation components:
  - `primary` (`string`): The primary color of the app used to tint various elements. Usually you'll want to use your brand color for this.
  - `background` (`string`): The color of various backgrounds, such as the background color for the screens.
  - `card` (`string`): The background color of card-like elements, such as headers, tab bars etc.
  - `text` (`string`): The text color of various elements.
  - `border` (`string`): The color of borders, e.g. header border, tab bar border etc.
  - `notification` (`string`): The color of notifications and badge (e.g. badge in bottom tabs).
- `fonts` (`object`): Various fonts used by react navigation components:
  - `regular` (`object`): Style object for the primary font used in the app.
  - `medium` (`object`): Style object for the semi-bold variant of the primary font.
  - `bold` (`object`): Style object for the bold variant of the primary font.
  - `heavy` (`object`): Style object for the extra-bold variant of the primary font.

The style objects for fonts contain the following properties:

- `fontFamily` (`string`): The name of the font family (or font stack on Web) to use, e.g. `Roboto` or `Helvetica Neue`. The system fonts are used by default.
- `fontWeight` (`string`): The font weight to use. Valid values are `normal`, `bold`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`.

When creating a custom theme, you will need to provide all of these properties.

<details>
<summary>Example theme</summary>

```js
import { Platform } from 'react-native';

const WEB_FONT_STACK =
  'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
  fonts: Platform.select({
    web: {
      regular: {
        fontFamily: WEB_FONT_STACK,
        fontWeight: '400',
      },
      medium: {
        fontFamily: WEB_FONT_STACK,
        fontWeight: '500',
      },
      bold: {
        fontFamily: WEB_FONT_STACK,
        fontWeight: '600',
      },
      heavy: {
        fontFamily: WEB_FONT_STACK,
        fontWeight: '700',
      },
    },
    ios: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '600',
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '700',
      },
    },
    default: {
      regular: {
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'sans-serif-medium',
        fontWeight: 'normal',
      },
      bold: {
        fontFamily: 'sans-serif',
        fontWeight: '600',
      },
      heavy: {
        fontFamily: 'sans-serif',
        fontWeight: '700',
      },
    },
  }),
};
```

</details>

Providing a theme will take care of styling of all the official navigators. React Navigation also provides several tools to help you make your customizations of those navigators and the screens within the navigators can use the theme too.

## Built-in themes

React Navigation provides basic light and dark themes on all platforms:

### `DefaultTheme`

<ThemeColors>
- primary: rgb(0 122 255)
- background: rgb(242 242 242)
- card: rgb(255 255 255)
- text: rgb(28 28 30)
- border: rgb(216 216 216)
- notification: rgb(255 59 48)
</ThemeColors>

### `DarkTheme`

<ThemeColors>
- primary: rgb(10 132 255)
- background: rgb(1 1 1)
- card: rgb(18 18 18)
- text: rgb(229 229 231)
- border: rgb(39 39 41)
- notification: rgb(255 69 58)
</ThemeColors>

The built-in themes use system fonts which vary based on the platform.

They can be imported from the `@react-navigation/native` package:

```js
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
```

## Keeping the native theme in sync

If you're changing the theme in the app, native UI elements such as Alert, ActionSheet etc. won't reflect the new theme. You can do the following to keep the native theme in sync:

```js
React.useLayoutEffect(() => {
  const colorScheme = theme.dark ? 'dark' : 'light';

  if (Platform.OS === 'web') {
    document.documentElement.style.colorScheme = colorScheme;
  } else {
    Appearance.setColorScheme(colorScheme);
  }
}, [theme.dark]);
```

Alternatively, you can use the [`useColorScheme`](#using-the-operating-system-preferences) hook to get the current native color scheme and update the theme accordingly.

## Using the operating system preferences

On iOS 13+ and Android 10+, you can get user's preferred color scheme (`'dark'` or `'light'`) with the ([`useColorScheme` hook](https://reactnative.dev/docs/usecolorscheme)).

```js name="Operating system color theme" snack static2dynamic
import * as React from 'react';
// codeblock-focus-start
import {
  createStaticNavigation,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { View, Text, useColorScheme } from 'react-native';
// codeblock-focus-end
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
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

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

// codeblock-focus-start

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  // highlight-next-line
  const scheme = useColorScheme();

  return (
    <Navigation
      // highlight-next-line
      theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
    />
  );
}
// codeblock-focus-end
```

## Using the current theme in your own components

To gain access to the theme in any component that is rendered inside the navigation container:, you can use the `useTheme` hook. It returns the theme object:

```js name="System themes" snack static2dynamic
import * as React from 'react';
// codeblock-focus-start
import {
  createStaticNavigation,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
// codeblock-focus-end
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// codeblock-focus-start

function MyButton() {
  // highlight-next-line
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={{
        // highlight-next-line
        backgroundColor: colors.card,
      }}
    >
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Home Screen</Text>
      <MyButton />
    </View>
  );
}

function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Profile Screen</Text>
    </View>
  );
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  const scheme = useColorScheme();

  return <Navigation theme={scheme === 'dark' ? DarkTheme : DefaultTheme} />;
}
```
