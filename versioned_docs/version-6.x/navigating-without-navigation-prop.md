---
id: navigating-without-navigation-prop
title: Navigating without the navigation prop
sidebar_label: Navigating without the navigation prop
---

Sometimes you need to trigger a navigation action from places where you do not have access to the `navigation` prop, such as a Redux middleware. For such cases, you can dispatch navigation actions from the navigation container.

If you're looking for a way to navigate from inside a component without needing to pass the `navigation` prop down, see [`useNavigation`](use-navigation.md). **Do not** use this method when you have access to a `navigation` prop or `useNavigation` since it will behave differently, and many helper methods specific to screens won't be available.

You can get access to the root navigation object through a `ref` and pass it to the `RootNavigation` which we will later use to navigate.

```js
// App.js

import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>{/* ... */}</NavigationContainer>
  );
}
```

In the next step, we define `RootNavigation`, which is a simple module with functions that dispatch user-defined navigation actions.

```js
// RootNavigation.js

import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

// add other navigation functions that you need and export them
```

Then, in any of your javascript modules, just import the `RootNavigation` and call functions which you exported from it. You may use this approach outside of your React components and, in fact, it works just as well when used from within them.

 <samp id="no-nav-prop" />

```js
// any js module
import * as RootNavigation from './path/to/RootNavigation.js';

// ...

RootNavigation.navigate('ChatScreen', { userName: 'Lucy' });
```

Apart from `navigate`, you can add other navigation actions:

```js
import { StackActions } from '@react-navigation/native';

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}
```

Note that a stack navigators needs to be rendered to handle this action. You may want to check the [docs for nesting](nesting-navigators.md#navigating-to-a-screen-in-a-nested-navigator) for more details.

When writing tests, you may mock the navigation functions, and make assertions on whether the correct functions are called with the correct parameters.

## Handling initialization

When using this pattern, you need to keep few things in mind to avoid crashes in your app.

- The ref is set only after the navigation container renders, this can be async when handling deep links
- A navigator needs to be rendered to be able to handle actions

If you try to navigate without rendering a navigator or before the navigator finishes mounting, it will throw and crash your app if not handled. So you'll need to add an additional check to decide what to do until your app mounts.

For an example, consider the following scenario, you have a screen somewhere in the app, and that screen dispatches a redux action on `useEffect`/`componentDidMount`. You are listening for this action in your middleware and try to perform navigation when you get it. This will throw an error, because by this time, the parent navigator hasn't finished mounting and isn't ready. Parent's `useEffect`/`componentDidMount` is always called **after** child's `useEffect`/`componentDidMount`.

To avoid this, you can set a ref to tell you that your app has finished mounting, and check that ref before performing any navigation. To do this, we can use the `onReady` callback in our `NavigationContainer`:

```js
// App.js

import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, isReadyRef } from './RootNavigation';

export default function App() {
  React.useEffect(() => {
    return () => {
      isReadyRef.current = false
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      {/* ... */}
    </NavigationContainer>
  );
}
```

Also export this ref from our `RootNavigation`:

```js
// RootNavigation.js

import * as React from 'react';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
```

Note that this only handles the case when you're dispatching actions before the container finishes mounting. You'll still have an error if you are not rendering any navigators. A navigator must be rendered to be able to dispatch actions.

If you're unsure if a navigator is rendered, you can call `navigationRef.current.getRootState()`, and it'll return a valid state object if any navigators are rendered, otherwise it will return `undefined`.
