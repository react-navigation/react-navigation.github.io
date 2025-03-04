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
import { setUpTests } from 'react-native-reanimated';

setUpTests();

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
import { jest } from '@jest/globals';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
```

Then we need to use this setup file in our jest config. You can add it under `setupFilesAfterEnv` option in a `jest.config.js` file or the `jest` key in `package.json`:

```json
{
  "preset": "react-native",
  "setupFilesAfterEnv": ["<rootDir>/jest/setup.js"]
}
```

Make sure that the path to the file in `setupFilesAfterEnv` is correct. Jest will run these files before running your tests, so it's the best place to put your global mocks.

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

### Example 1 - Navigation between tabs

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

export const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Settings: SettingsScreen,
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

export const MyTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
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
import { render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('navigates to settings by tab bar button press', async () => {
  const user = userEvent.setup();

  const MyTabNavigation = createStaticNavigation(MyTabs);
  render(<MyTabNavigation />);

  const button = screen.getByRole('button', { name: 'Settings, tab, 2 of 2' });
  await user.press(button);

  expect(screen.getByText('Settings screen')).toBeVisible();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('navigates to settings by tab bar button press', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

  const button = screen.getByRole('button', { name: 'Settings, tab, 2 of 2' });
  await user.press(button);

  expect(screen.getByText('Settings screen')).toBeVisible();
});
```

</TabItem>
</Tabs>

First, we need to create a User Event object instance from `react-native-testing-library` in order to be able to trigger user events.

```js
// Create User Event object instance
const user = userEvent.setup();
```

After we create and render our tabs, we get the settings tab bar button using an accessibility label assigned to it and press it using `user.press(button)`.

```js
// Get the setting tab bar button
const button = screen.getByRole('button', { name: 'Settings, tab, 2 of 2' });

// Simulate user pressing the button
await user.press(button);
```

We expect that after pressing the button, the screen will change and `'Settings screen'` will be visible.

```js
// Assert that Settings screen is visible
expect(screen.getByText('Settings screen')).toBeVisible();
```

### Example 2 - Reacting to navigation events

Show text on another screen after transition is completed.

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

