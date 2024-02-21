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
// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

// include this section and the NativeAnimatedHelper section for mocking react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
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

If you're not using Jest, then you'll need to mock these modules according to the test framework you are using.

## Writing tests

We recommend using [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) along with [`jest-native`](https://github.com/testing-library/jest-native) to write your tests.

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static">

```js name='Testing with jest'
import * as React from 'react';
import { screen, render, fireEvent } from '@testing-library/react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';

const Navigation = createStaticNavigation(RootNavigator);

test('shows profile screen when View Profile is pressed', () => {
  render(<Navigation />);

  fireEvent.press(screen.getByText('View Profile'));

  expect(screen.getByText('My Profile')).toBeOnTheScreen();
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name='Testing with jest'
import * as React from 'react';
import { screen, render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';

test('shows profile screen when View Profile is pressed', () => {
  render(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );

  fireEvent.press(screen.getByText('View Profile'));

  expect(screen.getByText('My Profile')).toBeOnTheScreen();
});
```

</TabItem>
</Tabs>

## Best practices

There are a couple of things to keep in mind when writing tests for components using React Navigation:

1. Avoid mocking React Navigation. Instead, use a real navigator in your tests.
2. Don't check for navigation actions. Instead, check for the result of the navigation such as the screen being rendered.
