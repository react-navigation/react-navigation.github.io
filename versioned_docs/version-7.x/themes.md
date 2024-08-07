---
id: themes
title: Themes
sidebar_label: Themes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Themes allow you to change the colors and fonts of various components provided by React Navigation. You can use themes to:

- Customize the colors and fonts to match your brand
- Provide light and dark themes based on the time of the day or user preference

## Basic usage

To pass a custom theme, you can pass the `theme` prop to the navigation container.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Simple theme" snack
// codeblock-focus-start
import * as React from 'react';
import {
  useNavigation,
  createStaticNavigation,
  DefaultTheme,
} from '@react-navigation/native';
// codeblock-focus-end
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

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

function SettingsScreen({ route }) {
  const navigation = useNavigation();
  const { user } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Text>userParam: {JSON.stringify(user)}</Text>
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

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={() =>
          navigation.navigate('Panel', {
            screen: 'Settings',
            params: { user: 'jane' },
          })
        }
      >
        Go to Settings
      </Button>
    </View>
  );
}

const PanelStack = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
    Settings: SettingsScreen,
  },
});

const Drawer = createDrawerNavigator({
  initialRouteName: 'Panel',
  screens: {
    Home: HomeScreen,
    Panel: PanelStack,
  },
});

// codeblock-focus-start

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  // highlight-next-line
  return <Navigation theme={MyTheme} />;
}
// codeblock-focus-end
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Simple theme" snack
// codeblock-focus-start
import * as React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
} from '@react-navigation/native';
// codeblock-focus-end
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

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

function SettingsScreen({ route }) {
  const navigation = useNavigation();
  const { user } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Text>userParam: {JSON.stringify(user)}</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'Settings',
            params: { user: 'jane' },
          })
        }
      >
        Go to Settings
      </Button>
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// codeblock-focus-start

export default function App() {
  return (
    // highlight-next-line
    <NavigationContainer theme={MyTheme}>
      <Drawer.Navigator useLegacyImplementation initialRouteName="Root">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
// codeblock-focus-start
```

</TabItem>
</Tabs>

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

Example theme:

```js
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

Providing a theme will take care of styling of all the official navigators. React Navigation also provides several tools to help you make your customizations of those navigators and the screens within the navigators can use the theme too.

## Built-in themes

As operating systems add built-in support for light and dark modes, supporting dark mode is less about keeping hip to trends and more about conforming to the average user expectations for how apps should work. In order to provide support for light and dark mode in a way that is reasonably consistent with the OS defaults, these themes are built in to React Navigation.

You can import the default and dark themes like so:

```js
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
```

## Keeping the native theme in sync

If you're changing the theme in the app, native UI elements such as Alert, ActionSheet etc. won't reflect the new theme. You can do the following to keep the native theme in sync:

```js
React.useEffect(() => {
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

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Operating system color theme" snack
import * as React from 'react';
// codeblock-focus-start
import {
  useNavigation,
  createStaticNavigation,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
// codeblock-focus-end
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

function SettingsScreen({ route }) {
  const navigation = useNavigation();
  const { user } = route.params;
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Settings Screen</Text>
      <Text style={{ color: colors.text }}>
        userParam: {JSON.stringify(user)}
      </Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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

function MyButton() {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ backgroundColor: colors.card }}>
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Home Screen</Text>
      <MyButton />
      <Button
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'Settings',
            params: { user: 'jane' },
          })
        }
      >
        Go to Settings
      </Button>
    </View>
  );
}

const PanelStack = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
    Settings: SettingsScreen,
  },
});

const Drawer = createDrawerNavigator({
  initialRouteName: 'Panel',
  screens: {
    Home: HomeScreen,
    Panel: PanelStack,
  },
});

// codeblock-focus-start

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  // highlight-next-line
  const scheme = useColorScheme();

  // highlight-next-line
  return <Navigation theme={scheme === 'dark' ? DarkTheme : DefaultTheme} />;
}

// codeblock-focus-end
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Operating system color theme" snack
import * as React from 'react';
// codeblock-focus-start
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
// codeblock-focus-end
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

function SettingsScreen({ route, navigation }) {
  const { user } = route.params;
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Settings Screen</Text>
      <Text style={{ color: colors.text }}>
        userParam: {JSON.stringify(user)}
      </Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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

function MyButton() {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ backgroundColor: colors.card }}>
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Home Screen</Text>
      <MyButton />
      <Button
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'Settings',
            params: { user: 'jane' },
          })
        }
      >
        Go to Settings
      </Button>
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// codeblock-focus-start

export default function App() {
  // highlight-next-line
  const scheme = useColorScheme();

  return (
    // highlight-next-line
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator useLegacyImplementation>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
// codeblock-focus-end
```

</TabItem>
</Tabs>

## Using the current theme in your own components

To gain access to the theme in any component that is rendered inside the navigation container:, you can use the `useTheme` hook. It returns the theme object:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="System themes" snack
import * as React from 'react';
// codeblock-focus-start
import {
  useNavigation,
  createStaticNavigation,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
// codeblock-focus-end
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

function SettingsScreen({ route }) {
  const navigation = useNavigation();
  const { user } = route.params;
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Settings Screen</Text>
      <Text style={{ color: colors.text }}>
        userParam: {JSON.stringify(user)}
      </Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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

// codeblock-focus-start

function MyButton() {
  // highlight-next-line
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ backgroundColor: colors.card }}>
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Home Screen</Text>
      <MyButton />
      <Button
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'Settings',
            params: { user: 'jane' },
          })
        }
      >
        Go to Settings
      </Button>
    </View>
  );
}

const PanelStack = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
    Settings: SettingsScreen,
  },
});

const Drawer = createDrawerNavigator({
  initialRouteName: 'Panel',
  screens: {
    Home: HomeScreen,
    Panel: PanelStack,
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  const scheme = useColorScheme();

  return <Navigation theme={scheme === 'dark' ? DarkTheme : DefaultTheme} />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="System themes" snack
import * as React from 'react';
// codeblock-focus-start
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
  useNavigation,
} from '@react-navigation/native';
// codeblock-focus-end
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

function SettingsScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { user } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Settings Screen</Text>
      <Text style={{ color: colors.text }}>
        userParam: {JSON.stringify(user)}
      </Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
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

// codeblock-focus-start

function MyButton() {
  // highlight-next-line
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ backgroundColor: colors.card }}>
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Home Screen</Text>
      <MyButton />
      <Button
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'Settings',
            params: { user: 'jane' },
          })
        }
      >
        Go to Settings
      </Button>
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator useLegacyImplementation initialRouteName="Root">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>
