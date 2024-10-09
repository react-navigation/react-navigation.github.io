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
jest.mock('react-native-reanimated', () => {
  require('react-native-reanimated/mock');
});

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

We are going to write example tests illustrating the difference between `navigate` and `push` functions, how drawer's screens `preload`
works and what you have to do to use times functions in tests.

To show the difference between `navigate` and `push` functions, we will use `RootNavigator` defined below:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { Button, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Navigate to Settings"
      />
      <Button
        onPress={() => navigation.push('Settings')}
        title="Push Settings"
      />
    </View>
  );
};

const Settings = () => {
  return (
    <View>
      <Text>Settings Screen</Text>
    </View>
  );
};

export const RootNavigator = createNativeStackNavigator({
  screens: {
    Profile,
    Settings,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { Button, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Profile = ({ navigation }) => {
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Navigate to Settings"
      />
      <Button
        onPress={() => navigation.push('Settings')}
        title="Push Settings"
      />
    </View>
  );
};

const Settings = () => {
  return (
    <View>
      <Text>Settings Screen</Text>
    </View>
  );
};

export const RootNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};
```

</TabItem>
</Tabs>

`navigate` function test example:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  createNavigationContainerRef,
  createStaticNavigation,
} from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';

test('navigates to settings screen twice', () => {
  const RootNavigation = createStaticNavigation(RootNavigator);
  const navigation = createNavigationContainerRef();
  render(<RootNavigation ref={navigation} />);

  const button = screen.getByText('Navigate to Settings');
  fireEvent.press(button);
  fireEvent.press(button);

  expect(navigation.getState().routes.map((route) => route.name)).toStrictEqual(
    ['Profile', 'Settings']
  );
  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';

test('navigates to settings screen twice', () => {
  const navigation = createNavigationContainerRef();
  render(
    <NavigationContainer ref={navigation}>
      <RootNavigator />
    </NavigationContainer>
  );

  const button = screen.getByText('Navigate to Settings');
  fireEvent.press(button);
  fireEvent.press(button);

  expect(navigation.getState().routes.map((route) => route.name)).toStrictEqual(
    ['Profile', 'Settings']
  );
  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

`push` function test example:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createStaticNavigation,
} from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { RootNavigator } from './RootNavigator';

test('pushes settings screen twice', () => {
  const RootNavigation = createStaticNavigation(RootNavigator);
  const navigation = createNavigationContainerRef();
  render(<RootNavigation ref={navigation} />);

  const button = screen.getByText('Push Settings');
  fireEvent.press(button);
  fireEvent.press(button);

  expect(navigation.getState().routes.map((route) => route.name)).toStrictEqual(
    ['Profile', 'Settings', 'Settings']
  );
  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';

test('pushes settings screen twice', () => {
  const navigation = createNavigationContainerRef();
  render(
    <NavigationContainer ref={navigation}>
      <RootNavigator />
    </NavigationContainer>
  );

  const button = screen.getByText('Push Settings');
  fireEvent.press(button);
  fireEvent.press(button);

  expect(navigation.getState().routes.map((route) => route.name)).toStrictEqual(
    ['Profile', 'Settings', 'Settings']
  );
  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

To show how drawer's screens `preload` works, we will compare two tests - with and without preloading.

Without preloading test example:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, test } from '@jest/globals';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createNavigationContainerRef,
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, Text, View } from 'react-native';

const Profile = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Navigate to Settings"
      />
    </View>
  );
};

let renderCounter = 0;

const Settings = () => {
  renderCounter++;
  return (
    <View>
      <Text>Settings Screen</Text>
    </View>
  );
};

const Drawer = createDrawerNavigator({
  screens: {
    Profile,
    Settings,
  },
});

const DrawerNavigation = createStaticNavigation(Drawer);

test('navigates to settings without previous preload', () => {
  const navigation = createNavigationContainerRef();
  render(<DrawerNavigation ref={navigation} />);

  expect(screen.queryByText('Profile Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).not.toBeOnTheScreen();
  expect(renderCounter).toBe(0);

  fireEvent.press(screen.queryByText('Navigate to Settings'));

  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
  expect(renderCounter).toBe(1);
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, test } from '@jest/globals';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, Text, View } from 'react-native';

const Profile = ({ navigation }) => {
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Navigate to Settings"
      />
    </View>
  );
};

let renderCounter = 0;

const Settings = () => {
  renderCounter++;
  return (
    <View>
      <Text>Settings Screen</Text>
    </View>
  );
};

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};

test('navigates to settings without previous preload', () => {
  const navigation = createNavigationContainerRef();
  render(
    <NavigationContainer ref={navigation}>
      <DrawerNavigation />
    </NavigationContainer>
  );

  expect(screen.queryByText('Profile Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).not.toBeOnTheScreen();
  expect(renderCounter).toBe(0);

  fireEvent.press(screen.queryByText('Navigate to Settings'));

  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
  expect(renderCounter).toBe(1);
});
```

</TabItem>
</Tabs>

With preloading test example:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, test } from '@jest/globals';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createNavigationContainerRef,
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Button, Text, View } from 'react-native';