export const MyStack = createStackNavigator({
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

export const MyStack = () => {
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
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyStack } from './MyStack';

jest.useFakeTimers();

test('surprise text appears after transition to surprise screen is complete', async () => {
  const user = userEvent.setup();

  const MyStackNavigation = createStaticNavigation(MyStack);
  render(<MyStackNavigation />);

  await user.press(screen.getByRole('button', { name: 'Click here!' }));

  expect(screen.queryByText('Surprise!')).not.toBeVisible();
  act(() => jest.runAllTimers());
  expect(screen.getByText('Surprise!')).toBeVisible();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyStack } from './MyStack';

jest.useFakeTimers();

test('surprise text appears after transition to surprise screen is complete', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );

  await user.press(screen.getByRole('button', { name: 'Click here!' }));

  expect(screen.queryByText('Surprise!')).not.toBeVisible();
  act(() => jest.runAllTimers());
  expect(screen.getByText('Surprise!')).toBeVisible();
});
```

</TabItem>
</Tabs>

We press the "Click here!" button using `user.press()` and check that the text does not appear right away but only after the transition between screens ends.

<!-- When writing tests containing navigation with animations (in this example we have a `StackNavigator`, which uses an animation for the transition based on the platform and OS version) you need to wait until animations finish before proceeding further. To do so, you have to use `fake timers`. [`Fake Timers`](https://jestjs.io/docs/timer-mocks) replace real implementation of times function to use fake clock. They allow you to instantly skip animation time. To avoid getting state change error, wrap `runAllTimers` in `act`.

```js
// Enable fake timers
jest.useFakeTimers();

// ...

// Wrap jest.runAllTimers in act to prevent state change error
// Skip all timers including animations
act(() => jest.runAllTimers());
```

If we hadn't used fake timers in this example, the test would have failed.

In the previous example we didn't use fake timers because `BottomTabNavigator` by default does not use any transition animations. -->

### Example 3 - Enforce navigator state in response to navigation event

Display settings screen after settings tab bar button is pressed.

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
    const unsubscribe = navigation
      .getParent('MyTabs')
      .addListener('tabPress', (e) => {
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

const MyStack = createStackNavigator({
  screens: {
    Settings: SettingsScreen,
    Details: DetailsScreen,
  },
});

export const MyTabs = createBottomTabNavigator({
  id: 'MyTabs',
  screens: {
    Home: HomeScreen,
    SettingsStack: MyStack,
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

function MyStack() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Details" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export function MyTabs() {
  return (
    <Tab.Navigator id="MyTabs" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="SettingsStack" component={MyStack} />
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
import { render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('displays settings screen after settings tab bar button press', async () => {
  const user = userEvent.setup();

  const MyTabNavigation = createStaticNavigation(MyTabs);
  render(<MyTabNavigation />);

  const homeTabButton = screen.getByRole('button', {
    name: 'Home, tab, 1 of 2',
  });

  const settingsTabButton = screen.getByRole('button', {
    name: 'SettingsStack, tab, 2 of 2',
  });

  await user.press(settingsTabButton);
  expect(screen.getByText('Settings screen')).toBeVisible();

  await user.press(screen.getByText('Go to Details'));
  expect(screen.getByText('Details screen')).toBeVisible();

  await user.press(homeTabButton);
  expect(screen.getByText('Home screen')).toBeVisible();

  await user.press(settingsTabButton);
  expect(screen.getByText('Settings screen')).toBeVisible();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('displays settings screen after settings tab bar button press', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

  const homeTabButton = screen.getByRole('button', {
    name: 'Home, tab, 1 of 2',
  });

  const settingsTabButton = screen.getByRole('button', {
    name: 'SettingsStack, tab, 2 of 2',
  });

  await user.press(settingsTabButton);
  expect(screen.getByText('Settings screen')).toBeVisible();

  await user.press(screen.getByText('Go to Details'));
  expect(screen.getByText('Details screen')).toBeVisible();

  await user.press(homeTabButton);
  expect(screen.getByText('Home screen')).toBeVisible();

  await user.press(settingsTabButton);
  expect(screen.getByText('Settings screen')).toBeVisible();
});
```

</TabItem>
</Tabs>

We get tab bar buttons, press them and check if rendered screens are correct.

<!-- In this example, we don't need to use fake timers because text from the next screen is available using `getByText` even before the animation ends. -->

### Example 4 - `useFocusEffect` hook and data fetching

On profile screen focus, display loading state while waiting for data and then show fetched profile on every refocus.

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

const url = 'https://pokeapi.co/api/v2/pokemon/ditto';

type PokemonData = {
  id: number;
  name: string;
};

type Result =
  | { status: 'loading' }
  | { status: 'success'; data: PokemonData }
  | { status: 'error' };

function ProfileScreen() {
  const [profileData, setProfileData] = useState<Result>({ status: 'loading' });

  useFocusEffect(
    useCallback(() => {
      if (profileData.status !== 'success') {
        setProfileData({ status: 'loading' });

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchUser = async () => {
          try {
            const response = await fetch(url, { signal });
            const data = await response.json();

            setProfileData({ status: 'success', data: data });
          } catch (error) {
            setProfileData({ status: 'error' });
          }
        };

        fetchUser();

        return () => {
          controller.abort();
        };
      } else {
        return () => {};
      }
    }, [profileData.status])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {profileData.status === 'loading' ? (
        <Text>Loading...</Text>
      ) : profileData.status === 'error' ? (
        <Text>Error!</Text>
      ) : profileData.status === 'success' ? (
        <Text>{profileData.data.name}</Text>
      ) : null}
    </View>
  );
}

export const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
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

const url = 'https://pokeapi.co/api/v2/pokemon/ditto';

type PokemonData = {
  id: number;
  name: string;
};

type Result =
  | { status: 'loading' }
  | { status: 'success'; data: PokemonData }
  | { status: 'error' };

function ProfileScreen() {
  const [profileData, setProfileData] = useState<Result>({ status: 'loading' });

  useFocusEffect(
    useCallback(() => {
      if (profileData.status !== 'success') {
        setProfileData({ status: 'loading' });

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchUser = async () => {
          try {
            const response = await fetch(url, { signal });
            const data = await response.json();

            setProfileData({ status: 'success', data: data });
          } catch (error) {
            setProfileData({ status: 'error' });
          }
        };

        fetchUser();

        return () => {
          controller.abort();
        };
      } else {
        return () => {};
      }
    }, [profileData.status])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {profileData.status === 'loading' ? (
        <Text>Loading...</Text>
      ) : profileData.status === 'error' ? (
        <Text>Error!</Text>
      ) : profileData.status === 'success' ? (
        <Text>{profileData.data.name}</Text>
      ) : null}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

</TabItem>
</Tabs>

To make the test deterministic and isolate it from the real backend, you can mock the `fetch` function. For this purpose you can use [Mock Service Worker](https://mswjs.io/). Please refer to the documentation of the library to learn more about setting it up in your project ([Getting started](https://mswjs.io/docs/getting-started), [React Native integration](https://mswjs.io/docs/integrations/react-native)).

```js
import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon/ditto', async () => {
    await delay(1000);

    return HttpResponse.json({
      id: 132,
      name: 'ditto',
    });
  }),
];
```

Before writing the test, we setup a handler that mocks responses from the API (for this example we're using [PokéAPI](https://pokeapi.co/)). Additionally, we `delay` the response by 1000 ms.

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('on profile screen focus, displays loading state while waiting for data and then shows fetched profile on every refocus', async () => {
  const user = userEvent.setup();

  const MyTabNavigation = createStaticNavigation(MyTabs);
  render(<MyTabNavigation />);

  const homeTabButton = screen.getByRole('button', {
    name: 'Home, tab, 1 of 2',
  });

  const profileTabButton = screen.getByRole('button', {
    name: 'Profile, tab, 2 of 2',
  });

  await user.press(profileTabButton);
  expect(screen.getByText('Loading...')).toBeVisible();

  await act(() => jest.runAllTimers());

  expect(screen.getByText('ditto')).toBeVisible();

  await user.press(homeTabButton);
  await user.press(profileTabButton);
  expect(screen.queryByText('Loading...')).not.toBeVisible();

  await act(() => jest.runAllTimers());

  expect(screen.getByText('ditto')).toBeVisible();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('on profile screen focus, displays loading state while waiting for data and then shows fetched profile on every refocus', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

  const homeTabButton = screen.getByRole('button', {
    name: 'Home, tab, 1 of 2',
  });

  const profileTabButton = screen.getByRole('button', {
    name: 'Profile, tab, 2 of 2',
  });

  await user.press(profileTabButton);
  expect(screen.getByText('Loading...')).toBeVisible();

  await act(() => jest.runAllTimers());

  expect(screen.getByText('ditto')).toBeVisible();

  await user.press(homeTabButton);
  await user.press(profileTabButton);
  expect(screen.queryByText('Loading...')).not.toBeVisible();

  await act(() => jest.runAllTimers());

  expect(screen.getByText('ditto')).toBeVisible();
});
```

</TabItem>
</Tabs>

We navigate to profile screen and check if loading state is rendered correctly. Then we use fake timers to skip the delay and check if fetched data is displayed on the screen. To ensure expected behavior not only on the first focus, we navigate back to home, then to settings and check that the data is present without unnecessary fetch.

## Best practices

There are a couple of things to keep in mind when writing tests for components using React Navigation:

1. Avoid mocking React Navigation. Instead, use a real navigator in your tests.
2. Don't check for navigation actions. Instead, check for the result of the navigation such as the screen being rendered.
3. Remember to use fake timers when testing code that involves animations (e.g. transitions between screens with `StackNavigator`).
