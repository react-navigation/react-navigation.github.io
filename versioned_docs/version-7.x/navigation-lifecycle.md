---
id: navigation-lifecycle
title: Navigation lifecycle
sidebar_label: Navigation lifecycle
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If you're coming from a web background, you might expect that when navigating from route A to route B, A unmounts and remounts when you return. React Navigation works differently - this is driven by the more complex needs of mobile navigation.

Unlike web browsers, React Navigation doesn't unmount screens when navigating away. When you navigate from `Home` to `Profile`:

- `Profile` mounts
- `Home` stays mounted

When going back from `Profile` to `Home`:

- `Profile` unmounts
- `Home` is not remounted, existing instance is shown

Similar behavior can be observed (in combination) with other navigators as well. Consider a tab navigator with two tabs, where each tab is a stack navigator:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Navigation lifecycle" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function SettingsScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('SettingsScreen mounted');

    return () => console.log('SettingsScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('ProfileScreen mounted');

    return () => console.log('ProfileScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('HomeScreen mounted');

    return () => console.log('HomeScreen unmounted');
  }, []);

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
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('DetailsScreen mounted');

    return () => console.log('DetailsScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button onPress={() => navigation.push('Details')}>
        Go to Details... again
      </Button>
    </View>
  );
}

// codeblock-focus-start
const SettingsStack = createNativeStackNavigator({
  screens: {
    Settings: SettingsScreen,
    Profile: ProfileScreen,
  },
});

const HomeStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const MyTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    First: SettingsStack,
    Second: HomeStack,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Navigation lifecycle" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function SettingsScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('SettingsScreen mounted');

    return () => console.log('SettingsScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('ProfileScreen mounted');

    return () => console.log('ProfileScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('HomeScreen mounted');

    return () => console.log('HomeScreen unmounted');
  }, []);

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
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('DetailsScreen mounted');

    return () => console.log('DetailsScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button onPress={() => navigation.push('Details')}>
        Go to Details... again
      </Button>
    </View>
  );
}

const SettingsStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const MyTabs = createBottomTabNavigator();

// codeblock-focus-start
function FirstScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Profile" component={ProfileScreen} />
    </SettingsStack.Navigator>
  );
}

function SecondScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

function Root() {
  return (
    <MyTabs.Navigator screenOptions={{ headerShown: false }}>
      <MyTabs.Screen name="First" component={FirstScreen} />
      <MyTabs.Screen name="Second" component={SecondScreen} />
    </MyTabs.Navigator>
  );
}
// codeblock-focus-end

export default function App() {
  return (
    <NavigationContainer>
      <Root />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/lifecycle.mp4" />
</video>

We start on the `HomeScreen` and navigate to `DetailsScreen`. Then we use the tab bar to switch to the `SettingsScreen` and navigate to `ProfileScreen`. After this sequence of operations is done, all 4 of the screens are mounted! If you use the tab bar to switch back to the `HomeStack`, you'll notice you'll be presented with the `DetailsScreen` - the navigation state of the `HomeStack` has been preserved!

## React Navigation lifecycle events

Now that we understand how React lifecycle methods work in React Navigation, let's answer an important question: "How do we find out that a user is leaving (blur) it or coming back to it (focus)?"

To detect when a screen gains or loses focus, we can listen to `focus` and `blur` events:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Focus and blur" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

// codeblock-focus-start
function ProfileScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    // highlight-start
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('ProfileScreen focused');
    });
    // highlight-end

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    // highlight-start
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('ProfileScreen blurred');
    });
    // highlight-end

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('HomeScreen focused');
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('HomeScreen blurred');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Focus and blur" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

// codeblock-focus-start
function ProfileScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    // highlight-start
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('ProfileScreen focused');
    });
    // highlight-end

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    // highlight-start
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('ProfileScreen blurred');
    });
    // highlight-end

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('HomeScreen focused');
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('HomeScreen blurred');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

See [Navigation events](navigation-events.md) for more details.

For performing side effects, we can use the [`useFocusEffect`](use-focus-effect.md) - it's like `useEffect` but ties to the navigation lifecycle -- it runs the effect when the screen comes into focus and cleans it up when the screen goes out of focus:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Focus effect" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { useFocusEffect } from '@react-navigation/native';

function ProfileScreen() {
  // highlight-start
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log('ProfileScreen focus effect');

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        console.log('ProfileScreen focus effect cleanup');
      };
    }, [])
  );
  // highlight-end

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Focus effect" snack
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { useFocusEffect } from '@react-navigation/native';

function ProfileScreen() {
  // highlight-start
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log('ProfileScreen focus effect');

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        console.log('ProfileScreen focus effect cleanup');
      };
    }, [])
  );
  // highlight-end

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/lifecycle-focus.mp4" />
</video>

To render different things based on whether the screen is focused, we can use the [`useIsFocused`](use-is-focused.md) hook which returns a boolean indicating whether the screen is focused.

To know the focus state inside of an event listener, we can use the [`navigation.isFocused()`](navigation-object.md#isfocused) method. Note that using this method doesn't trigger a re-render like the `useIsFocused` hook does, so it is not suitable for rendering different things based on focus state.

## Summary

- Screens stay mounted when navigating away from them
- The [`useFocusEffect`](use-focus-effect.md) hook is like [`useEffect`](https://react.dev/reference/react/useEffect) but tied to the navigation lifecycle instead of the component lifecycle
- The [`useIsFocused`](use-is-focused.md) hook and [`navigation.isFocused()`](navigation-object.md#isfocused) method can be used to determine if a screen is currently focused
- The [`focus`](navigation-events.md#focus) and [`blur`](navigation-events.md#blur) events can be used to know when a screen gains or loses focus