const Profile = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Navigate to Settings"
      />
    </View>
  );
};

let renderCounter = 0;

const Settings = () => {
  renderCounter++;
  return (
    <View>
      <Text>Settings Screen</Text>
    </View>
  );
};

const Drawer = createDrawerNavigator({
  screens: {
    Profile,
    Settings,
  },
});

const DrawerNavigation = createStaticNavigation(Drawer);

test('navigates to settings with previous preload', () => {
  const navigation = createNavigationContainerRef();
  render(<DrawerNavigation ref={navigation} />);

  expect(renderCounter).toBe(0);

  // navigate.preload causes React state updates
  // So it should be wrapped into act
  act(() => navigation.preload('Settings'));

  expect(screen.queryByText('Profile Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).not.toBeOnTheScreen();
  expect(renderCounter).toBe(1);

  fireEvent.press(screen.queryByText('Navigate to Settings'));

  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
  expect(renderCounter).toBe(1);
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, test } from '@jest/globals';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Button, Text, View } from 'react-native';

const Profile = ({ navigation }) => {
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Navigate to Settings"
      />
    </View>
  );
};

let renderCounter = 0;

const Settings = () => {
  renderCounter++;
  return (
    <View>
      <Text>Settings Screen</Text>
    </View>
  );
};

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};

test('navigates to settings with previous preload', () => {
  const navigation = createNavigationContainerRef();
  render(
    <NavigationContainer ref={navigation}>
      <DrawerNavigation />
    </NavigationContainer>
  );

  expect(renderCounter).toBe(0);

  // navigation.preload causes React state updates
  // So it should be wrapped into act
  act(() => navigation.preload('Settings'));

  expect(screen.queryByText('Profile Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).not.toBeOnTheScreen();
  expect(renderCounter).toBe(1);

  fireEvent.press(screen.queryByText('Navigate to Settings'));

  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
  expect(renderCounter).toBe(1);
});
```

</TabItem>
</Tabs>

For writing tests that include times functions we will have to use [Fake Timers](https://jestjs.io/docs/timer-mocks). They will replace times function implementation to use time from the fake clock.

Let's add another button to the Profile screen, which uses `setTimeout`:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
const Profile = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Navigate to Settings"
      />
      <Button
        onPress={() => navigation.push('Settings')}
        title="Push Settings"
      />
      {/* Added button */}
      <Button
        onPress={() => setTimeout(() => navigation.navigate('Settings'), 10000)}
        title="Navigate to Settings with 10000 ms delay"
      />
    </View>
  );
};
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Profile = ({ navigation }) => {
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Navigate to Settings"
      />
      <Button
        onPress={() => navigation.push('Settings')}
        title="Push Settings"
      />
      {/* Added button */}
      <Button
        onPress={() => setTimeout(() => navigation.navigate('Settings'), 10000)}
        title="Navigate to Settings with 10000 ms delay"
      />
    </View>
  );
};
```

</TabItem>
</Tabs>

Fake timers test example:

<Tabs groupId="example" queryString="example">
<TabItem value="static" label="Static" default>

```js
import { expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';

test('navigates to settings screen after 10000 ms delay', () => {
  // Enable fake timers
  jest.useFakeTimers();

  const RootNavigation = createStaticNavigation(RootNavigator);
  render(<RootNavigation />);

  fireEvent.press(screen.getByText('Navigate to Settings with 10000 ms delay'));

  // jest.advanceTimersByTime causes React state updates
  // So it should be wrapped into act
  act(() => jest.advanceTimersByTime(5000));

  expect(screen.queryByText('Profile Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).not.toBeOnTheScreen();

  act(() => jest.advanceTimersByTime(5000));

  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';

test('navigates to settings screen after 10000 ms delay', () => {
  // Enable fake timers
  jest.useFakeTimers();

  render(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );

  fireEvent.press(screen.getByText('Navigate to Settings with 10000 ms delay'));

  // jest.advanceTimersByTime causes React state updates
  // So it should be wrapped into act
  act(() => jest.advanceTimersByTime(5000));

  expect(screen.queryByText('Profile Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).not.toBeOnTheScreen();

  act(() => jest.advanceTimersByTime(5000));

  expect(screen.queryByText('Profile Screen')).not.toBeOnTheScreen();
  expect(screen.queryByText('Settings Screen')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

## Best practices

There are a couple of things to keep in mind when writing tests for components using React Navigation:

1. Avoid mocking React Navigation. Instead, use a real navigator in your tests.
2. Don't check for navigation actions. Instead, check for the result of the navigation such as the screen being rendered.
