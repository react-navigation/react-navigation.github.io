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

We will go through some real-world case test code examples. Each code example consist of navigator and test code file.

### Example 1

Navigate to another screen by button press.

Navigator:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Text, View } from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Go to Settings"
      />
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

export const StackNavigator = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Text, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Go to Settings"
      />
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

export const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
```

</TabItem>
</Tabs>

Test:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { StackNavigator } from './StackNavigator';

test('navigates to settings by button press', () => {
  const StackNavigation = createStaticNavigation(StackNavigator);

  render(<StackNavigation />);

  fireEvent.press(screen.queryByText('Go to Settings'));
  expect(screen.queryByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { StackNavigator } from './StackNavigator';

test('navigates to settings by button press', () => {
  render(
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );

  fireEvent.press(screen.queryByText('Go to Settings'));
  expect(screen.queryByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

We simulate user’s button press by `FireEvent` and call `expect` to check if rendered content is correct.

### Example 2

Navigate to another tab caused by tab bar button press.

Navigator:

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
        tabBarButtonTestID: 'home-tab',
      },
    },
    Settings: {
      screen: SettingsScreen,
      options: {
        tabBarButtonTestID: 'settings-tab',
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
          tabBarButtonTestID: 'home-tab',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tab.Navigator>
  );
};
```

</TabItem>
</Tabs>

Test:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

test('navigates to settings by tab bar button press', () => {
  const TabNavigation = createStaticNavigation(TabNavigator);
  jest.useFakeTimers();

  render(<TabNavigation />);

  act(() => jest.runAllTimers());

  const button = screen.queryByTestId('settings-tab');

  // You need to pass event object to fireEvent to prevent error

  fireEvent.press(button);

  expect(screen.queryByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

test('navigates to settings by tab bar button press', () => {
  jest.useFakeTimers();

  render(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );

  act(() => jest.runAllTimers());

  const button = screen.queryByTestId('settings-tab');

  // You need to pass event object to fireEvent to prevent error
  const event = {};
  fireEvent.press(button, event);

  expect(screen.queryByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

We use `id` to query for tab buttons, simulate button press by `FireEvent` and check if rendered content is correct.

To setup tab `id` you need to add `tabBarButtonTestID` in settings tab screen `options` defined in `TabNavigator`.

Bottom tabs bar buttons `handlePress` function expects `GestureResponderEvent`. To avoid error you should pass `event` object as the second argument of `fireEvent`.

Sometimes navigation animations need some time to finish and render screen's content. You need to wait until animations finish before querying components. Therefore, you have to use `fake timers`. [`Fake Timers`](https://jestjs.io/docs/timer-mocks) replace real implementation of times function to use fake clock ticks. They allow you to instantly skip animation time and avoid getting state change error.

### Example 3

Always display first screen of the settings stack nested in tab after settings stack tab focus.

Navigator:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const DetailsScreen = ({ navigation }) => {
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
};

const SettingsStack = createNativeStackNavigator();

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
        options={{ tabBarButtonTestID: 'home-tab' }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStackScreen}
        options={{ tabBarButtonTestID: 'settings-tab' }}
      />
    </Tab.Navigator>
  );
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

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

const DetailsScreen = () => {
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
};

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
        tabBarButtonTestID: 'home-tab',
      },
    },
    SettingsStack: {
      screen: SettingsNavigator,
      options: {
        tabBarButtonTestID: 'settings-tab',
      },
    },
  },
  screenOptions: {
    headerShown: false,
  },
});
```

</TabItem>
</Tabs>

Test:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

test('always displays first screen in settings stack after tab bar settings button press', async () => {
  const TabNavigation = createStaticNavigation(TabNavigator);
  jest.useFakeTimers();

  render(<TabNavigation />);

  act(() => jest.runAllTimers());

  const homeTabButton = screen.queryByTestId('home-tab');
  const settingsTabButton = screen.queryByTestId('settings-tab');

  // You need to pass event object to fireEvent to prevent error
  const event = {};

  fireEvent.press(settingsTabButton, event);
  expect(screen.queryByText('Settings screen')).toBeOnTheScreen();

  fireEvent.press(screen.queryByText('Go to Details'), event);
  expect(screen.queryByText('Details screen')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  expect(screen.queryByText('Home screen')).toBeOnTheScreen();

  fireEvent.press(settingsTabButton, event);
  expect(screen.queryByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TabNavigator } from './TabNavigator';

test('always displays first screen in settings stack after tab bar settings button press', async () => {
  jest.useFakeTimers();

  render(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );

  act(() => jest.runAllTimers());

  const homeTabButton = screen.queryByTestId('home-tab');
  const settingsTabButton = screen.queryByTestId('settings-tab');

  // You need to pass event object to fireEvent to prevent error
  const event = {};

  fireEvent.press(settingsTabButton, event);
  expect(screen.queryByText('Settings screen')).toBeOnTheScreen();

  fireEvent.press(screen.queryByText('Go to Details'), event);
  expect(screen.queryByText('Details screen')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  expect(screen.queryByText('Home screen')).toBeOnTheScreen();

  fireEvent.press(settingsTabButton, event);
  expect(screen.queryByText('Settings screen')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

We query tab buttons, simulating button presses and check if rendered screens are correct.

### Example 4

Display loading state while waiting for data and then fetched nick on every profile screen focus.

Navigator:

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

const url = 'your_url';

function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useFocusEffect(
    useCallback(() => {
      fetch(url)
        .then((res) => res.json())
        .then((res) => setData(res))
        .catch((error) => setError(error))
        .finally(() => setLoading(false));

      return () => {
        setData(undefined);
        setError(undefined);
        setLoading(true);
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
        tabBarButtonTestID: 'home-tab',
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        tabBarButtonTestID: 'profile-tab',
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

const url = 'your_url';

function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useFocusEffect(
    useCallback(() => {
      fetch(url)
        .then((res) => res.json())
        .then((res) => setData(res))
        .catch((error) => setError(error))
        .finally(() => setLoading(false));

      return () => {
        setData(undefined);
        setError(undefined);
        setLoading(true);
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
        options={{ tabBarButtonTestID: 'home-tab' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarButtonTestID: 'profile-tab' }}
      />
    </Tab.Navigator>
  );
}
```

