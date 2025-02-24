---
id: testing
title: Testing with Jest
sidebar_label: Testing with Jest
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Testing code using React Navigation may require some setup since we need to mock native dependencies used in the navigators. We recommend using [Jest](https://jestjs.io) to write unit tests.

## Mocking native modules

To be able to test React Navigation components, certain dependencies will need to be mocked depending on which components are being used.

If you're using `@react-navigation/drawer`, you will need to mock:

- `react-native-reanimated`
- `react-native-gesture-handler`

If you're using `@react-navigation/stack`, you will only need to mock:

- `react-native-gesture-handler`

To add the mocks, create a file `jest/setup.js` (or any other file name of your choice) and paste the following code in it:

```js
// Include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

// Include this section for mocking react-native-reanimated
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
```

Then we need to use this setup file in our jest config. You can add it under `setupFiles` option in a `jest.config.js` file or the `jest` key in `package.json`:

```json
{
  "preset": "react-native",
  "setupFiles": ["<rootDir>/jest/setup.js"]
}
```

Make sure that the path to the file in `setupFiles` is correct. Jest will run these files before running your tests, so it's the best place to put your global mocks.

If your configuration works correctly, you can skip this section, but in some unusual cases you will need to mock `react-native-screens` as well. To add mock of the particular component, e.g. `Screen`, add the following code in `jest/setup.js` file:

```js
// Include this section form mocking react-native-screens
jest.mock('react-native-screens', () => {
  // Require actual module instead of a mock
  let screens = jest.requireActual('react-native-screens');

  // All exports in react-native-screens are getters
  // We cannot use spread for cloning as it will call the getters
  // So we need to clone it with Object.create
  screens = Object.create(
    Object.getPrototypeOf(screens),
    Object.getOwnPropertyDescriptors(screens)
  );

  // Add mock of the Screen component
  Object.defineProperty(screens, 'Screen', {
    value: require('react-native').View,
  });

  return screens;
});
```

If you're not using Jest, then you'll need to mock these modules according to the test framework you are using.

## Writing tests

We recommend using [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) along with [`jest-native`](https://github.com/testing-library/jest-native) to write your tests.

We will go through some real-world case test code examples. Each code example consists of tested navigator and test code file.

### Example 1

Navigate to settings screen by tab bar button press.

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
    </View>
  );
};

export const TabNavigator = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarButtonTestID: 'homeTabBarButton',
      },
    },
    Settings: {
      screen: SettingsScreen,
      options: {
        tabBarButtonTestID: 'settingsTabBarButton',
      },
    },
  },
  screenOptions: {
    headerShown: false,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButtonTestID: 'homeTabBarButton',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarButtonTestID: 'settingsTabBarButton',
        }}
      />
    </Tab.Navigator>
  );
};
```

</TabItem>
</Tabs>

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

test('navigates to settings by tab bar button press', () => {
  const TabNavigation = createStaticNavigation(TabNavigator);
  render(<TabNavigation />);

  const button = screen.getByTestId('settingsTabBarButton');

  const event = {};
  fireEvent.press(button, event);

  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

test('navigates to settings by tab bar button press', () => {
  render(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );

  const button = screen.getByTestId('settingsTabBarButton');

  const event = {};
  fireEvent.press(button, event);

  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

We get the settings tab bar button using a `testID` assigned to it, press it using `fireEvent` and check if rendered content is correct.

Tab bar buttons `handlePress` function expects to receive `GestureResponderEvent`. To avoid error you should pass `event` object as the second argument of `fireEvent`.

```js
// Pass event object to avoid error
const event = {};
fireEvent.press(button, event);
```

### Example 2

Show text on another screen after transition to it ends.

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        onPress={() => navigation.navigate('Surprise')}
        title="Click here!"
      />
    </View>
  );
};

const SurpriseScreen = () => {
  const navigation = useNavigation();

  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    navigation.addListener('transitionEnd', () => setTextVisible(true));
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {textVisible ? <Text>Surprise!</Text> : ''}
    </View>
  );
};

export const StackNavigator = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Surprise: SurpriseScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        onPress={() => navigation.navigate('Surprise')}
        title="Click here!"
      />
    </View>
  );
};

const SurpriseScreen = ({ navigation }) => {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    navigation.addListener('transitionEnd', () => setTextVisible(true));
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {textVisible ? <Text>Surprise!</Text> : ''}
    </View>
  );
};

export const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Surprise" component={SurpriseScreen} />
    </Stack.Navigator>
  );
};
```

