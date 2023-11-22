---
id: devtools
title: Developer tools
sidebar_label: Developer tools
---

Developer tools to make debugging easier when using React Navigation.

To use the developer tools, install [`@react-navigation/devtools`](https://github.com/react-navigation/react-navigation/tree/master/packages/devtools):

```bash npm2yarn
npm install @react-navigation/devtools
```

Hooks from this package only work during development and are disabled in production. You don't need to do anything special to remove them from the production build.

## API Definition

The package exposes the following APIs:

### `useFlipper`

This hook provides integration with [Flipper](https://fbflipper.com/) for React Native apps.

:::warning

This doesn't work in Expo managed apps since they don't support Flipper.

:::

To be able to use this hook, you need to:

- [Configure Flipper in your React Native app](https://fbflipper.com/docs/features/react-native/) if it's not configured already
- Install the `react-native-flipper` package in your app:

  ```bash npm2yarn
  npm install --save-dev react-native-flipper
  ```

- Install the `react-navigation` plugin in the Flipper app

  ![Install Flipper](/assets/devtools/flipper-plugin-install.png)

**Usage:**

To use the hook, import it and pass a `ref` to the `NavigationContainer` as its argument:

```js
import * as React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useFlipper } from '@react-navigation/devtools';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useFlipper(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>{/* ... */}</NavigationContainer>
  );
}
```

Now, you'll be able to use the React Navigation devtools in Flipper whenever your device is connected to Flipper.

![React Navigation Logs](/assets/devtools/flipper-plugin-logs.png)

![React Navigation Linking](/assets/devtools/flipper-plugin-linking.png)

### `useReduxDevToolsExtension`

This hook provides integration with [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools). It also works with [`React Native Debugger app`](https://github.com/jhen0409/react-native-debugger) which includes this extension.

**Usage:**

To use the hook, import it and pass a `ref` to the `NavigationContainer` as its argument:

```js
import * as React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useReduxDevToolsExtension(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>{/* ... */}</NavigationContainer>
  );
}
```

Now, you'll be able to see logs from React Navigation in Redux DevTools Extension, e.g. when you're debugging your app with React Native Debugger app.
