---
id: screen-options
title: Options for screens
sidebar_label: Options for screens
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Each screen can configure various aspects about how it gets presented in the navigator that renders it by specifying certain options, for example, the header title in stack navigator, tab bar icon in bottom tab navigator etc. Different navigators support different set of options.

In the [configuring the header bar](headers.md) section of the fundamentals documentation we explain the basics of how this works. Also see the [screen options resolution guide](screen-options-resolution.md) to get an idea of how they work when there are multiple navigators.

There are 3 ways of specifying options for screens:

### `options` prop on `Screen`

You can pass a prop named `options` to the `Screen` component to configure a screen, where you can specify an object with different options for that screen:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Screen title option" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import Button from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

// codeblock-focus-start
const Stack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Awesome app',
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        title: 'My profile',
      },
    },
  },
});

const Navigation = createStaticNavigation(Stack);

export default function App() {
  return <Navigation />;
}
// codeblock-focus-end
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Screen title option" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import Button from '@react-navigation/elements';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      // codeblock-focus-start
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Awesome app' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'My profile' }}
        />
      </Stack.Navigator>
      // codeblock-focus-end
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

You can also pass a function to `options`. The function will receive the [`navigation` object](navigation-object.md) and the [`route` object](route-object.md) for that screen, as well as the [`theme` object](themes.md). This can be useful if you want to perform navigation in your options:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: ({ navigation }) => ({
        title: 'Awesome app',
        headerLeft: () => {
          <DrawerButton onPress={() => navigation.toggleDrawer()} />;
        },
      }),
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={({ navigation }) => ({
    title: 'Awesome app',
    headerLeft: () => (
      <DrawerButton onPress={() => navigation.toggleDrawer()} />
    ),
  })}
/>
```

</TabItem>
</Tabs>

### `screenOptions` prop on `Group`

You can pass a prop named `screenOptions` to the `Group` component to configure screens inside the group, where you can specify an object with different options. The options specified in `screenOptions` apply to all of the screens in the group.

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Screen options for group" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// codeblock-focus-start
const Stack = createNativeStackNavigator({
  groups: {
    App: {
      screenOptions: {
        headerStyle: {
          backgroundColor: '#FFB6C1',
        },
      },
      screens: {
        Home: ScreenWithButton('Home', 'Profile'),
        Profile: ScreenWithButton('Profile', 'Settings'),
      },
    },
    Modal: {
      screenOptions: {
        presentation: 'modal',
      },
      screens: {
        Settings: ScreenWithButton('Settings', 'Share'),
        Share: ScreenWithButton('Share'),
      },
    },
  },
});
// codeblock-focus-end

function ScreenWithButton(screenName, navigateTo) {
  return function () {
    const navigation = useNavigation();
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{screenName} Screen</Text>
        {navigateTo && (
          <Button onPress={() => navigation.navigate(navigateTo)}>
            Go to {navigateTo}
          </Button>
        )}
      </View>
    );
  };
}
const Navigation = createStaticNavigation(Stack);
export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Screen options for group" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ScreenWithButton(screenName, navigateTo) {
  return function () {
    const navigation = useNavigation();

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{screenName} Screen</Text>
        {navigateTo && (
          <Button onPress={() => navigation.navigate(navigateTo)}>
            Go to {navigateTo}
          </Button>
        )}
      </View>
    );
  };
}

const HomeScreen = ScreenWithButton('Home', 'Profile');
const ProfileScreen = ScreenWithButton('Profile', 'Settings');
const SettingsScreen = ScreenWithButton('Settings', 'Share');
const ShareScreen = ScreenWithButton('Share');

export default function App() {
  return (
    <NavigationContainer>
      // codeblock-focus-start
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Share" component={ShareScreen} />
        </Stack.Group>
      </Stack.Navigator>
      // codeblock-focus-end
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

Similar to `options`, you can also pass a function to `screenOptions`. The function will receive the [`navigation` object](navigation-object.md) and the [`route` object](route-object.md) for each screen. This can be useful if you want to configure options for all the screens in one place based on the route:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
  groups: {
    Modal: {
      screenOptions: {
        presentation: 'modal',
        headerLeft: () => <CancelButton onPress={navigation.goBack} />,
      },
      screens: {
        Settings: Settings,
        Share: Share,
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
  <Stack.Group
    screenOptions={({ navigation }) => ({
      presentation: 'modal',
      headerLeft: () => <CancelButton onPress={navigation.goBack} />,
    })}
  >
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Share" component={Share} />
  </Stack.Group>
</Stack.Navigator>
```

</TabItem>
</Tabs>

### `screenOptions` prop on the navigator

You can pass a prop named `screenOptions` to the navigator component, where you can specify an object with different options. The options specified in `screenOptions` apply to all of the screens in the navigator. So this is a good place to add specify options that you want to configure for the whole navigator.

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screenOptions: {
    headerStyle: {
      backgroundColor: 'papayawhip',
    },
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Navigator
  screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}
>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
</Stack.Navigator>
```

</TabItem>
</Tabs>

Similar to `options`, you can also pass a function to `screenOptions`. The function will receive the [`navigation` object](navigation-object.md) and the [`route` object](route-object.md) for each screen. This can be useful if you want to configure options for all the screens in one place based on the route:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Screen options for tab navigator" snack dependencies=@expo/vector-icons
import * as React from 'react';
import { View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// codeblock-focus-start
const Tab = createBottomTabNavigator({
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      const icons = {
        Home: 'home',
        Profile: 'account',
      };

      return (
        <MaterialCommunityIcons
          name={icons[route.name]}
          color={color}
          size={size}
        />
      );
    },
  }),
  screens: {
    Home: EmptyScreen,
    Profile: EmptyScreen,
  },
});
// codeblock-focus-end

function EmptyScreen() {
  return <View />;
}

const Navigation = createStaticNavigation(Tab);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Screen options for tab navigator" snack dependencies=@expo/vector-icons
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return <View />;
}

export default function App() {
  return (
    <NavigationContainer>
      // codeblock-focus-start
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Home: 'home',
              Profile: 'account',
            };

            return (
              <MaterialCommunityIcons
                name={icons[route.name]}
                color={color}
                size={size}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={EmptyScreen} />
        <Tab.Screen name="Profile" component={EmptyScreen} />
      </Tab.Navigator>
      // codeblock-focus-end
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

### `navigation.setOptions` method

The `navigation` object has a `setOptions` method that lets you update the options for a screen from within a component. See [navigation object's docs](navigation-object.md#setoptions) for more details.

```js
<Button onPress={() => navigation.setOptions({ title: 'Updated!' })}>
  Update options
</Button>
```
