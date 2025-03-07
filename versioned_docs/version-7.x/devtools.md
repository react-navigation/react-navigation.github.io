---
id: devtools
title: Developer tools
sidebar_label: Developer tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Developer tools to make debugging easier when using React Navigation.

To use the developer tools, install [`@react-navigation/devtools`](https://github.com/react-navigation/react-navigation/tree/master/packages/devtools):

```bash npm2yarn
npm install @react-navigation/devtools
```

Hooks from this package only work during development and are disabled in production. You don't need to do anything special to remove them from the production build.

## API Definition

The package exposes the following APIs:

### `useLogger`

This hook provides a logger for React Navigation. It logs the navigation state and actions to the console.

<video playsInline autoPlay muted loop style={{ width: "585px" }}>

  <source src="/assets/7.x/devtool-logger.mp4" />
</video>

**Usage:**

To use the hook, import it and pass a `ref` to the `NavigationContainer` as its argument:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
import * as React from 'react';
import {
  createStaticNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useLogger } from '@react-navigation/devtools';

/* content */

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useLogger(navigationRef);

  return <Navigation ref={navigationRef} />;
}
```

</TabItem>

<TabItem value="dynamic" label="Dynamic">

```js
import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useLogger } from '@react-navigation/devtools';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useLogger(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>{/* ... */}</NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

### `useReduxDevToolsExtension`

This hook provides integration with [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools). It also works with [`React Native Debugger app`](https://github.com/jhen0409/react-native-debugger) which includes this extension.

**Usage:**

To use the hook, import it and pass a `ref` to the `NavigationContainer` as its argument:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
import * as React from 'react';
import {
  createStaticNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';

/* content */

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useReduxDevToolsExtension(navigationRef);

  return <Navigation ref={navigationRef} />;
}
```

</TabItem>

<TabItem value="dynamic" label="Dynamic">

```js
import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useReduxDevToolsExtension(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>{/* ... */}</NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

Now, you'll be able to see logs from React Navigation in Redux DevTools Extension, e.g. when you're debugging your app with React Native Debugger app.