</TabItem>
</Tabs>

Test:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

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

test('fetches profile data on profile screen focus', async () => {
  const TabNavigation = createStaticNavigation(TabNavigator);
  jest.useFakeTimers();

  render(<TabNavigation />);

  act(() => jest.runAllTimers());

  const spy = jest.spyOn(window, 'fetch').mockImplementation(mockedFetch);

  const homeTabButton = screen.queryByTestId('home-tab');
  const dogsTabButton = screen.queryByTestId('profile-tab');

  // You need to pass event object to fireEvent to prevent error
  const event = {};

  fireEvent.press(dogsTabButton, event);

  expect(screen.queryByText('Loading')).toBeOnTheScreen();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  fireEvent.press(dogsTabButton, event);

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
import { act, fireEvent, render, screen } from '@testing-library/react-native';

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

test('fetches profile data on profile screen focus', async () => {
  jest.useFakeTimers();

  render(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );

  act(() => jest.runAllTimers());

  const spy = jest.spyOn(window, 'fetch').mockImplementation(mockedFetch);

  const homeTabButton = screen.queryByTestId('home-tab');
  const dogsTabButton = screen.queryByTestId('profile-tab');

  // You need to pass event object to fireEvent to prevent error
  const event = {};

  fireEvent.press(dogsTabButton, event);

  expect(screen.queryByText('Loading')).toBeOnTheScreen();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  fireEvent.press(dogsTabButton, event);

  expect(screen.queryByText('Loading')).toBeOnTheScreen();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

We query bottoms tabs buttons and mock fetch function using `spyOn` and `mockImplementation`. Then, we navigate to profile screen and checks if loading state displays correctly. To check if fetched data is displayed we add `await` to query - we need to wait for the fetch to finish before checking if fetched data is correct. To ensure that operation will succeed on every focus, we cause it again by navigating back to home, again to settings and check rendered content again.

It a good practice to use mocks while testing API functions. `mockedFetch` will override real implementation of fetch and enable us to make test deterministic. Thanks to `spyOnYou` you can check if mocked function was called using `toHaveBeenCalled` assertion.

## Best practices

There are a couple of things to keep in mind when writing tests for components using React Navigation:

1. Avoid mocking React Navigation. Instead, use a real navigator in your tests.
2. Don't check for navigation actions. Instead, check for the result of the navigation such as the screen being rendered.
