---
id: headers
title: Configuring the header bar
sidebar_label: Configuring the header bar
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

We've seen how to configure the header title already, but let's go over that again before moving on to some other options.

## Setting the header title

Each screen has an `options` property (an object or function returning an object) for configuring the navigator. For the header title, we can use the `title` option:

```js name="Setting header title" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const MyStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      // highlight-start
      options: {
        title: 'My home',
      },
      // highlight-end
    },
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return <Navigation />;
}
```

![Header title](/assets/headers/header-title.png)

## Using params in the title

To use params in the title, make `options` a function that returns a configuration object. React Navigation calls this function with `{ navigation, route }` - so you can use `route.params` to access the params:

```js name="Using params in the title" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() =>
          navigation.navigate('Profile', {
            name: 'Jane',
          })
        }
      >
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
    Home: {
      screen: HomeScreen,
      options: {
        title: 'My home',
      },
    },
    Profile: {
      screen: ProfileScreen,
      // highlight-start
      options: ({ route }) => ({
        title: route.params.name,
      }),
      // highlight-end
    },
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return <Navigation />;
}
```

The argument that is passed in to the `options` function is an object with the following properties:

- `navigation` - The [navigation object](navigation-object.md) for the screen.
- `route` - The [route object](route-object.md) for the screen

We only needed the `route` object in the above example but you may in some cases want to use `navigation` as well.

## Updating `options` with `setOptions`

We can update the header from within a screen using `navigation.setOptions`:

```js name="Updating options" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      // codeblock-focus-start
      <Button
        onPress={() =>
          // highlight-next-line
          navigation.setOptions({ title: 'Updated!' })
        }
      >
        Update the title
      </Button>
      // codeblock-focus-end
    </View>
  );
}

const MyStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'My home',
      },
    },
  },
});

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return <Navigation />;
}
```

## Adjusting header styles

There are three key properties to use when customizing the style of your header:

- `headerStyle`: A style object that will be applied to the view that wraps the header. If you set `backgroundColor` on it, that will be the color of your header.
- `headerTintColor`: The back button and title both use this property as their color. In the example below, we set the tint color to white (`#fff`) so the back button and the header title would be white.
- `headerTitleStyle`: If we want to customize the `fontFamily`, `fontWeight` and other `Text` style properties for the title, we can use this to do it.

```js name="Header styles" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const MyStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'My home',
        // highlight-start
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // highlight-end
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

![Custom header styles](/assets/headers/custom_headers.png)

There are a couple of things to notice here:

1. On iOS, the status bar text and icons are black by default, which doesn't look great over a dark background. We won't discuss it here, but see the [status bar guide](status-bar.md) to configure it.
2. The configuration we set only applies to the home screen; when we navigate to the details screen, the default styles are back. We'll look at how to share `options` between screens next.

## Sharing common `options` across screens

Often we want to apply the same options to all screens in a navigator. Instead of repeating the same options for each screen, we can use `screenOptions` on the navigator.

```js name="Common screen options" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const MyStack = createNativeStackNavigator({
  // highlight-start
  screenOptions: {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
  // highlight-end
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return <Navigation />;
}
```

All screens in this navigator will now share these styles. Individual screens can still override them in their own `options`.

## Replacing the title with a custom component

Sometimes you need more control than changing the text and styles of your title -- for example, you may want to render an image in place of the title, or make the title into a button. In these cases, you can completely override the component used for the title and provide your own.

```js name="Custom title" snack static2dynamic
import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

// codeblock-focus-start
function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('@expo/snack-static/react-native-logo.png')}
    />
  );
}

const MyStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        // highlight-next-line
        headerTitle: (props) => <LogoTitle {...props} />,
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

![Header custom title](/assets/headers/header-custom-title.png)

:::note

`headerTitle` is header-specific, while `title` is also used by tab bars and drawers, or as page title on web. `headerTitle` defaults to displaying the `title` in a `Text` component.

:::

## Additional configuration

See the full list of header options in the [`createNativeStackNavigator` reference](native-stack-navigator.md#options).

## Summary

- Headers can be customized via the [`options`](screen-options.md) property on screens
- The `options` property can be an object or a function that receives the [`navigation`](navigation-object.md) and [`route`](route-object.md) objects
- The [`screenOptions`](screen-options.md#screenoptions-prop-on-the-navigator) property on the navigator can be used to apply shared styles across all screens