</TabItem>
</Tabs>

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { StackNavigator } from './StackNavigator';

test('surprise text appears after transition to surprise screen is complete', () => {
  jest.useFakeTimers();

  const StackNavigation = createStaticNavigation(StackNavigator);
  render(<StackNavigation />);

  fireEvent.press(screen.getByText('Click here!'));

  expect(screen.queryByText('Surprise!')).not.toBeOnTheScreen();
  act(() => jest.runAllTimers());
  expect(screen.getByText('Surprise!')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { StackNavigator } from './StackNavigator';

test('surprise text appears after transition to surprise screen is complete', () => {
  jest.useFakeTimers();

  render(
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );

  fireEvent.press(screen.getByText('Click here!'));

  expect(screen.queryByText('Surprise!')).not.toBeOnTheScreen();
  act(() => jest.runAllTimers());
  expect(screen.getByText('Surprise!')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

We press the "Click here!" button using `fireEvent` and check that the text does not appear right away but only after the transition between screens ends.

While writing tests containing navigation with animations (in this example we have a `StackNavigator`, which uses an animation for the transition based on the platform and OS version) you need to wait until animations finish before proceeding further. To do so, you have to use `fake timers`. [`Fake Timers`](https://jestjs.io/docs/timer-mocks) replace real implementation of times function to use fake clock. They allow you to instantly skip animation time. To avoid getting state change error, wrap `runAllTimers` in `act`.

```js
// Enable fake timers
jest.useFakeTimers();

// ...

// Wrap jest.runAllTimers in act to prevent state change error
// Skip all timers including animations
act(() => jest.runAllTimers());
```

If we hadn't used fake timers in this example, the test would have failed.

In the previous example we didn't use fake timers because `BottomTabNavigator` by default does not use any animations for the transition.

### Example 3

Always displays settings screen after settings tab bar button press.

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
}

function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.getParent().addListener('tabPress', (e) => {
      navigation.popToTop();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details screen</Text>
    </View>
  );
}

const SettingsNavigator = createStackNavigator({
  screens: {
    Settings: SettingsScreen,
    Details: DetailsScreen,
  },
});

export const TabNavigator = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarButtonTestID: 'homeTabBarButton',
      },
    },
    SettingsStack: {
      screen: SettingsNavigator,
      options: {
        tabBarButtonTestID: 'settingsTabBarButton',
      },
    },
  },
  screenOptions: {
    headerShown: false,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.getParent().addListener('tabPress', (e) => {
      navigation.popToTop();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details screen</Text>
    </View>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Details" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarButtonTestID: 'homeTabBarButton' }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStackScreen}
        options={{ tabBarButtonTestID: 'settingsTabBarButton' }}
      />
    </Tab.Navigator>
  );
}
```

</TabItem>
</Tabs>

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

test('always displays settings screen after settings tab bar button press', () => {
  const TabNavigation = createStaticNavigation(TabNavigator);
  render(<TabNavigation />);

  const homeTabButton = screen.getByTestId('homeTabBarButton');

  const settingsTabButton = screen.getByTestId('settingsTabBarButton');

  const event = {};

  fireEvent.press(settingsTabButton, event);
  expect(screen.getByText('Settings screen')).toBeOnTheScreen();

  fireEvent.press(screen.getByText('Go to Details'), event);
  expect(screen.getByText('Details screen')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  expect(screen.getByText('Home screen')).toBeOnTheScreen();

  fireEvent.press(settingsTabButton, event);
  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

test('always displays settings screen after settings tab bar button press', () => {
  render(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );

  const homeTabButton = screen.getByTestId('homeTabBarButton');

  const settingsTabButton = screen.getByTestId('settingsTabBarButton');

  const event = {};

  fireEvent.press(settingsTabButton, event);
  expect(screen.getByText('Settings screen')).toBeOnTheScreen();

  fireEvent.press(screen.getByText('Go to Details'), event);
  expect(screen.getByText('Details screen')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  expect(screen.getByText('Home screen')).toBeOnTheScreen();

  fireEvent.press(settingsTabButton, event);
  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

We get tab bar buttons, press buttons and check if rendered screens are correct.

In this example, we don't need to use fake timers because text from the next screen is available using `getByText` even before the animation ends.

### Example 4

On every profile screen focus, display loading state while waiting for data and then show fetched profile.

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
}

const url = 'placeholder_url';

function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const data = await (await fetch(url)).json();

          if (isActive) {
            setData(data);
            setLoading(false);
          }
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };

      fetchUser();

      return () => {
        setData(undefined);
        setError(undefined);
        setLoading(true);
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <Text>Loading</Text>}
      {!loading && error && <Text>{error.message}</Text>}
      {!loading && !error && <Text>{data.profile.nick}</Text>}
    </View>
  );
}

export const TabNavigator = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarButtonTestID: 'homeTabBarButton',
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        tabBarButtonTestID: 'profileTabBarButton',
      },
    },
  },
  screenOptions: {
    headerShown: false,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
}

const url = 'placeholder_url';

function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const data = await (await fetch(url)).json();

          if (isActive) {
            setData(data);
            setLoading(false);
          }
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };

      fetchUser();

      return () => {
        setData(undefined);
        setError(undefined);
        setLoading(true);
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <Text>Loading</Text>}
      {!loading && error && <Text>{error.message}</Text>}
      {!loading && !error && <Text>{data.profile.nick}</Text>}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarButtonTestID: 'homeTabBarButton' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarButtonTestID: 'profileTabBarButton' }}
      />
    </Tab.Navigator>
  );
}
```

</TabItem>
</Tabs>

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

async function mockedFetch() {
  const mockResponse = {
    profile: {
      nick: 'CookieDough',
    },
  };
  return {
    ok: true,
    status: 200,
    json: async () => {
      return mockResponse;
    },
  };
}

test('on every profile screen focus, displays loading state while waiting for data and then shows fetched profile', async () => {
  jest.useFakeTimers();

  const TabNavigation = createStaticNavigation(TabNavigator);
  render(<TabNavigation />);

  const spy = jest.spyOn(window, 'fetch').mockImplementation(mockedFetch);

  const homeTabButton = screen.getByTestId('homeTabBarButton');
  const profileTabButton = screen.getByTestId('profileTabBarButton');

  const event = {};
  fireEvent.press(profileTabButton, event);

  expect(screen.queryByText('Loading')).toBeOnTheScreen();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  fireEvent.press(profileTabButton, event);

  expect(screen.queryByText('Loading')).toBeOnTheScreen();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

async function mockedFetch() {
  const mockResponse = {
    profile: {
      nick: 'CookieDough',
    },
  };
  return {
    ok: true,
    status: 200,
    json: async () => {
      return mockResponse;
    },
  };
}

test('on every profile screen focus, displays loading state while waiting for data and then shows fetched profile', async () => {
  jest.useFakeTimers();

  render(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );

  const spy = jest.spyOn(window, 'fetch').mockImplementation(mockedFetch);

  const homeTabButton = screen.getByTestId('homeTabBarButton');
  const profileTabButton = screen.getByTestId('profileTabBarButton');

  const event = {};
  fireEvent.press(profileTabButton, event);

  expect(screen.getByText('Loading')).toBeOnTheScreen();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  fireEvent.press(profileTabButton, event);

  expect(screen.getByText('Loading')).toBeOnTheScreen();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

We query tab buttons and mock fetch function using `spyOn` and `mockImplementation`. We navigate to profile screen and check if loading state is rendered correctly. Then, to check if fetched data is displayed, we use `findByText` - we need to wait for the fetch to finish before checking its result. To ensure that operation will succeed not only on the first focus, we navigate back to home, then to settings and check loading state and fetched data again.

To make test deterministic and isolate it from the real backend you can mock fetch function. You can use `spyOn` to override real implementation of fetch with `mockedFetch`.

```js
// Mock implementation of fetch function
async function mockedFetch() {
  const mockResponse = {
    profile: {
      nick: 'CookieDough',
    },
  };
  return {
    ok: true,
    status: 200,
    json: async () => {
      return mockResponse;
    },
  };
}

test('on every profile screen focus, displays loading state while waiting for data and then shows fetched profile', async () => {
  // ...

  // Replace fetch implementation with mock
  const spy = jest.spyOn(window, 'fetch').mockImplementation(mockedFetch);

  // ...

  // Check if mock fetch was called
  expect(spy).toHaveBeenCalled();

  // ...
});
```

## Best practices

There are a couple of things to keep in mind when writing tests for components using React Navigation:

1. Avoid mocking React Navigation. Instead, use a real navigator in your tests.
2. Don't check for navigation actions. Instead, check for the result of the navigation such as the screen being rendered.
3. Remember to use fake timers when testing code that involves animations (e.g. transitions between screens with `StackNavigator`).
