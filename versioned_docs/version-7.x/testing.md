---
id: testing
title: Writing tests
sidebar_label: Writing tests
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

React Navigation components can be tested in a similar way to other React components. This guide will cover how to write tests for components using React Navigation using [Jest](https://jestjs.io).

## Guiding principles

When writing tests, it's encouraged to write tests that closely resemble how users interact with your app. Keeping this in mind, here are some guiding principles to follow:

- **Test the result, not the action**: Instead of checking if a specific navigation action was called, check if the expected components are rendered after navigation.
- **Avoid mocking React Navigation**: Mocking React Navigation components can lead to tests that don't match the actual logic. Instead, use a real navigator in your tests.

Following these principles will help you write tests that are more reliable and easier to maintain by avoiding testing implementation details.

## Setting up Jest

### Compiling React Navigation

React Navigation ships [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). However, Jest does not support ES modules natively.

It's necessary to transform the code to CommonJS to use them in tests. The `react-native` preset for Jest does not transform the code in `node_modules` by default. To enable this, you need to add the [`transformIgnorePatterns`](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring) option in your Jest configuration where you can specify a regexp pattern. To compile React Navigation packages, you can add `@react-navigation` to the regexp.

This is usually done in a `jest.config.js` file or the `jest` key in `package.json`:

```diff lang=json
{
  "preset": "react-native",
+   "transformIgnorePatterns": [
+     "node_modules/(?!(@react-native|react-native|@react-navigation)/)"
+   ]
}
```

### Mocking native dependencies

To be able to test React Navigation components, certain dependencies will need to be mocked depending on which components are being used.

If you're using `@react-navigation/stack`, you will need to mock:

- `react-native-gesture-handler`

If you're using `@react-navigation/drawer`, you will need to mock:

- `react-native-reanimated`
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

Then we need to use this setup file in our jest config. You can add it under [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array) option in a `jest.config.js` file or the `jest` key in `package.json`:

```diff lang=json
{
  "preset": "react-native",
  "transformIgnorePatterns": [
    "node_modules/(?!(@react-native|react-native|@react-navigation)/)"
  ],
+   "setupFilesAfterEnv": ["<rootDir>/jest/setup.js"]
}
```

Jest will run the files specified in `setupFilesAfterEnv` before running your tests, so it's a good place to put your global mocks.

<details>
<summary>Mocking `react-native-screens`</summary>

This shouldn't be necessary in most cases. However, if you find yourself in a need to mock `react-native-screens` component for some reason, you should do it by adding following code in `jest/setup.js` file:

```js
// Include this section for mocking react-native-screens
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

  // Add mock of the component you need
  // Here is the example of mocking the Screen component as a View
  Object.defineProperty(screens, 'Screen', {
    value: require('react-native').View,
  });

  return screens;
});
```

</details>

If you're not using Jest, then you'll need to mock these modules according to the test framework you are using.

## Fake timers

When writing tests containing navigation with animations, you need to wait until the animations finish. In such cases, we recommend using [`Fake Timers`](https://jestjs.io/docs/timer-mocks) to simulate the passage of time in your tests. This can be done by adding the following line at the beginning of your test file:

```js
jest.useFakeTimers();
```

Fake timers replace real implementation of the native timer functions (e.g. `setTimeout()`, `setInterval()` etc,) with a custom implementation that uses a fake clock. This lets you instantly skip animations and reduce the time needed to run your tests by calling methods such as `jest.runAllTimers()`.

Often, component state is updated after an animation completes. To avoid getting an error in such cases, wrap `jest.runAllTimers()` in `act`:

```js
import { act } from 'react-test-renderer';

// ...

act(() => jest.runAllTimers());
```

See the examples below for more details on how to use fake timers in tests involving navigation.

## Navigation and visibility

In React Navigation, the previous screen is not unmounted when navigating to a new screen. This means that the previous screen is still present in the component tree, but it's not visible.

When writing tests, you should assert that the expected component is visible or hidden instead of checking if it's rendered or not. React Native Testing Library provides a `toBeVisible` matcher that can be used to check if an element is visible to the user.

```js
expect(screen.getByText('Settings screen')).toBeVisible();
```

This is in contrast to the `toBeOnTheScreen` matcher, which checks if the element is rendered in the component tree. This matcher is not recommended when writing tests involving navigation.

By default, the queries from React Native Testing Library (e.g. `getByRole`, `getByText`, `getByLabelText` etc.) [only return visible elements](https://callstack.github.io/react-native-testing-library/docs/api/queries#includehiddenelements-option). So you don't need to do anything special. However, if you're using a different library for your tests, you'll need to account for this behavior.

## Example tests

We recommend using [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) to write your tests.

In this guide, we will go through some example scenarios and show you how to write tests for them using Jest and React Native Testing Library:

### Navigation between tabs

In this example, we have a bottom tab navigator with two tabs: Home and Settings. We will write a test that asserts that we can navigate between these tabs by pressing the tab bar buttons.

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js title="MyTabs.js"
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
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js title="MyTabs.js"
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
    <Tab.Navigator>
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

```js title="MyTabs.test.js"
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('navigates to settings by tab bar button press', async () => {
  const user = userEvent.setup();

  const Navigation = createStaticNavigation(MyTabs);

  render(<Navigation />);

  const button = screen.getByRole('button', { name: 'Settings, tab, 2 of 2' });

  await user.press(button);

  act(() => jest.runAllTimers());

  expect(screen.getByText('Settings screen')).toBeVisible();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js title="MyTabs.test.js"
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('navigates to settings by tab bar button press', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

  const button = screen.getByLabelText('Settings, tab, 2 of 2');

  await user.press(button);

  act(() => jest.runAllTimers());

  expect(screen.getByText('Settings screen')).toBeVisible();
});
```

</TabItem>
</Tabs>

In the above test, we:

- Render the `MyTabs` navigator within a [NavigationContainer](navigation-container.md) in our test.
- Get the tab bar button using the `getByLabelText` query that matches its accessibility label.
- Press the button using `userEvent.press(button)` to simulate a user interaction.
- Run all timers using `jest.runAllTimers()` to skip animations (e.g. animations in the `Pressable` for the button).
- Assert that the `Settings screen` is visible after the navigation.

### Reacting to a navigation event

In this example, we have a stack navigator with two screens: Home and Surprise. We will write a test that asserts that the text "Surprise!" is displayed after navigating to the Surprise screen.

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js title="MyStack.js"
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

```js title="MyStack.js"
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

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

const Stack = createStackNavigator();

export const MyStack = () => {
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

```js title="MyStack.test.js"
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyStack } from './MyStack';

jest.useFakeTimers();

test('shows surprise text after navigating to surprise screen', async () => {
  const user = userEvent.setup();

  const Navigation = createStaticNavigation(MyStack);

  render(<Navigation />);

  await user.press(screen.getByLabelText('Click here!'));

  act(() => jest.runAllTimers());

  expect(screen.getByText('Surprise!')).toBeVisible();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js title="MyStack.test.js"
import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyStack } from './MyStack';

jest.useFakeTimers();

test('shows surprise text after navigating to surprise screen', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );

  await user.press(screen.getByLabelText('Click here!'));

  act(() => jest.runAllTimers());

  expect(screen.getByText('Surprise!')).toBeVisible();
});
```

</TabItem>
</Tabs>

In the above test, we:

- Render the `MyStack` navigator within a [NavigationContainer](navigation-container.md) in our test.
- Get the button using the `getByLabelText` query that matches its title.
- Press the button using `userEvent.press(button)` to simulate a user interaction.
- Run all timers using `jest.runAllTimers()` to skip animations (e.g. navigation animation between screens).
- Assert that the `Surprise!` text is visible after the transition to the Surprise screen is complete.

### Fetching data with `useFocusEffect`

In this example, we have a bottom tab navigator with two tabs: Home and Pokemon. We will write a test that asserts the data fetching logic on focus in the Pokemon screen.

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js title="MyTabs.js"
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

function PokemonScreen() {
  const [profileData, setProfileData] = useState({ status: 'loading' });

  useFocusEffect(
    useCallback(() => {
      if (profileData.status === 'success') {
        return;
      }

      setProfileData({ status: 'loading' });

      const controller = new AbortController();

      const fetchUser = async () => {
        try {
          const response = await fetch(url, { signal: controller.signal });
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
    }, [profileData.status])
  );

  if (profileData.status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (profileData.status === 'error') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>An error occurred!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{profileData.data.name}</Text>
    </View>
  );
}

export const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Pokemon: PokemonScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js title="MyTabs.js"
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

function PokemonInfoScreen() {
  const [profileData, setProfileData] = useState({ status: 'loading' });

  useFocusEffect(
    useCallback(() => {
      if (profileData.status === 'success') {
        return;
      }

      setProfileData({ status: 'loading' });

      const controller = new AbortController();

      const fetchUser = async () => {
        try {
          const response = await fetch(url, { signal: controller.signal });
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
    }, [profileData.status])
  );

  if (profileData.status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (profileData.status === 'error') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>An error occurred!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{profileData.data.name}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pokemon" component={PokemonScreen} />
    </Tab.Navigator>
  );
}
```

</TabItem>
</Tabs>

To make the test deterministic and isolate it from the real backend, you can mock the network requests with a library such as [Mock Service Worker](https://mswjs.io/):

```js title="msw-handlers.js"
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

Here we setup a handler that mocks responses from the API (for this example we're using [PokéAPI](https://pokeapi.co/)). Additionally, we `delay` the response by 1000ms to simulate a network request delay.

Then, we write a Node.js integration module to use the Mock Service Worker in our tests:

```js title="msw-node.js"
import { setupServer } from 'msw/node';
import { handlers } from './msw-handlers';

const server = setupServer(...handlers);
```

Refer to the documentation of the library to learn more about setting it up in your project - [Getting started](https://mswjs.io/docs/getting-started), [React Native integration](https://mswjs.io/docs/integrations/react-native).

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js title="MyTabs.test.js"
import './msw-node';

import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('loads data on Pokemon info screen after focus', async () => {
  const user = userEvent.setup();

  const Navigation = createStaticNavigation(MyTabs);

  render(<Navigation />);

  const homeTabButton = screen.getByLabelText('Home, tab, 1 of 2');
  const profileTabButton = screen.getByLabelText('Profile, tab, 2 of 2');

  await user.press(profileTabButton);

  expect(screen.getByText('Loading...')).toBeVisible();

  await act(() => jest.runAllTimers());

  expect(screen.getByText('ditto')).toBeVisible();

  await user.press(homeTabButton);

  await act(() => jest.runAllTimers());

  await user.press(profileTabButton);

  expect(screen.queryByText('Loading...')).not.toBeVisible();
  expect(screen.getByText('ditto')).toBeVisible();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js title="MyTabs.test.js"
import './msw-node';

import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('loads data on Pokemon info screen after focus', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

  const homeTabButton = screen.getByLabelText('Home, tab, 1 of 2');
  const profileTabButton = screen.getByLabelText('Profile, tab, 2 of 2');

  await user.press(profileTabButton);

  expect(screen.getByText('Loading...')).toBeVisible();

  await act(() => jest.runAllTimers());

  expect(screen.getByText('ditto')).toBeVisible();

  await user.press(homeTabButton);

  await act(() => jest.runAllTimers());

  await user.press(profileTabButton);

  expect(screen.queryByText('Loading...')).not.toBeVisible();
  expect(screen.getByText('ditto')).toBeVisible();
});
```

</TabItem>
</Tabs>

In the above test, we:

- Assert that the `Loading...` text is visible while the data is being fetched.
- Run all timers using `jest.runAllTimers()` to skip delays in the network request.
- Assert that the `ditto` text is visible after the data is fetched.
- Press the home tab button to navigate to the home screen.
- Run all timers using `jest.runAllTimers()` to skip animations (e.g. animations in the `Pressable` for the button).
- Press the profile tab button to navigate back to the Pokemon screen.
- Ensure that cached data is shown by asserting that the `Loading...` text is not visible and the `ditto` text is visible.

:::note

In a production app, we recommend using a library like [React Query](https://tanstack.com/query/) to handle data fetching and caching. The above example is for demonstration purposes only.

:::

### Re-usable components

To make it easier to test components that don't depend on the navigation structure, we can create a light-weight test navigator:

```js title="TestStackNavigator.js"
import { useNavigationBuilder, StackRouter } from '@react-navigation/native';

function TestStackNavigator(props) {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    props
  );

  return (
    <NavigationContent>
      {state.routes.map((route, index) => {
        return (
          <View key={route.key} aria-hidden={index !== state.index}>
            {descriptors[route.key].render()}
          </View>
        );
      })}
    </NavigationContent>
  );
}

export const createTestStackNavigator =
  createNavigatorFactory(TestStackNavigator);
```

This lets us test React Navigation specific logic such as `useFocusEffect` without needing to set up a full navigator.

We can use this test navigator in our tests like this:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js title="MyComponent.test.js"
import { act, render, screen } from '@testing-library/react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createTestStackNavigator } from './TestStackNavigator';
import { MyComponent } from './MyComponent';

test('does not show modal when not focused', () => {
  const TestStack = createTestStackNavigator({
    screens: {
      A: MyComponent,
      B: () => null,
    },
  });

  const Navigation = createStaticNavigation(TestStack);

  render(
    <Navigation
      initialState={{
        routes: [{ name: 'A' }, { name: 'B' }],
      }}
    />
  );

  expect(screen.queryByText('Modal')).not.toBeVisible();
});

test('shows modal when focused', () => {
  const TestStack = createTestStackNavigator({
    screens: {
      A: MyComponent,
      B: () => null,
    },
  });

  const Navigation = createStaticNavigation(TestStack);

  render(
    <Navigation
      initialState={{
        routes: [{ name: 'B' }, { name: 'A' }],
      }}
    />
  );

  expect(screen.getByText('Modal')).toBeVisible();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js title="MyComponent.test.js"
import { act, render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createTestStackNavigator } from './TestStackNavigator';
import { MyComponent } from './MyComponent';

test('does not show modal when not focused', () => {
  const Stack = createTestStackNavigator();

  const TestStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="A" component={MyComponent} />
      <Stack.Screen name="B" component={() => null} />
    </Stack.Navigator>
  );

  render(
    <NavigationContainer
      initialState={{
        routes: [{ name: 'A' }, { name: 'B' }],
      }}
    >
      <TestStack />
    </NavigationContainer>
  );

  expect(screen.queryByText('Modal')).not.toBeVisible();
});

test('shows modal when focused', () => {
  const Stack = createTestStackNavigator();

  const TestStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="A" component={MyComponent} />
      <Stack.Screen name="B" component={() => null} />
    </Stack.Navigator>
  );

  render(
    <NavigationContainer
      initialState={{
        routes: [{ name: 'B' }, { name: 'A' }],
      }}
    >
      <TestStack />
    </NavigationContainer>
  );

  expect(screen.getByText('Modal')).toBeVisible();
});
```

</TabItem>
</Tabs>

Here we create a test stack navigator using the `createTestStackNavigator` function. We then render the `MyComponent` component within the test navigator and assert that the modal is shown or hidden based on the focus state.

The `initialState` prop is used to set the initial state of the navigator, i.e. which screens are rendered in the stack and which one is focused. See [navigation state](navigation-state.md) for more information on the structure of the state object.

You can also pass a [`ref`](navigation-container.md#ref) to programmatically navigate in your tests.

The test navigator is a simplified version of the stack navigator, but it's still a real navigator and behaves like one. This means that you can use it to test any other navigation logic.

See [Custom navigators](custom-navigators.md) for more information on how to write custom navigators if you want adjust the behavior of the test navigator or add more functionality.

## Best practices

Generally, we recommend avoiding mocking React Navigation. Mocking can help you isolate the component you're testing, but when testing components with navigation logic, mocking means that your tests don't test for the navigation logic.

- Mocking APIs such as `useFocusEffect` means you're not testing the focus logic in your component.
- Mocking `navigation` prop or `useNavigation` means that the `navigation` object may not have the same shape as the real one.
- Asserting `navigation.navigate` calls means you only test that the function was called, not that the call was correct based on the navigation structure.
- etc.

Avoiding mocks means additional work when writing tests, but it also means:

- Refactors that don't change the logic won't break the tests, e.g. changing `navigation` prop to `useNavigation`, using a different navigation action that does the same thing, etc.
- Library upgrades or refactor that actually change the behavior will correctly break the tests, surfacing actual regressions.

Tests should break when there's a regression, not due to a refactor. Otherwise it leads to additional work to fix the tests, making it harder to know when a regression is introduced.
