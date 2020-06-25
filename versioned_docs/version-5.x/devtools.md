---
id: devtools
title: Developer tools
sidebar_label: Developer tools
---

Developer tools to make debugging easier when using React Navigation.

To configure the developer tools, install [`@react-navigation/devtools`](https://github.com/react-navigation/react-navigation/tree/master/packages/devtools):

```bash npm2yarn
npm install @react-navigation/devtools
```

## API Definition

The package exposes the following APIs:

### `useReduxDevToolsExtension`

This hook provides integration with [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension).It also works with [`React Native Debugger app`](https://github.com/jhen0409/react-native-debugger) which includes this extension.

The hook accepts a `ref` to the `NavigationContainer` as its argument.

Usage:

```js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';

export default function App() {
  const navigationRef = React.useRef();

  useReduxDevToolsExtension(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>{/* ... */}</NavigationContainer>
  );
}
```

The hook only works during development and is disabled in production. You don't need to do anything special to remove it from the production build.
